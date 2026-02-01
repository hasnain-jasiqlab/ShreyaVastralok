import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { getImageUrl } from '../../utils/helpers';

const CollectionFormModal = ({ collection, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        is_active: true,
        image: null
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isExistingImage, setIsExistingImage] = useState(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (collection) {
            setFormData({
                name: collection.name || '',
                description: collection.description || '',
                is_active: collection.is_active ?? true,
                image: null
            });
            if (collection.image_url) {
                setImagePreview(collection.image_url);
                setIsExistingImage(true);
            }
        }
    }, [collection]);

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (collection) {
                // Update existing collection
                const response = await api.patch(`/collections/${collection.id}`, {
                    name: data.name,
                    description: data.description,
                    is_active: data.is_active
                });

                // Upload image if provided
                if (data.image) {
                    const formData = new FormData();
                    formData.append('image', data.image);
                    await api.post(`/collections/${collection.id}/image`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                }

                return response.data;
            } else {
                // Create new collection
                const response = await api.post('/collections', {
                    name: data.name,
                    description: data.description,
                    is_active: data.is_active
                });

                // Upload image if provided
                if (data.image) {
                    try {
                        const formData = new FormData();
                        formData.append('image', data.image);
                        await api.post(`/collections/${response.data.data.id}/image`, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                        });
                    } catch (error) {
                        // If image upload fails, delete the created collection to prevent duplicates and 409 errors
                        await api.delete(`/collections/${response.data.data.id}`);
                        throw error;
                    }
                }

                return response.data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-collections']);
            queryClient.invalidateQueries(['featured-collections']);
            toast.success(collection ? 'Collection updated successfully' : 'Collection created successfully');
            onClose();
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to save collection');
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setIsExistingImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-display font-bold text-gray-900">
                        {collection ? 'Edit Collection' : 'Create Collection'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Collection Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Collection Name *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="input"
                            placeholder="e.g., Bridal Sarees, Party Wear"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="input h-24"
                            placeholder="Brief description of this collection..."
                        />
                    </div>

                    {/* Collection Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Collection Image
                        </label>
                        <div className="flex items-start gap-4">
                            {imagePreview && (
                                <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100">
                                    <img
                                        src={isExistingImage ? getImageUrl(imagePreview) : imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="input"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Recommended: 800x600px, JPG or PNG
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Active (visible to customers)
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={mutation.isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? 'Saving...' : (collection ? 'Update Collection' : 'Create Collection')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectionFormModal;
