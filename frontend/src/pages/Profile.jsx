import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, Save } from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";

import {
  getProfile,
  updateProfile,
} from "../services/profileService";

function Profile() {
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
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const data = await getProfile();

      setProfile(data);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load profile.");

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

      await updateProfile(profile);

      toast.success("Profile updated successfully.");

    } catch (error) {

      console.error(error);

      toast.error("Failed to update profile.");

    } finally {

      setSaving(false);

    }
  };

  return (
  <AdminPageShell
    title="My Profile"
    description="View and update your personal information."
    searchPlaceholder= "Your profile"
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
            {profile.role === "ADMIN"
            ? "Apartment Administrator"
            : "Resident"}
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

            <label>First Name</label>

            <input
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
            />

          </div>

          <div className="mg-form-group">

            <label>Last Name</label>

            <input
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
            />

          </div>

          <div className="mg-form-group">

            <label>Email</label>

            <input
              value={profile.email}
              disabled
            />

          </div>

          <div className="mg-form-group">

            <label>Username</label>

            <input
              value={profile.username}
              disabled
            />

          </div>

          <div className="mg-form-group">

            <label>Mobile Number</label>

            <input
              name="mobileNumber"
              value={profile.mobileNumber ?? ""}
              onChange={handleChange}
            />

          </div>

          <div className="mg-form-group">

            <label>Role</label>

            <input
              value={
                  profile.role === "ADMIN"
                    ? "Apartment Administrator"
                    : profile.role === "RESIDENT"
                    ? "Resident"
                    : profile.role
                }
              disabled
            />

          </div>

          <div className="mg-form-group mg-form-group-full">

            <label>Authentication Provider</label>

            <input
              value={
                profile.provider === "LOCAL"
                  ? "AquaTrack"
                  : profile.provider === "GOOGLE"
                  ? "Google"
                  : profile.provider
              }
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
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </form>

    </section>
  </AdminPageShell>
);
}

export default Profile;