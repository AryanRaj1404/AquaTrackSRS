import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../styles/hero.css";

function HeroSection() {
  const { t } = useTranslation();
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
          {t("hero.titleLine1")}
          <br />
          {t("hero.titleLine2")}
        </h1>

        <p>
          {t("hero.subtitle")}
        </p>

        <div className="hero-buttons">

          <Link to="/register" className="primary-btn">
            {t("hero.getStarted")}
          </Link>

          <Link to="/login" className="secondary-btn">
            {t("hero.login")}
          </Link>

        </div>

      </div>

      <div className="dashboard-preview">

        <div className="dashboard-card">

          <h3>{t("hero.communityOverview")}</h3>

          <div className="dashboard-item">
            <span>🏢 {t("hero.apartments")}</span>
            <span className="badge">{stats.apartments}</span>
          </div>

          <div className="dashboard-item">
            <span>🏠 {t("hero.households")}</span>
            <span className="badge">{stats.households}</span>
          </div>

          <div className="dashboard-item">
            <span>💧 {t("hero.waterUsage")}</span>
            <span className="badge">
              {(stats.waterUsage ?? 0).toLocaleString()} L
            </span>
          </div>

          <div className="dashboard-item">
            <span>👤 {t("hero.residents")}</span>
            <span className="badge">{stats.residents}</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;
