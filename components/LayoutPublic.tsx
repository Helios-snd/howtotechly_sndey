import React, { useState } from 'react';
import { MOCK_CATEGORIES } from '../services/mockData';

interface LayoutPublicProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
}

export const LayoutPublic: React.FC<LayoutPublicProps> = ({ children, onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            
            {/* Logo */}
            <div 
              className="flex-shrink-0 cursor-pointer flex items-center gap-2"
              onClick={() => onNavigate('/')}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">H</div>
              <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">HowToTechly</span>
            </div>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-1">
              {['Home', 'Blogs', 'Categories', 'About'].map((item) => (
                <button 
                  key={item}
                  onClick={() => onNavigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-all"
                >
                  {item}
                </button>
              ))}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center gap-4 flex-1 md:flex-none justify-end">
              <form onSubmit={handleSearch} className="relative group w-full max-w-[200px] hidden sm:block">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                 </div>
                 <input
                   type="text"
                   placeholder="Search..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="block w-full pl-10 pr-3 py-1.5 border border-slate-200 rounded-full leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                 />
              </form>

              <div className="h-4 w-px bg-slate-200 hidden md:block"></div>

              <button 
                onClick={() => onNavigate('/admin/login')}
                className="hidden md:flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
              >
                <span>Login</span>
              </button>

              <div className="md:hidden">
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} className="mb-4">
                <input
                   type="text"
                   placeholder="Search articles..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                 />
              </form>
              {['Home', 'Blogs', 'Categories', 'About', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => { onNavigate(item === 'Home' ? '/' : `/${item.toLowerCase()}`); setIsMobileMenuOpen(false); }} 
                  className="block w-full text-left px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {item}
                </button>
              ))}
              <div className="pt-4 border-t border-slate-100 mt-2">
                <button onClick={() => onNavigate('/admin/login')} className="block w-full text-left px-4 py-2 text-sm text-slate-500 font-mono">Admin Portal</button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">H</div>
              <span className="font-bold text-xl text-white tracking-tight">HowToTechly</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              Building the future of tech documentation. Production-grade tutorials for modern engineers.
            </p>
            {/* Social Links */}
            <div className="flex gap-4 pt-2">
               {/* X (Twitter) */}
               <a href="https://x.com/howtotechly" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group" aria-label="X (Twitter)">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
               </a>
               {/* Facebook */}
               <a href="https://www.facebook.com/howtotechly" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group" aria-label="Facebook">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path></svg>
               </a>
               {/* LinkedIn */}
               <a href="https://www.linkedin.com/company/howtotechly" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group" aria-label="LinkedIn">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
               </a>
               {/* Instagram */}
               <a href="https://www.instagram.com/howtotechly" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group" aria-label="Instagram">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 2.37c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path></svg>
               </a>
               {/* YouTube */}
               <a href="https://www.youtube.com/@howtotechly" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors group" aria-label="YouTube">
                 <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd"></path></svg>
               </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><button onClick={() => onNavigate('/blogs')} className="hover:text-blue-400 transition-colors">Latest Articles</button></li>
              <li><button onClick={() => onNavigate('/categories')} className="hover:text-blue-400 transition-colors">Categories</button></li>
              <li><button onClick={() => onNavigate('/about')} className="hover:text-blue-400 transition-colors">Our Story</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Topics</h3>
            <ul className="space-y-3 text-sm">
              {MOCK_CATEGORIES.slice(0, 4).map(cat => (
                <li key={cat.id}><button onClick={() => onNavigate(`/category/${cat.slug}`)} className="hover:text-blue-400 transition-colors">{cat.name}</button></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-6">Weekly Digest</h3>
            <p className="text-sm mb-4 text-slate-500">Get the best tech news delivered to your inbox.</p>
            <form className="flex flex-col gap-2">
              <input type="email" placeholder="you@company.com" className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-600">
          <p>© {new Date().getFullYear()} HowToTechly. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
             <button className="hover:text-slate-400">Privacy</button>
             <button className="hover:text-slate-400">Terms</button>
             <button className="hover:text-slate-400">Cookies</button>
          </div>
        </div>
      </footer>
    </div>
  );
};