import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary text-white">
            <div className="container-custom py-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="order-2 md:order-1">
                        <Link
                            to="/admin/login"
                            className="text-xs text-white/30 hover:text-white transition-colors flex items-center gap-1 group"
                        >
                            <svg className="w-3 h-3 opacity-30 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Admin Login
                        </Link>
                    </div>
                    <div className="order-1 md:order-2 text-center">
                        <p className="text-sm text-white/90">
                            © {currentYear} Shreya Vastralok. All rights reserved.
                        </p>
                    </div>
                    <div className="hidden md:block md:order-3 w-[100px]"></div> {/* Spacer to keep copyright centered on desktop */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
