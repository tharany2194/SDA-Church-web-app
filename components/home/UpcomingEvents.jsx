'use client';
import { useState, useRef } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
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
  const scrollRef = useRef(null);
  const { data: events, error } = useSWR(
    `/events?month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
    fetcher
  );

  const upcoming = events || [];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="py-24 parallax-section"
      style={{ backgroundImage: "url('/images/parallax_img2.jpg')" }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="container-custom relative z-10">
        <div className="bg-white/10 backdrop-blur-md p-6 md:p-10 curve-tl-br border border-white/20 shadow-2xl min-h-[95vh] flex flex-col justify-center">
          <h2 className="section-title !text-white !mb-2">
            {language === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events'}
          </h2>
          <p className="section-subtitle !text-white/80 !mb-8">
            {language === 'ta' ? 'சமூக நடவடிக்கைகளில் பங்கு கொள்ளுங்கள்' : 'Come and be part of our community activities'}
          </p>

          {error ? (
            <p className="text-center text-white/50">Failed to load events.</p>
          ) : !events ? (
            <div className="flex gap-4 overflow-hidden max-w-5xl mx-auto w-full">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="min-w-[280px] bg-white/5 border border-white/10 rounded-2xl p-4 animate-pulse flex flex-col gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl shrink-0" />
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
            <div className="relative group/slider max-w-6xl mx-auto w-full px-4 md:px-10">
              {/* Navigation Arrows */}
              <button 
                onClick={() => scroll('left')}
                className="absolute -left-2 md:-left-14 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 border border-white/30 text-white hover:bg-white/40 transition-all backdrop-blur-md hidden md:flex items-center justify-center shadow-xl"
              >
                <ChevronLeft size={28} />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="absolute -right-2 md:-right-14 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 border border-white/30 text-white hover:bg-white/40 transition-all backdrop-blur-md hidden md:flex items-center justify-center shadow-xl"
              >
                <ChevronRight size={28} />
              </button>

              {/* Scrollable Container */}
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 pb-8 no-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {upcoming.map((event) => {
                  const title = language === 'ta' && event.titleTa ? event.titleTa : event.title;
                  return (
                    <div 
                      key={event._id} 
                      className="min-w-[260px] md:min-w-[280px] bg-white/10 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col gap-3 hover:bg-white/20 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                    >
                      {/* Date Badge */}
                      <div className="w-11 h-11 rounded-xl bg-white/20 flex flex-col items-center justify-center shrink-0 border border-white/20">
                        <span className="text-white font-bold text-sm leading-none">
                          {format(new Date(event.startDate), 'd')}
                        </span>
                        <span className="text-white/70 text-[9px] font-medium uppercase">
                          {format(new Date(event.startDate), 'MMM')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block text-[8px] px-2 py-0.5 rounded-full capitalize ${categoryColors[event.category] || categoryColors.other} bg-opacity-20 text-white border border-white/10 mb-2`}>
                          {event.category}
                        </span>
                        <h3 className="font-bold text-white text-sm leading-snug group-hover:text-primary-200 transition-colors line-clamp-2 min-h-[40px]">{title}</h3>
                        
                        <div className="flex flex-col gap-1.5 mt-3 text-[10px] text-white/50">
                          <span className="flex items-center gap-2">
                            <Calendar size={12} className="shrink-0" />
                            {format(new Date(event.startDate), 'h:mm a')}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-2">
                              <MapPin size={12} className="shrink-0" />
                              <span className="truncate">{event.location}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/events" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-white text-primary-600 font-bold hover:scale-105 active:scale-95 transition-all gap-2 shadow-2xl text-sm">
              {language === 'ta' ? 'அனைத்து நிகழ்வுகள்' : 'View All Events'}
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
