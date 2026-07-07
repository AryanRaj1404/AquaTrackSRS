import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
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

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully.");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div className="mg-shell">
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

          <div className="mg-nav-link mg-disabled-link">
            <Droplets size={20} />
            <span>Water Usage</span>
            <small>Soon</small>
          </div>

          <div className="mg-nav-link mg-disabled-link">
            <ReceiptText size={20} />
            <span>Billing</span>
            <small>Soon</small>
          </div>
        </nav>

        <div className="mg-sidebar-bottom">
          <div className="mg-water-tip">
            <Droplets size={24} />

            <div>
              <strong>Save every drop</strong>
              <p>Monitor water usage efficiently.</p>
            </div>
          </div>

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

            <div className="mg-profile">
              <div className="mg-avatar">AD</div>

              <div className="mg-profile-details">
                <strong>Administrator</strong>
                <span>Apartment Admin</span>
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
  );
}

export default AdminPageShell;