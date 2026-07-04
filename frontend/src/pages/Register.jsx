import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth";

import "./../styles/register.css";

function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            await register({
                username,
                password
            });

            alert("Registration Successful!");

            navigate("/login");

        } catch (error) {

            console.error(error);

            alert("Registration Failed!");

        }
    };

    return (
        <div className="register-container">

            <div className="register-card">

                <h1>AquaTrack</h1>

                <h2>Create Account 🚀</h2>

                <p>Join AquaTrack to manage water efficiently.</p>

                <form onSubmit={handleRegister}>

                    <label>Username</label>

                    <input
                        type="text"
                        placeholder="Choose a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                <p className="login-text">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>

            </div>

        </div>
    );
}

export default Register;