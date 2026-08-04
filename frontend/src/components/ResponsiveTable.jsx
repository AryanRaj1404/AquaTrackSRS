function ResponsiveTable({ children }) {
    return (
        <div className="overflow-x-auto rounded-2xl">
            <div className="min-w-[900px]">
                {children}
            </div>
        </div>
    );
}

export default ResponsiveTable;