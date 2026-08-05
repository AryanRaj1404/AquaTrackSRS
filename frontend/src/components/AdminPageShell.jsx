import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
    BadgeDollarSign,
    Bell,
    Building2,
    CircleUser,
    Droplets,
    Gauge,
    LayoutDashboard,
    LogOut,
    Menu,
    ReceiptText,
    Search,
    Users,
    X,
} from "lucide-react";

import WorkspaceSelector from "./WorkspaceSelector";
import { useWorkspace } from "../context/WorkspaceContext";

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

    const {
        workspaceName,
        isGlobalWorkspace,
    } = useWorkspace();

    const closeSidebar = () => {

        setSidebarOpen(false);

    };

    const handleLogout = () => {

        [
            "token",
            "user",
            "role",
            "username",
        ].forEach(
            localStorage.removeItem.bind(localStorage)
        );

        toast.success(
            "Logged out successfully."
        );

        navigate("/");

    };

    const handleProfileClick = () => {

        navigate("/profile");

    };

    const workspaceSubtitle = useMemo(() => {

        return isGlobalWorkspace
            ? "Viewing all apartments"
            : "Current Workspace";

    }, [isGlobalWorkspace]);

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
    <div className="min-h-screen bg-slate-100">
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[290px] lg:w-72 flex-col
          border-r border-white/10
          bg-gradient-to-b
          from-[#0A4D68]
          via-[#0A5674]
          to-[#08445B]
          text-white
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex items-center gap-4 border-b border-white/10 px-6 py-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md">
            <img
              src="/aquatrack-logo.svg"
              alt="AquaTrack logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight">AquaTrack</h2>
            <span className="text-sm text-teal-100">Management Platform</span>
          </div>

          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Close sidebar"
            className="
              ml-auto
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              text-teal-100
              transition
              hover:bg-white/10
              lg:hidden
            "
          >
            <X size={20} />
          </button>
        </div>

        <p className="px-6 pt-5 pb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-200/70">MAIN MENU</p>

        <nav className="flex flex-1 flex-col gap-1.5 px-4">
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
                      `
                      flex
                      h-12
                      items-center
                      gap-3
                      rounded-2xl
                      px-4
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-white/15 text-white shadow-md"
                          : "text-teal-100 hover:bg-white/10 hover:text-white"
                      }
                    `
                    }
                >
                    <Icon size={20}/>
                    <span>{item.label}</span>
                </NavLink>
            );
        })}
</nav>

        <div className="border-t border-white/10 px-4 py-4">
          <div className="mb-3 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-start gap-3">
  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
    <Droplets size={20} />
  </div>

  <div>
    <p className="text-sm font-semibold text-white">
      Save every drop
    </p>

    <p className="mt-1 text-xs leading-5 text-teal-100">
      Monitor water usage efficiently.
    </p>
  </div>
