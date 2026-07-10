import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import api from "../services/api";

import "../styles/login.css";

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
            onChange={(e) => setUsername(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={isSubmitting}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
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

        <div style={{ marginTop: "20px", marginBottom: "20px" }}>
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

                toast.success("Google Login Successful!");

                navigate("/dashboard");

              } catch (error) {
                console.error(error);

                toast.error(
                  error.response?.data?.message || "Google Login Failed"
                );
              }
            }}
            onError={() => {
              toast.error("Google Login Failed");
            }}
          />
        </div>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;