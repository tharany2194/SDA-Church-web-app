'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Heart, Send, History, Trash2, CheckCircle, Clock, Image } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

function VerseBackgroundManager() {
  const { data: backgrounds, error, mutate } = useSWR('/verses/backgrounds', fetcher);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      await api.post('/verses/backgrounds', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Background uploaded successfully!');
      mutate();
    } catch (err) {
      toast.error('Failed to upload background');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this background?')) return;
    try {
      await api.delete(`/verses/backgrounds/${id}`);
      toast.success('Deleted successfully');
      mutate();
    } catch (err) {
      toast.error('Failed to delete background');
    }
  };

  return (
    <div className="card mt-8 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Image size={18} className="text-primary-500" />
          Verse Backgrounds
        </h3>
        <div>
          <input type="file" id="bg-upload" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          <label htmlFor="bg-upload" className="btn btn-secondary cursor-pointer text-sm py-1.5 px-3">
            {uploading ? 'Uploading...' : 'Upload Image'}
          </label>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-4">Upload background images for the Verse of the Day. One will be randomly selected every day.</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {backgrounds?.map((bg) => (
          <div key={bg._id} className="relative group rounded-xl overflow-hidden aspect-video border border-gray-100 shadow-sm">
            <img src={bg.url} alt="Background" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <button 
              type="button"
              onClick={() => handleDelete(bg._id)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {backgrounds?.length === 0 && (
          <div className="col-span-full py-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed text-sm">
            No backgrounds uploaded yet!
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerseManagement() {
  const { data: history, error } = useSWR('/verses', fetcher);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    contentEn: '',
    contentTa: '',
    reference: '',
    referenceTa: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/verses', formData);
      toast.success('Verse updated successfully!');
      setFormData({ contentEn: '', contentTa: '', reference: '', referenceTa: '' });
      mutate('/verses');
      mutate('/verses/today');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update verse');
    } finally {
      setLoading(false);
    }
  };

  const handleReuse = async (verse) => {
    setLoading(true);
    try {
      await api.post('/verses', {
        contentEn: verse.contentEn,
        contentTa: verse.contentTa,
        reference: verse.reference,
        referenceTa: verse.referenceTa,
      });
      toast.success('Verse re-activated!');
      mutate('/verses');
      mutate('/verses/today');
    } catch (err) {
      toast.error('Failed to re-activate verse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="text-rose-500" />
          Verse of the Day Management
        </h2>
        <p className="text-gray-500">Add a new verse or choose from previous ones to display on the landing page.</p>
      </div>

      {/* Add Verse Form */}
      <div className="card p-6 mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Set New Verse</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="w-full min-w-0 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">English Content</label>
              <textarea
                required
                className="input min-h-[100px] w-full resize-y"
                placeholder="Enter English verse..."
                value={formData.contentEn}
                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
              />
            </div>
            <div className="w-full min-w-0 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tamil Content</label>
              <textarea
                required
                className="input min-h-[100px] w-full resize-y"
                placeholder="வசனத்தை உள்ளிடவும்..."
                value={formData.contentTa}
                onChange={(e) => setFormData({ ...formData, contentTa: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="w-full min-w-0 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">English Reference (e.g. John 3:16)</label>
              <input
                type="text"
                required
                className="input w-full"
                placeholder="Book Chapter:Verse"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>
            <div className="w-full min-w-0 flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tamil Reference (எ.கா. யோவான் 3:16)</label>
              <input
                type="text"
                required
                className="input w-full"
                placeholder="புத்தகம் அதிகாரம்:வசனம்"
                value={formData.referenceTa}
                onChange={(e) => setFormData({ ...formData, referenceTa: e.target.value })}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {loading ? 'Updating...' : 'Publish Verse'}
          </button>
        </form>
      </div>

      {/* History */}
      <div className="card overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex items-center gap-2">
          <History size={18} className="text-gray-500" />
          <h3 className="font-semibold text-gray-900">Verse History & Records</h3>
        </div>
        <div className="overflow-auto max-h-[400px] custom-scrollbar">
          <table className="w-full text-left border-collapse relative">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold sticky top-0 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Verse</th>
                <th className="px-6 py-3">Expires At</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {history?.map((verse) => {
                const isExpired = new Date(verse.expiresAt) < new Date();
                const isActive = verse.isActive && !isExpired;

                return (
                  <tr key={verse._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Clock size={12} /> Expired
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{verse.contentEn}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 italic mb-1">{verse.contentTa}</p>
                      <div className="flex gap-4">
                        <p className="text-xs font-semibold text-primary-600">{verse.reference}</p>
                        <p className="text-xs font-semibold text-primary-600 italic">{verse.referenceTa}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(verse.expiresAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!isActive && (
                        <button
                          onClick={() => handleReuse(verse)}
                          disabled={loading}
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1 ml-auto"
                        >
                          <Send size={14} /> Reuse
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {(!history || history.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500 italic">
                    No verse records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <VerseBackgroundManager />
    </div>
  );
}
