import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Activity, Building2, PieChart as PieChartIcon, RefreshCw } from "lucide-react";
import adminDashboardService from "../services/adminDashboardService";

const COLORS = {
  darkTeal: "#06334b",
  teal: "#075d78",
  primaryTeal: "#0781a5",
  lightBlue: "#eef7fb",
  gray: "#f1f5f9",
  textGray: "#64748b"
};

const CustomTooltip = ({ active, payload, label, unit = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-[0_4px_12px_-2px_rgba(6,51,75,0.1)] rounded-lg text-sm">
        <p className="font-semibold text-[#06334b] mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-600 capitalize">{entry.name}:</span>
            <span className="font-bold text-[#06334b]">
              {Number(entry.value).toLocaleString()}{unit}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardCharts() {
  const [dataMonthly, setDataMonthly] = useState([]);
  const [dataApartment, setDataApartment] = useState([]);
  const [dataUsage, setDataUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchChartsData = async () => {
    try {
      setError(null);
      const [monthly, apartment, usage] = await Promise.all([
        adminDashboardService.getMonthlyConsumption(),
        adminDashboardService.getApartmentConsumption(),
        adminDashboardService.getUsageStatus()
      ]);
      setDataMonthly(monthly);
      setDataApartment(apartment);
      setDataUsage(usage);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch chart data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData();
    const interval = setInterval(fetchChartsData, 30000); // 30 sec auto refresh
    return () => clearInterval(interval);
  }, []);

  if (loading && dataMonthly.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100">
        <RefreshCw size={32} className="animate-spin text-[#0781a5] mb-4" />
        <p className="text-[#075d78] font-medium">Loading analytics...</p>
      </div>
    );
  }

  if (error && dataMonthly.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-red-50 rounded-xl border border-red-200">
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={fetchChartsData}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full relative">
      
      {/* 1. Monthly Water Consumption Chart */}
      <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100 lg:col-span-2">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
          <div className="p-1.5 bg-[#eef7fb] text-[#0781a5] rounded-lg">
            <Activity size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-[#06334b]">Monthly Water Consumption</h3>
            <p className="text-xs text-[#075d78]">Total water usage trend</p>
          </div>
        </div>
        <div className="h-72 w-full">
          {dataMonthly.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataMonthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorConsumption" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primaryTeal} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.primaryTeal} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.gray} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: COLORS.textGray }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: COLORS.textGray }} />
                <Tooltip content={<CustomTooltip unit=" L" />} />
                <Area 
                  type="monotone" 
                  dataKey="totalConsumption" 
                  name="Consumption" 
                  stroke={COLORS.primaryTeal} 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorConsumption)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 2. Apartment-wise Consumption Chart */}
      <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
          <div className="p-1.5 bg-[#eef7fb] text-[#0781a5] rounded-lg">
            <Building2 size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-[#06334b]">Apartment-wise Consumption</h3>
            <p className="text-xs text-[#075d78]">Compares water consumption between apartments/blocks</p>
          </div>
        </div>
        <div className="h-64 w-full">
          {dataApartment.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataApartment} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.gray} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: COLORS.textGray }} />
                <YAxis 
                  type="category" 
                  dataKey="apartmentName" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: COLORS.darkTeal, fontWeight: 500 }} 
                  width={90}
                />
                <Tooltip content={<CustomTooltip unit=" L" />} cursor={{ fill: COLORS.lightBlue }} />
                <Bar 
                  dataKey="totalConsumption" 
                  name="Consumption" 
                  fill={COLORS.teal} 
                  radius={[0, 6, 6, 0]} 
                  barSize={24}
                >
                  {dataApartment.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.totalConsumption > 1500 ? COLORS.darkTeal : COLORS.primaryTeal} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* 3. Usage Status Summary Chart */}
      <div className="bg-white p-5 rounded-xl shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">
          <div className="p-1.5 bg-[#eef7fb] text-[#0781a5] rounded-lg">
            <PieChartIcon size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-[#06334b]">Usage Status Summary</h3>
            <p className="text-xs text-[#075d78]">Normal, High, and Critical usage distribution</p>
          </div>
        </div>
        <div className="h-64 w-full flex items-center justify-center relative">
          {dataUsage.length === 0 ? (
            <div className="flex items-center justify-center h-full text-slate-400">No data available</div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataUsage}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                    stroke="none"
                  >
                    {dataUsage.map((entry, index) => {
                      let color = COLORS.primaryTeal;
                      if (entry.status === 'High Usage') color = COLORS.teal;
                      if (entry.status === 'Critical Usage') color = COLORS.darkTeal;
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-600 text-sm font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">
                <span className="text-2xl font-bold text-[#06334b]">
                  {dataUsage.reduce((acc, curr) => acc + curr.count, 0)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Total</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
