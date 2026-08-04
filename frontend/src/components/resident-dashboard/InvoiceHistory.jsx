import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Download, Receipt } from "lucide-react";
import {
  getInvoicesByHousehold,
  downloadInvoicePdf,
} from "../../services/invoiceService";
import ResponsiveTable from "../ResponsiveTable";

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
        if (!ignore) toast.error("Could not load invoice history");
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
      toast.error("Could not download invoice");
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
          <h2>Invoice History</h2>
          <p>All invoices generated for your household</p>
        </div>
      </div>

      {loading && <div className="mg-empty-state">Loading invoices...</div>}

      {!loading && invoices.length === 0 && (
        <div className="mg-empty-state">
          <Receipt size={28} style={{ marginBottom: 8 }} />
          <p>No invoices yet</p>
        </div>
      )}

      {!loading && invoices.length > 0 && (
        <div className="mg-table-wrapper">
          <ResponsiveTable>
          <table className="mg-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Date</th>
                <th>Consumption</th>
                <th>Amount</th>
                <th>Status</th>
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
                      {invoice.status}
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
                      {downloadingId === invoice.id ? "..." : "PDF"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </ResponsiveTable>
        </div>
      )}
    </motion.div>
  );
}

export default InvoiceHistory;
