import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionService, categoryService, productService, offerService, adminService, authService } from '../services';
import toast from 'react-hot-toast';

// Categories
export const useCategories = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: categoryService.getAll,
        staleTime: 10 * 60 * 1000,
    });
};
export const useCollections = () => {
    return useQuery({
        queryKey: ['collections'],
        queryFn: collectionService.getAll,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useFeaturedCollections = () => {
    return useQuery({
        queryKey: ['collections', 'featured'],
        queryFn: collectionService.getFeatured,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCollection = (id) => {
    return useQuery({
        queryKey: ['collection', id],
        queryFn: () => collectionService.getById(id),
        enabled: !!id,
    });
};

// Products
export const useProducts = (params = {}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.getAll(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useProduct = (id) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getById(id),
        enabled: !!id,
    });
};

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['products', 'featured'],
        queryFn: productService.getFeatured,
        staleTime: 5 * 60 * 1000,
    });
};

export const useNewArrivals = () => {
    return useQuery({
        queryKey: ['products', 'new-arrivals'],
        queryFn: productService.getNewArrivals,
        staleTime: 5 * 60 * 1000,
    });
};

export const useProductsByCollection = (collectionId, params = {}) => {
    return useQuery({
        queryKey: ['products', 'collection', collectionId, params],
        queryFn: () => productService.getByCollection(collectionId, params),
        enabled: !!collectionId,
        staleTime: 2 * 60 * 1000,
    });
};

// Offers
export const useOffers = () => {
    return useQuery({
        queryKey: ['offers'],
        queryFn: offerService.getAll,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useActiveOffers = () => {
    return useQuery({
        queryKey: ['offers', 'active'],
        queryFn: offerService.getActive,
        staleTime: 10 * 60 * 1000,
    });
};

// Admin
export const useAdminStats = () => {
    return useQuery({
        queryKey: ['admin', 'stats'],
        queryFn: adminService.getStats,
        staleTime: 60 * 1000, // 1 minute
    });
};

// Auth
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            queryClient.setQueryData(['user'], data.user);
            toast.success('Login successful!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Login failed');
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authService.logout,
        onSuccess: () => {
            queryClient.clear();
            toast.success('Logged out successfully');
        },
    });
};
