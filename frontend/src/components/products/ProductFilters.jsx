import { useNavigate, useParams } from 'react-router-dom';
import { useCollections, useCategories } from '../../hooks/useApi';

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
    const navigate = useNavigate();
    const { id: activeCollectionId } = useParams();
    const { data: collections } = useCollections();
    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.data || [];

    // Group categories by gender from the database
    const groupedCategories = categories.reduce((acc, cat) => {
        if (!cat.gender) return acc;
        if (!acc[cat.gender]) acc[cat.gender] = [];
        acc[cat.gender].push(cat);
        return acc;
    }, {});

    const handleGenderChange = (gender) => {
        onFilterChange({
            ...filters,
            gender: filters.gender === gender ? '' : gender,
            category: '', // Reset category when gender changes
        });
    };

    const handleCategoryChange = (categorySlug) => {
        onFilterChange({
            ...filters,
            category: filters.category === categorySlug ? '' : categorySlug,
        });
    };

    const activeFilterCount = [filters.gender, filters.category].filter(Boolean).length;

    // Get categories for selected gender from our grouped data
    const availableCategories = filters.gender ? groupedCategories[filters.gender] || [] : [];

    return (
        <div className="space-y-6">
            {/* Clear Filters */}
            {activeFilterCount > 0 && (
                <button
                    onClick={onClearFilters}
                    className="w-full btn btn-outline text-sm"
                >
                    Clear All Filters ({activeFilterCount})
                </button>
            )}

            {/* Gender Filter */}
            <div>
                <h3 className="font-display font-semibold text-gray-900 mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    Shop By Gender
                </h3>
                <div className="space-y-2">
                    {Object.keys(groupedCategories).map((gender) => (
                        <label
                            key={gender}
                            className="flex items-center cursor-pointer group"
                        >
                            <input
                                type="radio"
                                checked={filters.gender === gender}
                                onChange={() => handleGenderChange(gender)}
                                className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span className={`ml-3 transition-colors ${filters.gender === gender
                                ? 'text-primary font-semibold'
                                : 'text-gray-700 group-hover:text-primary'
                                }`}>
                                {gender}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Category Filter - Shows only when gender is selected */}
            {filters.gender && availableCategories.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-display font-semibold text-gray-900 mb-3 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        {filters.gender} Categories
                    </h3>
                    <div className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
                        {availableCategories.map((cat) => (
                            <label
                                key={cat.id}
                                className="flex items-center cursor-pointer group"
                            >
                                <input
                                    type="checkbox"
                                    checked={filters.category === cat.slug}
                                    onChange={() => handleCategoryChange(cat.slug)}
                                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className={`ml-3 text-sm transition-colors ${filters.category === cat.slug
                                    ? 'text-primary font-semibold'
                                    : 'text-gray-700 group-hover:text-primary'
                                    }`}>
                                    {cat.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* API Collections (if available) */}


            {/* Help Section */}
            <div className="pt-6 border-t border-gray-200">
                <div className="bg-primary-50 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-primary-900 mb-1">
                                Need Help Finding Something?
                            </p>
                            <p className="text-xs text-primary-700">
                                Contact us on WhatsApp for personalized recommendations
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
