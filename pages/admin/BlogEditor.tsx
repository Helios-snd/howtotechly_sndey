import React, { useState, useEffect } from 'react';
import { createPost, updatePost, fetchCategories, fetchPostBySlug, uploadImage } from '../../services/api';
import { BlogPost, Category } from '../../types';

interface BlogEditorProps {
  id?: string; // If undefined, it's create mode
  onNavigate: (path: string) => void;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ id, onNavigate }) => {
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Form State
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    categoryId: '',
    isPublished: false,
    tags: [],
    seoTitle: '',
    seoDescription: '',
  });
  
  // Tag input state
  const [tagInput, setTagInput] = useState('');

  // Load Categories and Post if Edit
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
    
    if (isEdit && id) {
      fetchPostBySlug(id).then(post => {
        setFormData(post);
      }).catch(() => alert('Failed to load post'));
    }
  }, [id, isEdit]);

  // Auto-generate slug from title if empty
  useEffect(() => {
    if (!isEdit && formData.title && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: prev.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || ''
      }));
    }
  }, [formData.title, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Standard 4MB limit
      if (file.size > 4 * 1024 * 1024) {
        alert("File too large. Please upload an image smaller than 4MB.");
        return;
      }

      setUploading(true);
      try {
        const url = await uploadImage(file);
        setFormData(prev => ({ ...prev, featuredImage: url }));
      } catch (err) {
        alert('Upload failed');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags?.includes(tagInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && id) {
        await updatePost(id, formData);
        alert('Post updated successfully!'); 
      } else {
        await createPost(formData);
        alert('Post created successfully!');
      }
      onNavigate('/admin/blogs');
    } catch (error: any) {
      alert(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  // Simple Markdown Preview Renderer
  const renderMarkdownPreview = (content: string) => {
    if (!content) return <p className="text-slate-400 italic">Start writing to see preview...</p>;
    
    return content.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="font-sans text-2xl font-bold text-slate-900 mt-6 mb-3">{line.replace('## ', '')}</h2>;
      if (line.startsWith('### ')) return <h3 key={i} className="font-sans text-xl font-semibold text-slate-900 mt-5 mb-2">{line.replace('### ', '')}</h3>;
      if (line.startsWith('1. ')) return <div key={i} className="flex gap-2 ml-2 mb-1"><span className="font-bold">{line.substring(0, 2)}</span><span>{line.replace('1. ', '')}</span></div>;
      if (line.startsWith('- ')) return <div key={i} className="flex gap-2 ml-4 mb-1"><span className="text-slate-900">•</span><span>{line.replace('- ', '')}</span></div>;
      if (line === '') return <br key={i} />;
      
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="text-slate-800 font-serif leading-relaxed mb-4">
          {parts.map((part, idx) => 
            (part.startsWith('**') && part.endsWith('**')) 
              ? <strong key={idx} className="font-bold text-slate-900">{part.slice(2, -2)}</strong> 
              : part
          )}
        </p>
      );
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sticky top-0 bg-gray-100 z-20 py-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEdit ? 'Edit Post' : 'Create New Post'}</h1>
          <p className="text-slate-500 text-sm mt-1">{isEdit ? 'Update your content' : 'Share your knowledge'}</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            type="button" 
            onClick={() => onNavigate('/admin/blogs')}
            className="flex-1 sm:flex-none px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isEdit ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Editor & Preview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title & Slug */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <input 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Post Title"
              className="w-full text-3xl font-bold text-slate-900 placeholder-slate-300 border-none focus:ring-0 outline-none p-0 mb-4"
              required
            />
            <div className="flex items-center text-sm text-slate-500 bg-slate-50 p-2 rounded-lg">
              <span className="mr-1">slug:</span>
              <input 
                name="slug" 
                value={formData.slug} 
                onChange={handleChange} 
                className="bg-transparent border-none focus:ring-0 text-slate-700 w-full p-0 font-mono text-xs"
                placeholder="post-url-slug"
              />
            </div>
          </div>

          {/* Main Content with Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-[calc(100vh-250px)] min-h-[600px] flex flex-col">
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex-1 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'write' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex-1 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'preview' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
              >
                Preview
              </button>
            </div>

            <div className="flex-1 relative">
              {activeTab === 'write' ? (
                <textarea 
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full h-full p-6 resize-none focus:outline-none font-mono text-base leading-relaxed text-slate-800"
                  placeholder="# Start writing your story...
                  
Supports Markdown:
- **Bold** for emphasis
- ## Headings for structure
- Lists for organization"
                  required
                ></textarea>
              ) : (
                <div className="w-full h-full p-8 overflow-y-auto prose prose-slate max-w-none">
                  {renderMarkdownPreview(formData.content || '')}
                </div>
              )}
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <label className="block text-sm font-bold text-slate-700 mb-2">Excerpt</label>
             <textarea 
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                placeholder="A short summary displayed on blog cards..."
             ></textarea>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="space-y-6">
          
          {/* Status Panel */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Publishing</h3>
            <div className="flex items-center justify-between mb-4">
               <span className="text-sm font-medium text-slate-700">Status</span>
               <span className={`px-2 py-1 rounded text-xs font-bold ${formData.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                 {formData.isPublished ? 'Published' : 'Draft'}
               </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
               <button 
                 type="button" 
                 onClick={() => setFormData(prev => ({...prev, isPublished: false}))}
                 className={`py-2 text-sm font-medium rounded-lg border transition-all ${!formData.isPublished ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
               >
                 Draft
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData(prev => ({...prev, isPublished: true}))}
                 className={`py-2 text-sm font-medium rounded-lg border transition-all ${formData.isPublished ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
               >
                 Publish
               </button>
            </div>
          </div>

          {/* Featured Image - Better UI */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Featured Image</h3>
            
            <div className="relative group cursor-pointer">
              <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${formData.featuredImage ? 'border-blue-300 bg-blue-50/30' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'}`}>
                
                {formData.featuredImage ? (
                  <div className="relative overflow-hidden rounded-lg">
                     <img src={formData.featuredImage} alt="Cover" className="w-full h-40 object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-bold">Click to Replace</span>
                     </div>
                  </div>
                ) : (
                  <div className="py-8">
                    <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to upload</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 4MB</p>
                  </div>
                )}
                
                <input 
                  type="file" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                />
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <span className="text-xs font-bold text-blue-600">Uploading...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
               <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Or External URL</label>
               <input 
                  name="featuredImage"
                  value={formData.featuredImage}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs text-slate-600 bg-slate-50"
               />
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Metadata</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                name="categoryId" 
                value={formData.categoryId || ''} 
                onChange={handleChange} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
              <input 
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag & Enter"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map(tag => (
                  <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 group">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-red-500">&times;</button>
                  </span>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-2">SEO</label>
              <input 
                  name="seoTitle" 
                  value={formData.seoTitle} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs mb-2"
                  placeholder="Meta Title"
                />
              <textarea 
                  name="seoDescription" 
                  value={formData.seoDescription} 
                  onChange={handleChange} 
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  placeholder="Meta Description"
                ></textarea>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
};