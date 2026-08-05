import { useTranslation } from "react-i18next";
import "../styles/footer.css";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">

      <h2>{t("common.appName")}</h2>

      <p>
        {t("footer.tagline")}
      </p>

      <small>
        {t("footer.copyright")}
      </small>

    </footer>
  );
}

export default Footer;
