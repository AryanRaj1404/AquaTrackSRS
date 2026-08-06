import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import AdminPageShell from "../components/AdminPageShell";

import profileService from "../services/profileService";

function Profile() {
  const { t } = useTranslation();

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    mobileNumber: "",
    role: "",
    provider: "",
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await profileService.getProfile();

      setProfile(data);

    } catch (error) {

      console.error(error);

      toast.error(t("profile.loadFailed"));

    } finally {

      setLoading(false);

    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setSaving(true);

      await profileService.updateProfile(profile);

      toast.success(t("profile.updateSuccess"));

    } catch (error) {

      console.error(error);

      toast.error(t("profile.updateFailed"));

    } finally {

      setSaving(false);

    }
  };

  const roleLabel =
    profile.role === "ADMIN"
      ? t("profile.apartmentAdministrator")
      : profile.role === "RESIDENT"
      ? t("profile.resident")
      : profile.role;

  const providerLabel =
    profile.provider === "LOCAL"
      ? t("profile.providerLocal")
      : profile.provider === "GOOGLE"
      ? t("profile.providerGoogle")
      : profile.provider;

  return (
  <AdminPageShell
    title={t("profile.pageTitle")}
    description={t("profile.pageSubtitle")}
    searchPlaceholder={t("profile.searchPlaceholder")}
  >
    <section className="mg-panel">

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >

        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg,#0781a5,#075d78)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "28px",
            fontWeight: "700",
          }}
        >
          {profile.firstName?.charAt(0)}
          {profile.lastName?.charAt(0)}
        </div>

        <div>

          <h2 style={{ marginBottom: "4px" }}>
            {profile.firstName} {profile.lastName}
          </h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            {roleLabel}
          </p>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            {profile.email}
          </p>

        </div>

      </div>

      <form onSubmit={handleSubmit}>

        <div className="mg-form-grid">

          <div className="mg-form-group">

            <label>{t("profile.firstName")}</label>

            <input
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
            />

          </div>

          <div className="mg-form-group">

            <label>{t("profile.lastName")}</label>

            <input
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
            />

          </div>

          <div className="mg-form-group">

            <label>{t("profile.email")}</label>

            <input
              value={profile.email}
              disabled
            />

          </div>

          <div className="mg-form-group">

            <label>{t("profile.username")}</label>

            <input
              value={profile.username}
              disabled
            />

          </div>

          <div className="mg-form-group">

            <label>{t("profile.mobileNumber")}</label>

            <input
              name="mobileNumber"
              value={profile.mobileNumber ?? ""}
              onChange={handleChange}
            />

          </div>

          <div className="mg-form-group">

            <label>{t("profile.role")}</label>

            <input
              value={roleLabel}
              disabled
            />

          </div>

          <div className="mg-form-group mg-form-group-full">

            <label>{t("profile.authProvider")}</label>

            <input
              value={providerLabel}
              disabled
            />

          </div>

        </div>

        <div
          className="mg-modal-actions"
          style={{
            marginTop: "25px",
          }}
        >

          <button
            type="submit"
            className="mg-primary-button"
            disabled={saving}
          >

            <Save size={17} />

            {saving
              ? t("profile.saving")
              : t("profile.saveChanges")}

          </button>

        </div>

      </form>

    </section>
  </AdminPageShell>
);
}

export default Profile;
