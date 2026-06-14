'use client';
import { use, useState } from 'react';
import useSWR from 'swr';
import { ArrowLeft, Eye, Tag, Share2, Download, Play, BookOpen, Heart, Calendar, Edit3, X } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import api from '../../../../lib/api';
import { shareToWhatsApp, shareToFacebook } from '../../../../lib/share';
import { downloadSermonPDF } from '../../../../lib/pdfGenerator';
import InteractiveSidebar from '../../../../components/bible/InteractiveSidebar';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

const categoryColors = {
  sermon: 'bg-purple-100 text-purple-700',
  teaching: 'bg-blue-100 text-blue-700',
  testimony: 'bg-green-100 text-green-700',
  worship: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-600',
};

export default function SermonDetailPage({ params }) {
  const { id } = use(params);
  const { data: sermon } = useSWR(`/messages/${id}`, fetcher);

  if (!sermon) {
    return (
      <div className="animate-pulse space-y-4 p-8 max-w-4xl mx-auto mt-20">
        <div className="h-8 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="aspect-video bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${sermon.title} — ${sermon.speaker ? `by ${sermon.speaker}` : 'Church Sermon'}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-10">
      <div className="container-custom max-w-4xl">
        <Link href="/sermons" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-sm mb-6">
          <ArrowLeft size={16} /> Back to Sermons
        </Link>

        <div className="card overflow-hidden">
          <div className="flex flex-col lg:flex-row transition-all duration-500">
            {/* Video / Thumbnail Side */}
            <div className="transition-all duration-500 w-full lg:w-[65%]">
              {sermon.youtubeVideoId ? (
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${sermon.youtubeVideoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={sermon.title}
                  />
                </div>
              ) : sermon.videoFile ? (
                <video controls className="w-full aspect-video bg-black" src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || ''}${sermon.videoFile?.includes('/api/v1/media') ? '' : '/api/v1/media'}${sermon.videoFile}`} />
              ) : sermon.thumbnail && (
                <div className="relative aspect-video bg-gray-900 flex-shrink-0">
                  <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || ''}${sermon.thumbnail?.includes('/api/v1/media') ? '' : '/api/v1/media'}${sermon.thumbnail}`} alt={sermon.title} className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            
            {/* Sidebar Side */}
            <div className="w-full lg:w-[35%] bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-100 min-h-[400px] flex flex-col">
              <InteractiveSidebar theme="light" id={sermon._id} initialTab="pray" />
            </div>
          </div>

          <div className="p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${categoryColors[sermon.category] || categoryColors.other}`}>
                {sermon.category}
              </span>
              {sermon.isFeatured && <span className="text-xs px-2.5 py-1 rounded-full bg-gold/20 text-yellow-700 font-medium">Featured</span>}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{sermon.title}</h1>
            {sermon.titleTa && <p className="text-lg text-gray-600 mb-4">{sermon.titleTa}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              {sermon.speaker && <span>🎙️ {sermon.speaker}</span>}
              {sermon.date && <span>{format(new Date(sermon.date), 'MMMM d, yyyy')}</span>}
              {sermon.duration && <span>⏱ {sermon.duration} min</span>}
              <span className="flex items-center gap-1"><Eye size={14} />{sermon.views} views</span>
            </div>

            {sermon.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {sermon.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    <Tag size={10} />{tag}
                  </span>
                ))}
              </div>
            )}

            {sermon.content && (
              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{sermon.content}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => shareToWhatsApp(shareUrl, shareText)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <Share2 size={15} /> WhatsApp
              </button>
              <button
                onClick={() => shareToFacebook(shareUrl)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Share2 size={15} /> Facebook
              </button>
              
              {sermon.videoFile ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || ''}${sermon.videoFile?.includes('/api/v1/media') ? '' : '/api/v1/media'}${sermon.videoFile}`}
                  download={`${sermon.title}.mp4`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Download size={15} /> Download Video
                </a>
              ) : (!sermon.youtubeVideoId && sermon.thumbnail) ? (
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || ''}${sermon.thumbnail?.includes('/api/v1/media') ? '' : '/api/v1/media'}${sermon.thumbnail}`}
                  download={`${sermon.title}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Download size={15} /> Download Image
                </a>
              ) : (
                <button
                  onClick={() => downloadSermonPDF(sermon)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Download size={15} /> Download PDF
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}
