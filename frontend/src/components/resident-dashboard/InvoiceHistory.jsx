import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Download, Receipt } from "lucide-react";
import {
  getInvoicesByHousehold,
  downloadInvoicePdf,
} from "../../services/invoiceService";

const STATUS_CLASS = {
  PAID: "mg-status mg-status-active",
  GENERATED: "mg-status mg-status-pending",
  SENT: "mg-status mg-status-pending",
  OVERDUE: "mg-status mg-status-pending",
  CANCELLED: "mg-status",
};

/**
 * Reads the household's invoice history and lets them
 * download any invoice as a PDF.
 */
function InvoiceHistory({ householdId }) {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function load() {
      if (!householdId) {
        setLoading(false);
        return;
      }
      try {
        const data = await getInvoicesByHousehold(householdId);
        if (!ignore) {
          setInvoices(
            [...data].sort(
              (a, b) => new Date(b.generatedDate) - new Date(a.generatedDate)
            )
          );
        }
      } catch {
        if (!ignore) toast.error(t("residentDashboard.invoiceHistory.couldNotLoad"));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [householdId]);

  const handleDownload = async (invoice) => {
    setDownloadingId(invoice.id);
    try {
      const response = await downloadInvoicePdf(invoice.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error(t("residentDashboard.invoiceHistory.couldNotDownload"));
    } finally {
      setDownloadingId(null);
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
          <h2>{t("residentDashboard.invoiceHistory.title")}</h2>
          <p>{t("residentDashboard.invoiceHistory.subtitle")}</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">{t("residentDashboard.invoiceHistory.loading")}</div>}

      {!loading && invoices.length === 0 && (
        <div className="mg-empty-state">
          <Receipt size={28} style={{ marginBottom: 8 }} />
          <p>{t("residentDashboard.invoiceHistory.noInvoices")}</p>
        </div>
      )}

      {!loading && invoices.length > 0 && (
        <div className="mg-table-wrapper">
          <table className="mg-table">
            <thead>
              <tr>
                <th>{t("residentDashboard.invoiceHistory.colInvoiceNumber")}</th>
                <th>{t("residentDashboard.invoiceHistory.colDate")}</th>
                <th>{t("residentDashboard.invoiceHistory.colConsumption")}</th>
                <th>{t("residentDashboard.invoiceHistory.colAmount")}</th>
                <th>{t("residentDashboard.invoiceHistory.colStatus")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="mg-table-primary">
                    {invoice.invoiceNumber}
                  </td>
                  <td>{invoice.generatedDate}</td>
                  <td>{invoice.consumptionKl} KL</td>
                  <td>
                    &#8377; {invoice.totalAmount?.toLocaleString("en-IN")}
                  </td>
                  <td>
                    <span
                      className={
                        STATUS_CLASS[invoice.status] || "mg-status"
                      }
                    >
                      {t(`residentDashboard.invoiceHistory.status.${invoice.status}`, {
                        defaultValue: invoice.status,
                      })}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="mg-action-button"
                      onClick={() => handleDownload(invoice)}
                      disabled={downloadingId === invoice.id}
                    >
                      <Download size={14} />
                      {downloadingId === invoice.id ? t("residentDashboard.invoiceHistory.downloading") : t("residentDashboard.invoiceHistory.pdf")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}

export default InvoiceHistory;
