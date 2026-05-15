'use client';
import { use } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, User, Eye, Tag, Share2, Download } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../../lib/api';
import { shareToWhatsApp, shareToFacebook } from '../../../../lib/share';
import { downloadArticlePDF } from '../../../../lib/pdfGenerator';

const fetcher = (url) => api.get(url).then((r) => r.data.data);

export default function ArticleDetailPage({ params }) {
  const { slug } = use(params);
  const { data: article } = useSWR(`/articles/${slug}`, fetcher);

  if (!article) {
    return (
      <div className="animate-pulse max-w-3xl mx-auto px-4 py-20 space-y-4">
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="h-8 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '').replace('/api', '') || '';
  let coverUrl = article.coverImage?.startsWith('http')
    ? article.coverImage
    : article.coverImage ? `${baseUrl}${article.coverImage}` : null;

  // Legacy support
  if (coverUrl && (article.coverImage?.startsWith('/images/') || article.coverImage?.startsWith('/videos/')) && !article.coverImage?.includes('/api/v1/media')) {
    coverUrl = `${baseUrl}/api/v1/media${article.coverImage}`;
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${article.title} — Read this article`;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container-custom max-w-3xl">
        <Link href="/articles" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-sm mb-6">
          <ArrowLeft size={16} /> Back to Articles
        </Link>

        <article className="card overflow-hidden">
          {coverUrl && (
            <div className="relative h-64 md:h-80">
              <Image src={coverUrl} alt={article.title} fill className="object-cover" />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs capitalize px-2.5 py-1 rounded-full bg-primary-100 text-primary-700 font-medium">{article.category}</span>
              {article.isFeatured && <span className="text-xs px-2.5 py-1 rounded-full bg-gold/20 text-yellow-700 font-medium">Featured</span>}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
            {article.titleTa && <p className="text-xl text-gray-600 mb-4">{article.titleTa}</p>}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
              {article.author?.name && <span className="flex items-center gap-1"><User size={14} />{article.author.name}</span>}
              {article.publishedAt && <span className="flex items-center gap-1"><Calendar size={14} />{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>}
              <span className="flex items-center gap-1"><Eye size={14} />{article.views} views</span>
            </div>

            {article.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    <Tag size={10} />{tag}
                  </span>
                ))}
              </div>
            )}

            {article.excerpt && (
              <blockquote className="border-l-4 border-primary-500 pl-4 mb-6 italic text-gray-600">{article.excerpt}</blockquote>
            )}

            <div
              className="prose prose-gray max-w-none leading-relaxed text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br />') || '' }}
            />

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100 mt-8">
              <button
                onClick={() => shareToWhatsApp(shareUrl, shareText)}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <Share2 size={15} /> WhatsApp
              </button>
              <button
                onClick={() => shareToFacebook(shareUrl)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Share2 size={15} /> Facebook
              </button>
              <button
                onClick={() => downloadArticlePDF(article)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
