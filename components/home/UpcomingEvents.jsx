'use client';
import useSWR from 'swr';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import api from '../../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

const categoryColors = {
  service: 'bg-blue-100 text-blue-700',
  prayer: 'bg-purple-100 text-purple-700',
  youth: 'bg-green-100 text-green-700',
  outreach: 'bg-orange-100 text-orange-700',
  special: 'bg-red-100 text-red-700',
  other: 'bg-gray-100 text-gray-700',
};

export default function UpcomingEvents() {
  const { language } = useSelector((s) => s.ui);
  const now = new Date();
  const { data: events, error } = useSWR(
    `/events?month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
    fetcher
  );

  const upcoming = events?.slice(0, 3) || [];

  return (
    <section 
      className="py-24 parallax-section"
      style={{ backgroundImage: "url('/images/parallax_img2.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="container-custom relative z-10">
        <div className="bg-white/10 backdrop-blur-md p-8 md:p-12 curve-tl-br border border-white/20 shadow-2xl min-h-[95vh] flex flex-col justify-center">
          <h2 className="section-title !text-white">
            {language === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events'}
          </h2>
          <p className="section-subtitle !text-white/80">
            {language === 'ta' ? 'சமூக நடவடிக்கைகளில் பங்கு கொள்ளுங்கள்' : 'Come and be part of our community activities'}
          </p>

          {error ? (
            <p className="text-center text-white/50">Failed to load events.</p>
          ) : !events ? (
            <div className="space-y-4 max-w-2xl mx-auto">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse flex gap-4">
                  <div className="w-14 h-14 bg-white/10 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-center text-white/40">No upcoming events this month.</p>
          ) : (
            <div className="space-y-4 max-w-2xl mx-auto">
              {upcoming.map((event) => {
                const title = language === 'ta' && event.titleTa ? event.titleTa : event.title;
                return (
                  <div key={event._id} className="bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex gap-4 hover:bg-white/20 transition-all group">
                    {/* Date Badge */}
                    <div className="w-14 h-14 rounded-xl bg-white/20 flex flex-col items-center justify-center shrink-0 border border-white/20">
                      <span className="text-white font-bold text-lg leading-none">
                        {format(new Date(event.startDate), 'd')}
                      </span>
                      <span className="text-white/70 text-xs font-medium">
                        {format(new Date(event.startDate), 'MMM')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-white truncate">{title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize shrink-0 ${categoryColors[event.category] || categoryColors.other} bg-opacity-20 text-white border border-white/20`}>
                          {event.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {format(new Date(event.startDate), 'h:mm a')}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href="/events" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-primary-600 font-bold hover:bg-opacity-90 transition-all gap-2 shadow-xl">
              {language === 'ta' ? 'அனைத்து நிகழ்வுகள்' : 'View All Events'}
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
