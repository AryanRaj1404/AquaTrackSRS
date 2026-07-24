import { useMemo } from "react";

export default function WaterBackground() {

    const bubbles = useMemo(() => {

        return Array.from({ length: 50 }, (_, index) => {

            let size;

            if (index < 30) {

                size = 8 + Math.random() * 12;

            } else if (index < 45) {

                size = 18 + Math.random() * 16;

            } else {

                size = 36 + Math.random() * 24;

            }

            return {
                left: Math.random() * 100,
                delay: Math.random() * 18,
                duration: 18 + Math.random() * 18,
                size,
                opacity: 0.35 + Math.random() * 0.35,
            };

        });

    }, []);

    return (
        <div className="mg-bubbles">
            {bubbles.map((bubble, index) => (
                <span
                    key={index}
                    className="mg-bubble"
                    style={{
                        left: `${bubble.left}%`,
                        animationDelay: `${bubble.delay}s`,
                        animationDuration: `${bubble.duration}s`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        opacity: bubble.opacity,
                    }}
                />
            ))}
        </div>
    );
}