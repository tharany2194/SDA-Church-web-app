'use client';
import { useState } from 'react';
import useSWR from 'swr';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
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
    <div className="py-12">
      <div className="container-custom">
        <h1 className="section-title">
          {language === 'ta' ? 'நிகழ்வுகள்' : 'Events Calendar'}
        </h1>
        <p className="section-subtitle">
          {language === 'ta' ? 'மாத நிகழ்வுகளை காண்க' : 'Stay up to date with all church activities'}
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 card p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 2))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="font-bold text-xl text-gray-900">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date(year, month))}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="text-xs font-medium text-gray-500 text-center py-2">{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {daysInMonth.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(isSameDay(day, selectedDate) ? null : day)}
                    className={clsx(
                      'relative p-2 rounded-xl text-sm text-center transition-colors min-h-[44px]',
                      isSelected ? 'bg-primary-600 text-white' :
                      isToday(day) ? 'bg-primary-50 text-primary-700 font-bold' :
                      'hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    {format(day, 'd')}
                    {dayEvents.length > 0 && (
                      <span className={clsx(
                        'absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full',
                        isSelected ? 'bg-white' : 'bg-primary-600'
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event List */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900">
              {selectedDate ? format(selectedDate, 'MMMM d') : 'Upcoming Events'}
            </h3>
            {selectedEvents.length === 0 ? (
              <p className="text-gray-400 text-sm">No events {selectedDate ? 'on this day.' : 'this month.'}</p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => {
                  const title = language === 'ta' && event.titleTa ? event.titleTa : event.title;
                  return (
                    <div key={event._id} className="card p-4 border-l-4 border-primary-600">
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
