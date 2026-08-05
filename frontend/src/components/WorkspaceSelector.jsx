import { useEffect, useRef, useState } from "react";
import {
    Building2,
    Check,
    ChevronDown,
    Globe2,
} from "lucide-react";

import workspaceService from "../services/workspaceService";
import { useWorkspace } from "../context/WorkspaceContext";

export default function WorkspaceSelector() {

    const {
        workspace,
        setWorkspace,
    } = useWorkspace();

    const [open, setOpen] = useState(false);

    const [loading, setLoading] = useState(true);

    const [workspaces, setWorkspaces] = useState([]);

    const containerRef = useRef(null);

    useEffect(() => {

        loadWorkspaces();

    }, []);

    useEffect(() => {

        function handleOutsideClick(event) {

            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {

                setOpen(false);

            }

        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);

    async function loadWorkspaces() {

        try {

            const data =
                await workspaceService.getWorkspaces();

            setWorkspaces(data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    function handleWorkspaceSelect(selectedWorkspace) {

        setWorkspace(selectedWorkspace);

        setOpen(false);

    }

    return (

        <div
            ref={containerRef}
            className="relative"
        >

            <button
                onClick={() => setOpen((prev) => !prev)}
                className="
                    flex
                    min-w-[240px]
                    items-center
                    justify-between
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    px-4
                    py-3
                    shadow-sm
                    transition-all
                    duration-200
                    hover:border-teal-300
                    hover:shadow-md
                "
            >

                <div className="flex items-center gap-3">

                    <div
                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-teal-50
                            text-teal-700
                        "
                    >

                        {workspace.id === null ? (

                            <Globe2 size={20} />

                        ) : (

                            <Building2 size={20} />

                        )}

                    </div>

                    <div className="text-left">

                        <p
                            className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.22em]
                                text-slate-500
                            "
                        >
                            Workspace
                        </p>

                        <p
                            className="
                                mt-0.5
                                font-semibold
                                text-slate-800
                            "
                        >
                            {workspace.name}
                        </p>

                    </div>

                </div>

                <ChevronDown
                    size={18}
                    className={`
                        transition-transform
                        duration-200
                        ${open ? "rotate-180" : ""}
                    `}
                />

            </button>

            {open && (

                <div
                    className="
                        absolute
                        right-0
                        z-50
                        mt-3
                        w-[320px]
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-2xl
                    "
                >

                    <div
                        className="
                            border-b
                            border-slate-100
                            px-5
                            py-4
                        "
                    >

                        <h3
                            className="
                                font-semibold
                                text-slate-800
                            "
                        >
                            Switch Workspace
                        </h3>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Select the apartment you want to manage.
                        </p>

                    </div>

                    {loading ? (

                        <div className="p-5 text-sm text-slate-500">

                            Loading workspaces...

                        </div>

                    ) : (

                        <div
                            className="
                                max-h-[360px]
                                overflow-y-auto
                                py-2
                            "
                        >

                            {workspaces.map((item) => {

                                const selected =
                                    workspace.id === item.id;

                                return (

                                    <button
                                        key={
                                            item.id ??
                                            "all-workspaces"
                                        }
                                        onClick={() =>
                                            handleWorkspaceSelect(
                                                item
                                            )
                                        }
                                        className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            px-5
                                            py-3
                                            transition-colors
                                            ${
                                                selected
                                                    ? "bg-teal-50"
                                                    : "hover:bg-slate-50"
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >

                                            <div
                                                className={`
                                                    flex
                                                    h-10
                                                    w-10
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    ${
                                                        selected
                                                            ? "bg-teal-600 text-white"
                                                            : "bg-slate-100 text-slate-600"
                                                    }
                                                `}
                                            >

                                                {item.id === null ? (
                                                    <Globe2 size={18} />
                                                ) : (
                                                    <Building2 size={18} />
                                                )}

                                            </div>

                                            <div className="text-left">

                                                <p
                                                    className="
                                                        font-medium
                                                        text-slate-800
                                                    "
                                                >
                                                    {item.name}
                                                </p>

                                            </div>

                                        </div>

                                        {selected && (

                                            <Check
                                                size={18}
                                                className="text-teal-700"
                                            />

                                        )}

                                    </button>

                                );

                            })}

                        </div>

                    )}

                </div>

            )}

        </div>

    );

}