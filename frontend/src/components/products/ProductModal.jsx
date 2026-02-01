import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, formatPrice } from '../../utils/helpers';
import { enquireProduct } from '../../utils/whatsapp';

const ProductModal = ({ product, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!product) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Get all images - either from images array or fallback to primary_image/image
    const productImages = product.images && product.images.length > 0
        ? product.images.map(img => img.image_url)
        : [product.primary_image || product.image].filter(Boolean);

    const currentImage = productImages[currentImageIndex] || product.primary_image || product.image;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleBackdropClick}
                className="modal-overlay"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="modal-content relative"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
                        {/* Image Gallery */}
                        <div className="relative">
                            {/* Main Image */}
                            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 relative group">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        src={getImageUrl(currentImage)}
                                        alt={`${product.name} - Image ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </AnimatePresence>

                                {/* Navigation Arrows - Only show if multiple images */}
                                {productImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                                            {currentImageIndex + 1} / {productImages.length}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail Gallery - Only show if multiple images */}
                            {productImages.length > 1 && (
                                <div className="mt-4 grid grid-cols-5 gap-2">
                                    {productImages.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                                                    ? 'border-primary ring-2 ring-primary/20'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <img
                                                src={getImageUrl(img)}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {product.is_new && (
                                    <span className="badge bg-secondary text-white shadow-lg">
                                        New Arrival
                                    </span>
                                )}
                                {product.discount_percentage > 0 && (
                                    <span className="badge bg-primary text-white shadow-lg">
                                        {product.discount_percentage}% OFF
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex flex-col">
                            {/* Category & Gender */}
                            <div className="flex items-center gap-2 mb-3">
                                {product.category_name && (
                                    <span className="badge badge-secondary">
                                        {product.category_name}
                                    </span>
                                )}
                                {product.gender && (
                                    <span className="badge bg-gray-100 text-gray-700">
                                        {product.gender}
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h2 className="text-3xl font-display font-bold text-gray-900 mb-4">
                                {product.name}
                            </h2>

                            {/* Price */}
                            {product.price ? (
                                <div className="mb-6">
                                    {product.discount_percentage > 0 ? (
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-3xl font-bold text-primary">
                                                {formatPrice(product.price * (1 - product.discount_percentage / 100))}
                                            </span>
                                            <span className="text-xl text-gray-400 line-through">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="badge bg-green-100 text-green-700">
                                                Save {formatPrice(product.price * product.discount_percentage / 100)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-900">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="mb-6">
                                    <span className="text-lg text-gray-500 italic">Price on request</span>
                                </div>
                            )}

                            {/* Description */}
                            {product.description && (
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {product.description}
                                    </p>
                                </div>
                            )}

                            {/* Product Code */}
                            {product.code && (
                                <div className="mb-6">
                                    <span className="text-sm text-gray-500">
                                        Product Code: <span className="font-mono font-medium text-gray-700">{product.code}</span>
                                    </span>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-6"></div>

                            {/* Features */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Why Choose This?</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Premium Quality Material
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Perfect Fit & Comfort
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Latest Fashion Trends
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Easy Returns & Exchange
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto space-y-3">
                                <button
                                    onClick={() => enquireProduct(product)}
                                    className="w-full btn btn-whatsapp"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Enquire on WhatsApp
                                </button>
                                <p className="text-xs text-center text-gray-500">
                                    Get instant assistance and personalized recommendations
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ProductModal;
