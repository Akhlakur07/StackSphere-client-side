import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:3000";

const TrendingProducts = () => {
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upvoting, setUpvoting] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTrendingProducts();
    }, []);

    const fetchTrendingProducts = async () => {
        try {
            const response = await fetch(`${API_BASE}/products/trending`);
            if (response.ok) {
                const data = await response.json();
                setTrendingProducts(data);
            } else {
                toast.error('Failed to load trending products');
            }
        } catch (error) {
            console.error('Error fetching trending products:', error);
            toast.error('Failed to load trending products');
        } finally {
            setLoading(false);
        }
    };

    const handleUpvote = async (productId, productOwnerEmail) => {
        if (!user) {
            toast.info('Please login to upvote products');
            navigate('/login');
            return;
        }

        if (productOwnerEmail === user.email) {
            toast.info("You can't upvote your own product");
            return;
        }

        setUpvoting(prev => ({ ...prev, [productId]: true }));

        try {
            const response = await fetch(`${API_BASE}/products/${productId}/upvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: user.email }),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                setTrendingProducts(prev => 
                    prev.map(product => 
                        product._id === productId ? updatedProduct : product
                    )
                );
                toast.success('Upvoted successfully!');
            } else {
                const error = await response.json();
                toast.error(error.message || 'Failed to upvote');
            }
        } catch (error) {
            console.error('Error upvoting:', error);
            toast.error('Failed to upvote');
        } finally {
            setUpvoting(prev => ({ ...prev, [productId]: false }));
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-br from-white to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Products</h2>
                        <p className="text-gray-600 text-lg">See what's popular in the community</p>
                    </div>
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (trendingProducts.length === 0) {
        return (
            <section className="py-16 bg-gradient-to-br from-white to-blue-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Products</h2>
                        <p className="text-gray-600 text-lg">See what's popular in the community</p>
                    </div>
                    <div className="text-center py-12 bg-white rounded-3xl shadow-xl">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">🔥</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Trending Products Yet</h3>
                        <p className="text-gray-600">Be the first to discover and upvote amazing products!</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-br from-white to-blue-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                        <span>🔥</span>
                        <span>Community Favorites</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Products</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover the most loved products in our community, sorted by popularity
                    </p>
                </div>

                {/* Trending Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {trendingProducts.map((product, index) => {
                        const canUpvote = user && user.email !== product.owner.email;
                        const isUpvoting = upvoting[product._id];
                        const isTopProduct = index < 3; // Top 3 products get special badges

                        return (
                            <div 
                                key={product._id} 
                                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group relative"
                            >
                                {/* Ranking Badge for Top Products */}
                                {isTopProduct && (
                                    <div className={`absolute top-4 left-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                                        index === 0 ? 'bg-yellow-400' : 
                                        index === 1 ? 'bg-gray-400' : 
                                        'bg-orange-400'
                                    }`}>
                                        #{index + 1}
                                    </div>
                                )}

                                {/* Product Image */}
                                <div className="relative overflow-hidden bg-gray-50">
                                    <div className="aspect-w-16 aspect-h-10">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Product+Image';
                                            }}
                                        />
                                    </div>
                                    
                                    {/* Hot Badge for High Votes */}
                                    {product.votes >= 10 && (
                                        <div className="absolute top-4 right-4">
                                            <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                                🔥 Hot
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Content */}
                                <div className="p-6">
                                    {/* Product Name */}
                                    <Link 
                                        to={`/product/${product._id}`}
                                        className="block mb-3 group-hover:text-blue-600 transition-colors duration-300"
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-blue-600">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {product.tags?.slice(0, 2).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                        {product.tags?.length > 2 && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                                                +{product.tags.length - 2} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Product Footer */}
                                    <div className="flex items-center justify-between">
                                        {/* Owner Info */}
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={product.owner.photo || "https://www.w3schools.com/w3images/avatar2.png"}
                                                alt={product.owner.name}
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <span className="text-xs text-gray-600 truncate max-w-[80px]">
                                                {product.owner.name}
                                            </span>
                                        </div>

                                        {/* Upvote Button with Vote Count */}
                                        <div className="flex items-center space-x-3">
                                            {/* Vote Count Display */}
                                            <div className="flex items-center space-x-1 text-gray-600">
                                                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm font-bold text-gray-900">{product.votes || 0}</span>
                                            </div>

                                            {/* Upvote Button */}
                                            <button
                                                onClick={() => handleUpvote(product._id, product.owner.email)}
                                                disabled={isUpvoting || !canUpvote}
                                                className={`flex items-center space-x-1 px-3 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                                    canUpvote
                                                        ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                {isUpvoting ? (
                                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="text-xs">Vote</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-3xl transition-all duration-300 pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>

                {/* Show All Products Button */}
                <div className="text-center">
                    <Link
                        to="/products"
                        className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 transform hover:scale-105 transition-all duration-300"
                    >
                        <span>Show All Products</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingProducts;