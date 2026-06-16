'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Edit3, Heart, Send, Loader2, X, MapPin } from 'lucide-react';
import useSWR from 'swr';
import api from '../../lib/api';
import BibleSearchWidget from './BibleSearchWidget';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import Link from 'next/link';

const fetcher = (url) => api.get(url).then((r) => r.data?.data || r.data);

// 1. Mini Prayer Form
function MiniPrayerForm({ theme }) {
  const { user } = useSelector((s) => s.auth);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const isDark = theme === 'dark';

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !title.trim()) return;
    setSaving(true);
    try {
      await api.post('/prayers', { title, content, isPrivate: false });
      setContent('');
      setTitle('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit prayer request. Please ensure you are logged in.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <h3 className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>Submit Prayer Request</h3>
        <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Let us know how we can pray for you.</p>
      </div>
      
      {!user ? (
        <div className={`flex flex-col items-center justify-center flex-1 text-center p-4 rounded-xl border ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-600'}`}>
          <p className="font-medium text-[15px] mb-4">You must sign in to send prayer requests.</p>
          <Link href="/login" className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors">
            Sign In
          </Link>
        </div>
      ) : success ? (
        <div className={`flex flex-col items-center justify-center flex-1 text-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
          <Heart size={48} className="mb-4" />
          <p className="font-medium">Prayer request received!</p>
          <p className="text-sm opacity-80 mt-2">Our team will be praying for you.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-2 flex-1">
          <input
            type="text"
            placeholder="Title / Subject"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-2 px-3 rounded-lg text-xs border focus:outline-none transition-all ${
              isDark 
                ? 'bg-black/50 border-white/20 text-white placeholder-white/40 focus:border-gold' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'
            }`}
          />
          <textarea
            required
            placeholder="Share your prayer request here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full p-2 px-3 rounded-lg text-xs border focus:outline-none transition-all resize-none flex-1 ${
              isDark 
                ? 'bg-black/50 border-white/20 text-white placeholder-white/40 focus:border-gold' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'
            }`}
          />
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center justify-center gap-2 p-2 rounded-lg text-sm font-bold transition-all ${
              isDark 
                ? 'bg-gold text-black hover:bg-yellow-500 disabled:opacity-50' 
                : 'bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50'
            }`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {saving ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
}

// 2. Mini Schedule
function MiniSchedule({ theme }) {
  const now = new Date();
  const { data: events, error } = useSWR(`/events?month=${now.getMonth() + 1}&year=${now.getFullYear()}`, fetcher);
  const isDark = theme === 'dark';

  const upcoming = (events || []).filter((event) => {
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    return eventEnd >= now;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2">
        <h3 className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>Upcoming Events</h3>
        <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Join us for our upcoming activities.</p>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1.5">
        {!events && !error && (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-gray-400" /></div>
        )}
        {error && <p className="text-red-400 text-sm py-4">Failed to load schedule.</p>}
        {events && upcoming.length === 0 && (
          <p className={`text-sm py-4 text-center ${isDark ? 'text-white/40' : 'text-gray-400'}`}>No upcoming events for this month.</p>
        )}
        {upcoming.map(event => (
          <div key={event._id} className={`p-2 rounded-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
            <h4 className={`font-bold text-sm mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{event.title}</h4>
            <div className={`text-xs space-y-1 ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
              <div className="flex items-center gap-1.5">
                <Calendar size={12} className={isDark ? 'text-gold' : 'text-primary-600'} />
                <span>{format(new Date(event.startDate), 'MMM d, h:mm a')}</span>
              </div>
              {event.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={12} className={isDark ? 'text-gold' : 'text-primary-600'} />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 3. Mini Notes
function MiniNotes({ id, theme }) {
  const { user } = useSelector((s) => s.auth);
  const [note, setNote] = useState('');
  const [savedIndicator, setSavedIndicator] = useState(false);
  const isDark = theme === 'dark';
  
  const userIdStr = user?._id || user?.id || 'guest';
  const storageKey = `sermon_notes_${userIdStr}_${id || 'livestream'}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setNote(saved);
  }, [storageKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (note !== localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, note);
        setSavedIndicator(true);
        setTimeout(() => setSavedIndicator(false), 2000);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [note, storageKey]);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your notes?')) {
      setNote('');
      localStorage.removeItem(storageKey);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className={`font-bold text-sm mb-0.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Notes</h3>
          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Your personal notes are auto-saved.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`text-xs font-semibold px-2 py-1 rounded-md transition-opacity duration-300 ${savedIndicator ? 'opacity-100' : 'opacity-0'} ${isDark ? 'bg-white/10 text-white/80' : 'bg-gray-200 text-gray-700'}`}>
            Saved
          </div>
          <button
            onClick={handleClear}
            className={`p-1.5 rounded-lg text-xs font-medium border flex justify-center items-center gap-1 transition-colors ${
              isDark ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
            title="Clear Notes"
          >
            Clear
          </button>
        </div>
      </div>
      
      <textarea
        placeholder="Type your notes here... They will be saved to your browser automatically."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className={`w-full p-3 rounded-lg text-xs border focus:outline-none transition-all resize-none flex-1 custom-scrollbar ${
          isDark 
            ? 'bg-black/50 border-white/20 text-white placeholder-white/40 focus:border-gold' 
            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-500'
        }`}
      />
    </div>
  );
}

// Main Interactive Sidebar Component
export default function InteractiveSidebar({ id, theme = 'dark', onClose, initialTab = 'bible' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const isDark = theme === 'dark';

  const tabs = [
    { id: 'pray', icon: Heart, label: 'Pray' },
    { id: 'schedule', icon: Calendar, label: 'Schedule' },
    { id: 'notes', icon: Edit3, label: 'Notes' },
    { id: 'bible', icon: BookOpen, label: 'Bible' },
  ];

  return (
    <div className={`flex flex-col h-full w-full rounded-xl overflow-hidden shadow-md transition-all duration-300 border ${
      isDark ? 'bg-black/40 backdrop-blur-md border-white/10' : 'bg-white border-gray-100'
    }`}>
      
      {/* Top Header */}
      <div className={`flex items-center justify-between p-2 px-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <div className="flex gap-2 items-center">
          {tabs.find(t => t.id === activeTab)?.icon && (
            <div className={isDark ? 'text-gold' : 'text-primary-600'}>
              {(() => {
                const Icon = tabs.find(t => t.id === activeTab).icon;
                return <Icon size={20} />;
              })()}
            </div>
          )}
          <span className={`font-semibold capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {activeTab}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className={`p-1.5 rounded-full transition-colors ${isDark ? 'text-white/50 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden p-3 min-h-[300px]">
        {activeTab === 'pray' && <MiniPrayerForm theme={theme} />}
        {activeTab === 'schedule' && <MiniSchedule theme={theme} />}
        {activeTab === 'notes' && <MiniNotes id={id} theme={theme} />}
        {activeTab === 'bible' && (
          // Use the existing widget but hide its native header to avoid duplication
          <div className="h-full [&>div]:p-0 [&>div]:border-0 [&>div>div:first-child]:hidden [&>div]:bg-transparent [&>div]:shadow-none">
            <BibleSearchWidget theme={theme} />
          </div>
        )}
      </div>

      {/* Bottom Tab Navigation */}
      <div className={`flex justify-around items-center p-1 border-t ${isDark ? 'border-white/10 bg-black/40' : 'border-gray-100 bg-gray-50'}`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 w-full py-1.5 rounded-lg transition-all ${
                isActive 
                  ? (isDark ? 'text-gold bg-white/5' : 'text-primary-600 bg-primary-50')
                  : (isDark ? 'text-white/50 hover:text-white/80 hover:bg-white/5' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100')
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium tracking-wide uppercase">{tab.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}
