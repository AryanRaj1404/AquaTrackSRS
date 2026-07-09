import { Link } from "react-router-dom";
import { Droplets, ShieldCheck, TrendingUp } from "lucide-react";
import "../styles/hero.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay" />

      <div className="hero-inner">
        <div className="hero-content">
          <span className="hero-badge">
            <Droplets size={16} />
            Smart Water Intelligence
          </span>

          <h1>
            Smart Water Management
            <br />
            for Modern Apartments
          </h1>

          <p>
            Monitor apartment water consumption, manage households
            and simplify community operations from one secure platform.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started Free
            </Link>
            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>

          <div className="hero-trust">
            <div className="hero-trust-item">
              <ShieldCheck size={18} />
              <span>Secure &amp; Encrypted</span>
            </div>
            <div className="hero-trust-item">
              <TrendingUp size={18} />
              <span>Real-time Analytics</span>
            </div>
          </div>
        </div>

        <div className="dashboard-preview">
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3>Community Overview</h3>
              <span className="live-dot" />
            </div>

            <div className="dashboard-item">
              <span>🏢 Apartments</span>
              <span className="badge">12</span>
            </div>

            <div className="dashboard-item">
              <span>🏠 Households</span>
              <span className="badge">48</span>
            </div>

            <div className="dashboard-item">
              <span>💧 Water Usage</span>
              <span className="badge">2540 L</span>
            </div>

            <div className="dashboard-item">
              <span>👤 Residents</span>
              <span className="badge">96</span>
            </div>
          </div>
        </div>
      </div>

      <svg
        className="hero-wave"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path
          fill="#F8FAFC"
          d="M0,64 C240,120 480,0 720,32 C960,64 1200,120 1440,64 L1440,120 L0,120 Z"
        />
      </svg>
    </section>
  );
}

export default HeroSection;