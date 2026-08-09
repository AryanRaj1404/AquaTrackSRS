import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Pagination({

    page,

    pageData,

    pageSize,

    currentCount,

    label,

    onPrevious,

    onNext,

    onPageChange,

})
{
    const { t } = useTranslation();
    const [pageInput, setPageInput] = useState(page + 1);

    useEffect(() => {

        setPageInput(page + 1);

    }, [page]);

    return (

        <div className="flex items-center justify-between mt-6">

            <p className="text-sm text-slate-500 hidden sm:block">

                {t("pagination.showing", {
                    from: page * pageSize + 1,
                    to: page * pageSize + currentCount,
                    total: pageData.totalElements,
                    label: label || t("pagination.records"),
                })}

            </p>

            <div className="flex items-center gap-3">

                <button
                    className="mg-cancel-button"
                    disabled={page === 0}
                    onClick={onPrevious}
                >
                    {t("pagination.previous")}
                </button>

                <div className="flex items-center gap-2">

    <span className="text-sm">
        {t("pagination.page")}
    </span>

    <input
        type="number"
        min={1}
        max={pageData?.totalPages??1}
        value={pageInput}
        onChange={(event) =>
            setPageInput(event.target.value)
        }
        onKeyDown={(event) => {

            if (event.key === "Enter") {

                const value = Number(pageInput);

                if (
                    value >= 1 &&
                    value <= pageData.totalPages
                ) {

                    onPageChange(value - 1);

                }

            }

        }}
        className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <span className="text-sm">

        {t("pagination.of")} {pageData.totalPages}

    </span>

</div>

                <button
                    className="mg-primary-button"
                    disabled={pageData?.last}
                    onClick={onNext}
                >
                    {t("pagination.next")}
                </button>

            </div>

        </div>

    );

}

export default Pagination;
