import { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts, useCategories } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/helpers';
import toast from 'react-hot-toast';
import api from '../../services/api';
import ProductModal from '../../components/admin/ProductModal';

const AdminProducts = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Fetch products with showInactive=true for admin
    const { data: productsData, isLoading: productsLoading, refetch } = useProducts({
        search: searchTerm,
        gender: selectedGender,
        category: selectedCategory,
        showInactive: 'true'
    });

    const { data: categoriesData } = useCategories();
    const categories = categoriesData?.data || [];
    const products = productsData?.data || [];

    // Filter categories based on selected gender for the filter dropdown
    const filteredCategories = selectedGender
        ? categories.filter(cat => cat.gender === selectedGender)
        : categories;

    const handleToggleActive = async (product) => {
        try {
            await api.patch(`/products/${product.id}`, { is_active: !product.is_active });
            toast.success(`Product ${!product.is_active ? 'activated' : 'deactivated'} successfully`);
            refetch();
        } catch (error) {
            toast.error('Failed to update product status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success('Product deleted successfully');
            refetch();
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const handleAddClick = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleGenderChange = (e) => {
        setSelectedGender(e.target.value);
        setSelectedCategory(''); // Reset category when gender changes
    };

    return (
        <div>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                        Products
                    </h1>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="btn btn-primary self-start md:self-auto"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Product
                </button>
            </div>

            {/* Filters */}
            <div className="card p-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="input pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        className="input"
                        value={selectedGender}
                        onChange={handleGenderChange}
                    >
                        <option value="">All Genders</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                        <option value="Unisex">Unisex</option>
                    </select>
                    <select
                        className="input"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {filteredCategories.map(cat => (
                            <option key={cat.id} value={cat.slug}>
                                {selectedGender ? cat.name : `${cat.name} (${cat.gender})`}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products List */}
            {productsLoading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="card p-12 text-center text-gray-500">
                    No products found.
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Product</th>
                                        <th className="px-6 py-3 font-semibold">Category</th>
                                        <th className="px-6 py-3 font-semibold">Price</th>
                                        <th className="px-6 py-3 font-semibold">Stock</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                                        {product.primary_image ? (
                                                            <img
                                                                src={getImageUrl(product.primary_image)}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/48';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 text-sm">{product.name.substring(0, 30)}{product.name.length > 30 && '...'}</div>
                                                        <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="badge badge-secondary text-xs uppercase tracking-wider">
                                                    {product.category_name || 'Uncategorized'}
                                                </span>
                                                {product.gender && (
                                                    <div className="text-[10px] text-gray-400 mt-1">
                                                        Target: {product.gender}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ₹{parseFloat(product.price).toLocaleString()}
                                                </div>
                                                {product.compare_at_price && (
                                                    <div className="text-xs text-gray-400 line-through">
                                                        ₹{parseFloat(product.compare_at_price).toLocaleString()}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`text-sm font-medium ${product.quantity < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                                                    {product.quantity} units
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleActive(product)}
                                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${product.is_active
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {product.is_active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditClick(product)}
                                                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                                                        title="Edit Product"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                        title="Delete Product"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {products.map((product) => (
                            <div key={product.id} className="card p-4">
                                <div className="flex gap-4">
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                                        {product.primary_image ? (
                                            <img
                                                src={getImageUrl(product.primary_image)}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/96';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
                                                <div className="text-xs text-gray-500 mt-1">SKU: {product.sku || 'N/A'}</div>
                                            </div>

                                        </div>

                                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                                            <span className="badge badge-secondary text-xs">
                                                {product.category_name}
                                            </span>
                                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {product.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <div className="mt-3 flex items-end justify-between">
                                            <div>
                                                <div className="font-bold text-gray-900">
                                                    ₹{parseFloat(product.price).toLocaleString()}
                                                </div>
                                                <div className={`text-xs font-medium mt-1 ${product.quantity < 10 ? 'text-red-500' : 'text-gray-600'}`}>
                                                    Stock: {product.quantity} units
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile Actions */}
                                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                                    <button
                                        onClick={() => handleToggleActive(product)}
                                        className="flex-1 btn btn-outline py-2 text-xs"
                                    >
                                        {product.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(product)}
                                        className="flex-1 btn btn-secondary py-2 text-xs flex items-center justify-center gap-1"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 00-2 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="btn bg-red-50 text-red-600 hover:bg-red-100 py-2 px-3 border-none flex items-center justify-center"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={editingProduct}
                categories={categories}
                onSave={refetch}
            />
        </div>
    );
};

export default AdminProducts;

