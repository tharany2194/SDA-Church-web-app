'use client';
import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Eye, X, Check, RefreshCw } from 'lucide-react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Pagination from '../../../../components/Pagination';

const fetcher = (url) => api.get(url).then((r) => r.data);

function MessageForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { title: '', titleTa: '', speaker: '', youtubeUrl: '', category: 'sermon', content: '', isPublished: true, isFeatured: false }
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalForm = { ...form };

      if (file) {
        const folder = file.type.startsWith('video/') ? 'videos' : 'images';
        const urlRes = await api.post('/messages/upload-url', {
          filename: file.name,
          contentType: file.type,
          folder
        });
        
        if (!urlRes.data.success) {
          throw new Error('Failed to get upload URL');
        }

        const { presignedUrl, key, publicUrl } = urlRes.data.data;

        const uploadRes = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type }
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload file directly to storage');
        }

        if (folder === 'videos') {
          finalForm.videoFile = publicUrl;
          finalForm.videoFileR2Key = key;
        } else {
          finalForm.thumbnail = publicUrl;
          finalForm.thumbnailR2Key = key;
        }
      }

      const fd = new FormData();
      Object.entries(finalForm).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') fd.append(k, v);
      });

      if (initial) {
        await api.put(`/messages/${initial._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Sermon updated');
      } else {
        await api.post('/messages', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Sermon created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save sermon');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl m-auto">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg">{initial ? 'Edit Sermon' : 'Add Sermon'}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title (English) *</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title (Tamil)</label>
            <input className="input" value={form.titleTa} onChange={(e) => setForm({ ...form, titleTa: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Speaker</label>
              <input className="input" value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['sermon', 'teaching', 'testimony', 'worship', 'other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">YouTube URL</label>
            <input className="input" placeholder="https://youtu.be/..." value={form.youtubeUrl} onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Or Upload Thumbnail / Video</label>
            <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-gray-600" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description / Notes</label>
            <textarea className="input resize-none" rows={3} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>
              {saving ? 'Saving...' : initial ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const { user } = useSelector((s) => s.auth);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const { data, mutate } = useSWR(`/messages?page=${page}&limit=10`, fetcher);
  const messages = data?.data || [];
  const totalPages = data?.totalPages || 1;

  const handleSync = async () => {
    setSyncing(true);
    const toastId = toast.loading('Syncing channel videos...');
    try {
      const res = await api.post('/messages/sync');
      if (res.data.success) {
        const { newCount, deletedCount, processedCount } = res.data.data;
        toast.success(
          `Sync complete! Processed ${processedCount} videos. Imported ${newCount} new, deleted ${deletedCount} old.`,
          { id: toastId, duration: 6000 }
        );
        mutate();
      } else {
        throw new Error(res.data.message || 'Sync failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to sync with YouTube', { id: toastId });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this sermon?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Sermon deleted');
      mutate();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditing(null);
    mutate();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Sermons & Messages</h2>
        <div className="flex gap-2">
          <button 
            onClick={handleSync} 
            disabled={syncing}
            className="btn-secondary gap-2 text-sm flex items-center border border-gray-200 hover:bg-gray-50"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync from YouTube'}
          </button>
          <button onClick={() => setShowForm(true)} className="btn-primary gap-2 text-sm flex items-center">
            <Plus size={16} /> Add Sermon
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Speaker</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <tr key={msg._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 line-clamp-1">{msg.title}</p>
                    <p className="text-xs text-gray-400">{new Date(msg.date).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{msg.speaker || '—'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="capitalize text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{msg.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${msg.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {msg.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(msg); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit2 size={15} />
                      </button>
                      {canDelete && (
                        <button onClick={() => handleDelete(msg._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {messages.length === 0 && (
          <p className="text-center text-gray-400 py-8">No sermons yet. Add your first one!</p>
        )}
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />

      {showForm && (
        <MessageForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />
      )}
    </div>
  );
}
