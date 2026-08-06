import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { generateInvoices } from "../services/invoiceService";
import { getBillingCycles } from "../services/billingCycleService";

import {
    Receipt,
    IndianRupee,
    Building2,
    Users,
    Loader2,
    Download,
    Mail,
    CheckCircle2,
} from "lucide-react";

import AdminPageShell from "../components/AdminPageShell";
import StatCard from "../components/StatCard";
import EmptyState from "../components/EmptyState";

import {
    getInvoices,
    downloadInvoicePdf,
    emailInvoice,
    markInvoicePaid,
    emailBillingCycleInvoices,
} from "../services/invoiceService";

function Invoices() {

    const { t } = useTranslation();

    const [invoices, setInvoices] = useState([]);

    const [query, setQuery] = useState("");

    const [isLoading, setIsLoading] = useState(true);

    const [billingCycles, setBillingCycles] = useState([]);

    const [selectedBillingCycle, setSelectedBillingCycle] = useState("");

    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {

        loadInvoices();

        loadBillingCycles();

    }, []);

    const loadInvoices = async () => {

        try {

            setIsLoading(true);

            const data = await getInvoices();

            setInvoices(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                t("invoices.toasts.loadError")
            );

        } finally {

            setIsLoading(false);

        }

    };

    const loadBillingCycles = async () => {

        try {

            const data =
                await getBillingCycles();

            setBillingCycles(
                Array.isArray(data)
                    ? data
                    : []
            );

        }

        catch (error) {

            console.error(error);

        }

    };

    const handleDownload = async (invoice) => {

        try {

            const response =
                await downloadInvoicePdf(invoice.id);

            const blob = new Blob(
                [response.data],
                {
                    type: "application/pdf",
                }
            );

            const url =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                `${invoice.invoiceNumber}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            toast.success(
                t("invoices.toasts.downloadSuccess")
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                t("invoices.toasts.downloadError")
            );

        }

    };

    const handleEmail = async (invoice) => {

        const loadingToast =
            toast.loading(
                t("invoices.toasts.sending")
            );

        try {

            await emailInvoice(invoice.id);

            toast.success(

                t("invoices.toasts.emailSuccess"),

                {
                    id: loadingToast,
                }

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??

                t("invoices.toasts.emailError"),

                {
                    id: loadingToast,
                }

            );

        }

    };

    const handleEmailAll = async () => {

        if (!selectedBillingCycle) {

            toast.error(
                t("invoices.toasts.selectCycle")
            );

            return;

        }

        const loadingToast =
            toast.loading(
                t("invoices.toasts.sendingAll")
            );

        try {

            const result =
                await emailBillingCycleInvoices(
                    selectedBillingCycle
                );

            await loadInvoices();

            toast.success(

                t("invoices.toasts.emailAllSuccess", { sent: result.emailsSent, total: result.totalInvoices, failed: result.failed }),

                {
                    id: loadingToast,
                }

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??

                t("invoices.toasts.emailAllError"),

                {
                    id: loadingToast,
                }

            );

        }

    };

    const handleMarkPaid = async (invoice) => {

        if (invoice.status === "PAID") {

            toast(
                t("invoices.toasts.alreadyPaid")
            );

            return;

        }

        const loadingToast =
            toast.loading(
                t("invoices.toasts.updating")
            );

        try {

            await markInvoicePaid(invoice.id);

            await loadInvoices();

            toast.success(

                t("invoices.toasts.markPaidSuccess"),

                {
                    id: loadingToast,
                }

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                t("invoices.toasts.markPaidError"),

                {
                    id: loadingToast,
                }

            );

        }

    };

    const handleGenerateInvoices = async () => {

        if (!selectedBillingCycle) {

            toast.error(
                t("invoices.toasts.selectCycle")
            );

            return;

        }

        const loadingToast =
            toast.loading(
                t("invoices.toasts.generating")
            );

        try {

            setIsGenerating(true);

            await generateInvoices(
                selectedBillingCycle
            );

            await loadInvoices();

            toast.success(
                t("invoices.toasts.generateSuccess"),
                {
                    id: loadingToast,
                }
            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??

                t("invoices.toasts.generateError"),

                {
                    id: loadingToast,
                }

            );

        }

        finally {

            setIsGenerating(false);

        }

    };

    const displayedInvoices = useMemo(() => {

    let filtered = invoices;

    // Filter by selected billing cycle
    if (selectedBillingCycle) {

        filtered = filtered.filter(

            invoice =>

                String(invoice.billingCycleId) ===

                String(selectedBillingCycle)

        );

    }

    // Apply search on filtered invoices
    if (query.trim()) {

        const keyword = query.toLowerCase();

        filtered = filtered.filter(

            invoice =>

                invoice.invoiceNumber
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                invoice.flatNumber
                    ?.toLowerCase()
                    .includes(keyword)

                ||

                invoice.apartmentName
                    ?.toLowerCase()
                    .includes(keyword)

        );

    }

    return filtered;

}, [

    invoices,

    selectedBillingCycle,

    query,

]);

    const totalInvoices =
            displayedInvoices.length;

    const paidInvoices =
            displayedInvoices.filter(
                invoice =>
                    invoice.status === "PAID"
            ).length;

    const pendingInvoices =
            displayedInvoices.filter(
                invoice =>
                    invoice.status !== "PAID" &&
                    invoice.status !== "CANCELLED"
            ).length;

    const totalRevenue =
            displayedInvoices.reduce(

                (sum, invoice) =>

                    sum +
                    Number(invoice.totalAmount),

                0

            );

    const getStatusStyle = (status) => {

        switch (status) {

            case "PAID":
                return {
                    background: "#dcfce7",
                    color: "#166534",
                };

            case "GENERATED":
                return {
                    background: "#fef3c7",
                    color: "#92400e",
                };

            case "SENT":
                return {
                    background: "#dbeafe",
                    color: "#1d4ed8",
                };

            case "OVERDUE":
                return {
                    background: "#fee2e2",
                    color: "#b91c1c",
                };

            case "CANCELLED":
                return {
                    background: "#e5e7eb",
                    color: "#374151",
                };

            default:
                return {};
        }

    };

    return (

        <AdminPageShell

                action={

    <div
        style={{
            display: "flex",
            gap: "10px",
        }}
    >

    <select

        className="mg-select"

        value={selectedBillingCycle}

        onChange={(e) =>
            setSelectedBillingCycle(
                e.target.value
            )
        }

    >

    <option value="">
    {t("invoices.selectBillingCycle")}
    </option>

    {billingCycles.map((cycle) => (

    <option
        key={cycle.id}
        value={cycle.id}
    >

    {cycle.apartmentName ?? t("invoices.unknownApartment")} | {new Date(cycle.startDate).toLocaleString("en-IN",{
        month: "long",
        year: "numeric",
    })}

    </option>

    ))}

    </select>

    <button
        className="mg-primary-button"
        onClick={handleGenerateInvoices}
        disabled={isGenerating}
        >
        <Plus size={16}/>
        {t("invoices.generate")}
    </button>

    <button
        className="mg-secondary-button"
        onClick={handleEmailAll}
    >
        {t("invoices.emailAll")}
    </button>

    </div>

    }

            title={t("invoices.pageTitle")}

            description={t("invoices.pageDesc")}

            searchValue={query}

            onSearchChange={setQuery}

            searchPlaceholder={t("invoices.searchPlaceholder")}

        >

            <section className="mg-summary-grid">

                <StatCard

                    icon={Receipt}

                    title={t("invoices.stats.invoicesTitle")}

                    value={totalInvoices}

                    description={t("invoices.stats.invoicesDesc")}

                    delay={0}

                />

                <StatCard

                    icon={Users}

                    title={t("invoices.stats.pendingTitle")}

                    value={pendingInvoices}

                    description={t("invoices.stats.pendingDesc")}

                    delay={0.1}

                />

                <StatCard

                    icon={Building2}

                    title={t("invoices.stats.paidTitle")}

                    value={paidInvoices}

                    description={t("invoices.stats.paidDesc")}

                    delay={0.2}

                />

                <StatCard

                    icon={IndianRupee}

                    title={t("invoices.stats.revenueTitle")}

                    value={`₹ ${totalRevenue.toLocaleString("en-IN")}`}

                    description={t("invoices.stats.revenueDesc")}

                    delay={0.3}

                />

            </section>

            <section className="mg-panel">

                <div className="mg-toolbar">

                    <div>

                        <h2>{t("invoices.recordsTitle")}</h2>

                        <p>
                            {t("invoices.recordsSubtitle")}
                        </p>

                    </div>

                </div>

                {isLoading ? (

                    <div className="mg-empty-state">

                        <Loader2
                            size={36}
                            className="animate-spin"
                        />

                        <h3>{t("invoices.loading")}</h3>

                        <p>
                            {t("invoices.pleaseWait")}
                        </p>

                    </div>

                ) : displayedInvoices.length > 0 ? (

                    <div className="mg-table-wrapper">

                        <table className="mg-table">

                            <thead>

                                <tr>

                                    <th>{t("invoices.table.colInvoice")}</th>

                                    <th>{t("invoices.table.colApartment")}</th>

                                    <th>{t("invoices.table.colFlat")}</th>

                                    <th>{t("invoices.table.colAmount")}</th>

                                    <th>{t("invoices.table.colStatus")}</th>

                                    <th>{t("invoices.table.colGenerated")}</th>

                                    <th>{t("invoices.table.colActions")}</th>

                                </tr>

                            </thead>

                            <tbody>

                                {displayedInvoices.map((invoice) => (

                                    <tr className="hover:bg-slate-50 transition-colors"
                                    key={invoice.id}>

                                        <td>

                                            <span className="mg-table-primary">

                                                {invoice.invoiceNumber}

                                            </span>

                                        </td>

                                        <td>

                                            {invoice.apartmentName}

                                        </td>

                                        <td>

                                            {invoice.flatNumber}

                                        </td>

                                        <td>

                                            ₹ {Number(
                                                invoice.totalAmount)
                                                .toLocaleString("en-IN", 
                                                {
                                                    minimumFractionDigits : 2,
                                                    maximumFractionDigits : 2,
                                                }
                                            )}

                                        </td>

                                        <td>

                                            <span
                                                className="mg-status"
                                                style={getStatusStyle(invoice.status)}
                                            >
                                                {t(`residentDashboard.invoiceHistory.status.${invoice.status}`, { defaultValue: invoice.status })}
                                            </span>

                                        </td>

                                        <td>

                                            {new Date(
                                                invoice.generatedDate
                                            ).toLocaleDateString(
                                                "en-GB",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                }
                                            )}

                                        </td>

                                        <td>

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    className="mg-action-button"
                                                    onClick={() =>
                                                        handleDownload(invoice)
                                                    }
                                                >
                                                    <Download size={15}></Download>
                                                </button>

                                                <button
                                                    type="button"
                                                    className="mg-action-button"
                                                    onClick={() =>
                                                        handleEmail(invoice)
                                                    }
                                                >
                                                    <Mail size={15} />

                                                </button>

                                                <button
                                                    type="button"
                                                    className="mg-action-button"
                                                    onClick={() =>
                                                        handleMarkPaid(invoice)
                                                    }
                                                >
                                                    <CheckCircle2 size={15} />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <EmptyState

                        icon={Receipt}

                        title={t("invoices.noInvoicesFound")}

                        description={t("invoices.noInvoicesDesc")}

                    />

                )}

            </section>

        </AdminPageShell>

    );

}

export default Invoices;