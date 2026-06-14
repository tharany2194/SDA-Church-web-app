import { useState, useEffect } from 'react';
import { Search, Loader2, X, BookOpen } from 'lucide-react';

export default function BibleSearchWidget({ onClose, theme = 'dark' }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [bibleLang, setBibleLang] = useState('eng');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [booksList, setBooksList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/aruljohn/Bible-tamil/main/Books.json')
      .then(res => res.json())
      .then(data => setBooksList(data))
      .catch(err => console.error('Failed to load books dictionary', err));
  }, []);

  const searchBible = async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setShowDropdown(false);
    try {
      let finalQuery = query;
      // If typing in Tamil text, transliterate the book name to English for the parser
      for (const b of booksList) {
        if (finalQuery.includes(b.book.tamil)) {
          finalQuery = finalQuery.replace(b.book.tamil, b.book.english);
          break;
        }
      }

      const res = await fetch(`https://bible-api.com/${encodeURIComponent(finalQuery)}?translation=kjv`);
      if (!res.ok) throw new Error('Verse not found. Please check spelling (e.g. John 3:16).');
      const data = await res.json();

      if (bibleLang === 'tam' && data.verses && data.verses.length > 0) {
        try {
          const bookName = data.verses[0].book_name.replace(/ /g, '_');
          const tamilRes = await fetch(`https://raw.githubusercontent.com/aruljohn/Bible-tamil/main/${bookName}.json`);
          if (tamilRes.ok) {
            const tamilData = await tamilRes.json();
            const tamilVerses = data.verses.map(v => {
              const chapterObj = tamilData.chapters.find(c => c.chapter === v.chapter.toString());
              const verseObj = chapterObj?.verses.find(t => t.verse === v.verse.toString());
              return {
                ...v,
                text: verseObj ? verseObj.text : v.text
              };
            });
            data.verses = tamilVerses;
            data.reference = data.reference.replace(data.verses[0].book_name, tamilData.book.tamil);
          }
        } catch (e) {
          console.error("Failed to load Tamil bible data:", e);
        }
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full rounded-2xl border p-3 sm:p-4 shadow-xl transition-all duration-300 ${isDark ? 'bg-black/40 backdrop-blur-md border-white/20' : 'bg-white border-gray-100 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <BookOpen size={20} className={isDark ? 'text-gold' : 'text-primary-600'} />
          Bible
        </h3>
        {onClose && (
          <button onClick={onClose} className={`p-1 rounded-full transition-colors ${isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-800 hover:bg-gray-100'}`}>
            <X size={18} />
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-4 bg-black/10 p-1 rounded-xl">
        <button
          onClick={() => { setBibleLang('eng'); setResult(null); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            bibleLang === 'eng' ? (isDark ? 'bg-gold text-black shadow-md' : 'bg-white text-primary-600 shadow-sm') : (isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900')
          }`}
        >
          English
        </button>
        <button
          onClick={() => { setBibleLang('tam'); setResult(null); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            bibleLang === 'tam' ? (isDark ? 'bg-gold text-black shadow-md' : 'bg-white text-primary-600 shadow-sm') : (isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900')
          }`}
        >
          தமிழ்
        </button>
      </div>

      <div className="relative mb-4">
        <form onSubmit={searchBible} className="flex gap-2">
          <input 
            type="text" 
            placeholder={bibleLang === 'tam' ? 'உ-ம்: யோவான் 3:16' : 'e.g. John 3:16'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowDropdown(true)}
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

        {showDropdown && booksList.length > 0 && (
          <div className={`absolute top-full lg:left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl border shadow-2xl z-50 p-2 custom-scrollbar ${
            isDark ? 'bg-gray-900 border-white/20' : 'bg-white border-gray-200'
          }`}>
            <div className="flex justify-between items-center px-3 mb-2 pb-2 border-b border-gray-500/20">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white/50' : 'text-gray-500'}`}>Select Book</span>
              <button type="button" onClick={() => setShowDropdown(false)} className={`text-xs ${isDark ? 'text-white/50 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}>Close</button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {booksList.map((b, i) => {
                const bookName = bibleLang === 'tam' ? b.book.tamil : b.book.english;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setQuery(`${bookName} `);
                      setShowDropdown(false);
                    }}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition-colors truncate ${
                      isDark ? 'text-white/80 hover:bg-white/10 hover:text-gold' : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                    }`}
                  >
                    {bookName}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[500px] pl-3 pr-2 custom-scrollbar">
        {error && <p className="text-red-500 text-sm text-center py-4">{error}</p>}
        {result && (
          <div className="animate-fade-in pl-1">
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
