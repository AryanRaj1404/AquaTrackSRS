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
  Legend,
} from "recharts";
import {
  Activity,
  Building2,
  PieChart as PieChartIcon,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import adminDashboardService from "../../services/adminDashboardService";
import { useWorkspace } from "../../context/WorkspaceContext";

const COLORS = {
  darkTeal: "#06334b",
  teal: "#075d78",
  primaryTeal: "#0781a5",
  lightBlue: "#eef7fb",
  gray: "#f1f5f9",
  textGray: "#64748b",
};

export default function AdminDashboardCharts() {
  const { t, i18n } = useTranslation();
  const { workspaceId } = useWorkspace();

  const localeMap = {
    en: "en-IN",
    hi: "hi-IN",
    kn: "kn-IN",
    ml: "ml-IN",
    ta: "ta-IN",
    te: "te-IN",
};

  const [chartData, setChartData] = useState([]);
  const [dataApartment, setDataApartment] = useState([]);
  const [dataUsage, setDataUsage] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [viewMode, setViewMode] = useState("daily");
  const [timeRange, setTimeRange] = useState("1M");

  const [lastUpdated, setLastUpdated] = useState(
    new Date()
  );

  const CustomTooltip = ({
  active,
  payload,
  label,
  unit = "",
  t,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-[0_4px_12px_-2px_rgba(6,51,75,0.1)] rounded-lg text-sm">
        <p className="font-semibold text-[#06334b] mb-1">
          {
            new Date(label).toLocaleDateString(
              localeMap[i18n.language] || "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              }
            )
          }
        </p>

        {payload.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2"
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: entry.color,
              }}
            />

            <span className="text-slate-600 capitalize">
              {t("adminCharts.consumptionLabel")}
            </span>

            <span className="font-bold text-[#06334b]">
              {Number(entry.value).toLocaleString()}
              {unit}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

  const fetchChartsData = async () => {
    try {
      setError(null);

      const [
        consumption,
        apartment,
        usage,
      ] = await Promise.all([
        adminDashboardService.getConsumptionTrend(
          viewMode,
          timeRange
        ),
        adminDashboardService.getApartmentConsumption(),
        adminDashboardService.getUsageStatus(),
      ]);

      setChartData(consumption);

      setDataApartment(
        apartment
          .sort(
            (a, b) =>
              b.totalConsumption -
              a.totalConsumption
          )
          .slice(0, 10)
      );

      setDataUsage(usage);

      setLastUpdated(new Date());
    } catch (err) {
      setError(t("adminCharts.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartsData();
  }, [workspaceId, viewMode, timeRange]);

  useEffect(() => {
    const interval = setInterval(
      fetchChartsData,
      30000
    );

    return () => clearInterval(interval);
  }, [workspaceId, viewMode, timeRange]);

  if (loading && chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-white rounded-[30px] shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100">
        <RefreshCw
          size={32}
          className="animate-spin text-teal-700 mb-4"
        />

        <p className="text-[#075d78] font-medium">
          {t("adminCharts.loadingAnalytics")}
        </p>
      </div>
    );
  }

  if (error && chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 w-full bg-red-50 rounded-[30px] border border-red-200">
        <p className="text-red-600 font-medium">
          {error}
        </p>

        <button
          onClick={fetchChartsData}
          className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
        >
          {t("adminCharts.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full relative">
            {/* 1. Consumption Trends */}
      <div className="bg-white p-7 rounded-[30px] shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100 lg:col-span-2">

        <div
          className="
            mb-6
            flex
            flex-col
            gap-5
            border-b
            border-slate-100
            pb-5
            lg:flex-row
            lg:items-start
            lg:justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <Activity size={22} />
            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-[0.30em] text-teal-600 mb-1">
                {t("adminCharts.analytics")}
              </p>

              <h3 className="text-xl font-bold text-[#06334b]">
                {t("adminCharts.consumptionTrends")}
              </h3>

              <p className="text-sm text-[#075d78]">
                {t("adminCharts.consumptionTrendsSubtitle")}
              </p>

            </div>

          </div>

          <div
            className="
              flex
              w-full
              flex-col
              gap-2
              rounded-2xl
              bg-slate-50
              p-2
              lg:w-auto
              lg:items-end
            "
          >

            {/* Daily / Monthly */}

            <div className="flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">

              <button
                onClick={() => setViewMode("daily")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 sm:flex-none ${
                  viewMode === "daily"
                    ? "bg-teal-700 text-white shadow"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t("adminCharts.daily")}
              </button>

              <button
                onClick={() => setViewMode("monthly")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 sm:flex-none ${
                  viewMode === "monthly"
                    ? "bg-teal-700 text-white shadow"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {t("adminCharts.monthly")}
              </button>

            </div>

            {/* Time Range */}

            <div className="grid grid-cols-4 gap-2 w-full sm:flex sm:w-auto">

              {["1M", "3M", "6M", "1Y"].map((range) => (

                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`w-full rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                    timeRange === range
                      ? "bg-teal-700 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {range}
                </button>

              ))}

            </div>

          </div>

        </div>

        <div className="h-[360px] w-full">

          {chartData.length === 0 ? (

            <div className="flex items-center justify-center h-full text-slate-400">
              {t("adminCharts.noDataAvailable")}
            </div>

          ) : (

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 15,
                }}
              >

                <defs>

                  <linearGradient
                    id="consumptionGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopColor={COLORS.primaryTeal}
                      stopOpacity={0.35}
                    />

                    <stop
                      offset="95%"
                      stopColor={COLORS.primaryTeal}
                      stopOpacity={0}
                    />

                  </linearGradient>

                </defs>

                <CartesianGrid
                  strokeDasharray="2 6"
                  vertical={false}
                  stroke={COLORS.gray}
                />

                <XAxis
    dataKey="label"
    axisLine={false}
    tickLine={false}
    minTickGap={50}
    label={{
        value: t("adminCharts.date"),
        position: "insideBottom",
        offset: -5,
        style: {
            fill: "#64748b",
            fontSize: 13,
            fontWeight: 600,
        },
    }}
    tick={{
        fontSize: 13,
        fill: "#64748b",
    }}
    tickFormatter={(value) => {
        const date = new Date(value);

        if (viewMode === "daily") {
            return date.toLocaleDateString(localeMap[i18n.language] || "en-IN", {
                day: "numeric",
                month: "short",
            });
        }

        return date.toLocaleDateString(localeMap[i18n.language] || "en-IN", {
            month: "short",
            year: "numeric",
        });
    }}
/>

<YAxis
    axisLine={false}
    tickLine={false}
    label={{
        value: t("adminCharts.consumptionAxis"),
        angle: -90,
        position: "insideLeft",
        style: {
            fill: "#64748b",
            fontSize: 13,
            fontWeight: 600,
        },
    }}
/>

                <Tooltip
                  content={
                    <CustomTooltip
                      unit=" KL"
                      t={t}
                    />
                  }
                />

                <Area
                  type="monotone"
                  dataKey="totalConsumption"
                  stroke={COLORS.primaryTeal}
                  strokeWidth={4}
                  fill="url(#consumptionGradient)"
                  dot={{
                    r: 5,
                    strokeWidth: 2,
                    fill: "#0781a5",
                    stroke: "#ffffff",
                  }}
                  activeDot={{
                    r: 7,
                  }}
                  isAnimationActive
                  animationDuration={900}
                  animationEasing="ease-out"
                />

              </AreaChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>


            {/* 2. Apartment-wise Consumption Chart */}
      <div className="bg-white p-7 rounded-[30px] shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)]">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">

          <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
            <Building2 size={20} />
          </div>

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-600 mb-1">
              {t("adminCharts.analytics")}
            </p>

            <h3 className="font-semibold text-[#06334b]">
              {t("adminCharts.apartmentWiseConsumption")}
            </h3>

            <p className="text-xs text-[#075d78]">
              {t("adminCharts.apartmentWiseSubtitle")}
            </p>

          </div>

        </div>

        <div className="h-64 w-full">

          {dataApartment.length === 0 ? (

            <div className="flex items-center justify-center h-full text-slate-400">
              {t("adminCharts.noDataAvailable")}
            </div>

          ) : (

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={dataApartment}
                layout="vertical"
                barCategoryGap="25%"
                margin={{
                  top: 0,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}
              >

                <CartesianGrid
                  strokeDasharray="2 6"
                  horizontal={false}
                  stroke={COLORS.gray}
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: COLORS.textGray,
                  }}
                />

                <YAxis
                  type="category"
                  dataKey="apartmentName"
                  interval={0}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                  tick={{
                    fontSize: 12,
                    fill: COLORS.textGray,
                  }}
                />

                <Tooltip
                  content={<CustomTooltip unit=" KL" t={t} />}
                  cursor={{ fill: COLORS.lightBlue }}
                />

                <Bar
                  dataKey="totalConsumption"
                  name={t("adminCharts.consumption")}
                  fill={COLORS.teal}
                  radius={[0, 6, 6, 0]}
                  barSize={12}
                >

                  {dataApartment.map((entry, index) => (

                    <Cell
                      key={index}
                      fill={
                        entry.totalConsumption > 1500
                          ? COLORS.darkTeal
                          : COLORS.primaryTeal
                      }
                    />

                  ))}

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          )}

        </div>

      </div>

      {/* 3. Usage Status Summary */}

      <div className="bg-white p-7 rounded-[30px] shadow-[0_4px_20px_-4px_rgba(6,51,75,0.05)] border border-slate-100">

        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-3">

          <div className="p-1.5 bg-teal-50 text-teal-700 rounded-lg">
            <PieChartIcon size={20} />
          </div>

          <div>

            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-600 mb-1">
              {t("adminCharts.analytics")}
            </p>

            <h3 className="font-semibold text-[#06334b]">
              {t("adminCharts.usageStatusSummary")}
            </h3>

            <p className="text-xs text-[#075d78]">
              {t("adminCharts.usageStatusSubtitle")}
            </p>

          </div>

        </div>

        <div className="h-64 w-full flex items-center justify-center relative">

          {dataUsage.length === 0 ? (

            <div className="flex items-center justify-center h-full text-slate-400">
              {t("adminCharts.noDataAvailable")}
            </div>

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

                      if (entry.status === "High Usage")
                        color = COLORS.teal;

                      if (entry.status === "Critical Usage")
                        color = COLORS.darkTeal;

                      return (
                        <Cell
                          key={index}
                          fill={color}
                        />
                      );

                    })}

                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [value, name]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    formatter={(value) => {

                      const map = {
                          "Normal Usage":
                              t("adminCharts.normalUsage"),

                          "High Usage":
                              t("adminCharts.highUsage"),

                          "Critical Usage":
                              t("adminCharts.criticalUsage"),
                      };

                      return (
                          <span className="text-slate-600 text-sm font-medium">
                              {map[value] || value}
                          </span>
                      );
                  }}
                  />

                </PieChart>

              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-8">

                <span className="text-2xl font-bold text-[#06334b]">
                  {dataUsage.reduce(
                    (acc, curr) => acc + curr.count,
                    0
                  )}
                </span>

                <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                  {t("adminCharts.usageRecords")}
                </span>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}