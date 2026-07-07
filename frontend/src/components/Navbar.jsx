import { Link } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src="/aquatrack-logo.svg" alt="AquaTrack logo" />
          <span>AquaTrack</span>
        </Link>
      </div>

      <ul className="nav-links">
        <li>
          <a href="#home">Home</a>
        </li>

        <li>
          <a href="#features">Features</a>
        </li>

        <li>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </li>

        <li>
          <Link to="/register" className="register-btn">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;