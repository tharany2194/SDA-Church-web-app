'use client';
import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Search, Filter } from 'lucide-react';
import api from '../../../lib/api';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import SermonMedia from '../../../components/sermons/SermonMedia';

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

  const featuredMessage = page === 1 && messages.length > 0 ? messages[0] : null;
  const gridMessages = page === 1 && messages.length > 0 ? messages.slice(1) : messages;

  return (
    <div className="pt-20 pb-12 bg-gray-50/50 min-h-screen">

      <div className="container-custom">
        <h1 className="text-3xl md:text-4xl font-bold text-church-dark text-center mb-1">
          {language === 'ta' ? 'பிரசங்கங்கள் & செய்திகள்' : 'Sermons & Messages'}
        </h1>
        <p className="text-church-muted text-center text-lg mb-4 max-w-2xl mx-auto">
          {language === 'ta' ? 'ஆவியில் வளருங்கள்' : 'Grow in spirit through powerful messages'}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                category === cat ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat === 'all' ? (language === 'ta' ? 'அனைத்தும்' : 'All') : cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse bg-white">
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
          <div key={`${category}-${page}`}>
            {/* Featured Sermon */}
            {featuredMessage && (
              <div className="mb-12 overflow-hidden bg-white rounded-[2rem] p-4 md:p-6 shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Left Side: Video/Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full lg:w-3/5"
                  >
                    <Link href={`/sermons/${featuredMessage._id}`}>
                      <SermonMedia 
                        message={featuredMessage}
                        title={language === 'ta' && featuredMessage.titleTa ? featuredMessage.titleTa : featuredMessage.title}
                        thumbnail={featuredMessage.youtubeVideoId ? `https://img.youtube.com/vi/${featuredMessage.youtubeVideoId}/maxresdefault.jpg` : featuredMessage.thumbnail || '/placeholder-sermon.jpg'}
                        isFeatured={true}
                      />
                    </Link>
                  </motion.div>

                  {/* Right Side: Details */}
                  <motion.div
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                    className="w-full lg:w-2/5 lg:pr-8 py-4"
                  >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight leading-tight">
                      {language === 'ta' && featuredMessage.titleTa ? featuredMessage.titleTa : featuredMessage.title}
                    </h2>
                    
                    <div className="text-gray-500 mb-8 flex flex-wrap items-center gap-2 text-sm md:text-base font-medium">
                      {featuredMessage.series && <span className="text-primary-700">{featuredMessage.series}</span>}
                      {featuredMessage.series && <span className="text-gray-300">•</span>}
                      <span>{new Date(featuredMessage.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      {featuredMessage.speaker && <span className="text-gray-300">•</span>}
                      {featuredMessage.speaker && <span>{featuredMessage.speaker}</span>}
                    </div>
                    
                    <div className="flex flex-wrap gap-4">
                      <Link href={`/sermons/${featuredMessage._id}`} className="px-8 py-3.5 bg-primary-600 text-white rounded-xl font-semibold text-lg shadow-md hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-center">
                        Watch Now
                      </Link>
                      <Link href={`/sermons/${featuredMessage._id}`} className="px-8 py-3.5 border-2 border-gray-200 text-gray-700 hover:text-gray-900 bg-white rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 text-center text-lg">
                        Details
                      </Link>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Recently Added</h3>
            </div>

            {/* Grid for other sermons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {gridMessages.map((message, idx) => {
                const title = language === 'ta' && message.titleTa ? message.titleTa : message.title;
                const thumbnail = message.youtubeVideoId
                  ? `https://img.youtube.com/vi/${message.youtubeVideoId}/mqdefault.jpg`
                  : message.thumbnail || '/placeholder-sermon.jpg';
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    key={message._id}
                  >
                    <Link href={`/sermons/${message._id}`} className="card bg-white group hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full rounded-2xl overflow-hidden hover:-translate-y-1">
                      <SermonMedia 
                        message={message}
                        title={title}
                        thumbnail={thumbnail}
                        isFeatured={false}
                      />
                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors text-base leading-tight mb-2">
                            {title}
                          </h3>
                          {message.speaker && <p className="text-xs font-medium text-gray-500 mb-2">{message.speaker}</p>}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">{new Date(message.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12 bg-white inline-flex mx-auto p-1.5 rounded-2xl shadow-sm border border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-200 ${
                  page === p ? 'bg-primary-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
