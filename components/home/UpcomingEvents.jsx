'use client';
import { useState, useRef } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight, ChevronLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import api from '../../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

const categoryMeta = {
  service:  { label: 'Service',  color: 'bg-blue-400/20 text-blue-200 border-blue-400/30' },
  prayer:   { label: 'Prayer',   color: 'bg-purple-400/20 text-purple-200 border-purple-400/30' },
  youth:    { label: 'Youth',    color: 'bg-green-400/20 text-green-200 border-green-400/30' },
  outreach: { label: 'Outreach', color: 'bg-orange-400/20 text-orange-200 border-orange-400/30' },
  special:  { label: 'Special',  color: 'bg-red-400/20 text-red-200 border-red-400/30' },
  other:    { label: 'Other',    color: 'bg-gray-400/20 text-gray-200 border-gray-400/30' },
};

export default function UpcomingEvents() {
  const { language } = useSelector((s) => s.ui);
  const now = new Date();
  const scrollRef = useRef(null);
  const { data: events, error } = useSWR(
    `/events?month=${now.getMonth() + 1}&year=${now.getFullYear()}`,
    fetcher
  );

  const upcoming = (events || []).filter((event) => {
    const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    return eventEnd >= now;
  });

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div id="events" className="px-2 sm:px-8 md:px-12 py-8">
      <section
        className="relative overflow-hidden rounded-tr-[80px] md:rounded-tr-[120px] rounded-bl-[80px] md:rounded-bl-[120px] min-h-screen flex flex-col justify-start"
        style={{
          backgroundImage: "url('/images/parallax_img2.jpg')",
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/45" />

        {/* Content */}
        <div className="relative z-10 w-full px-2 sm:px-8 md:px-14 pt-12 pb-16">

          {/* Header */}
          <div className="text-center mb-10 px-2">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">
              {language === 'ta' ? 'நிகழ்வுகள்' : '— Our Events —'}
            </p>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-3 drop-shadow-xl">
              {language === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events'}
            </h2>
            <p className="text-white/65 text-base md:text-lg max-w-lg mx-auto">
              {language === 'ta' ? 'சமூக நடவடிக்கைகளில் பங்கு கொள்ளுங்கள்' : 'Come and be part of our community activities'}
            </p>
          </div>

          {/* Cards */}
          {error ? (
            <p className="text-center text-white/50 py-20">Failed to load events.</p>
          ) : !events ? (
            <div className="flex gap-5 overflow-hidden max-w-7xl mx-auto w-full px-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[300px] bg-white/5 border border-white/10 rounded-3xl p-6 animate-pulse flex flex-col gap-4 h-72" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-center text-white/40 py-24">No upcoming events this month.</p>
          ) : (
            <div className="relative max-w-7xl mx-auto w-full px-1 md:px-16">
              {/* Arrows */}
              <button
                onClick={() => scroll('left')}
                className="absolute -left-2 md:-left-16 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-md hidden md:flex items-center justify-center shadow-2xl"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute -right-2 md:-right-16 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/30 transition-all backdrop-blur-md hidden md:flex items-center justify-center shadow-2xl"
              >
                <ChevronRight size={28} />
              </button>

              <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-6 pb-4 no-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {upcoming.map((event) => {
                  const title = language === 'ta' && event.titleTa ? event.titleTa : event.title;
                  const meta = categoryMeta[event.category] || categoryMeta.other;
                  return (
                    <div
                      key={event._id}
                      className="w-[260px] sm:w-[300px] md:w-[320px] flex-shrink-0 flex flex-col rounded-3xl overflow-hidden cursor-pointer group transition-all duration-300 hover:-translate-y-3"
                      style={{
                        background: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.18)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 1.5px 0 rgba(255,255,255,0.12) inset, 0 -1px 0 rgba(0,0,0,0.2) inset',
                        minHeight: '300px',
                      }}
                    >
                      {/* Card top colour strip */}
                      <div className="h-1.5 w-full bg-gradient-to-r from-gold via-purple-400 to-gold opacity-70" />

                      <div className="p-7 flex flex-col gap-5 flex-1">
                        {/* Date badge + category */}
                        <div className="flex items-start gap-4">
                          <div
                            className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-white/20 shadow-lg"
                            style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}
                          >
                            <span className="text-white font-black text-2xl leading-none">
                              {format(new Date(event.startDate), 'd')}
                            </span>
                            <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                              {format(new Date(event.startDate), 'MMM')}
                            </span>
                          </div>
                          <div className="flex-1 pt-1">
                            <span className={`inline-block text-[9px] px-2.5 py-0.5 rounded-full capitalize font-bold border ${meta.color} mb-2.5`}>
                              {meta.label}
                            </span>
                            <h3 className="font-bold text-white text-lg leading-snug group-hover:text-gold transition-colors duration-200 line-clamp-2">
                              {title}
                            </h3>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10" />

                        {/* Meta info */}
                        <div className="flex flex-col gap-2.5 text-sm text-white/55 mt-auto">
                          <span className="flex items-center gap-2.5">
                            <Calendar size={14} className="shrink-0 text-gold" />
                            {format(new Date(event.startDate), 'EEEE, MMM d · h:mm a')}
                          </span>
                          {event.location && (
                            <span className="flex items-center gap-2.5">
                              <MapPin size={14} className="shrink-0 text-gold" />
                              <span className="truncate">{event.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Arrow CTA */}
                        <div className="flex justify-end mt-2">
                          <span className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                            <ChevronRight size={14} className="text-white" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-white text-purple-800 font-bold hover:scale-105 active:scale-95 transition-all shadow-2xl text-sm tracking-wide"
            >
              {language === 'ta' ? 'அனைத்து நிகழ்வுகள்' : 'View All Events'}
              <ChevronRight size={16} />
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
