import { useState } from 'react';
import { motion } from 'framer-motion';
import { useOffers } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminOffers = () => {
    const { data: offersData, isLoading, refetch } = useOffers();
    const offers = offersData?.data || [];

    const handleToggleActive = async (offer) => {
        try {
            await api.patch(`/offers/${offer.id}`, { is_active: !offer.is_active });
            toast.success(`Offer ${!offer.is_active ? 'activated' : 'deactivated'} successfully`);
            refetch();
        } catch (error) {
            toast.error('Failed to update offer status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this offer?')) return;
        try {
            await api.delete(`/offers/${id}`);
            toast.success('Offer deleted successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to delete offer');
        }
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                        Offers & Promotions
                    </h1>
                    <p className="text-gray-600">Manage your store's promotional banners and discounts</p>
                </div>
                <button className="btn btn-primary">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Offer
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="card h-64 animate-pulse bg-gray-50"></div>
                    ))
                ) : offers.length === 0 ? (
                    <div className="col-span-full card p-12 text-center text-gray-500">
                        No offers found. Create your first promotion!
                    </div>
                ) : (
                    offers.map((offer) => (
                        <motion.div
                            key={offer.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card overflow-hidden group"
                        >
                            <div className="relative h-40 bg-gray-100">
                                {offer.image_url ? (
                                    <img
                                        src={getImageUrl(offer.image_url)}
                                        alt={offer.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => handleToggleActive(offer)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md shadow-sm transition-all ${offer.is_active
                                                ? 'bg-green-500/80 text-white hover:bg-green-600'
                                                : 'bg-gray-500/80 text-white hover:bg-gray-600'
                                            }`}
                                    >
                                        {offer.is_active ? 'Active' : 'Paused'}
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-display font-semibold text-gray-900 mb-1">{offer.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{offer.description}</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-400 capitalize">
                                        Applied to: All Products
                                    </span>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(offer.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminOffers;
