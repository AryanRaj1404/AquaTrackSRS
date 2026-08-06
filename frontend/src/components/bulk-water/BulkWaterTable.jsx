import {
    Pencil,
    Trash2,
} from "lucide-react";

import Pagination from "../Pagination";
import { useTranslation } from "react-i18next";

function BulkWaterTable({

    purchases,

    openEditModal,

    setPurchaseToDelete,

    setShowDeleteDialog,

    page,

    pageData,

    setPage,

}) {

    const { t } = useTranslation();

    return (

        <div className="mg-table-wrapper">

            <table className="mg-table">

                <thead>

                    <tr>

                        <th>{t("bulkWaterPurchases.table.date")}</th>

                        <th>{t("bulkWaterPurchases.table.apartment")}</th>

                        <th>{t("bulkWaterPurchases.table.billingCycle")}</th>

                        <th>{t("bulkWaterPurchases.table.supplier")}</th>

                        <th>{t("bulkWaterPurchases.table.source")}</th>

                        <th>{t("bulkWaterPurchases.table.volume")}</th>

                        <th>{t("bulkWaterPurchases.table.unitCost")}</th>

                        <th>{t("bulkWaterPurchases.table.totalCost")}</th>

                        <th className="text-center">

                            {t("bulkWaterPurchases.table.actions")}

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {purchases.map((purchase) => (

                        <tr
                            key={purchase.id}
                            className="hover:bg-slate-50 transition-colors"
                        >

                            <td>

                                {new Date(
                                    purchase.purchaseDate
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

                                {purchase.apartmentName}

                            </td>

                            <td>

                                {purchase.billingCycleMonth}

                            </td>

                            <td className="font-medium text-slate-700">

                                {purchase.supplier}

                            </td>

                            <td>

                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        purchase.source === "TANKER"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-sky-100 text-sky-700"
                                    }`}
                                >

                                    {purchase.source === "TANKER"
                                        ? t("bulkWaterPurchases.table.tanker")
                                        : t("bulkWaterPurchases.table.municipal")}

                                </span>

                            </td>

                            <td className="font-semibold">

                                {purchase.volumeKl} {t("bulkWaterPurchases.table.klUnit")}

                            </td>

                            <td className="font-semibold">

                                ₹{" "}

                                {Number(
                                    purchase.unitCost
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}

                            </td>

                            <td className="font-semibold">

                                ₹{" "}

                                {Number(
                                    purchase.totalCost
                                ).toLocaleString(
                                    "en-IN",
                                    {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }
                                )}

                            </td>

                            <td>

                                <div className="flex justify-center gap-2">

                                    <button
                                        type="button"
                                        className="mg-action-button"
                                        onClick={() =>
                                            openEditModal(
                                                purchase
                                            )
                                        }
                                    >

                                        <Pencil size={16} />

                                    </button>

                                    <button
                                        type="button"
                                        className="mg-action-button"
                                        onClick={() => {

                                            setPurchaseToDelete(
                                                purchase
                                            );

                                            setShowDeleteDialog(
                                                true
                                            );

                                        }}
                                    >

                                        <Trash2 size={16} />

                                    </button>

                                </div>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

            <Pagination
                page={page}
                pageData={pageData}
                pageSize={pageData?.size ?? 20}
                currentCount={purchases.length}
                label={t("bulkWaterPurchases.table.purchases")}
                onPrevious={() =>
                    setPage(previous => previous - 1)
                }
                onNext={() =>
                    setPage(previous => previous + 1)
                }
                onPageChange={setPage}
            />

        </div>

    );

}

export default BulkWaterTable;