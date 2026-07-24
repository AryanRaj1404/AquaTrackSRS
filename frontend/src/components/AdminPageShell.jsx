import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import WaterBackground from "./WaterBackground";
import { motion } from "framer-motion";

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
    [
    "token",
    "user",
    "role",
    "username",
    ].forEach(localStorage.removeItem.bind(localStorage));

    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const navigationItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/apartments",
    label: "Apartments",
    icon: Building2,
    adminOnly: true,
  },
  {
    to: "/households",
    label: "Households",
    icon: Users,
    adminOnly: true,
  },
  {
    to: "/tariff-plans",
    label: "Tariff Plans",
    icon: BadgeDollarSign,
    adminOnly: true,
  },
  {
    to: "/water-usage",
    label: "Water Usage",
    icon: Droplets,
    adminOnly: true,
  },
  {
    to: "/bulk-water-purchases",
    label: "Bulk Water Purchase",
    icon: Droplets,
    adminOnly: true,
  },
  {
    to: "/billing-cycles",
    label: "Billing Cycles",
    icon: ReceiptText,
    adminOnly: true,
  },
  {
    to: "/invoices",
    label: "Invoices",
    icon: ReceiptText,
    adminOnly: true,
  },
];

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
    {navigationItems
        .filter(item => !item.adminOnly || role === "ADMIN")
        .map(item => {
            const Icon = item.icon;

            return (
                <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                        isActive
                            ? "mg-nav-link mg-nav-active"
                            : "mg-nav-link"
                    }
                >
                    <Icon size={20}/>
                    <span>{item.label}</span>
                </NavLink>
            );
        })}
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
              className="mg-profile cursor-pointer rounded-xl p-2 transition-all"
              onClick={handleProfileClick}
              role="button"
              tabIndex={0}
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

        <motion.main
          className="mg-content"
          initial={{
              opacity: 0,
              x: 20,
          }}
          animate={{
              opacity: 1,
              x: 0,
          }}
          exit={{
              opacity: 0,
              x: -20,
          }}
          transition={{
              duration: 0.28,
              ease: "easeOut",
          }}
      >
          <section className="mg-heading">
            <div>
              <p className="mg-eyebrow">MANAGEMENT</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>

            {action && <div>{action}</div>}
          </section>

          {children}
        </motion.main>
      </div>
    </div>
    </>
  );
}

export default AdminPageShell;