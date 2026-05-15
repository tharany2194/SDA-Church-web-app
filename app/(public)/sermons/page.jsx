'use client';
import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Search, Filter } from 'lucide-react';
import api from '../../../lib/api';
import { useSelector } from 'react-redux';

const fetcher = (url) => api.get(url).then((r) => r.data);

const categories = ['all', 'sermon', 'teaching', 'testimony', 'worship', 'other'];

export default function SermonsPage() {
  const { language } = useSelector((s) => s.ui);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const query = `/messages?page=${page}&limit=12${category !== 'all' ? `&category=${category}` : ''}`;
  const { data, isLoading } = useSWR(query, fetcher);
  const messages = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="pt-24 pb-12">

      <div className="container-custom">
        <h1 className="section-title">
          {language === 'ta' ? 'பிரசங்கங்கள் & செய்திகள்' : 'Sermons & Messages'}
        </h1>
        <p className="section-subtitle">
          {language === 'ta' ? 'ஆவியில் வளருங்கள்' : 'Grow in spirit through powerful messages'}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                category === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'all' ? (language === 'ta' ? 'அனைத்தும்' : 'All') : cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No sermons found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {messages.map((message) => {
              const title = language === 'ta' && message.titleTa ? message.titleTa : message.title;
              const thumbnail = message.youtubeVideoId
                ? `https://img.youtube.com/vi/${message.youtubeVideoId}/mqdefault.jpg`
                : message.thumbnail || '/placeholder-sermon.jpg';
              return (
                <Link key={message._id} href={`/sermons/${message._id}`} className="card group hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video bg-gray-900 overflow-hidden">
                    <Image src={thumbnail} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                        <Play size={20} className="text-primary-600 ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors text-sm">
                      {title}
                    </h3>
                    {message.speaker && <p className="text-xs text-gray-500 mt-1">{message.speaker}</p>}
                    <p className="text-xs text-gray-400 mt-2">{new Date(message.date).toLocaleDateString()}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  page === p ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
