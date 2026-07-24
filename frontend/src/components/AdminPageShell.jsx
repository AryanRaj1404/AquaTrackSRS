import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import WaterBackground from "./WaterBackground";

import {
  CircleUser,
  Bell,
  Building2,
  Droplets,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Search,
  Users,
  X,
  Gauge,
  BadgeDollarSign,
} from "lucide-react";

import "../styles/management.css";

function AdminPageShell({
  title,
  description,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  action,
  children,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("username");

    toast.success("Logged out successfully.");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <>
    <WaterBackground/>
    <div className="mg-shell relative z-10">
      <aside className={`mg-sidebar ${sidebarOpen ? "mg-sidebar-open" : ""}`}>
        <div className="mg-brand">
          <div className="mg-brand-icon">
            <img
              src="/aquatrack-logo.svg"
              alt="AquaTrack logo"
              className="mg-brand-logo-image"
            />
          </div>

          <div className="mg-brand-text">
            <h2>AquaTrack</h2>
            <span>Water Management</span>
          </div>

          <button
            type="button"
            className="mg-sidebar-close"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={21} />
          </button>
        </div>

        <p className="mg-menu-label">MAIN MENU</p>

        <nav className="mg-navigation">
          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "mg-nav-link mg-nav-active" : "mg-nav-link"
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          {role === "ADMIN" && (
  <>
    <NavLink
      to="/apartments"
      onClick={closeSidebar}
      className={({ isActive }) =>
        isActive ? "mg-nav-link mg-nav-active" : "mg-nav-link"
      }
    >
      <Building2 size={20} />
      <span>Apartments</span>
    </NavLink>

    <NavLink
      to="/households"
      onClick={closeSidebar}
      className={({ isActive }) =>
        isActive ? "mg-nav-link mg-nav-active" : "mg-nav-link"
      }
    >
      <Users size={20} />
      <span>Households</span>
    </NavLink>
  
  {/* <NavLink
  to="/meters"
  onClick={closeSidebar}
  className={({ isActive }) =>
    isActive ? "mg-nav-link mg-nav-active" : "mg-nav-link"
  }
>
  <Gauge size={20} />
  <span>Meters</span>
</NavLink> */}
</>
)}
<NavLink
  to="/tariff-plans"
  onClick={closeSidebar}
  className={({ isActive }) =>
    isActive ? "mg-nav-link mg-nav-active" : "mg-nav-link"
  }
>
  <BadgeDollarSign size={20} />
  <span>Tariff Plans</span>
</NavLink>

          <NavLink
            to="/water-usage"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "mg-nav-link mg-nav-active" : "mg-nav-link"
            }
          >
            <Droplets size={20} />
            <span>Water Usage</span>
          </NavLink>

          <NavLink
            to="/bulk-water-purchases"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive ? "mg-nav-link mg-nav-active" : "mg-nav-link"
            }
          >
            <Droplets size={20} />
            <span>Bulk Water Purchase</span>
          </NavLink>
          
          <NavLink
              to="/billing-cycles"
              onClick={closeSidebar}
              className={({ isActive }) =>
                  isActive
                      ? "mg-nav-link mg-nav-active"
                      : "mg-nav-link"
              }
          >
              <ReceiptText size={20} />
              <span>Billing Cycles</span>
          </NavLink>

          <NavLink
              to="/invoices"
              onClick={closeSidebar}
              className={({ isActive }) =>
                  isActive
                      ? "mg-nav-link mg-nav-active"
                      : "mg-nav-link"
              }
          >
              <ReceiptText size={20} />
              <span>Invoices</span>
          </NavLink>
        </nav>

        <div className="mg-sidebar-bottom">
          <div className="mg-water-tip">
            <Droplets size={24} />

            <div>
              <strong>Save every drop</strong>
              <p>Monitor water usage efficiently.</p>
            </div>
          </div>

          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? "mg-nav-link mg-nav-active"
                : "mg-nav-link"
            }
          >
            <CircleUser size={20} />
            <span>My Profile</span>
          </NavLink>

          <button
            type="button"
            className="mg-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="mg-sidebar-overlay"
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      <div className="mg-main">
        <header className="mg-topbar">
          <div className="mg-topbar-left">
            <button
              type="button"
              className="mg-mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="mg-search">
              <Search size={19} />

              <input
                type="search"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
          </div>

          <div className="mg-topbar-right">
            <button
              type="button"
              className="mg-notification-button"
              onClick={() =>
                toast("No new notifications.", {
                  icon: "🔔",
                })
              }
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="mg-notification-dot" />
            </button>

            <div className="mg-topbar-divider" />

            <div
              className="mg-profile"
              onClick={handleProfileClick}
              role="button"
              tabIndex={0}
              style={{
                cursor: "pointer",
                borderRadius: "14px",
                padding: "8px 12px",
                transition: "0.25s",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleProfileClick();
                }
              }}
            >
              <div className="mg-avatar">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="mg-profile-details">
                <strong>{username || "User"}</strong>
                <span>
                  {role === "ADMIN"
                    ? "Apartment Admin"
                    : "Resident"}
                </span>
              </div>
            </div>

          </div>
        </header>

        <main className="mg-content">
          <section className="mg-heading">
            <div>
              <p className="mg-eyebrow">MANAGEMENT</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            {action && <div>{action}</div>}
          </section>

          {children}
        </main>
      </div>
    </div>
    </>
  );
}

export default AdminPageShell;