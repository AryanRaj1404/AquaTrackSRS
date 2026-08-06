import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import LanguageSwitcher from "../components/LanguageSwitcher";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  username: "",
  password: "",
};

function Register() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!form.firstName.trim()) {
      toast.error(t("register.errors.firstNameRequired"));
      return false;
    }

    if (!form.lastName.trim()) {
      toast.error(t("register.errors.lastNameRequired"));
      return false;
    }

    if (!form.email.trim()) {
      toast.error(t("register.errors.emailRequired"));
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error(t("register.errors.emailInvalid"));
      return false;
    }

    if (!form.mobileNumber.trim()) {
      toast.error(t("register.errors.mobileRequired"));
      return false;
    }

    if (!/^[0-9]{10}$/.test(form.mobileNumber)) {
      toast.error(t("register.errors.mobileInvalid"));
      return false;
    }

    if (!form.username.trim()) {
      toast.error(t("register.errors.usernameRequired"));
      return false;
    }

    if (form.password.length < 6) {
      toast.error(t("register.errors.passwordTooShort"));
      return false;
    }

    return true;
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      mobileNumber: form.mobileNumber.trim(),
      username: form.username.trim(),
      password: form.password
    };

    setIsSubmitting(true);

    const loadingToast = toast.loading(t("register.toasts.creating"));

    try {
      await api.post("/auth/register", payload);

      toast.success(t("register.toasts.success"), {
        id: loadingToast,
      });

      setForm(initialForm);

      setTimeout(() => {
        navigate("/login");
      }, 700);

    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.response?.data?.message ||
        t("register.errors.serverError");

      toast.error(message, {
        id: loadingToast,
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async (credentialResponse) => {
    try {
      const response = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      });

      const token = response.data.token;

      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      localStorage.setItem("role", decoded.role);
      localStorage.setItem("username", decoded.sub);

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: decoded.sub,
        })
      );

      toast.success(t("register.toasts.googleSuccess"));

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
        t("register.errors.googleFailed")
      );
    }
  };
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(7,129,165,0.14),transparent_32%),linear-gradient(135deg,#f6fbff_0%,#e7f4fb_100%)] px-4 py-8">
      <div className="mx-auto mb-4 flex max-w-6xl justify-end">
        <LanguageSwitcher />
      </div>
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-[#dce8ef] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.12)] lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left branding panel */}
          <div className="hidden bg-linear-to-br from-[#06334b] via-[#075d78] to-[#0781a5] p-10 text-white lg:flex lg:flex-col lg:justify-center">
            <div>
              <div className="mb-10 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
                  <img
                    src="/aquatrack-logo.svg"
                    alt="AquaTrack logo"
                    className="h-8 w-8 object-contain"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold">{t("common.appName")}</h1>
                  <p className="text-sm text-cyan-100">
                    {t("register.waterManagementPlatform")}
                  </p>
                </div>
              </div>

              <h2 className="mb-5 text-4xl font-bold leading-tight">
                {t("register.heroTitle")}
              </h2>

              <p className="max-w-md text-base leading-8 text-cyan-50">
                {t("register.heroSubtitle")}
              </p>
            </div>
          </div>

          {/* Right registration form */}
          <div className="p-6 sm:p-9 lg:p-12">
            <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
              <img
                src="/aquatrack-logo.svg"
                alt="AquaTrack logo"
                className="h-11 w-11 object-contain"
              />

              <h1 className="text-3xl font-extrabold text-[#075d78]">
                {t("common.appName")}
              </h1>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[#0781a5]">
                {t("register.residentRegistration")}
              </p>

              <h2 className="text-3xl font-bold text-[#06334b]">
                {t("register.createResidentAccount")}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {t("register.formSubtitle")}
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    {t("register.firstName")}
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder={t("register.firstNamePlaceholder")}
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    {t("register.lastName")}
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder={t("register.lastNamePlaceholder")}
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    {t("register.emailId")}
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="resident@example.com"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    {t("register.mobileNumber")}
                  </label>

                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="username"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    {t("register.username")}
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder={t("register.usernamePlaceholder")}
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    {t("register.password")}
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder={t("register.passwordPlaceholder")}
                      disabled={isSubmitting}
                      className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-20 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#eef7fb] px-3 py-1.5 text-xs font-bold text-[#075d78] transition hover:bg-[#dff0f6] disabled:cursor-not-allowed"
                    >
                      {showPassword ? t("register.hide") : t("register.show")}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-13 w-full items-center justify-center rounded-xl bg-linear-to-r from-[#0781a5] to-[#075d78] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(7,93,120,0.22)] transition hover:from-[#075d78] hover:to-[#06334b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? t("register.creatingAccount") : t("register.createAccount")}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-slate-300"></div>

              <span className="mx-4 text-sm text-slate-500">
                {t("common.or")}
              </span>

              <div className="h-px flex-1 bg-slate-300"></div>
            </div>

            <div className="my-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleRegister}
                onError={() => {
                  toast.error(t("register.errors.googleFailed"));
                }}
              />
            </div>

            <p className="mt-7 text-center text-sm text-slate-500">
              {t("register.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="font-bold text-[#0781a5] hover:text-[#075d78]"
              >
                {t("register.login")}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


export default Register;