</div>
</div>


          <NavLink
            to="/profile"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `
              group flex h-12 items-center gap-3 rounded-2xl px-4
              transition-all duration-200
              ${
                isActive
                  ? "bg-white/15 text-white shadow-lg"
                  : "text-teal-100 hover:bg-white/10 hover:text-white"
              }
            `
            }
          >
            <CircleUser size={20} />
            <span>My Profile</span>
          </NavLink>

          <button
            type="button"
            className="mt-3 flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-red-100 transition hover:bg-red-500/15"
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
          className="
            fixed
            inset-0
            z-40
            bg-black/40
            backdrop-blur-sm
            lg:hidden
            "
          onClick={closeSidebar}
          aria-label="Close sidebar overlay"
        />
      )}

      <div className="min-h-screen lg:ml-72">
        <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">

    <div className="flex flex-col gap-4 px-4 py-4 md:px-6 lg:px-8">

        {/* Top Row */}

        <div className="flex items-center justify-between gap-4">

            {/* Left */}

            <div className="flex flex-1 items-center gap-3">

                <button
                    type="button"
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        transition
                        hover:border-teal-500
                        hover:text-teal-700
                        lg:hidden
                    "
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu size={22}/>
                </button>

                <div
                    className="
                        flex
                        h-12
                        w-full
                        max-w-md
                        items-center
                        gap-3
                        rounded-2xl
                        border
                        border-slate-200
                        bg-slate-50
                        px-4
                        transition
                        focus-within:border-teal-600
                        focus-within:bg-white
                        focus-within:ring-4
                        focus-within:ring-teal-100
                    "
                >

                    <Search size={18}/>

                    <input
                        type="search"
                        placeholder={searchPlaceholder || "Search..."}
                        value={searchValue}
                        onChange={(e)=>onSearchChange(e.target.value)}
                        className="
                            flex-1
                            bg-transparent
                            text-sm
                            outline-none
                            placeholder:text-slate-400
                        "
                    />

                </div>

            </div>

            {/* Right */}

            <div className="flex items-center gap-3">

                <button
                    type="button"
                    className="
                        relative
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        transition
                        hover:border-teal-500
                        hover:text-teal-700
                    "
                    onClick={() =>
                        toast("No new notifications.", {
                            icon: "🔔",
                        })
                    }
                >

                    <Bell size={20}/>

                    <span
                        className="
                            absolute
                            right-2.5
                            top-2.5
                            h-2
                            w-2
                            rounded-full
                            bg-red-500
                        "
                    />

                </button>

                <div
                    className="
                        flex
                        cursor-pointer
                        items-center
                        gap-3
                        rounded-2xl
                        bg-white
                        px-2
                        py-2
                        transition
                        hover:shadow-md
                    "
                    onClick={handleProfileClick}
                >

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-gradient-to-br
                            from-teal-600
                            to-cyan-600
                            font-bold
                            text-white
                        "
                    >

                        {username
                            ? username.charAt(0).toUpperCase()
                            : "U"}

                    </div>

                    <div className="hidden sm:flex flex-col">

                        <span className="font-semibold text-slate-800">

                            {username}

                        </span>

                        <span className="text-xs text-slate-500">

                            {role === "ADMIN"
                                ? "Apartment Admin"
                                : "Resident"}

                        </span>

                    </div>

                </div>

            </div>

        </div>

        {/* Workspace */}

        {role === "ADMIN" && (

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <p className="text-[11px] font-bold uppercase tracking-[0.30em] text-teal-600">

                        Workspace

                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">

                        {workspaceName}

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        {workspaceSubtitle}

                    </p>

                </div>

                <WorkspaceSelector/>

            </div>

        )}

    </div>

</header>

        <motion.main
          className="
            min-h-[calc(100vh-80px)]
            space-y-10
            bg-gradient-to-br
            from-slate-50
            via-slate-100
            to-slate-50
            px-4 py-5
            md:px-6 md:py-6
            lg:px-10 lg:py-8
            "
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
          {(title || description || action) && (

    <section
        className="
            flex
            flex-col
            gap-8
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            shadow-sm
            md:p-6
            lg:flex-row
            lg:items-center
            lg:justify-between
            lg:p-8
        "
    >

        {/* Left */}

        <div className="flex-1">

            <p className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-teal-700">

                MANAGEMENT

            </p>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">

                {title}

            </h1>

            {description && (

                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">

                    {description}

                </p>

            )}

            {/* Workspace Badge */}

            {role === "ADMIN" && (

                <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-teal-100 bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white">

                        <Building2 size={20} />

                    </div>

                    <div>

                        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-teal-700">

                            Current Workspace

                        </p>

                        <p className="mt-1 font-semibold text-slate-800">

                            {workspaceName}

                        </p>

                    </div>

                </div>

            )}

        </div>

        {/* Action */}

        {action && (

            <div className="w-full lg:w-auto">

                {action}

            </div>

        )}

    </section>

)}

          {children}
        </motion.main>
      </div>
    </div>
    </>
  );
}

export default AdminPageShell;