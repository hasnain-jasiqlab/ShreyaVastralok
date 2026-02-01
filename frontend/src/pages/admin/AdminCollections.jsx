import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getImageUrl } from '../../utils/helpers';
import Loader from '../../components/common/Loader';
import CollectionFormModal from '../../components/admin/CollectionFormModal';

const AdminCollections = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCollection, setEditingCollection] = useState(null);
    const queryClient = useQueryClient();

    // Fetch collections
    const { data: collections, isLoading } = useQuery({
        queryKey: ['admin-collections'],
        queryFn: async () => {
            const response = await api.get('/collections?showInactive=true');
            return response.data.data;
        }
    });

    // Toggle featured mutation
    const toggleFeaturedMutation = useMutation({
        mutationFn: async (collectionId) => {
            const response = await api.patch(`/collections/${collectionId}/featured`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-collections']);
            queryClient.invalidateQueries(['featured-collections']);
            toast.success('Featured status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update featured status');
        }
    });

    // Delete collection mutation
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            await api.delete(`/collections/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-collections']);
            toast.success('Collection deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete collection');
        }
    });

    const handleEdit = (collection) => {
        setEditingCollection(collection);
        setIsModalOpen(true);
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            deleteMutation.mutate(id);
        }
    };

    const handleToggleFeatured = (id) => {
        toggleFeaturedMutation.mutate(id);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                        Collections
                    </h1>
                    <p className="text-gray-600">Manage your product collections and featured categories</p>
                </div>
                <button
                    onClick={() => {
                        setEditingCollection(null);
                        setIsModalOpen(true);
                    }}
                    className="btn btn-primary"
                >
                    + Add Collection
                </button>
            </div>

            {collections && collections.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <div key={collection.id} className="card overflow-hidden">
                            {/* Collection Image */}
                            <div className="aspect-video bg-gray-100 relative">
                                {collection.image_url ? (
                                    <img
                                        src={getImageUrl(collection.image_url)}
                                        alt={collection.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}

                                {/* Featured Badge */}
                                {collection.featured && (
                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        Featured
                                    </div>
                                )}

                                {/* Inactive Badge */}
                                {!collection.is_active && (
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        Inactive
                                    </div>
                                )}
                            </div>

                            {/* Collection Info */}
                            <div className="p-4">
                                <h3 className="font-display font-bold text-lg text-gray-900 mb-2">
                                    {collection.name}
                                </h3>
                                {collection.description && (
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                        {collection.description}
                                    </p>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => handleToggleFeatured(collection.id)}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${collection.featured
                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        disabled={toggleFeaturedMutation.isLoading}
                                    >
                                        <span className="flex items-center justify-center gap-1">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {collection.featured ? 'Featured' : 'Set Featured'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleEdit(collection)}
                                        className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(collection.id, collection.name)}
                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                        disabled={deleteMutation.isLoading}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="card p-12 text-center">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections yet</h3>
                    <p className="text-gray-600 mb-4">Create your first collection to organize products</p>
                    <button
                        onClick={() => {
                            setEditingCollection(null);
                            setIsModalOpen(true);
                        }}
                        className="btn btn-primary"
                    >
                        + Create Collection
                    </button>
                </div>
            )}

            {/* Collection Form Modal */}
            {isModalOpen && (
                <CollectionFormModal
                    collection={editingCollection}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingCollection(null);
                    }}
                />
            )}
        </div>
    );
};

export default AdminCollections;
