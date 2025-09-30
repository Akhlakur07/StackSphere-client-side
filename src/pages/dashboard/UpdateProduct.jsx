import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router";
import { toast } from "react-toastify";
import { WithContext as ReactTags } from "react-tag-input";
import Swal from "sweetalert2";
// import withReactContent from 'sweetalert2-react-content';

const API_BASE = "https://stack-back-omega.vercel.app";

// const MySwal = withReactContent(Swal);

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    externalLink: "",
  });
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (response.ok) {
        const product = await response.json();

        // Check if current user owns this product
        if (product.owner.email !== user?.email) {
          toast.error("You don't have permission to edit this product");
          navigate("/dashboard/my-products");
          return;
        }

        setForm({
          name: product.name,
          image: product.image,
          description: product.description,
          externalLink: product.externalLink || "",
        });
        setTags(product.tags?.map((tag) => ({ id: tag, text: tag })) || []);
      } else {
        toast.error("Failed to load product");
        navigate("/dashboard/my-products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      navigate("/dashboard/my-products");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
    console.log("The tag at index " + index + " was clicked");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const productData = {
        name: form.name,
        image: form.image,
        description: form.description,
        tags: tags.map((tag) => tag.text),
        externalLink: form.externalLink,
        owner: {
          name: user?.displayName || "User",
          email: user?.email,
          image: user?.photoURL || "",
        },
      };

      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      // Show success with SweetAlert
      await Swal.fire({
        title: "Success!",
        text: "Product updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#10b981",
      });

      // Show toast notification
      toast.success("Product updated successfully!");

      navigate("/dashboard/my-products");
    } catch (error) {
      console.error("Error updating product:", error);

      // Show error with SweetAlert
      Swal.fire({
        title: "Error!",
        text: "Failed to update product. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // React Tags styling configuration
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
      tags: "react-tags",
      tagInput: "react-tags__tag-input",
      tagInputField: "react-tags__tag-input-field",
      selected: "react-tags__selected",
      tag: "react-tags__tag",
      remove: "react-tags__remove",
      suggestions: "react-tags__suggestions",
      activeSuggestion: "react-tags__active-suggestion",
    },
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Update Product
            </h2>
            <p className="text-gray-600">Modify your product information</p>
          </div>
          <Link
            to="/dashboard/my-products"
            className="px-4 py-2 text-gray-600 hover:text-purple-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            ← Back to Products
          </Link>
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
                <label className="block text-xs text-gray-500 mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  value={user?.displayName || "User"}
                  readOnly
                  className="w-full rounded-xl border border-purple-200 bg-white/50 px-4 py-2.5 text-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Owner Email
                </label>
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-purple-200 bg-white/50 px-4 py-2.5 text-gray-600 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Owner Image
                </label>
                <input
                  type="text"
                  value={user?.photoURL || "No image"}
                  readOnly
                  className="w-full rounded-xl border border-purple-200 bg-white/50 px-4 py-2.5 text-gray-600 text-sm truncate"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate("/dashboard/my-products")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Updating Product...
                </div>
              ) : (
                "Update Product"
              )}
            </button>
          </div>
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

        .react-tags__selected:empty
          + .react-tags__tag-input
          .react-tags__tag-input-field {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default UpdateProduct;
