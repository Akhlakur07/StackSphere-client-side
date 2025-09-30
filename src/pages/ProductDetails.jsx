import React, { useState, useContext, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

const API_BASE = "https://stack-back-omega.vercel.app";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    description: "",
    rating: 5,
  });

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (response.ok) {
        const productData = await response.json();
        setProduct(productData);
      } else {
        toast.error("Product not found");
        navigate("/products");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      const response = await fetch(`${API_BASE}/reviews/product/${id}`);
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      toast.info("Please login to upvote products");
      navigate("/login");
      return;
    }

    if (product.owner.email === user.email) {
      toast.info("You can't upvote your own product");
      return;
    }

    setUpvoting(true);
    try {
      const response = await fetch(`${API_BASE}/products/${id}/upvote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userEmail: user.email }),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProduct(updatedProduct);
        toast.success("Upvoted successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to upvote");
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Failed to upvote");
    } finally {
      setUpvoting(false);
    }
  };

  const handleReport = async () => {
    if (!user) {
      toast.info("Please login to report products");
      navigate("/login");
      return;
    }

    setReporting(true);
    try {
      const response = await fetch(`${API_BASE}/products/${id}/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.displayName || user.email.split("@")[0], // Fallback to email username
          userPhoto: user.photoURL || "",
        }),
      });

      if (response.ok) {
        toast.success("Product reported successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to report product");
      }
    } catch (error) {
      console.error("Error reporting product:", error);
      toast.error("Failed to report product");
    } finally {
      setReporting(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.info("Please login to post reviews");
      navigate("/login");
      return;
    }

    if (!reviewForm.description.trim()) {
      toast.error("Please enter a review description");
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewData = {
        productId: id,
        reviewerName: user.displayName || "Anonymous",
        reviewerImage: user.photoURL || "",
        reviewerEmail: user.email,
        description: reviewForm.description.trim(),
        rating: reviewForm.rating,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(`${API_BASE}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        const newReview = await response.json();
        setReviews((prev) => [newReview, ...prev]);
        setReviewForm({ description: "", rating: 5 });
        toast.success("Review posted successfully!");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to post review");
      }
    } catch (error) {
      console.error("Error posting review:", error);
      toast.error("Failed to post review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <Link
            to="/products"
            className="text-purple-600 hover:text-purple-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const canUpvote = user && user.email !== product.owner.email;
  const canReview = user && user.email !== product.owner.email;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            to="/products"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to Products
          </Link>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Details Section */}
          <div className="space-y-8">
            {/* Product Image - Fixed aspect ratio */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="aspect-w-16 aspect-h-12 bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=Product+Image";
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Upvote Button */}
                <div className="ml-6 flex-shrink-0">
                  <button
                    onClick={handleUpvote}
                    disabled={upvoting || !canUpvote}
                    className={`flex flex-col items-center space-y-1 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 min-w-[100px] ${
                      canUpvote
                        ? "bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25 transform hover:scale-105"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <span className="text-xl">▲</span>
                    <span className="text-lg font-bold">
                      {product.votes || 0}
                    </span>
                    <span className="text-xs">Upvotes</span>
                    {upvoting && (
                      <svg
                        className="animate-spin h-4 w-4 text-white absolute"
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

              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Product Owner */}
              <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Submitted by
                </h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      product.owner.photo ||
                      "https://www.w3schools.com/w3images/avatar2.png"
                    }
                    alt={product.owner.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {product.owner.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {product.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* External Link */}
              {product.externalLink && (
                <div className="mb-6">
                  <a
                    href={product.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <span className="font-semibold">Visit Website</span>
                  </a>
                </div>
              )}

              {/* Report Button */}
              <button
                onClick={handleReport}
                disabled={reporting || !user}
                className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                  user
                    ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {reporting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>Reporting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    <span>Report Product</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-8">
            {/* Post Review Section */}
            {canReview && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Write a Review
                </h2>

                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  {/* Reviewer Info */}
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl">
                    <img
                      src={
                        user.photoURL ||
                        "https://www.w3schools.com/w3images/avatar2.png"
                      }
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.displayName || "Anonymous"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Posting as yourself
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Your Rating
                    </label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() =>
                            setReviewForm((prev) => ({ ...prev, rating: star }))
                          }
                          className="text-2xl focus:outline-none"
                        >
                          <span
                            className={
                              star <= reviewForm.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          >
                            ★
                          </span>
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({reviewForm.rating}{" "}
                        {reviewForm.rating === 1 ? "star" : "stars"})
                      </span>
                    </div>
                  </div>

                  {/* Review Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      name="description"
                      value={reviewForm.description}
                      onChange={handleReviewChange}
                      rows="4"
                      placeholder="Share your thoughts about this product. What did you like? What could be improved?"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 resize-none"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    {submittingReview ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                        <span>Posting Review...</span>
                      </div>
                    ) : (
                      "Post Review"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Reviews ({reviews.length})
                </h2>
                {reviews.length > 0 && (
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <span className="text-lg">★</span>
                    <span className="font-semibold text-gray-700">
                      {(
                        reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / reviews.length
                      ).toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💬</span>
                  </div>
                  <p className="text-gray-600">
                    No reviews yet. Be the first to review!
                  </p>
                </div>
              ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="border-b border-gray-200 pb-6 last:border-b-0"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={
                            review.reviewerImage ||
                            "https://www.w3schools.com/w3images/avatar2.png"
                          }
                          alt={review.reviewerName}
                          className="w-12 h-12 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {review.reviewerName}
                            </h4>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={`text-lg ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-2 leading-relaxed">
                            {review.description}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
