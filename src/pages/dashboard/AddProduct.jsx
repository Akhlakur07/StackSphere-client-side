import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router';
import { WithContext as ReactTags } from 'react-tag-input';
import Swal from 'sweetalert2';

const API_BASE = "http://localhost:3000";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [userProductCount, setUserProductCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    image: '',
    description: '',
    externalLink: '',
  });
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (user?.email) {
      fetchUserData();
    }
  }, [user?.email]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile to check membership status
      const profileResponse = await fetch(`${API_BASE}/user-profile/${user.email}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData);
      }

      // Fetch user's product count
      const productsResponse = await fetch(`${API_BASE}/products/user/${user.email}`);
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setUserProductCount(productsData.length);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // React Tags handlers
  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
  };

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const showUpgradePrompt = () => {
    Swal.fire({
      title: '🚀 Upgrade Required',
      html: (
        <div className="text-left">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 mb-4 border border-purple-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">⭐</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Product Limit Reached</h3>
                <p className="text-gray-600">You've used your 1 free product submission.</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Current Plan</span>
                <span className="font-semibold text-gray-900">Free</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Product Limit</span>
                <span className="font-semibold text-red-600">1 / 1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Premium Benefit</span>
                <span className="font-semibold text-green-600">Unlimited</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">✨ Premium Features</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>✅ Unlimited product submissions</li>
              <li>✅ Enhanced voting power</li>
              <li>✅ Advanced analytics</li>
              <li>✅ Featured placement opportunities</li>
            </ul>
          </div>
        </div>
      ),
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Upgrade to Premium - $9.99',
      cancelButtonText: 'Maybe Later',
      confirmButtonColor: '#8b5cf6',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-purple-200',
        confirmButton: 'px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300',
        cancelButton: 'px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-300'
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/dashboard');
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check product limit before submitting
    const isPremium = userProfile?.membership?.status === "premium";
    if (!isPremium && userProductCount >= 1) {
      showUpgradePrompt();
      return;
    }

    setSubmitting(true);

    try {
      const productData = {
        name: form.name,
        image: form.image,
        description: form.description,
        tags: tags.map(tag => tag.text),
        externalLink: form.externalLink,
        owner: {
          name: user?.displayName || 'User',
          email: user?.email,
          image: user?.photoURL || ''
        }
      };

      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.upgradeRequired) {
          showUpgradePrompt();
          return;
        }
        throw new Error(result.error || 'Failed to submit product');
      }

      // Show success message
      await Swal.fire({
        title: '🎉 Success!',
        html: (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Product Submitted!</h3>
            <p className="text-gray-600 mb-4">Your product is now under review by our moderators.</p>
            {!isPremium && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                <p className="text-sm text-blue-700">
                  📝 <strong>Free account:</strong> {userProductCount + 1}/1 products used
                </p>
              </div>
            )}
          </div>
        ),
        icon: 'success',
        confirmButtonText: 'View My Products',
        confirmButtonColor: '#10b981',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-green-200',
          confirmButton: 'px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300'
        },
        buttonsStyling: false
      });

      navigate('/dashboard/my-products');
      
    } catch (error) {
      console.error('Error submitting product:', error);
      
      Swal.fire({
        title: '❌ Error',
        text: error.message || 'Failed to submit product. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#ef4444',
        background: '#ffffff',
        customClass: {
          popup: 'rounded-2xl shadow-2xl border border-red-200'
        }
      });
    } finally {
      setSubmitting(false);
    }
  };

  // React Tags configuration
  const tagInputProps = {
    tags,
    placeholder: "Add tags (AI, Web, Mobile, etc.)",
    suggestions: [
      { id: "AI", text: "AI" },
      { id: "Web", text: "Web" },
      { id: "Mobile", text: "Mobile" },
      { id: "SaaS", text: "SaaS" },
      { id: "Open Source", text: "Open Source" },
      { id: "API", text: "API" },
      { id: "Cloud", text: "Cloud" },
      { id: "Blockchain", text: "Blockchain" },
    ],
    handleDelete,
    handleAddition,
    handleDrag,
    handleTagClick,
    autocomplete: true,
    allowUnique: true,
    allowDragDrop: false,
    inline: false,
    classNames: {
      tags: 'react-tags',
      tagInput: 'react-tags__tag-input',
      tagInputField: 'react-tags__tag-input-field',
      selected: 'react-tags__selected',
      tag: 'react-tags__tag',
      remove: 'react-tags__remove',
      suggestions: 'react-tags__suggestions',
      activeSuggestion: 'react-tags__active-suggestion'
    }
  };

  const isPremium = userProfile?.membership?.status === "premium";
  const canAddProduct = isPremium || userProductCount < 1;

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!canAddProduct) {
    return (
      <div className="p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Upgrade Required Banner */}
          <div className="bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl p-8 text-white text-center mb-8 shadow-2xl">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
            <p className="text-purple-100 text-lg">Unlock unlimited product submissions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Product Limit Reached</h3>
              <p className="text-gray-600 mb-6">
                You've used your 1 free product submission. Upgrade to Premium to submit unlimited products and access advanced features.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Free Plan</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span>Product Submissions</span>
                      <span className="font-semibold text-red-600">1 / 1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voting Power</span>
                      <span className="font-semibold">Basic</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analytics</span>
                      <span className="text-red-500">❌</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3">Premium Plan</h4>
                  <div className="space-y-2 text-sm text-purple-700">
                    <div className="flex items-center justify-between">
                      <span>Product Submissions</span>
                      <span className="font-semibold text-green-600">Unlimited</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Voting Power</span>
                      <span className="font-semibold">Enhanced</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Analytics</span>
                      <span className="text-green-500">✅</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Dashboard
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  <span className="mr-2">⭐</span>
                  Upgrade to Premium
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header with Product Count */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Add New Product</h2>
            {!isPremium && (
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
                {userProductCount}/1 Used
              </span>
            )}
            {isPremium && (
              <span className="bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full border border-purple-200">
                ⭐ Premium - Unlimited
              </span>
            )}
          </div>
          <p className="text-gray-600">Share your amazing tech product with the community</p>
          
          {!isPremium && userProductCount === 0 && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4 inline-block">
              <p className="text-sm text-yellow-700">
                📝 <strong>Free account:</strong> You can submit 1 product. Upgrade for unlimited submissions.
              </p>
            </div>
          )}
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

          {/* Tags with react-tag-input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="react-tags-container">
              <ReactTags
                {...tagInputProps}
                inputFieldPosition="inline"
                autofocus={false}
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Press Enter to add tags. Click × to remove.
            </p>
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
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Product Owner Information
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={user?.displayName || 'User'}
                  readOnly
                  className="w-full rounded-xl border border-purple-200 bg-white/50 px-4 py-2.5 text-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Owner Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full rounded-xl border border-purple-200 bg-white/50 px-4 py-2.5 text-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Owner Image</label>
                <input
                  type="text"
                  value={user?.photoURL || 'No image'}
                  readOnly
                  className="w-full rounded-xl border border-purple-200 bg-white/50 px-4 py-2.5 text-gray-600 text-sm truncate"
                />
              </div>
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

      {/* Custom Styles for React Tags */}
      <style jsx>{`
        .react-tags-container {
          position: relative;
        }
        
        .react-tags {
          position: relative;
          padding: 6px 0 0 6px;
          border: 1px solid #d1d5db;
          border-radius: 1rem;
          background: white;
          min-height: 56px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
        }

        .react-tags__selected {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .react-tags__tag {
          background: linear-gradient(to right, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 6px 12px;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .react-tags__remove {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 1.125rem;
          line-height: 1;
          padding: 0;
          margin-left: 4px;
        }

        .react-tags__tag-input {
          display: inline-block;
          margin: 4px;
        }

        .react-tags__tag-input-field {
          border: none;
          outline: none;
          padding: 8px 12px;
          font-size: 0.875rem;
          background: transparent;
          min-width: 200px;
        }

        .react-tags__tag-input-field::placeholder {
          color: #9ca3af;
        }

        .react-tags__suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 10;
          margin-top: 4px;
        }

        .react-tags__suggestions ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .react-tags__suggestions li {
          padding: 8px 12px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
        }

        .react-tags__suggestions li:last-child {
          border-bottom: none;
        }

        .react-tags__suggestions li:hover,
        .react-tags__active-suggestion {
          background: #f3f4f6;
        }

        .react-tags__selected:empty + .react-tags__tag-input {
          width: 100%;
        }

        .react-tags__selected:empty + .react-tags__tag-input .react-tags__tag-input-field {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;