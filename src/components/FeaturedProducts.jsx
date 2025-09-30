import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:3000";

const FeaturedProducts = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [upvoting, setUpvoting] = useState({});
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const response = await fetch(`${API_BASE}/products/featured`);
            if (response.ok) {
                const data = await response.json();
                setFeaturedProducts(data);
            } else {
                toast.error('Failed to load featured products');
            }
        } catch (error) {
            console.error('Error fetching featured products:', error);
            toast.error('Failed to load featured products');
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
                setFeaturedProducts(prev => 
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
            <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-gray-600 text-lg">Discover hand-picked amazing products</p>
                    </div>
                    <div className="flex items-center justify-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (featuredProducts.length === 0) {
        return (
            <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-gray-600 text-lg">Discover hand-picked amazing products</p>
                    </div>
                    <div className="text-center py-12 bg-white rounded-3xl shadow-xl">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">⭐</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Featured Products Yet</h3>
                        <p className="text-gray-600">Check back later for featured product updates</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-purple-50/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
                        <span>⭐</span>
                        <span>Featured Collection</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover hand-picked amazing products that are making waves in the tech community
                    </p>
                </div>

                {/* Featured Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featuredProducts.map((product) => {
                        const canUpvote = user && user.email !== product.owner.email;
                        const isUpvoting = upvoting[product._id];

                        return (
                            <div 
                                key={product._id} 
                                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
                            >
                                {/* Product Image */}
                                <div className="relative overflow-hidden bg-gray-50">
                                    <div className="aspect-w-16 aspect-h-10">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Product+Image';
                                            }}
                                        />
                                    </div>
                                    {/* Featured Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                            ⭐ Featured
                                        </span>
                                    </div>
                                </div>

                                {/* Product Content */}
                                <div className="p-6">
                                    {/* Product Name */}
                                    <Link 
                                        to={`/product/${product._id}`}
                                        className="block mb-3 group-hover:text-purple-600 transition-colors duration-300"
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-purple-600">
                                            {product.name}
                                        </h3>
                                    </Link>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {product.tags?.slice(0, 2).map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium"
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

                                        {/* Upvote Button */}
                                        <button
                                            onClick={() => handleUpvote(product._id, product.owner.email)}
                                            disabled={isUpvoting || !canUpvote}
                                            className={`flex items-center space-x-2 px-3 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                                                canUpvote
                                                    ? 'bg-purple-500 hover:bg-purple-600 text-white shadow-lg shadow-purple-500/25'
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
                                                    <span className="text-sm font-bold">{product.votes || 0}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Hover Effect Border */}
                                <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500 rounded-3xl transition-all duration-300 pointer-events-none"></div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Products CTA */}
                <div className="text-center mt-12">
                    <Link
                        to="/products"
                        className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold rounded-2xl shadow-lg shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                    >
                        <span>View All Products</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;