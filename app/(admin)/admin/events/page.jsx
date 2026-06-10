'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import Pagination from '../../../../components/Pagination';

const fetcher = (url) => api.get(url).then((r) => r.data);

function EventForm({ initial, onSave, onCancel }) {
  const toLocal = (d) => d ? new Date(d).toISOString().slice(0, 16) : '';
  const [form, setForm] = useState(
    initial
      ? { ...initial, startDate: toLocal(initial.startDate), endDate: toLocal(initial.endDate) }
      : { title: '', titleTa: '', description: '', location: '', startDate: '', endDate: '', category: 'service', isPublished: true }
  );
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      const excludeKeys = ['_id', 'createdBy', 'createdAt', 'updatedAt', '__v'];
      Object.entries(form).forEach(([k, v]) => { 
        if (!excludeKeys.includes(k) && v !== undefined && v !== '') {
          fd.append(k, v); 
        }
      });
      if (file) fd.append('image', file);

      if (initial) {
        await api.put(`/events/${initial._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Event updated');
      } else {
        await api.post('/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Event created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save event');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex justify-between items-center mb-5 sticky top-0 bg-white z-10 pb-2 border-b">
          <h3 className="font-bold text-lg">{initial ? 'Edit Event' : 'Add Event'}</h3>
          <button onClick={onCancel} className="p-1 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Title (English) *</label>
              <input className="input w-full" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Title (Tamil)</label>
              <input className="input w-full" value={form.titleTa} onChange={(e) => setForm({ ...form, titleTa: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description *</label>
            <textarea className="input resize-y w-full" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Start Date/Time *</label>
              <input type="datetime-local" className="input w-full" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">End Date/Time</label>
              <input type="datetime-local" className="input w-full" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Location</label>
              <input className="input w-full" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
              <select className="input w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {['service', 'prayer', 'youth', 'outreach', 'special', 'other'].map((c) => (
                  <option key={c} value={c} className="capitalize">{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Event Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm text-gray-600 block w-full border border-gray-200 rounded-lg p-2" />
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer mt-2 font-medium">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500" />
            Published
          </label>
          <div className="flex gap-3 pt-4 border-t mt-4">
            <button type="submit" className="btn-primary flex-1 py-2.5" disabled={saving}>{saving ? 'Saving...' : initial ? 'Update Event' : 'Create Event'}</button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1 py-2.5">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminEvents() {
  const { user } = useSelector((s) => s.auth);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, mutate } = useSWR(`/events?month=${month}&year=${year}&page=${page}&limit=10`, fetcher);
  const events = data?.data || [];

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      mutate();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Events</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {events.map((event) => (
                <tr key={event._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{event.title}</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{format(new Date(event.startDate), 'MMM d, yyyy h:mm a')}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{event.location || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="capitalize text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{event.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setEditing(event); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                      {canDelete && (
                        <button onClick={() => handleDelete(event._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {events.length === 0 && <p className="text-center text-gray-400 py-8">No events this month.</p>}
        
        <Pagination 
          currentPage={page} 
          totalPages={data?.totalPages || 1} 
          onPageChange={setPage} 
        />
      </div>

      {showForm && <EventForm initial={editing} onSave={() => { setShowForm(false); setEditing(null); mutate(); }} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}
