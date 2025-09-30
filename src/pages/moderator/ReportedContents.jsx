import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const API_BASE = "https://stack-back-omega.vercel.app";

const ReportedContents = () => {
  const [reportedProducts, setReportedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReportedProducts();
  }, []);

  const fetchReportedProducts = async () => {
    try {
      console.log("Fetching reported products...");

      const response = await fetch(`${API_BASE}/products/reported`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received reported products:", data);
      setReportedProducts(data);
    } catch (error) {
      console.error("Error fetching reported products:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to load reported products",
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

  const showDeleteConfirmation = async (product) => {
    const result = await Swal.fire({
      title: "Delete Reported Product?",
      html: (
        <div className="text-left">
          <p className="text-gray-600 mb-4">
            You are about to permanently delete this reported product:
          </p>
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
                  Reported by: {product.reportedBy?.name || "Unknown"} • Votes:{" "}
                  {product.votes}
                </p>
                {product.reportReason && (
                  <p className="text-xs text-red-500 mt-1">
                    Reason: {product.reportReason}
                  </p>
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-red-600 font-medium">
            ⚠️ This will permanently remove the product and all associated data!
          </p>
        </div>
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete permanently",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl shadow-2xl border border-gray-200",
        confirmButton: "px-6 py-3 rounded-xl font-semibold shadow-lg",
        cancelButton:
          "px-6 py-3 rounded-xl font-semibold border border-gray-300",
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
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setReportedProducts((prev) =>
          prev.filter((product) => product._id !== productId)
        );

        Swal.fire({
          title: "🗑️ Deleted!",
          text: "Reported product has been permanently removed",
          icon: "success",
          confirmButtonText: "OK",
          background: "#ffffff",
          customClass: {
            popup: "rounded-2xl shadow-2xl border border-green-200",
          },
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting reported product:", error);
      Swal.fire({
        title: "Error!",
        text: error.message || "Failed to delete product",
        icon: "error",
        confirmButtonText: "OK",
        background: "#ffffff",
        customClass: {
          popup: "rounded-2xl shadow-2xl border border-red-200",
        },
      });
    } finally {
      setDeletingId(null);
    }
  };

  const showProductDetails = (product) => {
    Swal.fire({
      title: product.name,
      html: `
      <div class="text-left max-h-96 overflow-y-auto">
        <img 
          src="${product.image}" 
          alt="${product.name}" 
          class="w-full h-48 object-cover rounded-xl mb-4 border border-gray-200"
        />
        <div class="space-y-3">
          <div>
            <strong class="text-gray-700">Description:</strong>
            <p class="text-gray-600 mt-1 text-sm">${
              product.description || "No description"
            }</p>
          </div>
          
          <div>
            <strong class="text-gray-700">Owner:</strong>
            <div class="flex items-center space-x-2 mt-1">
              <img 
                src="${
                  product.owner?.photo ||
                  "https://www.w3schools.com/w3images/avatar2.png"
                }" 
                alt="${product.owner?.name || "Unknown"}"
                class="w-6 h-6 rounded-full"
              />
              <span class="text-sm text-gray-600">${
                product.owner?.name || "Unknown"
              }</span>
              <span class="text-xs text-gray-400">(${
                product.owner?.email || "No email"
              })</span>
            </div>
          </div>

          <!-- Report Information -->
          <div class="bg-red-50 border border-red-200 rounded-xl p-3">
            <strong class="text-red-700">Report Information:</strong>
            <div class="mt-2 space-y-2">
              <div class="flex items-center justify-between text-sm">
              </div>
              ${
                product.reportReason
                  ? `
                <div>
                  <span class="text-red-600 text-sm">Reason:</span>
                  <p class="text-red-700 text-sm mt-1 font-medium">
                    ${product.reportReason}
                  </p>
                </div>
              `
                  : ""
              }
              ${
                product.reportedAt
                  ? `
                <div class="flex items-center justify-between text-sm">
                  <span class="text-red-600">Reported On:</span>
                  <span class="text-red-700">
                    ${new Date(product.reportedAt).toLocaleDateString()}
                  </span>
                </div>
              `
                  : ""
              }
            </div>
          </div>

          ${
            product.externalLink
              ? `
            <div>
              <strong class="text-gray-700">External Link:</strong>
              <a 
                href="${product.externalLink}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="block text-blue-500 hover:text-blue-600 text-sm mt-1 truncate"
              >
                ${product.externalLink}
              </a>
            </div>
          `
              : ""
          }

          ${
            product.tags && product.tags.length > 0
              ? `
            <div>
              <strong class="text-gray-700">Tags:</strong>
              <div class="flex flex-wrap gap-1 mt-1">
                ${product.tags
                  .map(
                    (tag) => `
                  <span class="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full border border-purple-200">
                    ${tag}
                  </span>
                `
                  )
                  .join("")}
              </div>
            </div>
          `
              : ""
          }

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong class="text-gray-700">Submitted:</strong>
              <p class="text-gray-600">${new Date(
                product.createdAt
              ).toLocaleDateString()}</p>
            </div>
            <div>
              <strong class="text-gray-700">Votes:</strong>
              <p class="text-gray-600">${product.votes || 0}</p>
            </div>
            <div>
              <strong class="text-gray-700">Status:</strong>
              <p class="text-gray-600 capitalize">${
                product.status || "unknown"
              }</p>
            </div>
            <div>
              <strong class="text-gray-700">Featured:</strong>
              <p class="text-gray-600">${product.featured ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>
      </div>
    `,
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
            Reported Contents
          </h2>
          <p className="text-gray-600">Review and manage reported products</p>
        </div>

        {reportedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Reported Content
            </h3>
            <p className="text-gray-600">
              All clear! No products have been reported.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-900">
                    Reported Products ({reportedProducts.length})
                  </h3>
                  <p className="text-sm text-red-700">
                    Review and take action on reported content
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-red-600">Sorted by: Report Date</p>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Product Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reported Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reportedProducts.map((product) => (
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
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 truncate">
                                {product.name}
                              </h4>
                              {product.featured && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full border border-yellow-200">
                                  ⭐ Featured
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                              {product.description}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>Votes: {product.votes}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {product.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={
                              product.reporterImage ||
                              "https://www.w3schools.com/w3images/avatar2.png"
                            }
                            alt={product.reporterName}
                            className="w-8 h-8 rounded-full border border-gray-200"
                          />
                          <div className="min-w-0">
                            <p className="text-xs text-gray-500 truncate">
                              {product.reportedBy || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="space-y-1">
                          <div>
                            {product.reportedAt
                              ? new Date(
                                  product.reportedAt
                                ).toLocaleDateString()
                              : "Unknown"}
                          </div>
                          <div className="text-xs text-gray-400">
                            {product.reportedAt
                              ? new Date(
                                  product.reportedAt
                                ).toLocaleTimeString()
                              : ""}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          {/* View Details Button */}
                          <button
                            onClick={() => showProductDetails(product)}
                            className="inline-flex items-center justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            View Details
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => showDeleteConfirmation(product)}
                            disabled={deletingId === product._id}
                            className="inline-flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-xs font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                          >
                            {deletingId === product._id ? (
                              <svg
                                className="animate-spin -ml-1 mr-2 h-3 w-3 text-white"
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
                            ) : (
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            )}
                            {deletingId === product._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {reportedProducts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-100 rounded-2xl p-6 text-center border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {reportedProducts.length}
              </div>
              <div className="text-sm text-red-700">Total Reported</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 text-center border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {reportedProducts.filter((p) => p.featured).length}
              </div>
              <div className="text-sm text-yellow-700">Featured Products</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-6 text-center border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">
                {reportedProducts.reduce(
                  (total, product) => total + product.votes,
                  0
                )}
              </div>
              <div className="text-sm text-purple-700">Total Votes</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportedContents;
