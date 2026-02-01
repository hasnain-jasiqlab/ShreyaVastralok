import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendGeneralEnquiry } from '../../utils/whatsapp';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'COLLECTIONS', path: '/collection' },
        { name: 'CONTACT', path: '/contact' },
    ];

    const isActive = (path) => location.pathname === path;
    const isTransparentPage = ['/', '/collection', '/contact'].some(path =>
        location.pathname === path || location.pathname.startsWith('/collection/')
    );

    // Handle scroll for background change
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || !isTransparentPage
                    ? 'bg-white shadow-md'
                    : 'bg-transparent'
                    }`}
            >
                <div className="container-custom">
                    <div className="flex items-center justify-between h-20 md:h-24">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2 z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${scrolled || !isTransparentPage ? 'bg-primary' : 'bg-white'
                                }`}>
                                <span className={`font-bold text-lg transition-colors ${scrolled || !isTransparentPage ? 'text-white' : 'text-primary'
                                    }`}>S</span>
                            </div>
                            <span className={`font-display font-bold text-xl transition-colors ${scrolled || !isTransparentPage ? 'text-gray-900' : 'text-white'
                                }`}>
                                Shreya Vastralok
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`font-medium text-sm tracking-wider transition-colors relative ${scrolled || !isTransparentPage
                                        ? isActive(link.path)
                                            ? 'text-primary'
                                            : 'text-gray-700 hover:text-primary'
                                        : 'text-white hover:text-white/80'
                                        }`}
                                >
                                    {link.name}
                                    {isActive(link.path) && (
                                        <motion.div
                                            layoutId="activeNav"
                                            className={`absolute -bottom-1 left-0 right-0 h-0.5 ${scrolled || !isTransparentPage ? 'bg-primary' : 'bg-white'
                                                }`}
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">

                            {/* WhatsApp Button */}
                            <button
                                onClick={() => sendGeneralEnquiry()}
                                className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${scrolled || !isTransparentPage
                                    ? 'bg-whatsapp hover:bg-whatsapp-dark text-white'
                                    : 'bg-white/90 hover:bg-white text-primary'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <span className="font-medium">WhatsApp</span>
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className={`md:hidden p-2 rounded-lg transition-colors ${scrolled || !isTransparentPage
                                    ? 'hover:bg-gray-100 text-gray-700'
                                    : 'hover:bg-white/10 text-white'
                                    }`}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Full-Screen Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-gradient-to-br from-primary to-primary-600 z-50 md:hidden"
                    >
                        <div className="h-full flex flex-col">
                            {/* Header with Logo and Close Button */}
                            <div className="container-custom py-4 flex items-center justify-between">
                                <Link
                                    to="/"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center space-x-2"
                                >
                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-primary font-bold text-sm">S</span>
                                    </div>
                                    <span className="font-display font-bold text-xl text-white">
                                        Shreya Vastralok
                                    </span>
                                </Link>

                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 text-white"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Navigation Links - Centered */}
                            <nav className="flex-1 flex flex-col items-center justify-center space-y-8 px-8">
                                {navLinks.map((link, index) => (
                                    <motion.div
                                        key={link.path}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            to={link.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`text-4xl font-display font-light text-white hover:text-white/80 transition-colors ${isActive(link.path) ? 'font-normal' : ''
                                                }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* WhatsApp Button in Menu */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: navLinks.length * 0.1 }}
                                    className="pt-8"
                                >
                                    <button
                                        onClick={() => {
                                            sendGeneralEnquiry();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="flex items-center space-x-3 bg-white text-primary px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                        <span>Contact on WhatsApp</span>
                                    </button>
                                </motion.div>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
