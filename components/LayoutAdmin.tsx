import React, { useState } from 'react';

interface LayoutAdminProps {
  children: React.ReactNode;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  currentPage: string;
}

export const LayoutAdmin: React.FC<LayoutAdminProps> = ({ children, onNavigate, onLogout, currentPage }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <button 
        onClick={() => handleNavigate('/admin/dashboard')}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage === '/admin/dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        <span>Dashboard</span>
      </button>
      
      <button 
         onClick={() => handleNavigate('/admin/blogs')}
         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage.startsWith('/admin/blogs') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
        <span>Blog Manager</span>
      </button>

      <button 
         onClick={() => handleNavigate('/admin/categories')}
         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage.startsWith('/admin/categories') ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
        <span>Categories</span>
      </button>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="font-bold text-lg tracking-wider">HTT Admin</span>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <NavLinks />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button onClick={onLogout} className="w-full flex items-center space-x-3 text-slate-400 hover:text-white transition-colors px-4 py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Sign Out</span>
           </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 md:hidden z-20 relative">
          <span className="font-bold text-slate-800">HTT Admin</span>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 p-2 focus:outline-none"
          >
            {isMobileMenuOpen ? (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            ) : (
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            )}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="bg-slate-900 absolute top-16 left-0 w-full z-10 border-b border-slate-800 md:hidden shadow-xl">
             <nav className="p-4 space-y-2">
                <NavLinks />
                <div className="pt-4 mt-2 border-t border-slate-800">
                  <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center space-x-3 text-slate-400 hover:text-white transition-colors px-4 py-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span>Sign Out</span>
                  </button>
                </div>
             </nav>
          </div>
        )}

        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
};