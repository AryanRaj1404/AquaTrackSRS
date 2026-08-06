import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WorkspaceContext = createContext(null);

const STORAGE_KEY = "aquatrack-workspace";

const ALL_WORKSPACES = {
    id: null,
    name: "All Apartments",
};

export function WorkspaceProvider({ children }) {

    const [workspace, setWorkspaceState] = useState(ALL_WORKSPACES);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        try {

            const savedWorkspace =
                localStorage.getItem(STORAGE_KEY);

            if (savedWorkspace) {

                setWorkspaceState(
                    JSON.parse(savedWorkspace)
                );

            }

        } catch (error) {

            console.error(
                "Unable to restore workspace",
                error
            );

            localStorage.removeItem(STORAGE_KEY);

        } finally {

            setLoading(false);

        }

    }, []);

    const setWorkspace = (selectedWorkspace) => {

        const workspaceToSave =
            selectedWorkspace ?? ALL_WORKSPACES;

        setWorkspaceState(workspaceToSave);

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(workspaceToSave)
        );

    };

    const clearWorkspace = () => {

        setWorkspaceState(ALL_WORKSPACES);

        localStorage.removeItem(STORAGE_KEY);

    };

    const value = useMemo(
        () => ({

            workspace,

            workspaceId: workspace.id,

            workspaceName: workspace.name,

            isGlobalWorkspace:
                workspace.id === null,

            setWorkspace,

            clearWorkspace,

        }),
        [workspace]
    );

    if (loading) {

        return null;

    }

    return (

        <WorkspaceContext.Provider value={value}>

            {children}

        </WorkspaceContext.Provider>

    );

}

export function useWorkspace() {

    const context = useContext(WorkspaceContext);

    if (!context) {

        throw new Error(
            "useWorkspace must be used inside WorkspaceProvider."
        );

    }

    return context;

}