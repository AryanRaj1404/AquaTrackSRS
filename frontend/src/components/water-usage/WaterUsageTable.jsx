import {
    Edit3,
    Trash2,
} from "lucide-react";

import Pagination from "../Pagination";
import { useTranslation } from "react-i18next";

function WaterUsageTable({

    displayedLogs,

    page,

    pageData,

    setPage,

    openEditModal,

    setUsageToDelete,

    setShowDeleteDialog,

}) {

    const { t } = useTranslation();

    return (

        <div className="mg-table-wrapper">

            <table className="mg-table">

                <thead>

                    <tr>

                        <th>{t("waterUsage.table.apartment")}</th>

                        <th>{t("waterUsage.table.household")}</th>

                        <th>{t("waterUsage.table.readingDate")}</th>

                        <th>{t("waterUsage.table.consumption")}</th>

                        <th>{t("waterUsage.table.source")}</th>

                        <th>{t("waterUsage.table.action")}</th>

                    </tr>

                </thead>

                <tbody>

                    {displayedLogs.map((log) => (

                        <tr
                            key={log.id}
                            className="hover:bg-slate-50 transition-colors"
                        >

                            <td>{log.apartmentName}</td>

                            <td>{log.flatNumber}</td>

                            <td>

                                {new Date(
                                    log.usageDate
                                ).toLocaleDateString(
                                    "en-GB",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }
                                )}

                            </td>

                            <td className="font-semibold text-slate-800">

                                {log.litersConsumed} {t("waterUsage.table.litersUnit")}

                            </td>

                            <td>

                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                        log.source === "MANUAL_ENTRY"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-sky-100 text-sky-700"
                                    }`}
                                >

                                    {log.source === "MANUAL_ENTRY"
                                        ? t("waterUsage.table.manual")
                                        : t("waterUsage.table.csv")}

                                </span>

                            </td>

                            <td>

                                <div className="flex justify-center gap-2">

                                    <button
                                        type="button"
                                        className="mg-action-button"
                                        onClick={() =>
                                            openEditModal(log)
                                        }
                                    >

                                        <Edit3 size={15} />

                                    </button>

                                    <button
                                        type="button"
                                        className="mg-action-button"
                                        onClick={() => {

                                            setUsageToDelete(log);

                                            setShowDeleteDialog(true);

                                        }}
                                    >

                                        <Trash2 size={15} />

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
                currentCount={displayedLogs.length}
                label={t("waterUsage.table.records")}
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

export default WaterUsageTable;