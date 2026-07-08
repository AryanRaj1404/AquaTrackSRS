import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const REGISTER_ENDPOINT = "http://localhost:8080/auth/register";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  mobileNumber: "",
  username: "",
  password: "",
};

function Register() {
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
      toast.error("First name is required.");
      return false;
    }

    if (!form.lastName.trim()) {
      toast.error("Last name is required.");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email ID is required.");
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      toast.error("Please enter a valid email ID.");
      return false;
    }

    if (!form.mobileNumber.trim()) {
      toast.error("Mobile number is required.");
      return false;
    }

    if (!/^[0-9]{10}$/.test(form.mobileNumber)) {
      toast.error("Mobile number must contain 10 digits.");
      return false;
    }

    if (!form.username.trim()) {
      toast.error("Username is required.");
      return false;
    }

    if (form.password.length < 6) {
      toast.error("Password must have at least 6 characters.");
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

    const loadingToast = toast.loading("Creating resident account...");

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Registration failed.");
      }

      toast.success("Resident registered successfully.", {
        id: loadingToast,
      });

      setForm(initialForm);

      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (error) {
      console.error("Registration error:", error);

      toast.error("Registration failed. Please check backend API and field names.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(7,129,165,0.14),transparent_32%),linear-gradient(135deg,#f6fbff_0%,#e7f4fb_100%)] px-4 py-8">
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
                  <h1 className="text-2xl font-bold">AquaTrack</h1>
                  <p className="text-sm text-cyan-100">
                    Water Management Platform
                  </p>
                </div>
              </div>

              <h2 className="mb-5 text-4xl font-bold leading-tight">
                Create resident accounts easily.
              </h2>

              <p className="max-w-md text-base leading-8 text-cyan-50">
                Register residents using their personal details, username,
                and password. Login will continue with username and password.
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
                AquaTrack
              </h1>
            </div>

            <div className="mb-8 text-center lg:text-left">
              <p className="mb-2 text-xs font-bold tracking-[0.22em] text-[#0781a5]">
                RESIDENT REGISTRATION
              </p>

              <h2 className="text-3xl font-bold text-[#06334b]">
                Create Resident Account
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Enter resident details and create a username and password
                for login.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
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
                    Email ID
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
                    Mobile Number
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
                    Username
                  </label>

                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choose username"
                    disabled={isSubmitting}
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-semibold text-[#06334b]"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
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
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-13 w-full items-center justify-center rounded-xl bg-linear-to-r from-[#0781a5] to-[#075d78] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(7,93,120,0.22)] transition hover:from-[#075d78] hover:to-[#06334b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#0781a5] hover:text-[#075d78]"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Register;