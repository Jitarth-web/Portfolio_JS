import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    startTransition,
} from "react"

const BOOT_LINES = [
    { text: "JITARTH BIOS v2.0.26", instant: true },
    {
        text: "Copyright (C) 2026 Jitarth Singh. All Rights Reserved.",
        instant: true,
    },
    { text: "NIT Delhi Systems Division", instant: true },
    {
        text: "--------------------------------------------------",
        instant: true,
    },
    { text: "Initializing CPU: Full Stack AI Web Developer...", delay: 400 },
    { text: "Checking memory bank... 16384MB OK", delay: 200 },
    {
        text: "Loading Core Modules: React, GSAP, CSS, Flask, Node...",
        delay: 500,
    },
    { text: "Establishing secure link to portfolio assets...", delay: 350 },
    { text: "Loading portfolio content...", delay: 300 },
    { text: "Welcome to my portfolio!", delay: 200 },
    { text: "Initializing responsive interface elements...", delay: 250 },
    { text: "Boot completed. Redirecting to workspace...", delay: 500 },
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
        filter: "brightness(1.3) contrast(1.15) saturate(1.1)",
    }

    const overlayStyle = {
        position: "absolute",
        inset: 0,
        background: `rgba(0, 0, 0, ${safeOverlayOpacity})`,
        zIndex: 1,
    }

    const terminalStyle = {
        position: "absolute",
        left: isMobile ? "5%" : leftOffset,
        top: isMobile ? "40%" : "50%",
        transform: "translateY(-50%)",
        width: isMobile ? "90%" : textWidth,
        color: "#FFFFFF",
        background: "transparent",
        fontFamily:
            '"Bricolage Grotesque", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: isMobile ? Math.max(14, fontSize - 6) : fontSize,
        lineHeight: 1.45,
        letterSpacing: "0.01em",
        whiteSpace: "pre-wrap",
        pointerEvents: "none",
        zIndex: 2,
        textShadow: "0 1px 2px rgba(0,0,0,0.55)",
    }

    return (
        <div className={className} style={rootStyle} onClick={completeBoot} onTouchStart={completeBoot}>
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

                    return (
                        <div key={`${index}-${lineText.length}`}>
                            {lineText}
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
