import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import "../styles/navbar.css";

function Navbar() {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/aquatrack-logo.svg" alt="AquaTrack logo" />
          <span>{t("common.appName")}</span>
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <a href="#home">{t("navbar.home")}</a>
        </li>

        <li>
          <a href="#features">{t("navbar.features")}</a>
        </li>

        <li>
          <Link to="/login" className="login-btn">
            {t("navbar.login")}
          </Link>
        </li>

        <li>
          <Link to="/register" className="register-btn">
            {t("navbar.register")}
          </Link>
        </li>

        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
