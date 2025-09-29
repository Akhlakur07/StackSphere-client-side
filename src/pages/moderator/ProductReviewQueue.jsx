import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";

const API_BASE = "http://localhost:3000";

const ProductReviewQueue = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [acceptedProducts, setAcceptedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "accepted"
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch pending products
      const pendingResponse = await fetch(`${API_BASE}/products/pending`);
      if (pendingResponse.ok) {
        const pendingData = await pendingResponse.json();
        setPendingProducts(pendingData);
      }

      // Fetch accepted products (non-featured)
      const acceptedResponse = await fetch(`${API_BASE}/products/accepted-non-featured`);
      if (acceptedResponse.ok) {
        const acceptedData = await acceptedResponse.json();
        setAcceptedProducts(acceptedData);
      } else {
        // Fallback: filter accepted products from all products
        const allProductsResponse = await fetch(`${API_BASE}/moderator/products`);
        if (allProductsResponse.ok) {
          const allProducts = await allProductsResponse.json();
          const acceptedNonFeatured = allProducts.filter(
            product => product.status === "accepted" && !product.featured
          );
          setAcceptedProducts(acceptedNonFeatured);
        }
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load products",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-red-200",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAccept = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: "accept" }));

    try {
      const response = await fetch(`${API_BASE}/products/${productId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "accepted" }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove from pending and add to accepted
        const acceptedProduct = pendingProducts.find(p => p._id === productId);
        setPendingProducts(prev => prev.filter(product => product._id !== productId));
        if (acceptedProduct) {
          setAcceptedProducts(prev => [...prev, { ...acceptedProduct, status: "accepted" }]);
        }

        Swal.fire({
          title: "✅ Accepted!",
          text: "Product has been approved and published on the platform",
          icon: "success",
          confirmButtonText: "OK",
          background: "#ffffff",
          customClass: {
            popup: "rounded-2xl shadow-2xl border border-green-200",
          },
        });
      } else {
        throw new Error(result.error || "Failed to accept product");
      }
    } catch (error) {
      console.error("Error accepting product:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to accept product",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-red-200",
        },
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: null }));
    }
  };

  const handleReject = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: "reject" }));

    try {
      const response = await fetch(`${API_BASE}/products/${productId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove from pending
        setPendingProducts(prev => prev.filter(product => product._id !== productId));

        Swal.fire({
          title: "❌ Rejected!",
          text: "Product has been rejected and will not be published",
          icon: "success",
          confirmButtonText: "OK",
          background: "#ffffff",
          customClass: {
            popup: "rounded-2xl shadow-2xl border border-red-200",
          },
        });
      } else {
        throw new Error(result.error || "Failed to reject product");
      }
    } catch (error) {
      console.error("Error rejecting product:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to reject product",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-red-200",
        },
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: null }));
    }
  };

  const handleMakeFeatured = async (productId) => {
    setActionLoading((prev) => ({ ...prev, [productId]: "feature" }));

    try {
      const response = await fetch(
        `${API_BASE}/products/${productId}/featured`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ featured: true }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        // Remove from accepted products (since it's now featured)
        setAcceptedProducts(prev => prev.filter(product => product._id !== productId));

        Swal.fire({
          title: "⭐ Featured!",
          text: "Product has been marked as featured and will appear in the Featured Products section",
          icon: "success",
          confirmButtonText: "OK",
          background: "#ffffff",
          customClass: {
            popup: "rounded-2xl shadow-2xl border border-green-200",
          },
        });
      } else {
        throw new Error(result.error || "Failed to mark product as featured");
      }
    } catch (error) {
      console.error("Error featuring product:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to mark product as featured",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-red-200",
        },
      });
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: null }));
    }
  };

  const showProductDetails = (product) => {
    Swal.fire({
      title: product.name,
      html: (
        <div className="text-left max-h-96 overflow-y-auto">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
          />
          <div className="space-y-3">
            <div>
              <strong className="text-gray-700">Description:</strong>
              <p className="text-gray-600 mt-1 text-sm">
                {product.description}
              </p>
            </div>

            <div>
              <strong className="text-gray-700">Owner:</strong>
              <div className="flex items-center space-x-2 mt-1">
                <img
                  src={
                    product.owner?.image ||
                    "https://www.w3schools.com/w3images/avatar2.png"
                  }
                  alt={product.owner?.name}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-sm text-gray-600">
                  {product.owner?.name}
                </span>
                <span className="text-xs text-gray-400">
                  ({product.owner?.email})
                </span>
              </div>
            </div>

            {product.externalLink && (
              <div>
                <strong className="text-gray-700">External Link:</strong>
                <a
                  href={product.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:text-blue-600 text-sm mt-1 truncate"
                >
                  {product.externalLink}
                </a>
              </div>
            )}

            {product.tags && product.tags.length > 0 && (
              <div>
                <strong className="text-gray-700">Tags:</strong>
                <div className="flex flex-wrap gap-1 mt-1">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full border border-purple-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">Submitted:</strong>
                <p className="text-gray-600">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <strong className="text-gray-700">Votes:</strong>
                <p className="text-gray-600">{product.votes}</p>
              </div>
              <div>
                <strong className="text-gray-700">Status:</strong>
                <p className="text-gray-600 capitalize">{product.status}</p>
              </div>
              {product.featured !== undefined && (
                <div>
                  <strong className="text-gray-700">Featured:</strong>
                  <p className="text-gray-600">{product.featured ? "Yes" : "No"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      showCancelButton: false,
      confirmButtonText: "Close",
      confirmButtonColor: "#6b7280",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-200",
        confirmButton: "px-6 py-3 rounded-xl font-semibold",
      },
      width: "600px",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "accepted":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const EmptyState = ({ icon, title, description }) => (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const ProductCard = ({ product, isPending = false }) => (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm flex-shrink-0"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {product.name}
              </h4>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(product.status)}`}>
                {product.status === "pending" && "⏳ Pending"}
                {product.status === "accepted" && "✅ Accepted"}
              </span>
              {!isPending && product.featured && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200"
                >
                  {tag}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">
                  +{product.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <img
                  src={product.owner?.image || "https://www.w3schools.com/w3images/avatar2.png"}
                  alt={product.owner?.name}
                  className="w-5 h-5 rounded-full"
                />
                <span>{product.owner?.name}</span>
              </div>
              <span>•</span>
              <span>Votes: {product.votes}</span>
              <span>•</span>
              <span>{new Date(product.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => showProductDetails(product)}
                className="inline-flex items-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Details
              </button>

              {isPending ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAccept(product._id)}
                    disabled={actionLoading[product._id]}
                    className="inline-flex items-center px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {actionLoading[product._id] === "accept" ? (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(product._id)}
                    disabled={actionLoading[product._id]}
                    className="inline-flex items-center px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    {actionLoading[product._id] === "reject" ? (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleMakeFeatured(product._id)}
                  disabled={actionLoading[product._id] || product.featured}
                  className="inline-flex items-center px-3 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  {actionLoading[product._id] === "feature" ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  )}
                  {product.featured ? "Featured" : "Make Featured"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Product Review Queue
          </h2>
          <p className="text-gray-600">
            Manage pending submissions and feature accepted products
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-8 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "pending"
                ? "bg-white text-blue-600 shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            ⏳ Pending ({pendingProducts.length})
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === "accepted"
                ? "bg-white text-green-600 shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            ✅ Accepted ({acceptedProducts.length})
          </button>
        </div>

        {/* Pending Products Section */}
        {activeTab === "pending" && (
          <div>
            {pendingProducts.length === 0 ? (
              <EmptyState
                icon="✅"
                title="All Caught Up!"
                description="No pending products to review at the moment."
              />
            ) : (
              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <ProductCard key={product._id} product={product} isPending={true} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Accepted Products Section */}
        {activeTab === "accepted" && (
          <div>
            {acceptedProducts.length === 0 ? (
              <EmptyState
                icon="⭐"
                title="No Products to Feature"
                description="All accepted products are already featured or no products have been accepted yet."
              />
            ) : (
              <div className="space-y-4">
                {acceptedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} isPending={false} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-6 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {pendingProducts.length}
            </div>
            <div className="text-sm text-blue-700">Pending Reviews</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {acceptedProducts.length}
            </div>
            <div className="text-sm text-green-700">Ready to Feature</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 text-center border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {pendingProducts.length + acceptedProducts.length}
            </div>
            <div className="text-sm text-purple-700">Total to Manage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewQueue;