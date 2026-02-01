import api from './api';
import { endpoints } from '../config/config';

export const categoryService = {
    getAll: async () => {
        const response = await api.get('/categories');
        return response.data;
    },
};

export const collectionService = {
    // Get all collections
    getAll: async () => {
        const response = await api.get(endpoints.collections);
        return response.data;
    },

    // Get collection by ID
    getById: async (id) => {
        const response = await api.get(endpoints.collectionById(id));
        return response.data;
    },

    // Get featured collections
    getFeatured: async () => {
        const response = await api.get(`${endpoints.collections}/featured`);
        return response.data;
    },
};

export const productService = {
    // Get all products with filters
    getAll: async (params = {}) => {
        const response = await api.get(endpoints.products, { params });
        return response.data;
    },

    // Get product by ID
    getById: async (id) => {
        const response = await api.get(endpoints.productById(id));
        return response.data;
    },

    // Get products by collection
    getByCollection: async (collectionId, params = {}) => {
        const response = await api.get(endpoints.productsByCollection(collectionId), { params });
        return response.data;
    },

    // Get featured products
    getFeatured: async () => {
        const response = await api.get(endpoints.featuredProducts);
        return response.data;
    },

    // Get new arrivals
    getNewArrivals: async () => {
        const response = await api.get(endpoints.newArrivals);
        return response.data;
    },
};

export const offerService = {
    // Get all offers
    getAll: async () => {
        const response = await api.get(endpoints.offers);
        return response.data;
    },

    // Get active offers
    getActive: async () => {
        const response = await api.get(endpoints.activeOffers);
        return response.data;
    },
};

export const adminService = {
    // Get dashboard stats
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },
};

export const authService = {
    // Login
    login: async (credentials) => {
        const response = await api.post(endpoints.login, credentials);
        const { token, data } = response.data;
        if (token && data?.user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(data.user));
        }
        return response.data;
    },

    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};
