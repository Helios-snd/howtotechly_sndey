import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/api';
import { PostCard } from '../components/PostCard';
import { BlogPost } from '../types';

interface SearchProps {
  query: string;
  onNavigate: (path: string) => void;
}

export const Search: React.FC<SearchProps> = ({ query, onNavigate }) => {
  const decodedQuery = decodeURIComponent(query || '');
  const [results, setResults] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (decodedQuery) {
      setLoading(true);
      fetchPosts({ search: decodedQuery })
        .then(setResults)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [decodedQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900">
          Search Results for <span className="text-blue-600">"{decodedQuery}"</span>
        </h1>
        <p className="text-slate-500 mt-2">{loading ? 'Searching...' : `${results.length} articles found`}</p>
      </div>

      {!loading && results.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map(blog => (
            <PostCard 
              key={blog.id} 
              post={blog} 
              onClick={() => onNavigate(`/blog/${blog.slug}`)} 
            />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-24 bg-slate-50 rounded-2xl">
          <p className="text-lg text-slate-600 mb-4">We couldn't find anything matching your search.</p>
          <button onClick={() => onNavigate('/blogs')} className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50">
            View all articles
          </button>
        </div>
      )}
    </div>
  );
};