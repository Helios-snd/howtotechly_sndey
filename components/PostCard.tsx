import React from 'react';
import { BlogPost } from '../types';

interface PostCardProps {
  post: BlogPost;
  onClick: () => void;
  compact?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onClick, compact = false }) => {
  if (compact) {
    return (
      <div 
        onClick={onClick}
        className="group flex gap-4 cursor-pointer p-4 rounded-xl hover:bg-slate-50 transition-colors"
      >
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
          <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>
        <div className="flex-1">
          <div className="flex gap-2 mb-1">
            <span className="text-xs font-semibold text-blue-600">{post.tags[0]}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{post.title}</h3>
          <div className="text-xs text-slate-400 mt-2">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <article 
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
    >
      <div className="h-52 overflow-hidden relative">
        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10" />
        <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-slate-900">
            {post.tags[0]}
          </span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
          {post.title}
        </h3>
        <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
              {post.author.charAt(0)}
            </div>
            <span className="text-xs font-medium text-slate-500">{post.author}</span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>
    </article>
  );
};