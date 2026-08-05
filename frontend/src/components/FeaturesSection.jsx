import { useTranslation } from "react-i18next";
import "../styles/features.css";

function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="features" className="features">

      <h2>{t("features.heading")}</h2>

      <div className="feature-container">

        <div className="feature-card">
          <div className="icon">🏢</div>
          <h3>{t("features.apartmentManagement.title")}</h3>
          <p>
            {t("features.apartmentManagement.description")}
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">💧</div>
          <h3>{t("features.waterTracking.title")}</h3>
          <p>
            {t("features.waterTracking.description")}
          </p>
        </div>

        <div className="feature-card">
          <div className="icon">🔒</div>
          <h3>{t("features.secureAuth.title")}</h3>
          <p>
            {t("features.secureAuth.description")}
          </p>
        </div>

      </div>

    </section>
  );
}

export default FeaturesSection;
