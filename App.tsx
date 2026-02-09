import React, { useState, useEffect } from 'react';
import { AuthState } from './types';
import { LayoutPublic } from './components/LayoutPublic';
import { LayoutAdmin } from './components/LayoutAdmin';
import { ErrorBoundary } from './components/ErrorBoundary';

// Public Pages
import { Home } from './pages/Home';
import { BlogList } from './pages/BlogList';
import { BlogPost } from './pages/BlogPost';
import { CategoriesList, CategoryDetail } from './pages/Categories';
import { About, Contact } from './pages/StaticPages';
import { Search } from './pages/Search';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { BlogManager } from './pages/admin/BlogManager';
import { BlogEditor } from './pages/admin/BlogEditor';
import { CategoryManager } from './pages/admin/CategoryManager';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.substring(1) || '/');
  
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.substring(1);
      setCurrentPath(path || '/');
      window.scrollTo(0, 0); // Scroll to top on navigation
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const handleLoginSuccess = (token: string, user: any) => {
    setAuthState({
      isAuthenticated: true,
      user,
      token
    });
    navigate('/admin/dashboard');
  };

  const handleLogout = () => {
    setAuthState({ isAuthenticated: false, user: null, token: null });
    navigate('/');
  };

  // --- Routing Logic ---
  const renderContent = () => {
    // Admin Routes
    if (currentPath.startsWith('/admin')) {
      if (!authState.isAuthenticated) {
         return <Login onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />;
      }

      const renderAdminPage = () => {
        if (currentPath === '/admin/dashboard') return <Dashboard />;
        if (currentPath === '/admin/blogs') return <BlogManager onNavigate={navigate} />;
        if (currentPath === '/admin/blogs/new') return <BlogEditor onNavigate={navigate} />;
        if (currentPath.startsWith('/admin/blogs/')) {
          const id = currentPath.split('/admin/blogs/')[1];
          return <BlogEditor id={id} onNavigate={navigate} />;
        }
        if (currentPath === '/admin/categories') return <CategoryManager />;
        
        return <Dashboard />; // Fallback
      };

      return (
        <LayoutAdmin onNavigate={navigate} onLogout={handleLogout} currentPage={currentPath}>
          {renderAdminPage()}
        </LayoutAdmin>
      );
    }

    // Public Routes
    return (
      <LayoutPublic onNavigate={navigate}>
        {currentPath === '/' && <Home onNavigate={navigate} />}
        {currentPath === '/blogs' && <BlogList onNavigate={navigate} />}
        {currentPath.startsWith('/blog/') && <BlogPost slug={currentPath.replace('/blog/', '')} onNavigate={navigate} />}
        {currentPath === '/categories' && <CategoriesList onNavigate={navigate} />}
        {currentPath.startsWith('/category/') && <CategoryDetail slug={currentPath.replace('/category/', '')} onNavigate={navigate} />}
        {currentPath.startsWith('/search') && <Search query={new URLSearchParams(currentPath.split('?')[1]).get('q') || ''} onNavigate={navigate} />}
        {currentPath === '/about' && <About />}
        {currentPath === '/contact' && <Contact />}
      </LayoutPublic>
    );
  };

  return (
    <ErrorBoundary>
      {renderContent()}
    </ErrorBoundary>
  );
}