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
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title">
          {language === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events'}
        </h2>
        <p className="section-subtitle">
          {language === 'ta' ? 'சமூக நடவடிக்கைகளில் பங்கு கொள்ளுங்கள்' : 'Come and be part of our community activities'}
        </p>

        {error ? (
          <p className="text-center text-gray-500">Failed to load events.</p>
        ) : !events ? (
          <div className="space-y-4 max-w-2xl mx-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse flex gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <p className="text-center text-gray-400">No upcoming events this month.</p>
        ) : (
          <div className="space-y-4 max-w-2xl mx-auto">
            {upcoming.map((event) => {
              const title = language === 'ta' && event.titleTa ? event.titleTa : event.title;
              return (
                <div key={event._id} className="card p-5 flex gap-4 hover:shadow-md transition-shadow">
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-xl bg-primary-50 flex flex-col items-center justify-center shrink-0">
                    <span className="text-primary-600 font-bold text-lg leading-none">
                      {format(new Date(event.startDate), 'd')}
                    </span>
                    <span className="text-primary-500 text-xs font-medium">
                      {format(new Date(event.startDate), 'MMM')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize shrink-0 ${categoryColors[event.category] || categoryColors.other}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
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

        <div className="mt-8 text-center">
          <Link href="/events" className="btn-secondary gap-2">
            {language === 'ta' ? 'அனைத்து நிகழ்வுகள்' : 'View All Events'}
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
