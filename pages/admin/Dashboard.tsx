import React, { useEffect, useState } from 'react';
import { fetchAdminPosts } from '../../services/api';
import { BlogPost } from '../../types';

export const Dashboard: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminPosts()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const stats = [
    { label: 'Total Posts', value: posts.length, color: 'bg-blue-500' },
    { label: 'Published', value: posts.filter(b => b.isPublished).length, color: 'bg-emerald-500' },
    { label: 'Drafts', value: posts.filter(b => !b.isPublished).length, color: 'bg-amber-500' },
    { label: 'Total Views', value: posts.reduce((acc, curr) => acc + curr.views, 0).toLocaleString(), color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 text-sm font-medium">{stat.label}</span>
              <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="font-bold text-slate-800">Recent Activity</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {posts.slice(0, 5).map((blog) => (
            <div key={blog.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  <span className="text-blue-600 font-bold">New Post:</span> {blog.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">by {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${blog.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {blog.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
          ))}
          {posts.length === 0 && <div className="p-4 text-slate-500 text-center">No activity yet.</div>}
        </div>
      </div>
    </div>
  );
};