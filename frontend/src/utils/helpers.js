import { config } from '../config/config';

/**
 * Get full image URL
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder-product.jpg';

    // If it's already a full URL (like Supabase public URL), return as is
    if (imagePath.startsWith('http')) return imagePath;

    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    // Check if it's a Supabase storage path
    if (cleanPath.startsWith('products/') || cleanPath.startsWith('collections/') || cleanPath.startsWith('images/')) {
        // For collections, they're stored in 'images' bucket
        if (cleanPath.startsWith('collections/')) {
            return `${config.supabaseUrl}/storage/v1/object/public/images/${cleanPath}`;
        }
        // For products, they're in 'images' bucket too
        if (cleanPath.startsWith('products/')) {
            return `${config.supabaseUrl}/storage/v1/object/public/images/${cleanPath}`;
        }
        // Direct images bucket path
        if (cleanPath.startsWith('images/')) {
            const path = cleanPath.replace('images/', '');
            return `${config.supabaseUrl}/storage/v1/object/public/images/${path}`;
        }
    }

    return `${config.imageBaseUrl}/${cleanPath}`;
};

/**
 * Format price to Indian currency
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

/**
 * Format date
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Check if image is loaded
 */
export const isImageLoaded = (img) => {
    return img.complete && img.naturalHeight !== 0;
};

/**
 * Scroll to top
 */
export const scrollToTop = (smooth = true) => {
    window.scrollTo({
        top: 0,
        behavior: smooth ? 'smooth' : 'auto',
    });
};

/**
 * Get gender icon
 */
export const getGenderIcon = (gender) => {
    const icons = {
        Men: '👔',
        Women: '👗',
        Kids: '👶',
        Unisex: '👕',
    };
    return icons[gender] || '👕';
};
