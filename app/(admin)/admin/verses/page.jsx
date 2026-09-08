'use client';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Heart, Send, History, Trash2, CheckCircle, Clock, Image, Music, Play } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

function VerseAudioManager() {
  const { data: audioTracks, error, mutate } = useSWR('/verses/audio', fetcher);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (Max 10 MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error('Audio file size must be 10 MB or less');
      e.target.value = '';
      return;
    }

    // Check audio duration (Max 10 seconds)
    const objectUrl = URL.createObjectURL(file);
    const audio = new window.Audio(objectUrl);

    const isDurationValid = await new Promise((resolve) => {
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(objectUrl);
        if (audio.duration > 10.5) {
          toast.error(`Audio duration (${Math.round(audio.duration)}s) exceeds maximum allowed duration of 10 seconds`);
          resolve(false);
        } else {
          resolve(true);
        }
      };
      audio.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(true); // proceed if metadata check unavailable
      };
    });

    if (!isDurationValid) {
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

    setUploading(true);
    try {
      await api.post('/verses/audio', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Background music uploaded successfully!');
      mutate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload background music');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this background audio track?')) return;
    try {
      await api.delete(`/verses/audio/${id}`);
      toast.success('Audio track deleted successfully');
      mutate();
    } catch (err) {
      toast.error('Failed to delete audio track');
    }
  };

  return (
    <div className="card mt-8 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Music size={18} className="text-primary-500" />
          Verse Background Music
        </h3>
        <div>
          <input type="file" id="audio-upload" className="hidden" accept="audio/*" onChange={handleUpload} disabled={uploading} />
          <label htmlFor="audio-upload" className="btn btn-secondary cursor-pointer text-sm py-1.5 px-3">
            {uploading ? 'Uploading...' : 'Upload Audio Track'}
          </label>
        </div>
      </div>
      <p className="text-gray-500 text-sm mb-4">
        Upload background music tracks (MP3, WAV, M4A, AAC) for the Verse of the Day video generator.
        <span className="block mt-1 text-xs text-amber-600 font-medium">
          ⚠️ Note: Audio files must be 10 MB or less in size and 10 seconds or less in duration.
        </span>
      </p>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {audioTracks?.map((track) => (
          <div key={track._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 gap-3 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-primary-50 text-primary-600 flex-shrink-0">
                <Music size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{track.title || 'Background Music'}</p>
                <p className="text-xs text-gray-400">Uploaded {new Date(track.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <audio src={track.url} controls className="h-8 max-w-[200px] sm:max-w-[250px]" />
              <button 
                type="button"
                onClick={() => handleDelete(track._id)}
                className="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors flex-shrink-0"
                title="Delete track"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {audioTracks?.length === 0 && (
          <div className="py-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed text-sm">
            No background music tracks uploaded yet!
          </div>
        )}
      </div>
    </div>
  );
}

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
  const { data: history, mutate: mutateHistory } = useSWR('/verses', fetcher);
  const { data: backgrounds } = useSWR('/verses/backgrounds', fetcher);
  const { data: audioTracks } = useSWR('/verses/audio', fetcher);
  
  const [loading, setLoading] = useState(false);
  const [targetDay, setTargetDay] = useState('today');
  const [selectedBg, setSelectedBg] = useState('');
  const [selectedAudio, setSelectedAudio] = useState('');
  
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
      await api.post('/verses', {
        ...formData,
        backgroundUrl: selectedBg || null,
        audioUrl: selectedAudio || null,
        targetDay,
      });
      toast.success(targetDay === 'today' ? 'Set active for Today!' : 'Scheduled for Tomorrow at 12 AM!');
      setFormData({ contentEn: '', contentTa: '', reference: '', referenceTa: '' });
      setSelectedBg('');
      setSelectedAudio('');
      mutate('/verses');
      mutate('/verses/today');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update verse');
    } finally {
      setLoading(false);
    }
  };

  const handleReuse = async (verse, day = 'today') => {
    setLoading(true);
    try {
      await api.post('/verses', {
        contentEn: verse.contentEn,
        contentTa: verse.contentTa,
        reference: verse.reference,
        referenceTa: verse.referenceTa,
        backgroundUrl: verse.backgroundUrl || null,
        audioUrl: verse.audioUrl || null,
        targetDay: day,
      });
      toast.success(day === 'today' ? 'Set active for Today!' : 'Scheduled for Tomorrow!');
      mutate('/verses');
      mutate('/verses/today');
    } catch (err) {
      toast.error('Failed to set verse');
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
        <p className="text-gray-500">Configure verse text, select background image, and select background music step-by-step.</p>
        <div className="mt-2 p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed font-medium">
          ✨ <strong>Manual-First Flow & 12 AM Automatic Fallback:</strong> Set today's or tomorrow's verse text, background image, and background audio manually. Once set for a 24-hour period, it stays 100% fixed on the home page until 12 AM midnight. If no manual verse is set for a day, the system automatically selects a random set at 12 AM midnight and locks it for 24 hours.
        </div>
      </div>

      {/* Structured Step-by-Step Form */}
      <div className="card p-6 mb-8 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 text-lg mb-1">Step-by-Step Verse Creation</h3>
        <p className="text-gray-500 text-xs mb-6">Complete steps 1 to 3 to organize your verse set for Today or Tomorrow.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1 */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4">
            <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm">
              <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">1</span>
              Step 1: Enter Verse Content (English & Tamil)
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="w-full min-w-0 flex flex-col">
                <label className="block text-xs font-medium text-gray-700 mb-1">English Content</label>
                <textarea
                  required
                  className="input min-h-[90px] w-full resize-y text-sm"
                  placeholder="Enter English verse..."
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                />
              </div>
              <div className="w-full min-w-0 flex flex-col">
                <label className="block text-xs font-medium text-gray-700 mb-1">Tamil Content</label>
                <textarea
                  required
                  className="input min-h-[90px] w-full resize-y text-sm"
                  placeholder="வசனத்தை உள்ளிடவும்..."
                  value={formData.contentTa}
                  onChange={(e) => setFormData({ ...formData, contentTa: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div className="w-full min-w-0 flex flex-col">
                <label className="block text-xs font-medium text-gray-700 mb-1">English Reference (e.g. John 3:16)</label>
                <input
                  type="text"
                  required
                  className="input w-full text-sm"
                  placeholder="Book Chapter:Verse"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                />
              </div>
              <div className="w-full min-w-0 flex flex-col">
                <label className="block text-xs font-medium text-gray-700 mb-1">Tamil Reference (எ.கா. யோவான் 3:16)</label>
                <input
                  type="text"
                  required
                  className="input w-full text-sm"
                  placeholder="புத்தகம் அதிகாரம்:வசனம்"
                  value={formData.referenceTa}
                  onChange={(e) => setFormData({ ...formData, referenceTa: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">2</span>
                Step 2: Select Background Image
              </div>
              <span className="text-xs text-gray-400">Optional (Auto fallback if unselected)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
              <div
                onClick={() => setSelectedBg('')}
                className={`cursor-pointer rounded-lg border-2 p-2 text-center flex flex-col items-center justify-center aspect-video transition-all ${
                  selectedBg === '' ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold' : 'border-dashed border-gray-300 text-gray-400 hover:border-gray-400'
                }`}
              >
                <Image size={20} className="mb-1" />
                <span className="text-xs">Random Auto</span>
              </div>
              {backgrounds?.map((bg) => (
                <div
                  key={bg._id}
                  onClick={() => setSelectedBg(bg.url)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 aspect-video transition-all ${
                    selectedBg === bg.url ? 'border-primary-600 ring-2 ring-primary-500/30' : 'border-gray-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={bg.url} alt="Background option" className="w-full h-full object-cover" />
                  {selectedBg === bg.url && (
                    <div className="absolute inset-0 bg-primary-600/30 flex items-center justify-center text-white">
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* STEP 3 */}
          <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary-700 font-semibold text-sm">
                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">3</span>
                Step 3: Select Background Music Track
              </div>
              <span className="text-xs text-gray-400">Optional (Auto fallback if unselected)</span>
            </div>

            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
              <div
                onClick={() => setSelectedAudio('')}
                className={`cursor-pointer p-2.5 rounded-lg border-2 flex items-center justify-between text-xs transition-all ${
                  selectedAudio === '' ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Music size={16} />
                  <span>Random Auto Audio</span>
                </div>
                {selectedAudio === '' && <CheckCircle size={14} className="text-primary-600" />}
              </div>

              {audioTracks?.map((track) => (
                <div
                  key={track._id}
                  onClick={() => setSelectedAudio(track.url)}
                  className={`cursor-pointer p-2.5 rounded-lg border-2 flex items-center justify-between text-xs transition-all ${
                    selectedAudio === track.url ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold' : 'border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Music size={16} className="text-primary-500 flex-shrink-0" />
                    <span className="truncate">{track.title || 'Background Music'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <audio src={track.url} controls onClick={(e) => e.stopPropagation()} className="h-6 max-w-[140px]" />
                    {selectedAudio === track.url && <CheckCircle size={14} className="text-primary-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Target Day Selector & Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-xl text-xs font-semibold w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setTargetDay('today')}
                className={`px-4 py-2 rounded-lg transition-all flex-1 sm:flex-none ${
                  targetDay === 'today' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                ☀️ Set for Today (Active 24 Hours)
              </button>
              <button
                type="button"
                onClick={() => setTargetDay('tomorrow')}
                className={`px-4 py-2 rounded-lg transition-all flex-1 sm:flex-none ${
                  targetDay === 'tomorrow' ? 'bg-white text-gray-900 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                🌙 Schedule for Tomorrow (12 AM)
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full sm:w-auto px-8 py-2.5 flex items-center justify-center gap-2 text-sm"
            >
              <Send size={16} />
              {loading ? 'Saving...' : targetDay === 'today' ? 'Publish for Today' : 'Schedule for Tomorrow'}
            </button>
          </div>

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
      <VerseAudioManager />
    </div>
  );
}
