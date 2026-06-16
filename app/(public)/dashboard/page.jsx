'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';
import {
  User, Key, Upload, Check, Heart, Plus, Edit2, Trash2,
  Lock, Globe, X, HandHeart, LayoutDashboard, ChevronRight,
  Clock, BadgeCheck, XCircle, IndianRupee,
} from 'lucide-react';
import api from '../../../lib/api';
import toast from 'react-hot-toast';
import withAuth from '../../../components/auth/withAuth';
import { fetchCurrentUser } from '../../../store/slices/authSlice';

const fetcher = (url) => api.get(url).then((r) => r.data);

// ─── Prayer Modal ──────────────────────────────────────────────────────────────
function PrayerModal({ initial, onSave, onCancel }) {
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
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-lg text-gray-900">{initial ? 'Edit Request' : 'New Prayer Request'}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
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
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1"><Lock size={14} />Keep this private</p>
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

// ─── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ user, onNavigate }) {
  const { data: prayerData } = useSWR('/prayers/my', fetcher);
  const { data: donationData } = useSWR('/donations/my?limit=3', fetcher);
  const prayers = prayerData?.data || [];
  const donations = donationData?.data || [];

  const statusIcon = (s) => {
    if (s === 'confirmed') return <BadgeCheck size={14} className="text-green-600" />;
    if (s === 'rejected') return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-yellow-500" />;
  };
  const statusColor = (s) => {
    if (s === 'confirmed') return 'bg-green-100 text-green-700';
    if (s === 'rejected') return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <p className="text-primary-200 text-sm mb-1">Welcome back,</p>
        <h2 className="text-2xl font-bold">{user?.name}</h2>
        <p className="text-primary-200 text-sm mt-1 capitalize">{user?.role} · {user?.email}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate('prayers')} className="card p-5 text-left hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Heart size={20} className="text-rose-600" />
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{prayers.length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Prayer Requests</p>
        </button>
        <button onClick={() => onNavigate('donations')} className="card p-5 text-left hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <HandHeart size={20} className="text-emerald-600" />
            </div>
            <ChevronRight size={16} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{donationData?.total ?? 0}</p>
          <p className="text-sm text-gray-500 mt-0.5">Donations</p>
        </button>
      </div>

      {/* Recent Prayers */}
      {prayers.length > 0 && (
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Prayer Requests</h3>
            <button onClick={() => onNavigate('prayers')} className="text-xs text-primary-600 hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {prayers.slice(0, 3).map((p) => (
              <div key={p._id} className="flex items-start gap-3">
                <Heart size={16} className="text-rose-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.title}</p>
                  <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Donations */}
      {donations.length > 0 && (
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Donations</h3>
            <button onClick={() => onNavigate('donations')} className="text-xs text-primary-600 hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {donations.map((d) => (
              <div key={d._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee size={14} className="text-emerald-600" />
                  <span className="text-sm font-medium text-gray-800">{d.amount.toLocaleString()} {d.currency}</span>
                  <span className="text-xs text-gray-400 capitalize">{d.purpose}</span>
                </div>
                <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(d.status)}`}>
                  {statusIcon(d.status)}{d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Prayers Tab ───────────────────────────────────────────────────────────────
function PrayersTab({ currentUserId }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null); // id of open prayer
  const [followUpText, setFollowUpText] = useState('');
  const [sendingFollowUp, setSendingFollowUp] = useState(false);
  const { data, mutate } = useSWR('/prayers/my', fetcher);
  const prayers = data?.data || [];

  const handleDelete = async (id) => {
    if (!confirm('Delete this prayer request?')) return;
    try {
      await api.delete(`/prayers/${id}`);
      toast.success('Deleted');
      if (expanded === id) setExpanded(null);
      mutate();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleFollowUp = async (prayerId) => {
    if (!followUpText.trim()) return;
    setSendingFollowUp(true);
    try {
      await api.post(`/prayers/${prayerId}/followup`, { message: followUpText.trim() });
      toast.success('Follow-up added');
      setFollowUpText('');
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send');
    } finally {
      setSendingFollowUp(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">My Prayer Requests</h2>
          <p className="text-sm text-gray-500 mt-0.5">{prayers.length} request{prayers.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> New Request
        </button>
      </div>

      {prayers.length === 0 ? (
        <div className="card p-10 text-center">
          <Heart size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No prayer requests yet</p>
          <p className="text-gray-400 text-sm mt-1">Share what's on your heart</p>
          <button onClick={() => setShowModal(true)} className="btn-primary mt-4 text-sm">Add First Request</button>
        </div>
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => {
            const isOpen = expanded === prayer._id;
            return (
              <div key={prayer._id} className="card overflow-hidden">
                {/* Header row — click to expand */}
                <button
                  className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                  onClick={() => { setExpanded(isOpen ? null : prayer._id); setFollowUpText(''); }}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{prayer.title}</h3>
                        {prayer.isPrivate ? (
                          <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full"><Lock size={10} />Private</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full"><Globe size={10} />Public</span>
                        )}
                        {prayer.followUps?.length > 0 && (
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{prayer.followUps.length} update{prayer.followUps.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{prayer.content}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                        <span>{new Date(prayer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><Heart size={11} />{prayer.prayerCount || 0} praying</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className={`text-gray-400 shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </div>
                </button>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4 bg-gray-50/50">
                    {/* Full content */}
                    <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{prayer.content}</p>

                    {/* Follow-ups timeline */}
                    {prayer.followUps?.length > 0 && (
                      <div className="mb-4 space-y-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Updates</p>
                        {prayer.followUps.map((fu, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-1.5 shrink-0 mt-1.5 flex flex-col items-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                              {i < prayer.followUps.length - 1 && <div className="flex-1 w-px bg-gray-200 mt-1" />}
                            </div>
                            <div className="flex-1 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                              <p className="text-sm text-gray-800">{fu.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{new Date(fu.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add follow-up */}
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Add an Update</p>
                      <textarea
                        className="input resize-none text-sm"
                        rows={2}
                        maxLength={1000}
                        placeholder='e.g. "My son got cured. Thank you for your prayers!"'
                        value={followUpText}
                        onChange={(e) => setFollowUpText(e.target.value)}
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{followUpText.length}/1000</span>
                        <button
                          onClick={() => handleFollowUp(prayer._id)}
                          disabled={!followUpText.trim() || sendingFollowUp}
                          className="btn-primary text-sm py-1.5 px-4 disabled:opacity-50"
                        >
                          {sendingFollowUp ? 'Sending...' : 'Send Update'}
                        </button>
                      </div>
                    </div>

                    {/* Edit / Delete actions */}
                    <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button onClick={() => { setEditing(prayer); setShowModal(true); }} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                        <Edit2 size={13} /> Edit Request
                      </button>
                      <button onClick={() => handleDelete(prayer._id)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <PrayerModal
          initial={editing}
          onSave={() => { setShowModal(false); setEditing(null); mutate(); }}
          onCancel={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

// ─── Donations Tab ─────────────────────────────────────────────────────────────
function DonationsTab() {
  const { data, mutate } = useSWR('/donations/my', fetcher);
  const donations = data?.data || [];

  const [form, setForm] = useState({ amount: '', currency: 'INR', method: 'bank_transfer', purpose: 'general', notes: '', referenceNumber: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amount || isNaN(form.amount) || Number(form.amount) < 1) {
      toast.error('Please enter a valid amount');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/donations', { ...form, amount: Number(form.amount) });
      toast.success('Donation recorded! Thank you for your generosity.');
      setForm({ amount: '', currency: 'INR', method: 'bank_transfer', purpose: 'general', notes: '', referenceNumber: '' });
      setShowForm(false);
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (s) => {
    const map = {
      confirmed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-600',
      pending: 'bg-yellow-100 text-yellow-700',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${map[s] || map.pending}`}>{s}</span>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Donations</h2>
          <p className="text-sm text-gray-500 mt-0.5">Record and track your giving</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary gap-2 text-sm">
          <Plus size={16} /> Record Donation
        </button>
      </div>

      {/* Donation Form */}
      {showForm && (
        <div className="card p-6 mb-6 border-2 border-primary-100">
          <h3 className="font-semibold text-gray-900 mb-4">New Donation Record</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Amount *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input
                    type="number" min="1" step="1"
                    className="input pl-7"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Currency</label>
                <select className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Payment Method *</label>
                <select className="input" value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                  <option value="cheque">Cheque</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Purpose</label>
                <select className="input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
                  <option value="general">General Fund</option>
                  <option value="building">Building Fund</option>
                  <option value="mission">Mission</option>
                  <option value="charity">Charity</option>
                  <option value="youth">Youth Ministry</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            {['bank_transfer', 'upi', 'cheque', 'online'].includes(form.method) && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Reference / Transaction Number</label>
                <input className="input" placeholder="e.g. UTR12345..." value={form.referenceNumber} onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })} maxLength={100} />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Notes (optional)</label>
              <textarea className="input resize-none" rows={2} maxLength={500} placeholder="Any additional information..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary flex-1" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Donation'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* History */}
      {donations.length === 0 ? (
        <div className="card p-10 text-center">
          <HandHeart size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No donations recorded yet</p>
          <p className="text-gray-400 text-sm mt-1">Your giving history will appear here</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Purpose</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Method</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {donations.map((d) => (
                <tr key={d._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{d.amount.toLocaleString()} {d.currency}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize hidden sm:table-cell">{d.purpose?.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize hidden md:table-cell">{d.method?.replace('_', ' ')}</td>
                  <td className="px-4 py-3">{statusBadge(d.status)}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Profile Tab ───────────────────────────────────────────────────────────────
function ProfileTab() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '', preferredLanguage: user?.preferredLanguage || 'en' });
  const [avatar, setAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(profile).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append('avatar', avatar);
      await api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Profile updated');
      dispatch(fetchCurrentUser());
      setAvatar(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = user?.avatar?.startsWith('http') ? user.avatar : null;

  return (
    <div className="w-full">
      {/* Avatar + Identity */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-700 transition-colors">
              <Upload size={12} className="text-white" />
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setAvatar(e.target.files[0])} />
            </label>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            <span className="capitalize text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full mt-1 inline-block">{user?.role}</span>
          </div>
        </div>

        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><User size={16} className="text-primary-600" />Personal Info</h3>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Full Name</label>
            <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Phone Number</label>
            <input className="input" type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Preferred Language</label>
            <select className="input" value={profile.preferredLanguage} onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}>
              <option value="en">English</option>
              <option value="ta">Tamil (தமிழ்)</option>
            </select>
          </div>
          {avatar && <p className="text-sm text-primary-600 flex items-center gap-1"><Check size={14} />New avatar selected: {avatar.name}</p>}
          <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [changingPw, setChangingPw] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setChangingPw(true);
    try {
      await api.put('/users/change-password', { currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="w-full">
      {/* Change Password */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Lock size={16} className="text-primary-600" />Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Current Password</label>
            <input type="password" className="input" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
            <input type="password" className="input" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} required minLength={8} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
            <input type="password" className="input" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={changingPw}>{changingPw ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'prayers', label: 'Prayer Requests', icon: Heart },
  { id: 'donations', label: 'Donations', icon: HandHeart },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
];

function DashboardPage() {
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-20 w-full">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:fixed md:left-0 md:top-20 md:bottom-0 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex flex-col z-10 shrink-0">
        {/* User Card - Hidden on Mobile */}
        <div className="hidden md:flex flex-col items-center p-6 border-b border-gray-50">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-2xl font-bold overflow-hidden mb-3">
            {user?.avatar?.startsWith('http') ? (
              <img src={user.avatar} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <h2 className="font-bold text-gray-900 text-center truncate w-full">{user?.name}</h2>
          <p className="text-gray-500 text-xs text-center truncate w-full mt-0.5">{user?.email}</p>
          <span className="capitalize text-[10px] bg-primary-50 text-primary-700 px-2.5 py-0.5 rounded-full mt-2 font-semibold tracking-wider">
            {user?.role?.replace('_', ' ')}
          </span>
        </div>

        {/* Sidebar Tabs */}
        <div className="flex-1 p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto whitespace-nowrap md:whitespace-normal">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium transition-all w-full text-left ${
                activeTab === id
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/10'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={16} className={activeTab === id ? 'text-white' : 'text-gray-400'} />
              {label}
            </button>
          ))}
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 md:ml-64 p-6 md:p-10 min-w-0 w-full bg-gray-50">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your profile, prayer requests, and giving</p>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {activeTab === 'overview' && <OverviewTab user={user} onNavigate={setActiveTab} />}
          {activeTab === 'prayers' && <PrayersTab currentUserId={user?._id} />}
          {activeTab === 'donations' && <DonationsTab />}
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}

export default withAuth(DashboardPage);
