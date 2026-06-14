import { useState } from 'react';
import { Search, Loader2, X, BookOpen } from 'lucide-react';

export default function BibleSearchWidget({ onClose, theme = 'dark' }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDark = theme === 'dark';

  const searchBible = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(query)}?translation=kjv`);
      if (!res.ok) throw new Error('Verse not found. Please check spelling (e.g. John 3:16).');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border p-4 shadow-xl transition-all duration-300 ${isDark ? 'bg-black/40 backdrop-blur-md border-white/20' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <BookOpen size={20} className={isDark ? 'text-gold' : 'text-primary-600'} />
          KJV Bible
        </h3>
        {onClose && (
          <button onClick={onClose} className={`p-1 rounded-full transition-colors ${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'}`}>
            <X size={18} />
          </button>
        )}
      </div>
      <form onSubmit={searchBible} className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="e.g. John 3:16" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`flex-1 rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors border ${
            isDark 
              ? 'bg-black/40 text-white placeholder-white/50 border-white/20 focus:border-gold' 
              : 'bg-gray-50 text-gray-900 placeholder-gray-400 border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
          }`}
        />
        <button type="submit" className={`px-3 py-2 rounded-xl flex items-center justify-center transition-all shadow-md hover:-translate-y-0.5 ${
          isDark
            ? 'bg-gold text-black hover:bg-[#d59a2a]'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
        </button>
      </form>
      
      <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[500px] pr-2 custom-scrollbar">
        {error && <p className="text-red-500 text-sm text-center py-4">{error}</p>}
        {result && (
          <div className="animate-fade-in">
            <h4 className={`font-bold mb-3 text-lg ${isDark ? 'text-gold' : 'text-primary-700'}`}>
              {result.reference}
            </h4>
            <div className={`space-y-3 leading-relaxed text-sm lg:text-base ${isDark ? 'text-white/90' : 'text-gray-700'}`}>
              {result.verses ? result.verses.map((v, i) => (
                <p key={i}>
                  <sup className={`font-semibold mr-1 ${isDark ? 'text-white/50' : 'text-gray-400'}`}>{v.verse}</sup>
                  {v.text.trim()}
                </p>
              )) : (
                <p>{result.text}</p>
              )}
            </div>
          </div>
        )}
        {!result && !error && !loading && (
          <div className={`flex flex-col items-center justify-center h-full text-center py-8 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p className="text-sm italic">Search for a book, chapter, or verse to read.</p>
          </div>
        )}
      </div>
    </div>
  );
}
