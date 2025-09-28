import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:3000";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    image: '',
    description: '',
    tags: [],
    externalLink: '',
    currentTag: ''
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddTag = () => {
    if (form.currentTag.trim() && !form.tags.includes(form.currentTag.trim())) {
      setForm(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        name: form.name,
        image: form.image,
        description: form.description,
        tags: form.tags,
        externalLink: form.externalLink,
        owner: {
          name: user?.displayName,
          email: user?.email,
          image: user?.photoURL
        },
        status: 'pending',
        votes: 0,
        createdAt: new Date().toISOString(),
        featured: false
      };

      // TODO: Replace with actual API call
      console.log('Submitting product:', productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('🎉 Product submitted successfully! It will be reviewed by our moderators.');
      navigate('/dashboard/my-products');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('❌ Failed to submit product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h2>
          <p className="text-gray-600">Share your amazing tech product with the community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Enter your product name"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300"
            />
          </div>

          {/* Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Image URL *
            </label>
            <input
              type="url"
              name="image"
              value={form.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/product-image.jpg"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe your product features and benefits..."
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={form.currentTag}
                onChange={(e) => setForm(prev => ({ ...prev, currentTag: e.target.value }))}
                placeholder="Add tags (AI, Web, Mobile, etc.)"
                className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-6 bg-purple-500 text-white rounded-2xl hover:bg-purple-600 transition-all duration-300"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-purple-500 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* External Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              External Link (Website/Landing Page)
            </label>
            <input
              type="url"
              name="externalLink"
              value={form.externalLink}
              onChange={handleChange}
              placeholder="https://your-product.com"
              className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300"
            />
          </div>

          {/* Owner Info (Read-only) */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Owner Information
            </label>
            <div className="space-y-2">
              <input
                type="text"
                value={user?.displayName || ''}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-600"
                placeholder="Owner Name"
              />
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-gray-600"
                placeholder="Owner Email"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            {submitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Product...
              </div>
            ) : (
              'Submit Product for Review'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;