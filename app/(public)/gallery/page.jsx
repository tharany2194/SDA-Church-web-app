'use client';
import { useState } from 'react';
import useSWR from 'swr';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import api from '../../../lib/api';
import { useSelector } from 'react-redux';
import VideoPreview from '../../../components/VideoPreview';

const fetcher = (url) => api.get(url).then((r) => r.data);
const tabs = ['all', 'image', 'video'];

export default function GalleryPage() {
  const { language } = useSelector((s) => s.ui);
  const [type, setType] = useState('all');
  const [selected, setSelected] = useState(null);

  const query = `/gallery?limit=50${type !== 'all' ? `&type=${type}` : ''}`;
  const { data } = useSWR(query, fetcher);
  const items = data?.data || [];

  const getUrl = (item) => {
    if (!item.url) return '';
    if (item.url.startsWith('http')) return item.url;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || '';
    
    // Legacy support: if URL starts with /images or /videos but is NOT already proxied
    if ((item.url.startsWith('/images/') || item.url.startsWith('/videos/')) && !item.url.includes('/api/v1/media')) {
      return `${baseUrl}/api/v1/media${item.url}`;
    }
    
    return `${baseUrl}${item.url}`;
  };
  const getThumbnail = (item) => {
    if (item.thumbnail) return item.thumbnail;
    if (item.type === 'video') {
      if (item.youtubeVideoId) {
        return `https://img.youtube.com/vi/${item.youtubeVideoId}/hqdefault.jpg`;
      }
      if (item.url) return getUrl(item); // For raw videos, return URL for video tag poster extraction
      return '/placeholder-gallery.jpg';
    }
    // For images, use the actual URL
    return getUrl(item);
  };



  return (
    <div className="pt-20 pb-12">

      <div className="container-custom">
        <h1 className="page-title">{language === 'ta' ? 'படத்தொகுப்பு' : 'Gallery'}</h1>
        <p className="page-subtitle">{language === 'ta' ? 'எங்கள் நிகழ்வு நினைவுகள்' : 'Photos and videos from our church community'}</p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 px-2 sm:px-0">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                type === t ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t === 'all' ? (language === 'ta' ? 'அனைத்தும்' : 'All') : t === 'image' ? (language === 'ta' ? 'படங்கள்' : 'Photos') : (language === 'ta' ? 'வீடியோக்கள்' : 'Videos')}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelected(item)}
              className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
            >
              {item.type === 'video' && !item.thumbnail && !item.youtubeVideoId && item.url ? (
                <VideoPreview 
                  src={getThumbnail(item)} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              ) : (
                <Image
                  src={getThumbnail(item)}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                {item.type === 'video' && (
                  <Play size={32} className="text-white opacity-0 group-hover:opacity-100 drop-shadow-lg transition-opacity" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selected && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelected(null)}
            >
              <X size={32} />
            </button>
            <div className="max-w-5xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {selected.type === 'image' ? (
                <div className="relative w-full aspect-video">
                  <Image src={getUrl(selected)} alt={selected.title} fill className="object-contain" />
                </div>
              ) : selected.youtubeVideoId ? (
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${selected.youtubeVideoId}?autoplay=1`}
                    className="absolute inset-0 w-full h-full rounded-xl"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={selected.title}
                  />
                </div>
              ) : (
                <video src={getUrl(selected)} controls autoPlay className="w-full rounded-xl max-h-[80vh]" />
              )}
              <p className="text-white text-center mt-3 font-medium">{selected.title}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
