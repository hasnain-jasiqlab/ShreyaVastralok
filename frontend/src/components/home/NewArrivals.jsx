import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNewArrivals } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/helpers';

const NewArrivals = () => {
    const { data: products, isLoading, error } = useNewArrivals();

    // Fallback products with clothing images
    const fallbackProducts = [
        {
            id: 1,
            name: 'Women\'s Designer Saree',
            image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop',
            category: 'Women',
        },
        {
            id: 2,
            name: 'Men\'s Kurta Set',
            image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=400&h=300&fit=crop',
            category: 'Men',
        },
        {
            id: 3,
            name: 'Kids Traditional Wear',
            image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=300&fit=crop',
            category: 'Kids',
        },
    ];

    const productsToShow = products?.data?.slice(0, 3) || fallbackProducts;

    if (isLoading) {
        return null;
    }

    return (
        <section className="section-padding bg-gray-50">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                        New Arrivals
                    </h2>
                    <p className="text-gray-600 mt-2 font-serif italic text-lg">
                        Latest collection for Women, Men & Kids
                    </p>
                </motion.div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {productsToShow.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                                {/* Image */}
                                <div className="aspect-[4/3] overflow-hidden relative">
                                    <img
                                        src={products?.data ? getImageUrl(product.primary_image || product.image) : product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />

                                    {/* Category Badge */}
                                    {(product.category || product.gender) && (
                                        <div className="absolute top-3 left-3">
                                            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                                                {product.category || product.gender}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 text-center">
                                        {product.name}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
