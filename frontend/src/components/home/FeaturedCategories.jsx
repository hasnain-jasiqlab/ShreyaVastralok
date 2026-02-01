import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFeaturedCollections } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/helpers';
import Loader from '../common/Loader';

const FeaturedCategories = () => {
    const { data: collections, isLoading, error } = useFeaturedCollections();

    console.log('Featured Collections Data:', collections);
    console.log('Is Loading:', isLoading);
    console.log('Error:', error);

    // Fallback categories if API fails
    const fallbackCategories = [
        {
            id: 'bridal-sarees',
            name: 'Bridal Sarees',
            image: '/images/cat-bridal-saree.png',
        },
        {
            id: 'party-kurtis',
            name: 'Party Wear Kurtis',
            image: '/images/cat-party-kurti.png',
        },
        {
            id: 'kids-festival',
            name: 'Kids Festival Collection',
            image: '/images/cat-kids-festival.png',
        },
        {
            id: 'new-arrivals',
            name: 'New Arrivals',
            image: '/images/cat-new-arrivals.png',
        },
    ];

    const categoriesToShow = collections?.data || fallbackCategories;
    console.log('Categories to Show:', categoriesToShow);

    if (isLoading) {
        return (
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                            Featured Categories
                        </h2>
                        <p className="text-gray-600 font-serif italic text-lg">Curated Elegance for Every Special Moment</p>
                    </div>
                    <div className="flex justify-center">
                        <Loader size="lg" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section-padding bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                        Featured Categories
                    </h2>
                    <p className="text-gray-600 font-serif italic text-lg opacity-80">Discover Our Most Loved Premium Collections</p>
                </motion.div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {categoriesToShow.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                        >
                            <Link
                                to={`/collection?category=${category.name}`}
                                className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 bg-gray-100"
                            >
                                {/* Image Container */}
                                <div className="aspect-[3/4] overflow-hidden">
                                    <img
                                        src={collections?.data ? getImageUrl(category.image_url) : category.image}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        loading="lazy"
                                    />
                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                </div>

                                {/* Content Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-6 text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="inline-block w-8 h-0.5 bg-white/60 mb-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                                    <h3 className="text-white font-display font-bold text-2xl tracking-wide drop-shadow-md">
                                        {category.name}
                                    </h3>
                                    <div className="mt-2 text-white/0 group-hover:text-white/90 text-sm font-medium uppercase tracking-[0.2em] transition-all duration-500">
                                        Explore Now
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedCategories;
