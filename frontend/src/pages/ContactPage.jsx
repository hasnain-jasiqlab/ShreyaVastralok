import { useState } from 'react';
import { motion } from 'framer-motion';
import { sendGeneralEnquiry } from '../utils/whatsapp';
import toast from 'react-hot-toast';
import AnnouncementBanner from '../components/common/AnnouncementBanner';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.message) {
            toast.error('Please fill all fields');
            return;
        }

        const message = `Hi! I'm ${formData.name}\nPhone: ${formData.phone}\n\nMessage: ${formData.message}`;
        sendGeneralEnquiry(message);

        setFormData({ name: '', phone: '', message: '' });
        toast.success('Redirecting to WhatsApp...');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const contactInfo = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            title: 'Visit Us',
            details: ['Shreya Vastralok', 'Satbarwa, Palmu, Jharkhand', 'India'],
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
            ),
            title: 'Call Us',
            details: ['+91 72057 54025', 'Mon-Sat: 10AM - 8PM'],
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            title: 'Email Us',
            details: ['info@shreyavastralok.com', 'support@shreyavastralok.com', 'We reply within 24 hours'],
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Page Header Banner */}
            <div className="relative bg-gradient-to-r from-primary to-secondary overflow-hidden">
                <div className="relative w-full h-64 md:h-80 lg:h-[450px]">
                    <img
                        src="/images/contact-red-textured.png"
                        alt="Contact Shreya Vastralok"
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay for Header Visibility */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>
            </div>

            <AnnouncementBanner />

            <div className="container-custom py-12 md:py-16">
                {/* Contact Cards */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="card p-6 text-center"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-4">
                                {info.icon}
                            </div>
                            <h3 className="font-display font-semibold text-lg text-gray-900 mb-3">
                                {info.title}
                            </h3>
                            <div className="space-y-1">
                                {info.details.map((detail, idx) => (
                                    <p key={idx} className="text-gray-600 text-sm">
                                        {detail}
                                    </p>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="card p-8">
                            <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                                Send us a Message
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="+91 72057 54025"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="input resize-none"
                                        placeholder="How can we help you?"
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="w-full btn btn-whatsapp">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                    Send via WhatsApp
                                </button>
                                <p className="text-xs text-center text-gray-500">
                                    Your message will open in WhatsApp for instant communication
                                </p>
                            </form>
                        </div>
                    </motion.div>

                    {/* Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="card overflow-hidden h-full min-h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.9210914!2d84.2559848!3d23.9210914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398b83000b4d59f3%3A0xcee2ebdd49be157f!2sShreya%20Vastralok!5e0!3m2!1sen!2sin!4v1706702400000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Shreya Vastralok Location"
                            ></iframe>
                        </div>
                    </motion.div>
                </div>

                {/* Business Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 card p-8"
                >
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 text-center">
                        Business Hours
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="font-medium text-gray-900">Monday - Friday</span>
                            <span className="text-gray-600">10:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="font-medium text-gray-900">Saturday</span>
                            <span className="text-gray-600">10:00 AM - 9:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="font-medium text-gray-900">Sunday</span>
                            <span className="text-gray-600">11:00 AM - 7:00 PM</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                            <span className="font-medium text-gray-900">WhatsApp Support</span>
                            <span className="text-primary font-medium">24/7 Available</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;
