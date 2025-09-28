import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    const slides = [
        {
            id: 1,
            title: "Welcome to StackSphere",
            subtitle: "Where Innovation Meets Collaboration",
            description: "Join thousands of developers building amazing projects together. Share knowledge, collaborate in real-time, and grow your skills.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            buttonText: "Get Started",
            buttonLink: "/register",
            overlay: "bg-black/25"
        },
        {
            id: 2,
            title: "Build Amazing Projects",
            subtitle: "Powerful Tools for Developers",
            description: "Access our comprehensive suite of development tools, cloud services, and collaborative features designed to supercharge your workflow.",
            image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
            buttonText: "Explore Products",
            buttonLink: "/products",
            overlay: "bg-gray-900/35"
        },
        {
            id: 3,
            title: "Join Our Community",
            subtitle: "Learn, Share, and Grow Together",
            description: "Connect with like-minded developers, participate in coding challenges, and get expert guidance from our thriving community.",
            image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            buttonText: "Join Community",
            buttonLink: "/register",
            overlay: "bg-black/30"
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setIsVisible(true);
            }, 500);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setIsVisible(true);
        }, 300);
    };

    const prevSlide = () => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setIsVisible(true);
        }, 300);
    };

    const goToSlide = (index) => {
        setIsVisible(false);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsVisible(true);
        }, 300);
    };

    return (
        <div className="relative h-[85vh] overflow-hidden">
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    {/* Background Image Container with Shadow */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 shadow-2xl"
                            style={{ 
                                backgroundImage: `url(${slide.image})`,
                                transform: 'scale(1.1)',
                                filter: 'brightness(0.9) contrast(1.1)'
                            }}
                        />
                        {/* Enhanced Shadow Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
                        <div className="absolute inset-0 shadow-inner" />
                    </div>
                    
                    {/* Textured Overlay for Better Contrast */}
                    <div className={`absolute inset-0 ${slide.overlay} backdrop-blur-[2px]`} />
                    
                    {/* Subtle Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
                    
                    {/* Additional Vignette Effect */}
                    <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]" />
                </div>
            ))}

            {/* Content Container */}
            <div className={`relative z-10 flex items-center justify-center h-full transition-all duration-700 ${
                isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
            }`}>
                <div className="text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mt-12">
                    {/* Main Title with Strong Shadow and Glow */}
                    <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black mb-4 animate-float drop-shadow-2xl">
                        {slides[currentSlide].title}
                        {/* Text Shadow Effect */}
                        <div className="absolute inset-0 text-3xl sm:text-4xl lg:text-6xl font-black bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent blur-sm -z-10">
                            {slides[currentSlide].title}
                        </div>
                    </h1>

                    {/* Subtitle with Border Effect */}
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-6 text-white relative inline-block drop-shadow-lg">
                        {slides[currentSlide].subtitle}
                        <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-transparent rounded-lg blur-sm -z-10"></div>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-transparent to-white/10 rounded-lg blur-[2px] -z-10"></div>
                    </h2>

                    {/* Description with Card-like Background */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-2xl transform -skew-y-1 scale-105 -z-10 shadow-xl"></div>
                        <p className="text-base sm:text-lg lg:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed p-6 relative drop-shadow-md">
                            {slides[currentSlide].description}
                            {/* Shine Effect */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 -z-10"></div>
                        </p>
                    </div>

                    {/* CTA Button with 3D Effect */}
                    <div className="relative inline-block transform hover:scale-105 transition-transform duration-300">
                        <Link
                            to={slides[currentSlide].buttonLink}
                            className="relative inline-block bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-base shadow-2xl hover:shadow-3xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 group drop-shadow-2xl"
                        >
                            {slides[currentSlide].buttonText}
                            
                            {/* Button Shine Effect */}
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            
                            {/* Button Shadow */}
                            <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md -z-10 transform translate-y-2 scale-95"></div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows with Glass Effect */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                aria-label="Previous slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl backdrop-blur-md border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl"
                aria-label="Next slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators with Glow */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative w-3 h-3 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 ${
                            index === currentSlide 
                                ? 'bg-white scale-125 shadow-lg shadow-white/50' 
                                : 'bg-white/40 hover:bg-white/60 hover:scale-110'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        {index === currentSlide && (
                            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-75"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Enhanced Scroll Down Indicator
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
                <div className="text-white text-center animate-bounce-slow">
                    <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20 shadow-lg">
                        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                    <span className="text-xs font-medium mt-1 block bg-black/20 backdrop-blur-sm rounded-full px-2 py-1 border border-white/10 shadow-md">Scroll Down</span>
                </div>
            </div> */}

            {/* Custom CSS for Enhanced Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-8px); }
                }
                @keyframes bounce-slow {
                    0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
                    40% { transform: translateY(-8px) translateX(-50%); }
                    60% { transform: translateY(-4px) translateX(-50%); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s infinite;
                }
                .shadow-3xl {
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
            `}</style>
        </div>
    );
};

export default Banner;