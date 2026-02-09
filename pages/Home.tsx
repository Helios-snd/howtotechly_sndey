import React, { useEffect, useState } from 'react';
import { PostCard } from '../components/PostCard';
import { useSEO } from '../hooks/useSEO';
import { fetchPosts } from '../services/api';
import { BlogPost } from '../types';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  useSEO({
    title: 'Home',
    description: 'A production-grade knowledge base for engineering leaders. Deep dives into architecture, scaling, and modern stacks.'
  });

  const [featured, setFeatured] = useState<BlogPost | null>(null);
  const [recent, setRecent] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const posts = await fetchPosts({ limit: 7 });
        if (posts.length > 0) {
          setFeatured(posts[0]);
          setRecent(posts.slice(1));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative bg-slate-900 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/50 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            v2.0 Now Live
          </div>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Build Better <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Software</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            A production-grade knowledge base for engineering leaders. Deep dives into architecture, scaling, and modern stacks.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => onNavigate('/blogs')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/25 ring-offset-2 ring-offset-slate-900 focus:ring-2 focus:ring-blue-500">
              Start Reading
            </button>
            <button onClick={() => onNavigate('/about')} className="bg-slate-800 text-slate-200 border border-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all">
              Our Mission
            </button>
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
          <div 
            onClick={() => onNavigate(`/blog/${featured.slug}`)}
            className="group bg-white rounded-3xl shadow-xl shadow-slate-900/5 border border-slate-100 overflow-hidden cursor-pointer grid md:grid-cols-12 gap-0"
          >
            <div className="md:col-span-7 h-64 md:h-[400px] overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent md:hidden z-10" />
               <img src={featured.featuredImage} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
               <div className="flex gap-2 mb-6">
                 {featured.tags && featured.tags[0] && (
                   <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{featured.tags[0]}</span>
                 )}
                 <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Featured</span>
               </div>
               <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                 {featured.title}
               </h2>
               <p className="text-slate-600 mb-8 leading-relaxed line-clamp-3 text-sm md:text-base">
                 {featured.excerpt}
               </p>
               <div className="flex items-center text-sm text-slate-500 font-medium mt-auto">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                     {featured.author.charAt(0)}
                   </div>
                   <div className="flex flex-col">
                     <span className="text-slate-900">{featured.author}</span>
                     <span className="text-xs text-slate-400">{new Date(featured.createdAt).toLocaleDateString()}</span>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Latest Articles</h2>
          <button onClick={() => onNavigate('/blogs')} className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
            View all <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recent.map(blog => (
            <PostCard 
              key={blog.id} 
              post={blog} 
              onClick={() => onNavigate(`/blog/${blog.slug}`)} 
            />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <div className="bg-blue-600 rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Stay ahead of the curve.</h2>
              <p className="text-blue-100 text-lg">Join 10,000+ developers getting the best tech content delivered weekly.</p>
            </div>
            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm border border-white/20">
              <form className="flex flex-col sm:flex-row gap-2">
                <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-lg bg-white/90 border-none focus:ring-2 focus:ring-white outline-none text-slate-900 placeholder-slate-500" />
                <button className="bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
                  Subscribe
                </button>
              </form>
              <p className="text-blue-200 text-xs mt-3 ml-2">No spam, unsubscribe at any time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};