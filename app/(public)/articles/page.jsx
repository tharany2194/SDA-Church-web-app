'use client';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Tag, ArrowRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../../../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data);

const categoryColors = {
  devotional: 'bg-purple-100 text-purple-700',
  news: 'bg-blue-100 text-blue-700',
  testimony: 'bg-green-100 text-green-700',
  announcement: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-600',
};

const t = {
  en: {
    title: 'Articles & Devotionals',
    subtitle: 'Encouraging words, testimonies, and church news',
    emptyState: 'No articles in this category yet.',
    all: 'all',
    devotional: 'devotional',
    news: 'news',
    testimony: 'testimony',
    announcement: 'announcement',
    other: 'other',
  },
  ta: {
    title: 'கட்டுரைகள் & தியானங்கள்',
    subtitle: 'ஊக்கமளிக்கும் வார்த்தைகள், சாட்சிகள் மற்றும் சபை செய்திகள்',
    emptyState: 'இந்த பிரிவில் இன்னும் கட்டுரைகள் இல்லை.',
    all: 'அனைத்தும்',
    devotional: 'தியானம்',
    news: 'செய்திகள்',
    testimony: 'சாட்சிகள்',
    announcement: 'அறிவிப்புகள்',
    other: 'மற்றவை',
  }
};

export default function ArticlesPage() {
  const { language = 'en' } = useSelector((s) => s.ui) || {};
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const { data } = useSWR(`/articles?page=${page}&limit=9${category !== 'all' ? `&category=${category}` : ''}`, fetcher);
  const articles = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <section className="pt-20 pb-12 min-h-screen bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h1 className="page-title">{t[language].title}</h1>
          <p className="page-subtitle">{t[language].subtitle}</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {['all', 'devotional', 'news', 'testimony', 'announcement'].map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${category === c ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
            >
              {t[language][c] || c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || '';
            let coverUrl = article.coverImage?.startsWith('http')
              ? article.coverImage
              : article.coverImage ? `${baseUrl}${article.coverImage}` : null;
            
            // Legacy support
            if (coverUrl && (article.coverImage?.startsWith('/images/') || article.coverImage?.startsWith('/videos/')) && !article.coverImage?.includes('/api/v1/media')) {
              coverUrl = `${baseUrl}/api/v1/media${article.coverImage}`;
            }

            const displayTitle = language === 'ta' ? (article.titleTa || article.title) : article.title;
            const displayExcerpt = language === 'ta' ? (article.excerptTa || article.excerpt) : article.excerpt;
            const displayCategory = language === 'ta' ? (t['ta'][article.category] || article.category) : article.category;

            return (
              <Link href={`/articles/${article.slug}`} key={article._id} className="card group overflow-hidden hover:shadow-md transition-shadow">
                {coverUrl ? (
                  <div className="relative h-48 bg-gray-100">
                    <Image src={coverUrl} alt={displayTitle} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${categoryColors[article.category] || categoryColors.other}`}>
                        {displayCategory}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                    <BookOpen size={48} className="text-primary-300" />
                  </div>
                )}
                <div className="p-5">
                  <h2 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors mb-2">{displayTitle}</h2>
                  {displayExcerpt && <p className="text-gray-500 text-sm line-clamp-2 mb-3">{displayExcerpt}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    {article.author?.name && (
                      <span className="flex items-center gap-1"><User size={11} />{article.author.name}</span>
                    )}
                    {article.publishedAt && (
                      <span className="flex items-center gap-1"><Calendar size={11} />{format(new Date(article.publishedAt), 'MMM d, yyyy')}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <BookOpen size={48} className="mx-auto mb-3 text-gray-200" />
            <p>{t[language].emptyState}</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex gap-2 justify-center mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'}`}
              >{p}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
