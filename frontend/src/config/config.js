const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+917205754025';

export const config = {
    apiUrl: API_BASE_URL,
    whatsappNumber: WHATSAPP_NUMBER,
    whatsappLink: `https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`,
    imageBaseUrl: import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:5000',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://wvqslazgvgeuqgqeaabu.supabase.co',
};

export const endpoints = {
    // Auth
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',

    // Collections
    collections: '/collections',
    collectionById: (id) => `/collections/${id}`,

    // Products
    products: '/products',
    productById: (id) => `/products/${id}`,
    productsByCollection: (collectionId) => `/products/collection/${collectionId}`,
    featuredProducts: '/products/featured',
    newArrivals: '/products/new-arrivals',

    // Offers
    offers: '/offers',
    activeOffers: '/offers/active',
};

export const genders = ['Men', 'Women', 'Kids', 'Unisex'];

export const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
];
