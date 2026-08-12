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
  PAID: "bg-emerald-100 text-emerald-700",
  GENERATED: "bg-blue-100 text-blue-700",
  SENT: "bg-amber-100 text-amber-700",
  OVERDUE: "bg-red-100 text-red-700",
  CANCELLED: "bg-slate-200 text-slate-600",
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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-3xl bg-white p-6 shadow-sm"
  >
    {/* Header */}
    <div className="mb-6 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
          Billing
        </p>

        <h2 className="mt-1 text-2xl font-bold">
          {t("residentDashboard.invoiceHistory.title")}
        </h2>

        <p className="text-sm text-slate-500">
          {t("residentDashboard.invoiceHistory.subtitle")}
        </p>
      </div>
    </div>

    {/* Loading */}

    {loading && (
      <div className="flex h-56 items-center justify-center text-slate-500">
        {t("residentDashboard.invoiceHistory.loading")}
      </div>
    )}

    {/* Empty */}

    {!loading && invoices.length === 0 && (
      <div className="flex h-56 flex-col items-center justify-center text-slate-400">
        <Receipt size={48} />

        <p className="mt-4">
          {t("residentDashboard.invoiceHistory.noInvoices")}
        </p>
      </div>
    )}

    {/* Desktop Table */}

    {!loading && invoices.length > 0 && (
      <>
        <div className="hidden overflow-x-auto lg:block">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
                <th className="py-4">
                  {t("residentDashboard.invoiceHistory.colInvoiceNumber")}
                </th>

                <th>
                  {t("residentDashboard.invoiceHistory.colDate")}
                </th>

                <th>
                  {t("residentDashboard.invoiceHistory.colConsumption")}
                </th>

                <th>
                  {t("residentDashboard.invoiceHistory.colAmount")}
                </th>

                <th>
                  {t("residentDashboard.invoiceHistory.colStatus")}
                </th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="py-5 font-semibold">
                    {invoice.invoiceNumber}
                  </td>

                  <td>{invoice.generatedDate}</td>

                  <td>{invoice.consumptionKl} KL</td>

                  <td>
                    ₹ {invoice.totalAmount?.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_CLASS[invoice.status]
                      }`}
                    >
                      {t(
                        `residentDashboard.invoiceHistory.status.${invoice.status}`,
                        {
                          defaultValue: invoice.status,
                        }
                      )}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() => handleDownload(invoice)}
                      disabled={downloadingId === invoice.id}
                      className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-white transition hover:bg-cyan-700 disabled:opacity-60"
                    >
                      <Download size={16} />

                      {downloadingId === invoice.id
                        ? t(
                            "residentDashboard.invoiceHistory.downloading"
                          )
                        : t(
                            "residentDashboard.invoiceHistory.pdf"
                          )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}

        <div className="space-y-4 lg:hidden">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">
                    {invoice.invoiceNumber}
                  </p>

                  <p className="text-sm text-slate-500">
                    {invoice.generatedDate}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    STATUS_CLASS[invoice.status]
                  }`}
                >
                  {t(
                    `residentDashboard.invoiceHistory.status.${invoice.status}`,
                    {
                      defaultValue: invoice.status,
                    }
                  )}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">
                    Consumption
                  </p>

                  <p className="font-semibold">
                    {invoice.consumptionKl} KL
                  </p>
                </div>

                <div>
                  <p className="text-slate-500">
                    Amount
                  </p>

                  <p className="font-semibold">
                    ₹{" "}
                    {invoice.totalAmount?.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDownload(invoice)}
                disabled={downloadingId === invoice.id}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 py-3 text-white transition hover:bg-cyan-700"
              >
                <Download size={18} />

                {downloadingId === invoice.id
                  ? t(
                      "residentDashboard.invoiceHistory.downloading"
                    )
                  : t(
                      "residentDashboard.invoiceHistory.pdf"
                    )}
              </button>
            </div>
          ))}
        </div>
      </>
    )}
  </motion.div>
);
}

export default InvoiceHistory;
