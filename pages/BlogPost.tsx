import React, { useEffect, useState, useRef } from 'react';
import { useSEO } from '../hooks/useSEO';
import { fetchPostBySlug } from '../services/api';
import { BlogPost as BlogPostType } from '../types';

interface BlogPostProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPost: React.FC<BlogPostProps> = ({ slug, onNavigate }) => {
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchPostBySlug(slug)
      .then(setPost)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useSEO({
    title: post ? post.seoTitle || post.title : 'Loading...',
    description: post ? post.seoDescription || post.excerpt : undefined,
    image: post?.featuredImage,
    type: 'article'
  });

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-sans tracking-wide">Loading article...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-4">Post not found</h1>
        <p className="text-slate-500 mb-8 max-w-md text-center">The article you are looking for might have been removed or is temporarily unavailable.</p>
        <button onClick={() => onNavigate('/blogs')} className="text-slate-900 border-b border-slate-900 pb-0.5 hover:text-blue-600 hover:border-blue-600 transition-colors">
          Back to all articles
        </button>
      </div>
    );
  }

  const readTime = calculateReadTime(post.content);

  return (
    <article className="relative bg-white min-h-screen">
      {/* Reading Progress Bar (Sticky under nav) */}
      <div className="fixed top-16 left-0 h-1 bg-blue-600 z-40 transition-all duration-100 ease-out" style={{ width: `${scrollProgress}%` }} />

      {/* Hero Section (Preserved Title Background) */}
      <div className="bg-slate-900 text-white pt-12 pb-32 px-6">
        <div className="max-w-[800px] mx-auto">
           {/* Navigation Back */}
           <button 
             onClick={() => onNavigate('/blogs')} 
             className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-sans mb-10"
           >
             <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
             Back to library
           </button>

           <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-white leading-[1.15] mb-6 tracking-tight">
             {post.title}
           </h1>
           
           {post.excerpt && (
             <p className="font-sans text-xl text-slate-300 leading-relaxed mb-8 font-light max-w-2xl">
               {post.excerpt}
             </p>
           )}

           {/* Author Metadata Row (Dark Mode) */}
           <div className="flex items-center justify-between border-t border-slate-700 py-6">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-200 font-bold font-sans text-sm ring-2 ring-slate-700 shadow-sm">
                 {post.author.charAt(0)}
               </div>
               <div className="flex flex-col">
                 <span className="text-sm font-bold text-white font-sans">{post.author}</span>
                 <div className="flex items-center gap-2 text-xs text-slate-400 font-sans">
                   <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                   <span>·</span>
                   <span>{readTime} min read</span>
                 </div>
               </div>
             </div>
             
             <div className="flex gap-3">
                <button className="text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg></button>
                <button className="text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg></button>
             </div>
           </div>
        </div>
      </div>

      {/* Featured Image (Floating Effect) */}
      {post.featuredImage && (
        <div className="max-w-4xl mx-auto px-4 md:px-0 -mt-24 relative z-10 mb-16">
          <div className="relative rounded-xl overflow-hidden shadow-2xl ring-1 ring-black/5 bg-white">
             <img 
               src={post.featuredImage} 
               alt={post.title} 
               className="w-full h-auto max-h-[500px] object-cover"
             />
          </div>
          <div className="text-center mt-3">
             <span className="text-xs text-slate-400 font-sans uppercase tracking-wider">Image Source: Unsplash / Editorial</span>
          </div>
        </div>
      )}

      {/* Main Content (Medium Style) */}
      <div className={`max-w-[700px] mx-auto px-6 pb-24 ${!post.featuredImage ? 'mt-12' : ''}`}>
        <div className="font-serif text-[19px] md:text-[21px] leading-[1.8] text-slate-800 space-y-8">
           {/* Custom Markdown-like Renderer */}
           {post.content.split('\n').map((line, i) => {
             // Headings
             if (line.startsWith('## ')) return <h2 key={i} className="font-sans text-2xl md:text-3xl font-bold text-slate-900 mt-12 mb-4 tracking-tight">{line.replace('## ', '')}</h2>;
             if (line.startsWith('### ')) return <h3 key={i} className="font-sans text-xl md:text-2xl font-semibold text-slate-900 mt-10 mb-3">{line.replace('### ', '')}</h3>;
             
             // Lists
             if (line.startsWith('1. ')) return <div key={i} className="flex items-baseline gap-3 ml-2 mb-2"><span className="font-bold text-slate-900 font-sans text-sm">{line.substring(0, 2)}</span><span className="text-slate-800">{line.replace('1. ', '')}</span></div>;
             if (line.startsWith('- ')) return <div key={i} className="flex items-baseline gap-3 ml-4 mb-2"><span className="w-1.5 h-1.5 bg-slate-900 rounded-full flex-shrink-0 mt-2.5"></span><span className="text-slate-800">{line.replace('- ', '')}</span></div>;

             // Empty lines
             if (line === '') return null;
             
             // Bold text parser (simple)
             const processText = (text: string) => {
               const parts = text.split(/(\*\*.*?\*\*)/g);
               return parts.map((part, idx) => {
                 if (part.startsWith('**') && part.endsWith('**')) {
                   return <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                 }
                 return part;
               });
             };

             // Paragraphs
             return <p key={i} className="text-slate-800 font-serif font-light">{processText(line)}</p>;
           })}
        </div>

        {/* Tags Footer */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="flex flex-wrap gap-3">
            {post.tags && post.tags.map(tag => (
              <button 
                key={tag} 
                onClick={() => onNavigate(`/search?q=${tag}`)}
                className="bg-slate-50 text-slate-600 px-4 py-2 rounded-full text-sm font-sans font-medium hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 bg-slate-50 p-8 rounded-xl flex items-start gap-6">
           <div className="w-14 h-14 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold text-xl">
              {post.author.charAt(0)}
           </div>
           <div>
             <h4 className="font-sans font-bold text-slate-900 text-lg mb-1">Written by {post.author}</h4>
             <p className="font-serif text-slate-600 leading-relaxed italic">
               Senior Engineering Lead sharing insights on distributed systems, frontend architecture, and team scaling.
             </p>
           </div>
        </div>
      </div>
    </article>
  );
};