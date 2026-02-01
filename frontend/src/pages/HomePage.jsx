import Hero from '../components/home/Hero';
import FeaturedCategories from '../components/home/FeaturedCategories';
import NewArrivals from '../components/home/NewArrivals';
import WhyChooseUs from '../components/home/WhyChooseUs';
import OffersCarousel from '../components/home/OffersCarousel';
import AnnouncementBanner from '../components/common/AnnouncementBanner';

const HomePage = () => {
    return (
        <div>
            <Hero />
            <AnnouncementBanner />
            <FeaturedCategories />
            <NewArrivals />
            <OffersCarousel />
            <WhyChooseUs />
        </div>
    );
};

export default HomePage;

