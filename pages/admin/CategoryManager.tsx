import React, { useState, useEffect } from 'react';
import { fetchCategories, createCategory, updateCategory } from '../../services/api';
import { Category } from '../../types';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // New/Edit State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setIsEditing(cat.id);
    setFormName(cat.name);
    setFormDesc(cat.description);
  };

  const handleCancel = () => {
    setIsEditing(null);
    setFormName('');
    setFormDesc('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await updateCategory(isEditing, { name: formName, description: formDesc });
        setCategories(prev => prev.map(c => c.id === isEditing ? updated : c));
      } else {
        const newCat = await createCategory({ name: formName, description: formDesc });
        setCategories(prev => [...prev, newCat]);
      }
      handleCancel();
    } catch (err) {
      alert('Failed to save category');
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* List */}
      <div className="lg:col-span-2">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Categories</h1>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 truncate max-w-xs">{cat.description}</td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{cat.slug}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEdit(cat)}
                      className="text-blue-600 hover:underline text-sm font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr className="p-4"><td colSpan={4} className="text-center p-4 text-slate-500">No categories found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Side Panel */}
      <div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 sticky top-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input 
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea 
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              ></textarea>
            </div>
            <div className="flex gap-2 pt-2">
              <button 
                type="submit" 
                className="flex-1 bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
              >
                {isEditing ? 'Update' : 'Add'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="flex-1 bg-slate-100 text-slate-600 py-2 rounded font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};