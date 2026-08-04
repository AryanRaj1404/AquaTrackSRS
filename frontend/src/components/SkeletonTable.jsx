import { motion } from "framer-motion";
import ResponsiveTable from "./ResponsiveTable";

export default function SkeletonTable({ rows = 5 }) {
    return (
        <div className="mg-table-wrapper">
            <ResponsiveTable>
            <table className="mg-table">
                <tbody>
                    {[...Array(rows)].map((_, index) => (
                        <motion.tr
                            key={index}
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{
                                repeat: Infinity,
                                duration: 1.4,
                                delay: index * 0.08,
                            }}
                        >
                            {[...Array(6)].map((__, cell) => (
                                <td key={cell}>
                                    <div
                                        style={{
                                            width: "85%",
                                            height: 12,
                                            background: "#E7EEF5",
                                            borderRadius: 8,
                                        }}
                                    />
                                </td>
                            ))}
                        </motion.tr>
                    ))}
                </tbody>
            </table>
            </ResponsiveTable>
        </div>
    );
}