import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  Droplets, 
  FileWarning, 
  Clock, 
  Wrench, 
  ShieldAlert,
  CheckCircle2,
  XCircle,
  RefreshCw
} from "lucide-react";
import adminDashboardService from "../services/adminDashboardService";

export default function AdminAlertPanel() {
  const [alerts, setAlerts] = useState([]);
  const [summary, setSummary] = useState({ criticalAlerts: 0, pendingAlerts: 0, resolvedToday: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchAlertData = async () => {
    try {
      setError(null);
      const [alertsData, summaryData] = await Promise.all([
        adminDashboardService.getAdminAlerts(),
        adminDashboardService.getAdminAlertSummary()
      ]);
      setAlerts(alertsData);
      setSummary(summaryData);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch alerts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertData();
    const interval = setInterval(fetchAlertData, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityStyles = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-700 border-red-200";
      case "HIGH":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "LOW":
        return "bg-[#eef7fb] text-[#0781a5] border-[#bce3f0]";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const s = status?.toUpperCase();
    if (s === "RESOLVED") return <CheckCircle2 size={14} className="text-green-600" />;
    if (s === "UNRESOLVED" || s === "PENDING") return <XCircle size={14} className="text-red-500" />;
    return <Clock size={14} className="text-[#0781a5]" />;
  };

  const getAlertIcon = (severity) => {
    switch (severity?.toUpperCase()) {
      case "CRITICAL": return <Droplets size={20} />;
      case "HIGH": return <AlertTriangle size={20} />;
      case "MEDIUM": return <FileWarning size={20} />;
      case "LOW": return <Wrench size={20} />;
      default: return <Clock size={20} />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100 overflow-hidden flex flex-col h-full max-h-[800px]">
      
      {/* Header Section */}
      <div className="p-5 border-b border-slate-100 bg-[#eef7fb]/50 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="text-[#06334b]" size={24} />
            <h2 className="text-xl font-bold text-[#06334b]">Alert Panel</h2>
          </div>
          <p className="text-sm text-[#075d78]">Monitor critical water usage and system alerts</p>
        </div>
        <div className="text-xs text-slate-500 flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-slate-200">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-3 gap-3 p-4 border-b border-slate-100 bg-white">
        <div className="bg-red-50 rounded-lg p-3 text-center border border-red-100">
          <p className="text-xs text-red-600 font-semibold mb-1 uppercase tracking-wide">Critical Alerts</p>
          <p className="text-2xl font-bold text-red-700">{summary.criticalAlerts}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center border border-amber-100">
          <p className="text-xs text-amber-600 font-semibold mb-1 uppercase tracking-wide">Pending Alerts</p>
          <p className="text-2xl font-bold text-amber-700">{summary.pendingAlerts}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
          <p className="text-xs text-green-600 font-semibold mb-1 uppercase tracking-wide">Resolved Today</p>
          <p className="text-2xl font-bold text-green-700">{summary.resolvedToday}</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {loading && alerts.length === 0 ? (
          <div className="flex justify-center items-center h-32 text-slate-500">
            <RefreshCw className="animate-spin mr-2" size={20} /> Loading alerts...
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center border border-red-200">
            {error}
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-32 text-slate-400">
            <CheckCircle2 size={32} className="mb-2 text-[#0781a5] opacity-50" />
            <p>No active alerts right now.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4"
            >
              
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#eef7fb] text-[#0781a5] flex items-center justify-center">
                  {getAlertIcon(alert.severity)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-2">
                  <h3 className="text-sm font-bold text-[#06334b] truncate">{alert.title}</h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap font-medium">
                    {new Date(alert.time).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                  {alert.description} <br/>
                  <span className="font-semibold text-xs mt-1 block">Location: {alert.apartmentName}</span>
                </p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getSeverityStyles(alert.severity)}`}>
                    {alert.severity}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {getStatusIcon(alert.status)}
                    {alert.status}
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}
