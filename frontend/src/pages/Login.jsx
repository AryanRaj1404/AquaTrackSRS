import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import "../styles/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLogin = (event) => {
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

    setTimeout(() => {
      try {
        const savedUser = localStorage.getItem("aquatrack_demo_user");

        if (!savedUser) {
          toast.error("No account found. Please register first.", {
            id: loadingToast,
          });

          setIsSubmitting(false);
          return;
        }

        const user = JSON.parse(savedUser);

        if (
          user.username !== cleanUsername ||
          user.password !== password
        ) {
          toast.error("Invalid username or password.", {
            id: loadingToast,
          });

          setIsSubmitting(false);
          return;
        }

        localStorage.setItem("token", "aquatrack-demo-token");

        localStorage.setItem(
          "user",
          JSON.stringify({
            username: user.username,
            role: user.role || "ADMIN",
          })
        );

        toast.success("Login successful. Welcome back!", {
          id: loadingToast,
        });

        setIsSubmitting(false);

        setTimeout(() => {
          navigate("/dashboard");
        }, 700);
      } catch (error) {
        console.error("Login error:", error);

        toast.error("Unable to sign in. Please try again.", {
          id: loadingToast,
        });

        setIsSubmitting(false);
      }
    }, 700);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="auth-brand">
          <img
            src="/aquatrack-logo.svg"
            alt="AquaTrack logo"
            className="auth-brand-logo"
          />

          <h1>AquaTrack</h1>
        </div>

        <h2>Welcome Back</h2>

        <p className="login-description">
          Sign in to monitor water usage and manage billing.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="login-username">Username</label>

          <input
            id="login-username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            disabled={isSubmitting}
          />

          <label htmlFor="login-password">Password</label>

          <div className="password-input-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((previous) => !previous)}
              disabled={isSubmitting}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="login-submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;