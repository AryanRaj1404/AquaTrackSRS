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

    apartmentName: "",
    flatNumber: "",
    flatSize: null,
    occupancy: null,
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
    {loading ? (
      <div className="flex h-112.5 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#0781a5]" />
      </div>
    ) : (
      <section
        className="
          overflow-hidden
          rounded-4xl
          border
          border-white/70
          bg-white/80
          backdrop-blur-xl
          shadow-[0_25px_60px_rgba(15,23,42,0.08)]
        "
      >

        {/* Header */}

        <div
          className="
            relative
            overflow-hidden
            bg-linear-to-r
            from-[#0781a5]
            via-[#086c8b]
            to-[#06334b]
            px-10
            py-10
            text-white
          "
        >

          {/* Decorative Glow */}

          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            {/* Left */}

            <div className="flex items-center gap-6">

              <div
                className="
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-white/20
                  bg-white/10
                  text-3xl
                  font-black
                  uppercase
                  shadow-xl
                  backdrop-blur
                "
              >
                {profile.firstName?.charAt(0)}
                {profile.lastName?.charAt(0)}
              </div>

              <div>

                <p className="text-xs uppercase tracking-[0.35em] text-cyan-100">
                  {t("profile.pageTitle")}
                </p>

                <h2 className="mt-2 text-4xl font-black">
                  {profile.firstName} {profile.lastName}
                </h2>

                <p className="mt-2 text-cyan-100">
                  {roleLabel}
                </p>

                <p className="mt-1 text-sm text-cyan-200">
                  {profile.email}
                </p>

              </div>

            </div>

            {/* Right */}

            <div
              className="
                rounded-2xl
                border
                border-white/15
                bg-white/10
                px-6
                py-5
                backdrop-blur
              "
            >

              <p className="text-xs uppercase tracking-[0.30em] text-cyan-100">
                {t("profile.authProvider")}
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {providerLabel}
              </h3>

              <p className="mt-1 text-sm text-cyan-100">
                {t("profile.pageSubtitle")}
              </p>

            </div>

          </div>

        </div>

        {/* Form */}

        <div className="p-10">

          <form onSubmit={handleSubmit}>

            <div className="grid gap-8 lg:grid-cols-2">

              {/* Personal Information */}

              <div
                className="
                  rounded-2xl
                  border
                  border-slate-200
                  bg-slate-50/60
                  p-6
                "
              >

                <h3 className="mb-6 text-lg font-bold text-slate-900">
                  {t("profile.personalInformation")}
                </h3>

                <div className="space-y-5">
                                <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("profile.firstName")}
                </label>

                <input
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    outline-none
                    transition
                    focus:border-[#0781a5]
                    focus:ring-4
                    focus:ring-[#0781a5]/10
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("profile.lastName")}
                </label>

                <input
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    outline-none
                    transition
                    focus:border-[#0781a5]
                    focus:ring-4
                    focus:ring-[#0781a5]/10
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("profile.mobileNumber")}
                </label>

                <input
                  name="mobileNumber"
                  value={profile.mobileNumber ?? ""}
                  onChange={handleChange}
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-300
                    bg-white
                    px-4
                    outline-none
                    transition
                    focus:border-[#0781a5]
                    focus:ring-4
                    focus:ring-[#0781a5]/10
                  "
                />
              </div>

            </div>

          </div>

          {/* Account Information */}

          <div
            className="
              rounded-2xl
              border
              border-slate-200
              bg-slate-50/60
              p-6
            "
          >

            <h3 className="mb-6 text-lg font-bold text-slate-900">
              {t("profile.accountInformation")}
            </h3>

            <div className="space-y-5">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("profile.email")}
                </label>

                <input
                  value={profile.email}
                  disabled
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-4
                    text-slate-500
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("profile.username")}
                </label>

                <input
                  value={profile.username}
                  disabled
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-4
                    text-slate-500
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("profile.role")}
                </label>

                <input
                  value={roleLabel}
                  disabled
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-4
                    text-slate-500
                  "
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  {t("profile.authProvider")}
                </label>

                <input
                  value={providerLabel}
                  disabled
                  className="
                    h-12
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-100
                    px-4
                    text-slate-500
                  "
                />
              </div>

            </div>

          </div>

        </div>

        {profile.role === "RESIDENT" && (
  <div
    className="
      mt-8
      rounded-2xl
      border
      border-slate-200
      bg-slate-50/60
      p-6
    "
  >
    <div className="mb-6">
      <h3 className="text-lg font-bold text-slate-900">
        {t("profile.residenceInformation")}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {t("profile.residenceInformationSubtitle")}
      </p>
    </div>

    <div className="grid gap-5 md:grid-cols-2">

      {/* Apartment */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("profile.apartment")}
        </p>

        <p className="mt-2 text-lg font-bold text-slate-900">
          {profile.apartmentName || "-"}
        </p>
      </div>

      {/* Flat Number */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("profile.flatNumber")}
        </p>

        <p className="mt-2 text-lg font-bold text-slate-900">
          {profile.flatNumber || "-"}
        </p>
      </div>

      {/* Flat Size */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("profile.flatSize")}
        </p>

        <p className="mt-2 text-lg font-bold text-slate-900">
          {profile.flatSize
            ? `${profile.flatSize} ${t("profile.squareFeet")}`
            : "-"}
        </p>
      </div>

      {/* Occupancy */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {t("profile.occupancy")}
        </p>

        <p className="mt-2 text-lg font-bold text-slate-900">
          {profile.occupancy ?? "-"}
        </p>
      </div>

    </div>
  </div>
)}

        {/* Footer */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-between
            border-t
            border-slate-200
            pt-8
          "
        >

          <div>

            <h4 className="font-semibold text-slate-900">
              {t("profile.pageTitle")}
            </h4>

            <p className="mt-1 text-sm text-slate-500">
              {t("profile.pageSubtitle")}
            </p>

          </div>

          <button
            type="submit"
            disabled={saving}
            className="
              inline-flex
              items-center
              gap-3
              rounded-xl
              bg-linear-to-r
              from-[#0781a5]
              to-[#075d78]
              px-7
              py-3
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-xl
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            {saving ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {t("profile.saving")}
              </>
            ) : (
              <>
                <Save size={18} />
                {t("profile.saveChanges")}
              </>
            )}
          </button>

        </div>

      </form>

    </div>

  </section>
)}

</AdminPageShell>
);
}

export default Profile;