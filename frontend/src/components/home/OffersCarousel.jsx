import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveOffers } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/helpers';

const OffersCarousel = () => {
    const { data: offers, isLoading } = useActiveOffers();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (isLoading || !offers?.data?.length) {
        return null;
    }

    const offersData = offers.data;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % offersData.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + offersData.length) % offersData.length);
    };

    return (
        <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="badge bg-secondary text-white mb-4">Limited Time</span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                        Special Offers
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Don't miss out on our exclusive deals and discounts
                    </p>
                </motion.div>

                <div className="relative max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            transition={{ duration: 0.3 }}
                            className="card overflow-hidden"
                        >
                            <div className="grid md:grid-cols-2">
                                {/* Image */}
                                {offersData[currentIndex].image && (
                                    <div className="aspect-square md:aspect-auto">
                                        <img
                                            src={getImageUrl(offersData[currentIndex].image)}
                                            alt={offersData[currentIndex].title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-8 flex flex-col justify-center">
                                    <div className="badge badge-primary mb-4 inline-block">
                                        {offersData[currentIndex].discount_percentage}% OFF
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-4">
                                        {offersData[currentIndex].title}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {offersData[currentIndex].description}
                                    </p>
                                    {offersData[currentIndex].code && (
                                        <div className="bg-gray-100 rounded-lg p-4 mb-6">
                                            <div className="text-sm text-gray-600 mb-1">Use Code:</div>
                                            <div className="font-mono font-bold text-lg text-primary">
                                                {offersData[currentIndex].code}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation */}
                    {offersData.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Dots */}
                            <div className="flex justify-center mt-6 space-x-2">
                                {offersData.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                                ? 'bg-primary w-8'
                                                : 'bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default OffersCarousel;
