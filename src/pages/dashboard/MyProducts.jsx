import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';

// const MySwal = withReactContent(Swal);
const API_BASE = "http://localhost:3000";

const MyProducts = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user?.email) {
      fetchUserProducts();
    }
  }, [user?.email]);

  const fetchUserProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/user/${user.email}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        toast.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': 
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'rejected': 
        return 'bg-red-100 text-red-800 border border-red-200';
      default: 
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return '✅';
      case 'pending': return '⏳';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  const handleUpdate = (productId) => {
    navigate(`/dashboard/update-product/${productId}`);
  };

  const showDeleteConfirmation = async (product) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      html: (
        <div className="text-left">
          <p className="text-gray-600 mb-4">You are about to delete:</p>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-lg object-cover border border-red-200"
              />
              <div>
                <h4 className="font-semibold text-red-800">{product.name}</h4>
                <p className="text-sm text-red-600">
                  Status: <span className="capitalize">{product.status}</span> • Votes: {product.votes}
                </p>
              </div>
            </div>
          </div>
          <p className="text-sm text-red-600 font-medium">
            ⚠️ This action cannot be undone!
          </p>
        </div>
      ),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-2xl shadow-2xl border border-gray-200',
        confirmButton: 'px-6 py-3 rounded-xl font-semibold shadow-lg',
        cancelButton: 'px-6 py-3 rounded-xl font-semibold border border-gray-300'
      },
      buttonsStyling: false,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await handleDelete(product._id);
    }
  };

  const handleDelete = async (productId) => {
    setDeletingId(productId);

    try {
      const response = await fetch(`${API_BASE}/products/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId));
        toast.success('Product deleted successfully!');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">My Products</h2>
          <p className="text-gray-600">Manage and track your submitted products</p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
            <p className="text-gray-600 mb-6">Start by submitting your first amazing product!</p>
            <Link
              to="/dashboard/add-product"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300"
            >
              <span className="mr-2">➕</span>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-violet-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                        Votes
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                        Date Submitted
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-purple-900 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr 
                        key={product._id} 
                        className="hover:bg-gray-50 transition-colors duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-gray-900 truncate">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {product.description.substring(0, 60)}...
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {product.tags?.slice(0, 3).map((tag, index) => (
                                  <span
                                    key={index}
                                    className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full border border-purple-200"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {product.tags?.length > 3 && (
                                  <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                    +{product.tags.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-purple-600">
                              {product.votes}
                            </span>
                            <span className="text-gray-400">↑</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getStatusIcon(product.status)}</span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                              {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                            </span>
                          </div>
                          {product.status === 'pending' && (
                            <p className="text-xs text-gray-500 mt-1">
                              Under review by moderators
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="space-y-1">
                            <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(product.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleUpdate(product._id)}
                              disabled={deletingId === product._id}
                              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Update
                            </button>
                            <button 
                              onClick={() => showDeleteConfirmation(product)}
                              disabled={deletingId === product._id}
                              className="inline-flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 shadow-sm"
                            >
                              {deletingId === product._id ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                              {deletingId === product._id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border border-green-200 shadow-sm">
                <div className="text-3xl font-bold text-green-600">
                  {products.filter(p => p.status === 'accepted').length}
                </div>
                <div className="text-sm font-semibold text-green-700">Accepted</div>
                <div className="text-xs text-green-600 mt-1">Live on platform</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 text-center border border-yellow-200 shadow-sm">
                <div className="text-3xl font-bold text-yellow-600">
                  {products.filter(p => p.status === 'pending').length}
                </div>
                <div className="text-sm font-semibold text-yellow-700">Pending</div>
                <div className="text-xs text-yellow-600 mt-1">Under review</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 text-center border border-red-200 shadow-sm">
                <div className="text-3xl font-bold text-red-600">
                  {products.filter(p => p.status === 'rejected').length}
                </div>
                <div className="text-sm font-semibold text-red-700">Rejected</div>
                <div className="text-xs text-red-600 mt-1">Needs changes</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 text-center border border-purple-200 shadow-sm">
                <div className="text-3xl font-bold text-purple-600">
                  {products.reduce((total, product) => total + product.votes, 0)}
                </div>
                <div className="text-sm font-semibold text-purple-700">Total Votes</div>
                <div className="text-xs text-purple-600 mt-1">Across all products</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProducts;