import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:3000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [upvoting, setUpvoting] = useState({});

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 6,
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`${API_BASE}/products?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  // eslint-disable-next-line no-unused-vars
  const handleUpvote = async (productId, currentVotes) => {
    setUpvoting((prev) => ({ ...prev, [productId]: true }));

    try {
      const response = await fetch(`${API_BASE}/products/${productId}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? updatedProduct : product
          )
        );
        toast.success("Upvoted successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Failed to upvote");
    } finally {
      setUpvoting((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
            currentPage === i
              ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-purple-50 hover:border-purple-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {pages}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 mt-22">
            Discover Products
          </h1>
          <p className="text-gray-600 text-lg">
            Explore amazing tech products shared by our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by name or tags (e.g., AI, Web, Mobile)..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-6 py-4 text-lg focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              Search
            </button>
          </form>

          {/* Search Info */}
          {searchTerm && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-2xl">
              <p className="text-purple-700">
                Showing results for:{" "}
                <span className="font-semibold">"{searchTerm}"</span>
                <span className="text-purple-600 ml-2">
                  ({totalProducts} products found)
                </span>
              </p>
              <p className="text-sm text-purple-600 mt-1">
                Searching in product names and tags
              </p>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl shadow-xl">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `No products found matching "${searchTerm}"`
                : "No products available at the moment"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {(currentPage - 1) * 6 + 1} -{" "}
                {Math.min(currentPage * 6, totalProducts)} of {totalProducts}{" "}
                products
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                >
                  {/* Product Image - Fixed aspect ratio */}
                  <div className="relative overflow-hidden bg-gray-50">
                    <div className="aspect-w-16 aspect-h-10">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-64 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Product+Image";
                        }}
                      />
                    </div>
                    <div className="absolute top-4 right-4">
                      {product.featured && (
                        <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                          ⭐ Featured
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                      <Link
                        to={`/product/${product._id}`}
                        className="hover:text-purple-600 transition-colors duration-300"
                      >
                        {product.name}
                      </Link>
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[40px]">
                      {product.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {product.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                      {product.tags?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                          +{product.tags.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Product Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            product.owner.photo ||
                            "https://www.w3schools.com/w3images/avatar2.png"
                          }
                          alt={product.owner.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600 truncate max-w-[100px]">
                          {product.owner.name}
                        </span>
                      </div>

                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(product._id, product.votes)}
                        disabled={upvoting[product._id]}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                      >
                        <span>▲</span>
                        <span>{product.votes || 0}</span>
                        {upvoting[product._id] && (
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-3xl shadow-xl p-6">
                {renderPagination()}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
