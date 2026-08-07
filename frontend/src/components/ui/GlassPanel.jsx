export default function GlassPanel({
    children,
    className = "",
    padding = "p-6",
}) {

    return (

        <div
            className={`
                rounded-[30px]
                border border-white/50
                bg-white/75
                backdrop-blur-xl
                shadow-[0_20px_50px_rgba(15,23,42,0.08)]
                ${padding}
                ${className}
            `}
        >

            {children}

        </div>

    );

}