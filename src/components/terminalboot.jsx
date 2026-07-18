import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    startTransition,
} from "react"
import FloatingSticker from "./FloatingSticker"

const BOOT_LINES = [
    { text: "JITARTH BIOS v2.0.26", instant: true },
    {
        text: "Copyright (C) 2026 Jitarth Singh. All Rights Reserved.",
        highlight: "Jitarth Singh",
        instant: true,
    },
    { text: "NIT Delhi Systems Division", highlight: "NIT Delhi", instant: true },
    {
        text: "--------------------------------------------------",
        instant: true,
    },
    { text: "Initializing CPU: Full Stack AI Web Developer...", highlight: "Full Stack AI Web Developer", delay: 400 },
    { text: "Checking memory bank... 16384MB OK", highlight: "OK", delay: 200 },
    {
        text: "Loading Core Modules: React, GSAP, CSS, Flask, Node...",
        highlight: ["React", "GSAP", "CSS", "Flask", "Node"],
        delay: 500,
    },
    { text: "Establishing secure link to portfolio assets...", highlight: "portfolio assets", delay: 350 },
    { text: "Loading portfolio content...", highlight: "portfolio content", delay: 300 },
    { text: "Welcome to my portfolio!", highlight: "portfolio", delay: 200 },
    { text: "Initializing responsive interface elements...", highlight: "responsive", delay: 250 },
    { text: "Boot completed. Redirecting to workspace...", highlight: "workspace", delay: 500 },
]

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function BootTypingLog(props) {
    const {
        className,
        style,
        videoSrc = "https://framerusercontent.com/assets/DQdJ9GP6oi2AQep6lGlVZFGM.mp4",
        typingSpeed = 32,
        startDelay = 0,
        overlayOpacity = 0.3,
        fontSize = 20,
        leftOffset = "6%",
        textWidth = "62%",
        onComplete,
        onFadeStart,
    } = props

    const [visibleLines, setVisibleLines] = useState([])
    const [currentLineIndex, setCurrentLineIndex] = useState(0)
    const [cursorVisible, setCursorVisible] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const timersRef = useRef([])
    const hasStartedRef = useRef(false)

    // Store callbacks in refs to prevent dependency cycles
    const onCompleteRef = useRef(onComplete)
    const onFadeStartRef = useRef(onFadeStart)

    useEffect(() => {
        onCompleteRef.current = onComplete
        onFadeStartRef.current = onFadeStart
    }, [onComplete, onFadeStart])

    const clearTimers = useCallback(() => {
        if (typeof window === "undefined") return
        timersRef.current.forEach((timerId) => window.clearTimeout(timerId))
        timersRef.current = []
    }, [])

    const schedule = useCallback((fn, ms) => {
        if (typeof window === "undefined") return
        const timerId = window.setTimeout(fn, ms)
        timersRef.current.push(timerId)
    }, [])

    const safeTypingSpeed = useMemo(
        () => Math.max(10, Number(typingSpeed) || 32),
        [typingSpeed]
    )
    const safeStartDelay = useMemo(
        () => Math.max(0, Number(startDelay) || 0),
        [startDelay]
    )
    const safeOverlayOpacity = useMemo(() => {
        const value = Number(overlayOpacity)
        if (Number.isNaN(value)) return 0.45
        return Math.max(0, Math.min(1, value))
    }, [overlayOpacity])

    const completeBoot = useCallback(() => {
        clearTimers()
        startTransition(() => {
            setCurrentLineIndex(-1)
        })
        if (typeof onFadeStartRef.current === "function") onFadeStartRef.current()
        
        // Optional delay before completely removing the boot screen to allow app fade-in
        setTimeout(() => {
            if (typeof onCompleteRef.current === "function") onCompleteRef.current()
        }, 500)
    }, [clearTimers])

    const typeLine = useCallback(
        (lineIndex) => {
            if (lineIndex >= BOOT_LINES.length) {
                completeBoot()
                return
            }

            const line = BOOT_LINES[lineIndex]
            if (line.instant) {
                startTransition(() => {
                    setVisibleLines((prev) => [...prev, line.text])
                    setCurrentLineIndex(lineIndex + 1)
                })
                schedule(() => typeLine(lineIndex + 1), 0)
                return
            }

            const initialDelay = Math.max(0, line.delay || 0)
            schedule(() => {
                let charIndex = 0
                startTransition(() => {
                    setVisibleLines((prev) => [...prev, ""])
                    setCurrentLineIndex(lineIndex)
                })

                const typeNextChar = () => {
                    charIndex += 1
                    startTransition(() => {
                        setVisibleLines((prev) => {
                            const updated = [...prev]
                            updated[lineIndex] = line.text.slice(0, charIndex)
                            return updated
                        })
                    })

                    if (charIndex < line.text.length) {
                        schedule(typeNextChar, safeTypingSpeed)
                    } else {
                        startTransition(() => {
                            setCurrentLineIndex(lineIndex + 1)
                        })
                        schedule(() => typeLine(lineIndex + 1), 0)
                    }
                }

                schedule(typeNextChar, safeTypingSpeed)
            }, initialDelay)
        },
        [completeBoot, safeTypingSpeed, schedule]
    )

    useEffect(() => {
        if (typeof window === "undefined") return
        if (hasStartedRef.current) return
        hasStartedRef.current = true

        clearTimers()
        startTransition(() => {
            setVisibleLines([])
            setCurrentLineIndex(0)
            setCursorVisible(true)
        })

        schedule(() => typeLine(0), safeStartDelay)

        return () => {
            clearTimers()
            hasStartedRef.current = false
        }
    }, [clearTimers, schedule, safeStartDelay, typeLine])

    useEffect(() => {
        if (typeof window === "undefined") return
        const blinkId = window.setInterval(() => {
            startTransition(() => {
                setCursorVisible((prev) => !prev)
            })
        }, 500)

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)

        return () => {
            window.clearInterval(blinkId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    const rootStyle = useMemo(
        () => ({
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 9999,
            width: "100%",
            height: "100%",
            minHeight: "100vh",
            background: "#000000",
            overflow: "hidden",
            transition: "opacity 0.5s ease-out",
            cursor: "pointer",
            ...style,
        }),
        [style]
    )

    const videoStyle = {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        zIndex: 0,
        pointerEvents: "none",
    }

    const overlayStyle = {
        position: "absolute",
        inset: 0,
        background: `rgba(0, 0, 0, ${safeOverlayOpacity})`,
        zIndex: 1,
    }

    const terminalStyle = {
        position: "absolute",
        left: isMobile ? "6%" : leftOffset,
        top: isMobile ? "15%" : "50%",
        transform: isMobile ? "none" : "translateY(-50%)",
        width: isMobile ? "88%" : textWidth,
        maxHeight: isMobile ? "80vh" : "none",
        overflowY: isMobile ? "auto" : "visible",
        color: "rgba(255, 255, 255, 0.75)",
        background: "transparent",
        fontFamily:
            "'Clash Display', sans-serif",
        fontSize: isMobile ? Math.max(12, fontSize - 8) : fontSize,
        lineHeight: 1.4,
        letterSpacing: "0.01em",
        whiteSpace: "pre-wrap",
        pointerEvents: "none",
        zIndex: 2,
        textShadow: "0 1px 2px rgba(0,0,0,0.55)",
    }

    const renderLineText = (lineText, lineObj) => {
        if (!lineObj || !lineObj.highlight) {
            return lineText
        }

        const highlights = Array.isArray(lineObj.highlight)
            ? lineObj.highlight
            : [lineObj.highlight]

        let result = [lineText]

        highlights.forEach((hl) => {
            const newResult = []
            result.forEach((part) => {
                if (typeof part !== "string") {
                    newResult.push(part)
                    return
                }

                const index = part.indexOf(hl)
                if (index !== -1) {
                    newResult.push(part.substring(0, index))
                    newResult.push(
                        <span key={hl} style={{ color: "#ffffff", fontWeight: "700", textShadow: "0 0 8px rgba(255, 255, 255, 0.6)" }}>
                            {hl}
                        </span>
                    )
                    newResult.push(part.substring(index + hl.length))
                } else {
                    let partialFound = false
                    for (let len = hl.length - 1; len > 0; len--) {
                        const partialHl = hl.substring(0, len)
                        if (part.endsWith(partialHl)) {
                            newResult.push(part.substring(0, part.length - len))
                            newResult.push(
                                <span key={`${hl}-partial`} style={{ color: "#ffffff", fontWeight: "700", textShadow: "0 0 8px rgba(255, 255, 255, 0.6)" }}>
                                    {partialHl}
                                </span>
                            )
                            partialFound = true
                            break
                        }
                    }
                    if (!partialFound) {
                        newResult.push(part)
                    }
                }
            })
            result = newResult
        })

        return result
    }

    return (
        <div className={className} style={rootStyle} onClick={completeBoot} onTouchStart={completeBoot}>
            <FloatingSticker text="Welcome" theme="white" size="md" top="15%" left="5%" rotation={-8} allowCenter={true} />
            <FloatingSticker text="Hello World" theme="white" size="md" top="45%" right="8%" rotation={6} allowCenter={true} />
            <FloatingSticker text="Initiating Boot..." theme="white" size="md" top="75%" left="10%" rotation={-5} allowCenter={true} />

            <video
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                style={videoStyle}
                aria-hidden="true"
            />
            <div style={overlayStyle} aria-hidden="true" />
            <div style={terminalStyle} aria-live="polite">
                {visibleLines.map((lineText, index) => {
                    const isCurrentLineTyping =
                        index === currentLineIndex &&
                        currentLineIndex >= 0 &&
                        currentLineIndex < BOOT_LINES.length &&
                        !BOOT_LINES[index]?.instant

                    if (index === 0) {
                        return (
                            <div 
                                key={index} 
                                className="boot-header-container animate-pulse"
                                style={{
                                    marginBottom: "16px",
                                    display: "flex",
                                    flexDirection: "column",
                                    lineHeight: 0.9,
                                    animation: "bootFlicker 3s infinite",
                                }}
                            >
                                <span 
                                    className="heading-outline" 
                                    style={{
                                        fontSize: isMobile ? "28px" : "48px",
                                        WebkitTextStroke: "1.2px #ffffff",
                                        fontStyle: "italic",
                                        letterSpacing: "-0.02em",
                                        lineHeight: 1,
                                        display: "inline-block",
                                        textShadow: "0 0 10px rgba(0, 0, 0, 0.95), 0 0 5px rgba(0, 0, 0, 0.95)",
                                    }}
                                    data-text="JITARTH"
                                >
                                    JITARTH
                                </span>
                                <span 
                                    className="heading-solid" 
                                    style={{
                                        fontSize: isMobile ? "24px" : "40px",
                                        color: "rgba(255, 255, 255, 0.8)",
                                        letterSpacing: "-0.01em",
                                        marginTop: "-0.05em",
                                        lineHeight: 1,
                                        display: "inline-block",
                                    }}
                                >
                                    BIOS v2.0.26
                                </span>
                            </div>
                        )
                    }

                    return (
                        <div key={`${index}-${lineText.length}`} style={{ marginBottom: index === 3 ? "12px" : "4px" }}>
                            {renderLineText(lineText, BOOT_LINES[index])}
                            {isCurrentLineTyping && cursorVisible ? "_" : ""}
                        </div>
                    )
                })}
            </div>
            
            {/* Cyberpunk 3D Helmet iframe positioned responsibly 
            <div 
                style={{
                    position: 'absolute',
                    bottom: isMobile ? '5%' : '0%',
                    right: isMobile ? '50%' : '0%',
                    transform: isMobile ? 'translateX(50%)' : 'none',
                    width: isMobile ? '320px' : '500px',
                    height: isMobile ? '320px' : '500px',
                    zIndex: 10,
                    overflow: 'visible'
                }}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
            >
                <iframe 
                    src="/cyber_punk/index.html" 
                    title="Cyberpunk 3D Element" 
                    style={{ width: '100%', height: '100%', border: 'none', position: 'absolute', inset: 0, zIndex: 1 }} 
                />
            </div>
            */}
        </div>
    )
}
