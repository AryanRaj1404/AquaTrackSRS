import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/hero.css";

function HeroSection() {
  const [stats, setStats] = useState({
    apartments: 0,
    households: 0,
    waterUsage: 0,
    residents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/public/stats"
        );

        setStats(response.data);
      } catch (error) {
        console.error("Failed to load statistics", error);
      }
    };

    fetchStats();
  }, []);

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
            <span className="badge">{stats.apartments}</span>
          </div>

          <div className="dashboard-item">
            <span>🏠 Households</span>
            <span className="badge">{stats.households}</span>
          </div>

          <div className="dashboard-item">
            <span>💧 Water Usage</span>
            <span className="badge">
              {(stats.waterUsage ?? 0).toLocaleString()} L
            </span>
          </div>

          <div className="dashboard-item">
            <span>👤 Residents</span>
            <span className="badge">{stats.residents}</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;