import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import WaterBackground from "../components/WaterBackground";

function Landing() {
  return (
    <>
      <WaterBackground/>
      <div className="relative z-10">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
      </div>
    </>
  );
}

export default Landing;