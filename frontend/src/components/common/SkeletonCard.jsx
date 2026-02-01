const SkeletonCard = () => {
    return (
        <div className="card p-4 animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
        </div>
    );
};

export const SkeletonGrid = ({ count = 8 }) => {
    return (
        <div className="product-grid">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
};

export default SkeletonCard;
