import { useState, useEffect } from 'react';
import api from '../../services/api';

const AnnouncementBanner = () => {
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnnouncement();
    }, []);

    const fetchAnnouncement = async () => {
        try {
            console.log('Fetching announcement...');
            const response = await api.get('/settings/announcement');
            console.log('Announcement response:', response.data);
            const data = response.data?.data;

            if (data && data.enabled && data.message) {
                console.log('Setting announcement:', data);
                setAnnouncement(data);
            } else {
                console.log('Announcement not enabled or no message:', data);
            }
        } catch (error) {
            console.error('Error fetching announcement:', error);
        } finally {
            setLoading(false);
        }
    };

    // Don't render anything while loading
    if (loading) {
        return null;
    }

    // Don't show if no announcement, not enabled
    if (!announcement || !announcement.enabled || !announcement.message) {
        console.log('Not showing banner:', { announcement });
        return null;
    }

    const getBannerStyles = () => {
        switch (announcement.type) {
            case 'success':
                return 'bg-green-600 text-white';
            case 'warning':
                return 'bg-yellow-500 text-gray-900';
            case 'error':
                return 'bg-red-600 text-white';
            default: // info
                return 'bg-blue-600 text-white';
        }
    };

    console.log('Rendering announcement banner:', announcement);

    return (
        <div className={`${getBannerStyles()} relative overflow-hidden`}>
            <div className="py-3">
                <div className="marquee-container" style={{ overflow: 'hidden', width: '100%' }}>
                    <div
                        className="marquee-content"
                        style={{
                            display: 'flex',
                            animation: 'marquee 20s linear infinite'
                        }}
                    >
                        <span className="text-sm md:text-base font-medium whitespace-nowrap px-8">
                            {announcement.message}
                        </span>
                        <span className="text-sm md:text-base font-medium whitespace-nowrap px-8">
                            {announcement.message}
                        </span>
                        <span className="text-sm md:text-base font-medium whitespace-nowrap px-8">
                            {announcement.message}
                        </span>
                        <span className="text-sm md:text-base font-medium whitespace-nowrap px-8">
                            {announcement.message}
                        </span>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                
                .marquee-content:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default AnnouncementBanner;
