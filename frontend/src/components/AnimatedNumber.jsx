import { useEffect, useState } from "react";

export default function AnimatedNumber({
    value,
    duration = 1000,
}) {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        let start = 0;
        const startTime = performance.now();

        function animate(now) {
            const progress = Math.min(
                (now - startTime) / duration,
                1
            );

            const current = Math.round(
                progress * value
            );

            setDisplay(current);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }, [value, duration]);

    return display.toLocaleString();
}