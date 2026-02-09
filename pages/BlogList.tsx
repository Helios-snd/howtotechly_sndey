import React, { useEffect, useState } from 'react';
import { PostCard } from '../components/PostCard';
import { fetchPosts } from '../services/api';
import { BlogPost } from '../types';

interface BlogListProps {
  onNavigate: (path: string) => void;
}

export const BlogList: React.FC<BlogListProps> = ({ onNavigate }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts({ limit: 50 })
      .then(setBlogs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center text-slate-500">Loading articles...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">The Engineering Blog</h1>
        <p className="text-xl text-slate-600">Insights, tutorials, and deep dives into the technologies shaping our world.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map(blog => (
          <PostCard 
            key={blog.id} 
            post={blog} 
            onClick={() => onNavigate(`/blog/${blog.slug}`)} 
          />
        ))}
        {blogs.length === 0 && <div className="col-span-3 text-center text-slate-500">No articles published yet.</div>}
      </div>
    </div>
  );
};