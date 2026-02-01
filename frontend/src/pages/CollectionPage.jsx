import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProducts, useProductsByCollection, useCategories, useCollection } from '../hooks/useApi';
import ProductCard from '../components/products/ProductCard';
import ProductFilters from '../components/products/ProductFilters';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import { scrollToTop, getImageUrl } from '../utils/helpers';
import AnnouncementBanner from '../components/common/AnnouncementBanner';

const CollectionPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        gender: searchParams.get('gender') || '',
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || 'newest',
    });

    // Use appropriate hook based on whether we have a collection ID
    const { data, isLoading, error } = id
        ? useProductsByCollection(id, filters)
        : useProducts(filters);

    // Fetch specific collection details if ID exists
    const { data: collectionData } = useCollection(id);
    const currentCollection = collectionData?.data;

    useEffect(() => {
        scrollToTop();
    }, [id, filters]);

    // ... (rest of filtering logic, categories, activeFilterCount, getCategoryName - keeping existing)

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setShowFilters(false);
    };

    const clearFilters = () => {
        setFilters({
            gender: '',
            category: '',
            sort: 'newest',
        });
    };

    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.data || [];
    const activeFilterCount = [filters.gender, filters.category].filter(Boolean).length;

    const getCategoryName = (slug) => {
        const cat = categories.find(c => c.slug === slug);
        return cat ? cat.name : slug;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header with Banner */}
            <div className="relative bg-gradient-to-r from-primary to-secondary overflow-hidden">
                {/* Background Image */}
                <div className="relative w-full h-64 md:h-80 lg:h-[400px]">
                    <img
                        src={currentCollection?.image_url ? getImageUrl(currentCollection.image_url) : "/images/collection-full-family.png"}
                        alt={currentCollection?.name || "Shreya Vastralok Collection"}
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-center text-white p-4">
                            <h1 className="text-3xl md:text-5xl font-display font-bold mb-4">
                                {currentCollection ? currentCollection.name : 'Our Collections'}
                            </h1>
                            {currentCollection?.description ? (
                                <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                                    {currentCollection.description}
                                </p>
                            ) : (
                                <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                                    Discover the latest trends in fashion for the whole family
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AnnouncementBanner />

            <div className="container-custom py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Filters Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24">
                            <ProductFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Bar */}
                        <div className="lg:hidden mb-6 flex items-center justify-between">
                            <button
                                onClick={() => setShowFilters(true)}
                                className="btn btn-outline flex-1 mr-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                </svg>
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Active Filters */}
                        {activeFilterCount > 0 && (
                            <div className="mb-6 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-600">Active Filters:</span>
                                {filters.gender && (
                                    <span className="filter-chip filter-chip-active">
                                        {filters.gender}
                                        <button
                                            onClick={() => setFilters({ ...filters, gender: '' })}
                                            className="ml-2"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {filters.category && (
                                    <span className="filter-chip filter-chip-active">
                                        {getCategoryName(filters.category)}
                                        <button
                                            onClick={() => setFilters({ ...filters, category: '' })}
                                            className="ml-2"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-primary hover:underline"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}

                        {/* Results Count & Sort */}
                        <div className="mb-6 flex items-center justify-between border-b pb-4">
                            <div className="text-sm text-gray-600 font-serif italic">
                                {!isLoading && data?.data && (
                                    <span>{data.data.length} products found in our latest collection</span>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-medium uppercase tracking-wider text-gray-400">Sort By:</span>
                                <select
                                    value={filters.sort}
                                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                                    className="bg-transparent border-none text-sm font-semibold text-gray-900 focus:ring-0 cursor-pointer"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="name-asc">Name: A to Z</option>
                                    <option value="name-desc">Name: Z to A</option>
                                </select>
                            </div>
                        </div>

                        {/* Products Grid */}
                        {isLoading ? (
                            <SkeletonGrid count={8} />
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Failed to load products. Please try again.</p>
                            </div>
                        ) : data?.data?.length === 0 ? (
                            <div className="text-center py-12">
                                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-gray-500 mb-4">No products found matching your filters</p>
                                <button onClick={clearFilters} className="btn btn-primary">
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {data.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filter Modal */}
            {showFilters && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
                    <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-display font-semibold text-lg">Filters</h3>
                            <button
                                onClick={() => setShowFilters(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <ProductFilters
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                onClearFilters={clearFilters}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CollectionPage;
