import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import WaterBackground from "../components/WaterBackground";
import DashboardShowcase from "../components/DashboardShowcase";

function Landing() {
  return (
    <>
      <WaterBackground/>
      <div className="relative z-10">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DashboardShowcase />
      <Footer />
      </div>
    </>
  );
}

export default Landing;