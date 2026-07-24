import { useMemo } from "react";

export default function WaterRipples() {

    const ripples = useMemo(() => {

        return Array.from({ length: 6 }, (_, i) => ({

            id: i,

            left: Math.random() * 100,

            top: Math.random() * 100,

            size: 60 + Math.random() * 120,

            delay: i * 0.5,

            duration: 10 + Math.random() * 6,

        }));

    }, []);

    return (
        <>
            <div className="mg-ripples">

                {ripples.map(ripple => (

                    <span
                        key={ripple.id}
                        className="mg-ripple"
                        style={{
                            left: `${ripple.left}%`,
                            top: `${ripple.top}%`,
                            width: ripple.size,
                            height: ripple.size,
                            animationDelay: `${ripple.delay}s`,
                            animationDuration: `${ripple.duration}s`,
                        }}
                    />

                ))}

            </div>

            <style>{`

.mg-ripples{

    position:fixed;

    inset:0;

    pointer-events:none;

    z-index:0;

    overflow:hidden;

}

.mg-ripple{

    position:absolute;

    border-radius:50%;

    border: 3px solid rgba(7,129,165,.35);

    transform:translate(-50%,-50%) scale(.2);

    opacity:0;

    animation:ripple infinite ease-out;

}

@keyframes ripple{

    0%{

        transform:
            translate(-50%,-50%)
            scale(.15);

        opacity:0;

    }

    8%{

        opacity:.18;

    }

    45%{

        opacity:.08;

    }

    100%{

        transform:
            translate(-50%,-50%)
            scale(2.3);

        opacity:0;

    }

}

            `}</style>
        </>
    );
}