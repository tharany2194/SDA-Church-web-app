'use client';
import useSWR from 'swr';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';
import { useSelector } from 'react-redux';
import api from '../../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

export default function GalleryPreview() {
  const { language } = useSelector((s) => s.ui);
  const { data: items } = useSWR('/gallery?limit=8&featured=true', fetcher);

  return (
    <section className="py-16 bg-church-cream">
      <div className="container-custom">
        <h2 className="section-title">
          {language === 'ta' ? 'படத்தொகுப்பு' : 'Photo Gallery'}
        </h2>
        <p className="section-subtitle">
          {language === 'ta' ? 'எங்கள் நிகழ்வுகளின் நினைவுகள்' : 'Memories of our church community life'}
        </p>

        {!items ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-400">No gallery items yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((item) => (
              <Link
                key={item._id}
                href="/gallery"
                className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.url.startsWith('http') ? item.url : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${item.url}`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <Image
                    src={item.thumbnail || (item.youtubeVideoId ? `https://img.youtube.com/vi/${item.youtubeVideoId}/mqdefault.jpg` : '/placeholder-gallery.jpg')}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  {item.type === 'video' && (
                    <Play size={32} className="text-white opacity-80 drop-shadow-lg" />
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/gallery" className="btn-primary gap-2">
            {language === 'ta' ? 'மேலும் காண்க' : 'View Full Gallery'}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
