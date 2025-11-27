import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

function TiltedCard({
    imageSrc,
    altText = "Tilted card image",
    captionText = "",
    containerHeight = "300px",
    containerWidth = "100%",
    imageHeight = "300px",
    imageWidth = "300px",
    scaleOnHover = 1.1,
    rotateAmplitude = 14,
    showMobileWarning = true,
    showTooltip = true,
    overlayContent = null,
    displayOverlayContent = false,
}) {
    const ref = useRef(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const rotateX = useTransform(
        ySpring,
        [-0.5, 0.5],
        ["17.5deg", "-17.5deg"]
    );
    const rotateY = useTransform(
        xSpring,
        [-0.5, 0.5],
        ["-17.5deg", "17.5deg"]
    );

    const handleMouseMove = (e) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                height: containerHeight,
                width: containerWidth,
                transformStyle: "preserve-3d",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    position: "relative",
                }}
                initial="rest"
                whileHover="hover"
                animate="rest"
                variants={{
                    rest: { scale: 1 },
                    hover: { scale: scaleOnHover }
                }}
            >
                <div
                    style={{
                        height: imageHeight,
                        width: imageWidth,
                        transformStyle: "preserve-3d",
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                        position: "relative",
                    }}
                >
                    <img
                        src={imageSrc}
                        alt={altText}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />

                    {displayOverlayContent && overlayContent && (
                        <div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-end",
                                padding: "1.5rem",
                                color: "white",
                                transform: "translateZ(30px)",
                            }}
                        >
                            {overlayContent}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
       


export default TiltedCard;
