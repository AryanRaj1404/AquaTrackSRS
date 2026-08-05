import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FileDown } from "lucide-react";
import { getUsageLogsByHousehold } from "../../services/usageLogService";

/**
 * Lets the resident download their own usage history as a CSV file.
 */
function UsageReportDownload({ householdId }) {
  const { t } = useTranslation();
  const [downloading, setDownloading] = useState(false);

  const toCsv = (rows) => {
    const header = [
      t("residentDashboard.usageReport.csvHeaders.0"),
      t("residentDashboard.usageReport.csvHeaders.1"),
      t("residentDashboard.usageReport.csvHeaders.2"),
      t("residentDashboard.usageReport.csvHeaders.3"),
    ];

    const lines = rows.map((row) =>
      [
        row.usageDate,
        row.litersConsumed,
        row.source,
        row.billingCycleId ?? "",
      ].join(",")
    );

    return [header.join(","), ...lines].join("\n");
  };

  const handleDownload = async () => {
    if (!householdId) {
      toast.error(t("residentDashboard.usageReport.noHousehold"));
      return;
    }

    setDownloading(true);
    try {
      const logs = await getUsageLogsByHousehold(householdId);

      if (!logs || logs.length === 0) {
        toast.error(t("residentDashboard.usageReport.noData"));
        return;
      }

      const csv = toCsv(logs);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `water-usage-household-${householdId}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(t("residentDashboard.usageReport.downloaded"));
    } catch {
      toast.error(t("residentDashboard.usageReport.couldNotGenerate"));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.div
      className="mg-panel"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="mg-toolbar">
        <div>
          <h2>{t("residentDashboard.usageReport.title")}</h2>
          <p>{t("residentDashboard.usageReport.subtitle")}</p>
        </div>
      </div>

      <button
        type="button"
        className="mg-primary-button"
        onClick={handleDownload}
        disabled={downloading}
      >
        <FileDown size={16} />
        {downloading ? t("residentDashboard.usageReport.preparing") : t("residentDashboard.usageReport.downloadCsv")}
      </button>
    </motion.div>
  );
}

export default UsageReportDownload;
