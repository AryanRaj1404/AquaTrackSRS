import { Player } from "@lottiefiles/react-lottie-player";
import backgroundLake from "../assets/animations/backgroundLake.json";

export default function WaterBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            <Player
                autoplay
                loop
                src={backgroundLake}
                style={{
                    position: "absolute",
                    width: "160%",
                    height: "160%",
                    left: "-30%",
                    top: "-30%",
                    objectFit: "cover",
                }}
            />
        </div>
    );
}