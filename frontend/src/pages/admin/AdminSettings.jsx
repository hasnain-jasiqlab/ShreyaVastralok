import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminSettings = () => {


    const [announcement, setAnnouncement] = useState({
        enabled: false,
        message: '',
        type: 'info' // info, success, warning, error
    });


    const [announcementLoading, setAnnouncementLoading] = useState(false);

    // Fetch current announcement on mount
    useEffect(() => {
        fetchAnnouncement();
    }, []);

    const fetchAnnouncement = async () => {
        try {
            const response = await api.get('/settings/announcement');
            if (response.data?.data) {
                setAnnouncement(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching announcement:', error);
        }
    };



    const handleAnnouncementChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAnnouncement({
            ...announcement,
            [name]: type === 'checkbox' ? checked : value
        });
    };



    const handleAnnouncementSubmit = async (e) => {
        e.preventDefault();
        setAnnouncementLoading(true);

        try {
            await api.post('/settings/announcement', announcement);
            toast.success('Announcement updated successfully');
        } catch (error) {
            console.error('Error updating announcement:', error);
            toast.error('Failed to update announcement');
        } finally {
            setAnnouncementLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mb-2">
                    Store Settings
                </h1>
                <p className="text-gray-600">Configure your store's announcement banner</p>
            </div>

            {/* Announcement Banner Settings */}
            <form onSubmit={handleAnnouncementSubmit}>
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-display font-semibold text-gray-900">
                                Announcement Banner
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Display a custom message at the top of your website
                            </p>
                        </div>
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="enabled"
                                checked={announcement.enabled}
                                onChange={handleAnnouncementChange}
                                className="sr-only peer"
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700">
                                {announcement.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </label>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Banner Type
                            </label>
                            <select
                                name="type"
                                value={announcement.type}
                                onChange={handleAnnouncementChange}
                                className="input"
                            >
                                <option value="info">Info (Blue)</option>
                                <option value="success">Success (Green)</option>
                                <option value="warning">Warning (Yellow)</option>
                                <option value="error">Error (Red)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={announcement.message}
                                onChange={handleAnnouncementChange}
                                placeholder="e.g., 🎉 Special Diwali Sale! Get 20% OFF on all products. Use code: DIWALI20"
                                className="input h-24"
                                maxLength={200}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {announcement.message.length}/200 characters
                            </p>
                        </div>

                        {/* Preview */}
                        {announcement.message && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preview
                                </label>
                                <div className={`p-3 rounded-lg text-sm text-center ${announcement.type === 'info' ? 'bg-blue-50 text-blue-800' :
                                    announcement.type === 'success' ? 'bg-green-50 text-green-800' :
                                        announcement.type === 'warning' ? 'bg-yellow-50 text-yellow-800' :
                                            'bg-red-50 text-red-800'
                                    }`}>
                                    {announcement.message}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            type="submit"
                            disabled={announcementLoading}
                            className="btn btn-primary px-6"
                        >
                            {announcementLoading ? 'Saving...' : 'Save Announcement'}
                        </button>
                    </div>
                </div>
            </form>

        </div>
    );
};

export default AdminSettings;

