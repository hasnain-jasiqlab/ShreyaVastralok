import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <section className="relative overflow-hidden min-h-screen flex items-center">
            {/* Background Image Overlay */}
            <div className="absolute inset-0 bg-black/30 z-0"></div>

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero-red-purple.png"
                    alt="Premium Traditional Wear - Shreya Vastralok"
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="container-custom relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 items-center py-32 md:py-40">
                    {/* Left side - empty for image background (model is here) */}
                    <div className="hidden lg:block"></div>

                    {/* Right Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-center lg:text-right"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
                            New Trends for<br />
                            Every Occasion
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 mb-4 max-w-xl mx-auto lg:ml-auto lg:mr-0 italic drop-shadow-md font-serif">
                            in Premium Collections
                        </p>

                        <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl mx-auto lg:ml-auto lg:mr-0 drop-shadow-md font-serif">
                            Premium clothing collection for Women, Men & Kids
                        </p>

                        <Link
                            to="/collection"
                            className="inline-block bg-white text-primary hover:bg-primary hover:text-white font-semibold px-8 py-4 rounded-md transition-all duration-300 hover:scale-105 shadow-lg uppercase tracking-wider text-sm"
                        >
                            Explore Our Collection
                        </Link>
                    </motion.div>
                </div>
            </div>

        </section>
    );
};

export default Hero;
