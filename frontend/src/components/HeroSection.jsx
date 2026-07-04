import { Link } from "react-router-dom";
import "../styles/hero.css";

function HeroSection() {
  return (
    <section className="hero">

      <div className="hero-content">

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
            Get Started
          </Link>

          <Link to="/login" className="secondary-btn">
            Login
          </Link>

        </div>

      </div>

      <div className="dashboard-preview">

        <div className="dashboard-card">

          <h3>Community Overview</h3>

          <div className="dashboard-item">
            <span>🏢 Apartments</span>
            <spam className="badge">12</spam>
          </div>

          <div className="dashboard-item">
            <span>🏠 Households</span>
            <spam className="badge">48</spam>
          </div>

          <div className="dashboard-item">
            <span>💧 Water Usage</span>
            <span className="badge">2540 L</span>
          </div>

          <div className="dashboard-item">
            <span>👤 Residents</span>
            <spam className="badge">96</spam>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;