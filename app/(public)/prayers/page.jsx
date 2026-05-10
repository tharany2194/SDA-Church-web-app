'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { Heart, Plus, Edit2, Trash2, Lock, Globe, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../../components/auth/withAuth';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

function PrayerForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || { title: '', content: '', isPrivate: false });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (initial) {
        await api.put(`/prayers/${initial._id}`, form);
        toast.success('Prayer request updated');
      } else {
        await api.post('/prayers', form);
        toast.success('Prayer request submitted');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg">{initial ? 'Edit Request' : 'New Prayer Request'}</h3>
          <button onClick={onCancel}><X size={20} className="text-gray-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Title *</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Request Details *</label>
            <textarea className="input resize-none" rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required maxLength={2000} />
            <p className="text-xs text-gray-400 mt-1">{form.content.length}/2000</p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:bg-gray-50">
            <input type="checkbox" checked={form.isPrivate} onChange={(e) => setForm({ ...form, isPrivate: e.target.checked })} />
            <div>
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Lock size={14} /> Keep this private
              </p>
              <p className="text-xs text-gray-500">Only church leadership will see this</p>
            </div>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Submitting...' : initial ? 'Update' : 'Submit'}</button>
            <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PrayersPage() {
  const { user } = useSelector((s) => s.auth);
  const [tab, setTab] = useState('community');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data: communityPrayers = [], mutate: mutateCommunity } = useSWR('/prayers', fetcher);
  const { data: myPrayers = [], mutate: mutateMyPrayers } = useSWR('/prayers/my', fetcher);

  const handleDelete = async (id) => {
    if (!confirm('Delete this request?')) return;
    try {
      await api.delete(`/prayers/${id}`);
      toast.success('Deleted');
      mutateCommunity();
      mutateMyPrayers();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handlePray = async (id) => {
    try {
      await api.patch(`/prayers/${id}/pray`);
      mutateCommunity();
    } catch {
      toast.error('Failed');
    }
  };

  const handleSave = () => {
    setShowForm(false);
    setEditing(null);
    mutateCommunity();
    mutateMyPrayers();
  };

  const prayers = tab === 'community' ? communityPrayers : myPrayers;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container-custom max-w-3xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Prayer Requests</h1>
            <button onClick={() => setShowForm(true)} className="btn-primary gap-2 text-sm">
              <Plus size={16} /> Add Request
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {['community', 'mine'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {t === 'community' ? 'Community' : 'My Requests'}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="space-y-4">
            {prayers.map((prayer) => {
              const isOwn = prayer.submittedBy?._id === user?._id || prayer.submittedBy === user?._id;
              const prayed = prayer.prayedBy?.includes(user?._id);
              return (
                <div key={prayer._id} className="card p-5">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{prayer.title}</h3>
                        {prayer.isPrivate ? (
                          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"><Lock size={10} />Private</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"><Globe size={10} />Public</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                          prayer.status === 'answered' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                        }`}>{prayer.status}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{prayer.content}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        {prayer.submittedBy?.name && <span>By {prayer.submittedBy.name}</span>}
                        <span>{new Date(prayer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {tab === 'community' && !isOwn && (
                        <button
                          onClick={() => handlePray(prayer._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${prayed ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600'}`}
                        >
                          <Heart size={13} fill={prayed ? 'currentColor' : 'none'} />
                          {prayer.prayerCount} Praying
                        </button>
                      )}
                      {isOwn && (
                        <div className="flex gap-1">
                          <button onClick={() => { setEditing(prayer); setShowForm(true); }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(prayer._id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {prayers.length === 0 && (
              <div className="card p-12 text-center">
                <Heart size={48} className="mx-auto mb-3 text-gray-200" />
                <p className="text-gray-400">No prayer requests yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      {showForm && <PrayerForm initial={editing} onSave={handleSave} onCancel={() => { setShowForm(false); setEditing(null); }} />}
    </div>
  );
}

export default withAuth(PrayersPage);
