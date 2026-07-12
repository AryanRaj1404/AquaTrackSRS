import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import api from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      toast.error("Please enter your username.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setIsSubmitting(true);

    const loadingToast = toast.loading("Signing in to AquaTrack...");

    try {
      const response = await api.post("/auth/login", {
        username: cleanUsername,
        password: password,
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

      toast.success("Login successful. Welcome back!", {
        id: loadingToast,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.message ||
        "Invalid username or password.";

      toast.error(message, {
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

      {/* Left Panel */}

      <div className="hidden bg-linear-to-br from-[#0781a5] via-[#086c8b] to-[#06334b] px-12 py-14 text-white lg:flex lg:flex-col lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <img
              src="/aquatrack-logo.svg"
              alt="AquaTrack"
              className="h-14 w-14 rounded-2xl bg-white/10 p-2"
            />

            <div>
              <h1 className="text-3xl font-black tracking-wide">
                AquaTrack
              </h1>

              <p className="text-sm text-cyan-100">
                Smart Water Management
              </p>
            </div>

          </div>

          <div className="mt-14">

            <h2 className="text-4xl font-black leading-tight">
              Welcome Back!
            </h2>

            <p className="mt-5 max-w-md text-base leading-7 text-cyan-50/90">
              Sign in to monitor water consumption,
              manage households and simplify
              apartment operations from one secure dashboard.
            </p>

          </div>

        </div>

        <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">

          <p className="text-sm uppercase tracking-[0.3em] text-cyan-100">
            AquaTrack
          </p>

          <p className="mt-3 text-lg font-semibold">
            Secure. Reliable. Smart.
          </p>

          <p className="mt-2 text-sm leading-6 text-cyan-50/80">
            Continue where you left off and manage your
            apartment's water consumption with ease.
          </p>

        </div>

      </div>

      {/* Right Panel */}

      <div className="px-8 py-10 sm:px-12 lg:px-14">

        <div className="mx-auto max-w-md">

          <div className="mb-10 flex items-center justify-center gap-3 lg:hidden">

            <img
              src="/aquatrack-logo.svg"
              alt="AquaTrack"
              className="h-12 w-12 rounded-xl bg-[#0781a5] p-2"
            />

            <div>
              <h1 className="text-2xl font-black text-[#075d78]">
                AquaTrack
              </h1>

              <p className="text-sm text-slate-500">
                Smart Water Management
              </p>
            </div>

          </div>

          <h2 className="text-3xl font-black text-slate-900">
            Sign In
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Welcome back. Login to continue managing your
            apartment community.
          </p>

          <form
            onSubmit={handleLogin}
            className="mt-8 space-y-5"
          >

            <div>

              <label
                htmlFor="login-username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Username
              </label>

              <input
                id="login-username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10"
              />

            </div>

            <div>

              <label
                htmlFor="login-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 pr-20 text-sm text-slate-800 outline-none transition focus:border-[#0781a5] focus:ring-4 focus:ring-[#0781a5]/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#eef7fb] px-3 py-1.5 text-xs font-bold text-[#075d78] hover:bg-[#dff0f6]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-linear-to-r from-[#0781a5] to-[#075d78] px-5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(7,93,120,0.22)] transition hover:from-[#075d78] hover:to-[#06334b] disabled:opacity-70"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="my-8 flex items-center">

            <div className="h-px flex-1 bg-slate-300" />

            <span className="mx-4 text-sm font-semibold text-slate-500">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-300" />

          </div>

          <div className="flex justify-center">

            <GoogleLogin
              onSuccess={async (credentialResponse) => {
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

                  toast.success("Signed in with Google successfully!");

                  navigate("/dashboard");

                } catch (error) {
                  console.error(error);

                  toast.error(
                    error.response?.data?.message ||
                    "Google Sign-In Failed"
                  );
                }
              }}

              onError={() => {
                toast.error("Google Sign-In Failed");
              }}
            />

          </div>

          <p className="mt-7 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#0781a5] hover:text-[#075d78]"
            >
              Create Account
            </Link>
          </p>

        </div>

      </div>

    </div>

  </section>
</main>
  )
}

export default Login;