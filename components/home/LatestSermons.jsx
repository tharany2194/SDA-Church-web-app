'use client';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Eye } from 'lucide-react';
import { useSelector } from 'react-redux';
import SermonMedia from '../sermons/SermonMedia';
import api from '../../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

function SermonCard({ message, language }) {
  const title = language === 'ta' && message.titleTa ? message.titleTa : message.title;
  const speaker = language === 'ta' && message.speakerTa ? message.speakerTa : message.speaker;

  const thumbnail =
    message.youtubeVideoId
      ? `https://img.youtube.com/vi/${message.youtubeVideoId}/mqdefault.jpg`
      : message.thumbnail || '/placeholder-sermon.jpg';

  return (
    <Link href={`/sermons/${message._id}`} className="card group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <SermonMedia 
          message={message}
          title={title}
          thumbnail={thumbnail}
          isFeatured={false}
        />
        {message.category && (
          <span className="absolute top-2 left-2 z-20 pointer-events-none bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full capitalize">
            {message.category}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        {speaker && <p className="text-sm text-gray-500 mt-1">{speaker}</p>}
        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span>{new Date(message.date).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Eye size={12} />{message.views}</span>
        </div>
      </div>
    </Link>
  );
}

export default function LatestSermons() {
  const { language } = useSelector((s) => s.ui);
  const { data: messages, error } = useSWR('/messages?limit=4', fetcher);


  return (
    <section className="py-16 bg-church-cream">
      <div className="container-custom">
        <h2 className="section-title">
          {language === 'ta' ? 'சமீபத்திய பிரசங்கங்கள்' : 'Latest Sermons'}
        </h2>
        <p className="section-subtitle">
          {language === 'ta'
            ? 'ஆன்மீக வளர்ச்சிக்கான செய்திகளை கேளுங்கள்'
            : 'Be inspired and grow through messages of faith'}
        </p>

        {error ? (
          <p className="text-center text-gray-500">Failed to load sermons.</p>
        ) : !messages ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {messages.map((message) => (
              <SermonCard key={message._id} message={message} language={language} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/sermons" className="btn-primary gap-2">
            {language === 'ta' ? 'அனைத்து பிரசங்கங்கள்' : 'View All Sermons'}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
