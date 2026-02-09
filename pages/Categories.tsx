import React, { useEffect, useState } from 'react';
import { fetchCategories, fetchPosts } from '../services/api';
import { PostCard } from '../components/PostCard';
import { BlogPost, Category } from '../types';

interface CategoriesListProps {
  onNavigate: (path: string) => void;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories().then(setCategories).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center">Loading categories...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Browse by Topic</h1>
        <p className="text-xl text-slate-600">Find exactly what you're looking for.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <div 
            key={cat.id} 
            onClick={() => onNavigate(`/category/${cat.slug}`)}
            className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group"
          >
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600">{cat.name}</h3>
            <p className="text-slate-600 text-sm mb-4">{cat.description}</p>
            <span className="text-xs font-semibold text-blue-600 group-hover:underline">View Articles &rarr;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface CategoryDetailProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CategoryDetail: React.FC<CategoryDetailProps> = ({ slug, onNavigate }) => {
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch all categories to find the current one (API could be optimized to fetch single category by slug)
    fetchCategories().then(cats => {
      const cat = cats.find(c => c.slug === slug);
      if (cat) {
        setCategory(cat);
        // Fetch posts for this category slug
        fetchPosts({ category: slug }).then(setPosts);
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Loading...</div>;
  if (!category) return <div className="p-12 text-center">Category not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="mb-12 border-b border-slate-200 pb-12">
        <span className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-2 block">Category</span>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{category.name}</h1>
        <p className="text-xl text-slate-600 max-w-2xl">{category.description}</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(blog => (
            <PostCard 
              key={blog.id} 
              post={blog} 
              onClick={() => onNavigate(`/blog/${blog.slug}`)} 
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 text-lg">No articles found in this category yet.</p>
          <button onClick={() => onNavigate('/categories')} className="mt-4 text-blue-600 font-medium">Browse other categories</button>
        </div>
      )}
    </div>
  );
};