'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { Plus, Edit2, Trash2, X, FileText } from 'lucide-react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Pagination from '../../../../components/Pagination';

const fetcher = (url) => api.get(url).then((r) => r.data);

function ArticleForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title || '',
          titleTa: initial.titleTa || '',
          excerpt: initial.excerpt || '',
          excerptTa: initial.excerptTa || '',
          content: initial.content || '',
          contentTa: initial.contentTa || '',
          category: initial.category || 'devotional',
          isPublished: initial.isPublished || false,
          isFeatured: initial.isFeatured || false,
        }
      : {
          title: '',
          titleTa: '',
          excerpt: '',
          excerptTa: '',
          content: '',
          contentTa: '',
          category: 'devotional',
          isPublished: false,
          isFeatured: false,
        }
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== undefined) fd.append(k, v); });
      if (file) fd.append('coverImage', file);

      if (initial) {
        await api.put(`/articles/${initial._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Article updated');
      } else {
        await api.post('/articles', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Article created');
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
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl my-4">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg">{initial ? 'Edit Article' : 'New Article'}</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400" /></button>
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
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Excerpt (English)</label>
            <textarea className="input resize-none" rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} maxLength={500} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Excerpt (Tamil)</label>
            <textarea className="input resize-none" rows={2} value={form.excerptTa} onChange={(e) => setForm({ ...form, excerptTa: e.target.value })} maxLength={500} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Content (English - HTML or Markdown) *</label>
            <textarea className="input resize-none font-mono text-xs" rows={8} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Content (Tamil - HTML or Markdown)</label>
            <textarea className="input resize-none font-mono text-xs" rows={8} value={form.contentTa} onChange={(e) => setForm({ ...form, contentTa: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['devotional', 'news', 'testimony', 'announcement', 'other'].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-gray-600" />
            </div>
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
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update' : 'Create'}</button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminArticles() {
  const { user } = useSelector((s) => s.auth);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, mutate } = useSWR(`/articles?page=${page}&limit=10`, fetcher);
  const articles = data?.data || [];

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return;
    try {
      await api.delete(`/articles/${id}`);
      toast.success('Article deleted');
      mutate();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Articles</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> New Article
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Views</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((article) => (
                <tr key={article._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 line-clamp-1">{article.title}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="capitalize text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">{article.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {article.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{article.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(article); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                      {canDelete && (
                        <button onClick={() => handleDelete(article._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {articles.length === 0 && <div className="text-center py-12"><FileText size={40} className="text-gray-200 mx-auto mb-2" /><p className="text-gray-400">No articles yet.</p></div>}
        
        <Pagination 
          currentPage={page} 
          totalPages={data?.totalPages || 1} 
          onPageChange={setPage} 
        />
      </div>

      {showForm && <ArticleForm initial={editing} onSave={() => { setShowForm(false); setEditing(null); mutate(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
