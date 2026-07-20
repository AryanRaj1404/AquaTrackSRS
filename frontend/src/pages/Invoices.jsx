import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";

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
                "Unable to load invoices."
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
                "Invoice downloaded."
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Unable to download invoice."
            );

        }

    };

    const handleEmail = async (invoice) => {

        const loadingToast =
            toast.loading(
                "Sending invoice..."
            );

        try {

            await emailInvoice(invoice.id);

            toast.success(

                "Invoice emailed successfully.",

                {
                    id: loadingToast,
                }

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??

                "Unable to send invoice.",

                {
                    id: loadingToast,
                }

            );

        }

    };

    const handleEmailAll = async () => {

        if (!selectedBillingCycle) {

            toast.error(
                "Select a billing cycle."
            );

            return;

        }

        const loadingToast =
            toast.loading(
                "Sending invoices..."
            );

        try {

            const result =
                await emailBillingCycleInvoices(
                    selectedBillingCycle
                );

            await loadInvoices();

            toast.success(

                `Emails sent: ${result.emailsSent}/${result.totalInvoices}
                Failed: ${result.failed}`,

                {
                    id: loadingToast,
                }

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??

                "Unable to send invoices.",

                {
                    id: loadingToast,
                }

            );

        }

    };

    const handleMarkPaid = async (invoice) => {

        if (invoice.status === "PAID") {

            toast(
                "Invoice is already paid."
            );

            return;

        }

        const loadingToast =
            toast.loading(
                "Updating invoice..."
            );

        try {

            await markInvoicePaid(invoice.id);

            await loadInvoices();

            toast.success(

                "Invoice marked as paid.",

                {
                    id: loadingToast,
                }

            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                "Unable to update invoice.",

                {
                    id: loadingToast,
                }

            );

        }

    };

    const handleGenerateInvoices = async () => {

        if (!selectedBillingCycle) {

            toast.error(
                "Select a billing cycle."
            );

            return;

        }

        const loadingToast =
            toast.loading(
                "Generating invoices..."
            );

        try {

            setIsGenerating(true);

            await generateInvoices(
                selectedBillingCycle
            );

            await loadInvoices();

            toast.success(
                "Invoices generated successfully.",
                {
                    id: loadingToast,
                }
            );

        }

        catch (error) {

            console.error(error);

            toast.error(

                error.response?.data?.message ??

                "Unable to generate invoices.",

                {
                    id: loadingToast,
                }

            );

        }

        finally {

            setIsGenerating(false);

        }

    };

    const filteredInvoices = useMemo(() => {

        const keyword = query.toLowerCase();

        return invoices.filter((invoice) =>

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

    }, [invoices, query]);

    const totalInvoices =
            invoices.length;

    const paidInvoices =
            invoices.filter(
                invoice =>
                    invoice.status === "PAID"
            ).length;

    const pendingInvoices =
            invoices.filter(
                invoice =>
                    invoice.status !== "PAID" &&
                    invoice.status !== "CANCELLED"
            ).length;

    const totalRevenue =
            invoices.reduce(

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
    Select Billing Cycle
    </option>

    {billingCycles.map((cycle) => (

    <option
        key={cycle.id}
        value={cycle.id}
    >

    {cycle.startDate} - {cycle.endDate}

    </option>

    ))}

    </select>

    <button
        className="mg-primary-button"
        onClick={handleGenerateInvoices}
        disabled={isGenerating}
        >
        <Plus size={16}/>
        Generate
    </button>

    <button
        className="mg-secondary-button"
        onClick={handleEmailAll}
    >
        Email All
    </button>

    </div>

    }

            title="Invoice Management"

            description="View and manage generated water invoices."

            searchValue={query}

            onSearchChange={setQuery}

            searchPlaceholder="Search invoice, apartment or flat..."

        >

            <section className="mg-summary-grid">

                <StatCard

                    icon={Receipt}

                    title="Invoices"

                    value={totalInvoices}

                    description="Generated invoices"

                />

                <StatCard

                    icon={Users}

                    title="Pending"

                    value={pendingInvoices}

                    description="Awaiting payment"

                />

                <StatCard

                    icon={Building2}

                    title="Paid"

                    value={paidInvoices}

                    description="Completed payments"

                />

                <StatCard

                    icon={IndianRupee}

                    title="Revenue"

                    value={`₹ ${totalRevenue.toLocaleString("en-IN")}`}

                    description="Invoice amount"

                />

            </section>

            <section className="mg-panel">

                <div className="mg-toolbar">

                    <div>

                        <h2>Invoice Records</h2>

                        <p>
                            Generated invoices are listed below.
                        </p>

                    </div>

                </div>

                {isLoading ? (

                    <div className="mg-empty-state">

                        <Loader2
                            size={36}
                            className="animate-spin"
                        />

                        <h3>Loading invoices...</h3>

                        <p>
                            Please wait while invoices are fetched.
                        </p>

                    </div>

                ) : filteredInvoices.length > 0 ? (

                    <div className="mg-table-wrapper">

                        <table className="mg-table">

                            <thead>

                                <tr>

                                    <th>Invoice</th>

                                    <th>Apartment</th>

                                    <th>Flat</th>

                                    <th>Amount</th>

                                    <th>Status</th>

                                    <th>Generated</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredInvoices.map((invoice) => (

                                    <tr key={invoice.id}>

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
                                                {invoice.status}
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

                        title="No invoices found"

                        description="Generate invoices from a billing cycle."

                    />

                )}

            </section>

        </AdminPageShell>

    );

}

export default Invoices;