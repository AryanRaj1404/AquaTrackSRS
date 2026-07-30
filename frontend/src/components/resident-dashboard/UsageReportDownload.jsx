import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FileDown } from "lucide-react";
import { getUsageLogsByHousehold } from "../../services/usageLogService";

function toCsv(rows) {
  const header = ["Date", "Liters Consumed", "Source", "Billing Cycle ID"];

  const lines = rows.map((row) =>
    [
      row.usageDate,
      row.litersConsumed,
      row.source,
      row.billingCycleId ?? "",
    ].join(",")
  );

  return [header.join(","), ...lines].join("\n");
}

/**
 * Lets the resident download their own usage history as a CSV file.
 */
function UsageReportDownload({ householdId }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!householdId) {
      toast.error("No household linked to this account");
      return;
    }

    setDownloading(true);
    try {
      const logs = await getUsageLogsByHousehold(householdId);

      if (!logs || logs.length === 0) {
        toast.error("No usage data to export yet");
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

      toast.success("Usage report downloaded");
    } catch {
      toast.error("Could not generate usage report");
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
          <h2>Usage Report</h2>
          <p>Download your complete water usage history as a CSV</p>
        </div>
      </div>

      <button
        type="button"
        className="mg-primary-button"
        onClick={handleDownload}
        disabled={downloading}
      >
        <FileDown size={16} />
        {downloading ? "Preparing..." : "Download CSV"}
      </button>
    </motion.div>
  );
}

export default UsageReportDownload;
