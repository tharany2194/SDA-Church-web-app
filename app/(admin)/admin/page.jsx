'use client';
import useSWR from 'swr';
import { MessageSquare, Calendar, Image, FileText, Users, Heart, TrendingUp } from 'lucide-react';
import api from '../../../lib/api';
import { useSelector } from 'react-redux';

const fetcher = (url) => api.get(url).then((r) => r.data);

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useSelector((s) => s.auth);
  const { data: messages } = useSWR('/messages?limit=1', fetcher);
  const { data: events } = useSWR('/events', fetcher);
  const { data: gallery } = useSWR('/gallery?limit=1', fetcher);
  const { data: articles } = useSWR('/articles?limit=1', fetcher);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h2>
        <p className="text-gray-500 mt-1">Here's what's happening in your church.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={MessageSquare} label="Total Sermons" value={messages?.total} color="bg-primary-600" />
        <StatCard icon={Calendar} label="Events" value={events?.count} color="bg-blue-500" />
        <StatCard icon={Image} label="Gallery Items" value={gallery?.total} color="bg-green-500" />
        <StatCard icon={FileText} label="Articles" value={articles?.total} color="bg-orange-500" />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/messages', label: 'Add Sermon', icon: MessageSquare, color: 'text-primary-600 bg-primary-50' },
            { href: '/admin/events', label: 'Add Event', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
            { href: '/admin/gallery', label: 'Upload Media', icon: Image, color: 'text-green-600 bg-green-50' },
            { href: '/admin/articles', label: 'Write Article', icon: FileText, color: 'text-orange-600 bg-orange-50' },
            { href: '/admin/verses', label: 'Add Verses', icon: Heart, color: 'text-rose-600 bg-rose-50' },
          ].map(({ href, label, icon: Icon, color }) => (
            <a
              key={href}
              href={href}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-transparent hover:border-gray-200 transition-colors ${color}`}
            >
              <Icon size={24} />
              <span className="text-sm font-medium">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
