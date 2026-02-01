import { useState } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl, formatPrice } from '../../utils/helpers';
import { enquireProduct } from '../../utils/whatsapp';
import ProductModal from './ProductModal';

const ProductCard = ({ product }) => {
    const [showModal, setShowModal] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleEnquire = (e) => {
        e.stopPropagation();
        enquireProduct(product);
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                className="card card-hover overflow-hidden cursor-pointer"
                onClick={() => setShowModal(true)}
            >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {!imageLoaded && (
                        <div className="absolute inset-0 skeleton"></div>
                    )}
                    <img
                        src={getImageUrl(product.primary_image || product.image)}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                            } group-hover:scale-110`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                    />

                    {/* Badges */}
                    {product.is_new && (
                        <div className="absolute top-3 left-3">
                            <span className="badge bg-secondary text-white shadow-lg">
                                New
                            </span>
                        </div>
                    )}

                    {product.discount_percentage > 0 && (
                        <div className="absolute top-3 right-3">
                            <span className="badge bg-primary text-white shadow-lg">
                                {product.discount_percentage}% OFF
                            </span>
                        </div>
                    )}

                    {/* Multiple Images Indicator */}
                    {product.images && product.images.length > 1 && (
                        <div className="absolute bottom-3 right-3">
                            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {product.images.length}
                            </span>
                        </div>
                    )}

                    {/* Quick Action Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                        <button
                            onClick={handleEnquire}
                            className="btn btn-whatsapp transform scale-90 hover:scale-100"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Enquire
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-display font-semibold text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                    </h3>

                    {product.category_name && (
                        <p className="text-sm text-gray-500 mb-2">
                            {product.category_name}
                        </p>
                    )}

                    {product.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {product.description}
                        </p>
                    )}

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        {product.price ? (
                            <div className="flex items-center gap-2">
                                {product.discount_percentage > 0 ? (
                                    <>
                                        <span className="text-lg font-bold text-primary">
                                            {formatPrice(product.price * (1 - product.discount_percentage / 100))}
                                        </span>
                                        <span className="text-sm text-gray-400 line-through">
                                            {formatPrice(product.price)}
                                        </span>
                                    </>
                                ) : (
                                    <span className="text-lg font-bold text-gray-900">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-sm text-gray-500 italic">Price on request</span>
                        )}

                        {/* Gender Badge */}
                        {product.gender && (
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                {product.gender}
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Product Modal */}
            {showModal && (
                <ProductModal
                    product={product}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default ProductCard;
