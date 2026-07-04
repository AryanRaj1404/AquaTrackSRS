import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

import "./../styles/login.css";

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await login({
                username,
                password
            });

            const token = response.data.token;
            localStorage.setItem("token", token);
            console.log(token);
            navigate("/dashboard");

        } catch (error) {

        console.error(error);

        alert("Invalid username or password");
    }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>AquaTrack</h1>

                <h2>Welcome Back 👋</h2>

                <p>Sign in to continue</p>

                <form onSubmit={handleLogin}>

                    <label>Username</label>

                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Login
                    </button>

                </form>

                <p className="register-text">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>

            </div>

        </div>
    );
}

export default Login;