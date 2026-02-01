import { motion } from 'framer-motion';
import { useAdminStats } from '../../hooks/useApi';
import { getImageUrl } from '../../utils/helpers';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { data: statsData, isLoading, error } = useAdminStats();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                Error loading dashboard data. Please try again later.
            </div>
        );
    }

    const { stats, recentProducts } = statsData?.data || {};

    const statCards = [
        {
            name: 'Total Products',
            value: stats?.products || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            name: 'Active Offers',
            value: stats?.offers || 0,
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                    Dashboard
                </h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card p-6"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white">
                                {stat.icon}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.name}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Products */}
                <div className="lg:col-span-2">
                    <div className="card h-full">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-lg font-display font-semibold text-gray-900">
                                Recently Added Products
                            </h2>
                            <Link to="/admin/products" className="text-sm font-medium text-primary hover:text-secondary">
                                View All
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">Product</th>
                                        <th className="px-6 py-3 font-semibold">Category</th>
                                        <th className="px-6 py-3 font-semibold">Price</th>
                                        <th className="px-6 py-3 font-semibold">Stock</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentProducts?.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                                                        {product.primary_image ? (
                                                            <img
                                                                src={getImageUrl(product.primary_image)}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/40';
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
                                                    <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="badge badge-secondary text-xs">
                                                    {product.category_name || 'Uncategorized'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                ₹{parseFloat(product.price).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {product.quantity} units
                                            </td>
                                        </tr>
                                    ))}
                                    {(!recentProducts || recentProducts.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                No products found. Start by adding one!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <div className="card p-6 h-full font-display">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Quick Actions
                        </h2>
                        <div className="space-y-4">
                            <Link to="/admin/products" className="flex items-center gap-4 p-4 rounded-xl bg-primary-50 text-primary hover:bg-primary hover:text-white transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="font-medium">Add New Product</span>
                            </Link>
                            <Link to="/admin/offers" className="flex items-center gap-4 p-4 rounded-xl bg-secondary-50 text-secondary hover:bg-secondary hover:text-white transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Create New Offer</span>
                            </Link>
                            <Link to="/admin/settings" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-200 transition-all group">
                                <div className="w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="font-medium">Store Settings</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

