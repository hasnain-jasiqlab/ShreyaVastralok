import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../services/api';

const ProductModal = ({ isOpen, onClose, product, categories, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        compare_at_price: '',
        sku: '',
        quantity: '0',
        gender: '',
        category_id: '',
        is_featured: false,
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                compare_at_price: product.compare_at_price || '',
                sku: product.sku || '',
                quantity: product.quantity || '0',
                gender: product.gender || '',
                category_id: product.category_id || '',
                is_featured: product.is_featured || false,
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                compare_at_price: '',
                sku: '',
                quantity: '0',
                gender: '',
                category_id: '',
                is_featured: false,
            });
        }
        setImages([]);
    }, [product, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // If gender changes, reset category_id
        if (name === 'gender') {
            setFormData(prev => ({
                ...prev,
                gender: value,
                category_id: ''
            }));
            return;
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Validate required fields
            if (!formData.name || !formData.price || !formData.gender || !formData.category_id) {
                toast.error('Please fill in all required fields');
                setLoading(false);
                return;
            }

            const dataToSave = {
                ...formData,
                price: parseFloat(formData.price),
                compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
                quantity: parseInt(formData.quantity) || 0,
                category_id: formData.category_id ? parseInt(formData.category_id) : null,
            };

            let productId = product?.id;

            // 1. Create or Update Product
            if (productId) {
                await api.patch(`/products/${productId}`, dataToSave);
                toast.success('Product updated successfully');
            } else {
                const response = await api.post('/products', dataToSave);
                productId = response.data.data.id;
                toast.success('Product created successfully');
            }

            // 2. Upload Images if any
            if (images.length > 0 && productId) {
                try {
                    const imageFormData = new FormData();
                    images.forEach(image => {
                        imageFormData.append('images', image);
                    });
                    await api.post(`/products/${productId}/images`, imageFormData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    toast.success('Images uploaded successfully');
                } catch (imageError) {
                    console.error('Error uploading images:', imageError);
                    toast.error(imageError.response?.data?.message || 'Failed to upload images. Please try uploading them separately.');
                }
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Error saving product:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save product';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Filter categories based on selected gender
    const filteredCategories = formData.gender
        ? categories.filter(cat => cat.gender === formData.gender)
        : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-display font-bold text-gray-900">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Info */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Designer Silk Saree"
                                className="input"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Tell us more about this piece..."
                                className="input"
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shop By Gender *</label>
                            <select
                                name="gender"
                                required
                                value={formData.gender}
                                onChange={handleChange}
                                className="input"
                            >
                                <option value="">Select Gender</option>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Kids">Kids</option>
                                <option value="Unisex">Unisex</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                            <select
                                name="category_id"
                                required
                                disabled={!formData.gender}
                                value={formData.category_id}
                                onChange={handleChange}
                                className={`input ${!formData.gender ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="">
                                    {!formData.gender ? 'Select Gender First' : 'Select Category'}
                                </option>
                                {filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {formData.gender && filteredCategories.length === 0 && (
                                <p className="text-[10px] text-red-500 mt-1">No categories found for this gender.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                            <input
                                type="number"
                                name="price"
                                required
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Compare at Price (₹)</label>
                            <input
                                type="number"
                                name="compare_at_price"
                                value={formData.compare_at_price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="input"
                            />
                        </div>



                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Stock Keeping Unit)</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                placeholder="e.g. saree-blk-001"
                                className="input"
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                checked={formData.is_featured}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                            />
                            <label htmlFor="is_featured" className="text-sm font-medium text-gray-700">
                                Feature this product on home page
                            </label>
                        </div>

                        {/* Images */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Product Images</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <label className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer flex flex-col items-center justify-center transition-colors group">
                                    <svg className="w-8 h-8 text-gray-400 group-hover:text-primary mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-[10px] font-medium text-gray-500 group-hover:text-primary">Add Image</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <p className="mt-2 text-xs text-gray-500">Upload high-quality images of the outfit.</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary min-w-[120px]"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </div>
                            ) : product ? 'Update Product' : 'Create Product'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default ProductModal;
