'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday, startOfDay, isBefore } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, MapPin, Info } from 'lucide-react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import api from '../../../lib/api';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

export default function EventsPage() {
  const { language } = useSelector((s) => s.ui);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const { data: events = [] } = useSWR(`/events?month=${month}&year=${year}`, fetcher);

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });
  const startDay = getDay(startOfMonth(currentDate));

  const getEventsForDay = (day) =>
    events.filter((e) => isSameDay(new Date(e.startDate), day));

  const selectedEvents = selectedDate
    ? getEventsForDay(selectedDate)
    : events.slice(0, 5);

  return (
    <div className="pt-28 pb-12 min-h-screen">
      <div className="container-custom">
        <h1 className="section-title">
          {language === 'ta' ? 'நிகழ்வுகள்' : 'Events Calendar'}
        </h1>
        <p className="section-subtitle">
          {language === 'ta' ? 'மாத நிகழ்வுகளை காண்க' : 'Stay up to date with all church activities'}
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 card p-6 shadow-xl border-t-4 border-t-primary-600">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 2))}
                className="p-3 rounded-xl hover:bg-primary-50 text-primary-600 transition-all active:scale-90"
              >
                <ChevronLeft size={24} />
              </button>
              <h2 className="font-bold text-2xl text-gray-900 tracking-tight">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date(year, month))}
                className="p-3 rounded-xl hover:bg-primary-50 text-primary-600 transition-all active:scale-90"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-sm font-bold text-gray-400 text-center py-2 uppercase tracking-widest">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const today = isToday(day);
                const hasEvents = dayEvents.length > 0;
                const isPast = hasEvents && isBefore(startOfDay(day), startOfDay(new Date()));

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(isSameDay(day, selectedDate) ? null : day)}
                    className={clsx(
                      'relative p-2 rounded-2xl text-base font-medium text-center transition-all duration-200 min-h-[56px] flex flex-col items-center justify-center gap-1',
                      'hover:scale-105 active:scale-95',
                      isSelected ? 'bg-primary-100 text-primary-900 border-2 border-primary-500 shadow-md z-10' :
                      today ? 'bg-amber-100 text-amber-700 border-2 border-amber-500 ring-4 ring-amber-100/50 shadow-[0_0_20px_rgba(245,158,11,0.4)] animate-pulse scale-105 z-10 font-bold' :
                      hasEvents
                        ? isPast
                          ? 'bg-gray-400 text-white font-bold shadow-lg shadow-gray-100/50'
                          : 'bg-primary-600 text-white font-bold shadow-lg shadow-primary-100/50'
                        : 'hover:bg-gray-50 text-gray-600'
                    )}
                  >
                    <span>{format(day, 'd')}</span>
                    {hasEvents && (
                      <div className="flex gap-0.5">
                        {dayEvents.slice(0, 3).map((_, idx) => (
                          <span key={idx} className={clsx(
                            'w-1.5 h-1.5 rounded-full',
                            isSelected ? 'bg-primary-500' : 'bg-white/80'
                          )} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Legend Card */}
            <div className="card p-5 border border-gray-100 shadow-xl rounded-2xl mb-6 bg-gradient-to-br from-white to-gray-50/50">
              <h4 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                <Info size={16} className="text-primary-600 animate-bounce" />
                {language === 'ta' ? 'நிகழ்வு விவரம்' : 'Calendar Key'}
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 border border-purple-100/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-primary-600 shadow-md shadow-purple-100" />
                    <span className="font-semibold text-purple-900">{language === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events'}</span>
                  </div>
                  <span className="text-[9px] bg-purple-200/50 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{language === 'ta' ? 'செயலில்' : 'Active'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/80 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-gray-400 shadow-md shadow-gray-100" />
                    <span className="font-semibold text-gray-700">{language === 'ta' ? 'முடிவடைந்த நிகழ்வுகள்' : 'Completed Events'}</span>
                  </div>
                  <span className="text-[9px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{language === 'ta' ? 'முடிந்தது' : 'Past'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/60 border border-amber-100/50">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-100 border border-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)] animate-pulse" />
                    <span className="font-semibold text-amber-900">{language === 'ta' ? 'இன்றைய தேதி' : "Today's Date"}</span>
                  </div>
                  <span className="text-[9px] bg-amber-200/50 text-amber-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{language === 'ta' ? 'இன்று' : 'Current'}</span>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-lg mb-4 text-gray-900">
              {selectedDate ? format(selectedDate, 'MMMM d') : (language === 'ta' ? 'வரவிருக்கும் நிகழ்வுகள்' : 'Upcoming Events')}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-gray-400 text-sm">{language === 'ta' ? 'இந்த நாளில் நிகழ்வுகள் இல்லை.' : 'No events on this day.'}</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => {
                  const title = language === 'ta' && event.titleTa ? event.titleTa : event.title;
                  const eventEnd = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
                  const isCompleted = eventEnd < new Date();
                  return (
                    <div 
                      key={event._id} 
                      className={clsx(
                        'card p-4 border-l-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
                        isCompleted 
                          ? 'border-l-gray-400 bg-gray-50/50 opacity-70 shadow-sm' 
                          : 'border-l-primary-600 shadow-md shadow-purple-50/50'
                      )}
                    >
                      <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        {format(new Date(event.startDate), 'MMM d, h:mm a')}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500">
                          <MapPin size={12} />
                          {event.location}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
