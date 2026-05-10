'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { Trash2, Heart, ChevronRight } from 'lucide-react';
import api from '../../../../lib/api';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const fetcher = (url) => api.get(url).then((r) => r.data);

export default function AdminPrayers() {
  const { user } = useSelector((s) => s.auth);
  const canDelete = ['super_admin', 'admin'].includes(user?.role);
  const { data, mutate } = useSWR('/prayers', fetcher);
  const prayers = data?.data || [];
  const [expanded, setExpanded] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Delete this prayer request?')) return;
    try {
      await api.delete(`/prayers/${id}`);
      toast.success('Prayer request deleted');
      if (expanded === id) setExpanded(null);
      mutate();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Prayer Requests</h2>
        <span className="text-sm text-gray-500">{prayers.length} total</span>
      </div>

      <div className="space-y-3">
        {prayers.map((prayer) => {
          const isOpen = expanded === prayer._id;
          return (
            <div key={prayer._id} className="card overflow-hidden">
              {/* Header row */}
              <button
                className="w-full text-left p-5 hover:bg-gray-50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : prayer._id)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{prayer.title}</h3>
                      {prayer.isPrivate ? (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">🔒 Private</span>
                      ) : (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Public</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                        prayer.status === 'answered' ? 'bg-green-100 text-green-700' :
                        prayer.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>{prayer.status}</span>
                      {prayer.followUps?.length > 0 && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                          {prayer.followUps.length} update{prayer.followUps.length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{prayer.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>By: {prayer.submittedBy?.name || 'Anonymous'}</span>
                      <span className="flex items-center gap-1"><Heart size={11} />{prayer.prayerCount} praying</span>
                      <span>{new Date(prayer.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {canDelete && (
                      <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(prayer._id); }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </span>
                    )}
                    <ChevronRight size={15} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Expanded: full content + follow-ups */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 pb-5 pt-4 bg-gray-50/50">
                  <p className="text-sm text-gray-700 mb-4 whitespace-pre-wrap">{prayer.content}</p>

                  {prayer.followUps?.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Updates from {prayer.submittedBy?.name || 'user'}</p>
                      {prayer.followUps.map((fu, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="w-1.5 shrink-0 mt-1.5 flex flex-col items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                            {i < prayer.followUps.length - 1 && <div className="flex-1 w-px bg-gray-200 mt-1" />}
                          </div>
                          <div className="flex-1 bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-800">{fu.message}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(fu.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">No follow-up updates yet.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {prayers.length === 0 && (
          <div className="card p-8 text-center text-gray-400">
            <Heart size={40} className="mx-auto mb-2 text-gray-200" />
            <p>No prayer requests yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

