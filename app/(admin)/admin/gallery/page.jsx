'use client';
import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X, Play } from 'lucide-react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const fetcher = (url) => api.get(url).then((r) => r.data);

function GalleryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { title: '', type: 'image', youtubeVideoId: '', category: 'general', isPublished: true, isFeatured: false }
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v); });
      if (file) fd.append('media', file);

      if (initial) {
        await api.put(`/gallery/${initial._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Gallery item updated');
      } else {
        await api.post('/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Gallery item added');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md my-4">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg">{initial ? 'Edit Item' : 'Add Gallery Item'}</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
            <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>
          {form.type === 'video' && (
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">YouTube Video ID</label>
              <input className="input" placeholder="e.g. dQw4w9WgXcQ" value={form.youtubeVideoId} onChange={(e) => setForm({ ...form, youtubeVideoId: e.target.value })} />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Upload File</label>
            <input type="file" accept={form.type === 'image' ? 'image/*' : 'video/*,image/*'} onChange={(e) => setFile(e.target.files[0])} className="text-sm text-gray-600" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
            <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {['service', 'event', 'youth', 'outreach', 'general'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Add'}</button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminGallery() {
  const { user } = useSelector((s) => s.auth);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);
  const [type, setType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const query = `/gallery?limit=50${type !== 'all' ? `&type=${type}` : ''}`;
  const { data, mutate } = useSWR(query, fetcher);
  const items = data?.data || [];

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      toast.success('Deleted');
      mutate();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const getThumbnail = (item) => {
    if (item.thumbnail) return item.thumbnail;
    if (item.youtubeVideoId) return `https://img.youtube.com/vi/${item.youtubeVideoId}/mqdefault.jpg`;
    if (!item.url) return '/placeholder.png'; // Fallback
    if (item.url.startsWith('http')) return item.url;
    
    // If it's a relative path, try to prepend API URL if available, else return as is
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || '';
    
    // Legacy support: if URL starts with /images or /videos but is NOT already proxied
    if ((item.url.startsWith('/images/') || item.url.startsWith('/videos/')) && !item.url.includes('/api/v1/media')) {
      return `${baseUrl}/api/v1/media${item.url}`;
    }

    return `${baseUrl}${item.url}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Gallery</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> Add Media
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {['all', 'image', 'video'].map((t) => (
          <button key={t} onClick={() => setType(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${type === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {items.map((item) => (
          <div key={item._id} className="relative group rounded-xl overflow-hidden bg-gray-100 aspect-square">
            <Image src={getThumbnail(item)} alt={item.title} fill className="object-cover" />
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Play size={24} className="text-white drop-shadow-lg" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors flex items-end justify-center pb-2 gap-2 opacity-0 group-hover:opacity-100">
              <button onClick={() => { setEditing(item); setShowForm(true); }} className="p-2 bg-white rounded-lg text-primary-600 hover:bg-primary-50">
                <Edit2 size={14} />
              </button>
              {canDelete && (
                <button onClick={() => handleDelete(item._id)} className="p-2 bg-white rounded-lg text-red-600 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-medium truncate">{item.title}</p>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center text-gray-400 py-12">No gallery items yet.</div>
        )}
      </div>

      {showForm && <GalleryForm initial={editing} onSave={() => { setShowForm(false); setEditing(null); mutate(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
