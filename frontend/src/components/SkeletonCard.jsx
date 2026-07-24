import { motion } from "framer-motion";

export default function SkeletonCard() {
    return (
        <motion.div
            className="mg-summary-card"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
                repeat: Infinity,
                duration: 1.4,
                ease: "easeInOut",
            }}
        >
            <div
                style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "#E6EEF5",
                }}
            />

            <div style={{ flex: 1 }}>
                <div
                    style={{
                        width: 80,
                        height: 10,
                        background: "#E6EEF5",
                        borderRadius: 8,
                        marginBottom: 12,
                    }}
                />

                <div
                    style={{
                        width: 110,
                        height: 26,
                        background: "#DCE7F2",
                        borderRadius: 8,
                        marginBottom: 10,
                    }}
                />

                <div
                    style={{
                        width: 140,
                        height: 10,
                        background: "#EEF4F8",
                        borderRadius: 8,
                    }}
                />
            </div>
        </motion.div>
    );
}