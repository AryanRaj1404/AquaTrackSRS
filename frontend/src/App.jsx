import { Navigate, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Apartments from "./pages/Apartments";
import Households from "./pages/Households";
import MeterConfig from "./pages/MeterConfig";
import axios from "axios";
import WaterUsage from "./pages/WaterUsage";
import ProtectedRoute from "./components/ProtectedRoute";
import TariffPlans from "./pages/TariffPlans";
import BillingCycles from "./pages/BillingCycles";
import Profile from "./pages/Profile";
import Invoices from "./pages/Invoices";
import BulkWaterPurchases from "./pages/BulkWaterPurchases";
import WaterRipples from "./components/WaterRipples";
import ResidentDashboard from "./pages/ResidentDashboard";
import Alerts from "./pages/Alerts";

function App() {
  const location = useLocation();
  return (
    <>
      <WaterRipples/>
    <AnimatePresence mode="wait">
      <Routes
        location={location}
        key={location.pathname}
      >
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {localStorage.getItem("role") === "RESIDENT" ? (
              <ResidentDashboard />
            ) : (
              <Dashboard />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/water-usage"
        element={
          <ProtectedRoute role="ADMIN">
            <WaterUsage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/alerts"
        element={
          <ProtectedRoute role="ADMIN">
            <Alerts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <ProtectedRoute role="ADMIN">
            <Invoices />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bulk-water-purchases"
        element={
          <ProtectedRoute role="ADMIN">
            <BulkWaterPurchases />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/apartments"
        element={
          <ProtectedRoute role = "ADMIN">
            <Apartments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/households"
        element={
          <ProtectedRoute role="ADMIN">
            <Households />
          </ProtectedRoute>
        }
      />

      <Route
        path="/billing-cycles"
        element={
          <ProtectedRoute role="ADMIN">
            <BillingCycles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/meters"
        element={
          <ProtectedRoute role="ADMIN">
            <MeterConfig />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/tariff-plans" 
        element={
          <ProtectedRoute role="ADMIN">
            <TariffPlans />
          </ProtectedRoute>
        } />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
    </AnimatePresence>
    </>
  );
}

export default App;