import { Navigate, Route, Routes } from "react-router-dom";

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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
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
  );
}

export default App;