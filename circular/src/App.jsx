import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture, Loader } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import './style.css'

// Import local images from assets folder
import imgAgrisort from './assets/agrisort.png'
import imgWaste from './assets/smart_waste_management.png'
import imgSoundwave from './assets/soundwave_ai.png'
import imgStudent from './assets/student_management_system.png'
import imgButtonmax from './assets/ChatGPT Image Jun 27, 2026, 01_06_59 PM.png'
import imgPerspective from './assets/ChatGPT Image Jul 2, 2026, 08_29_15 PM.png'
import nexa from './assets/nexa_ai.png'
// Showcase items with custom titles, descriptions, theme colors, and local imported images
const items = [
  {
    id: 1,
    title: "Shagun Fashions",
    desc: "A premium tailoring and garment manufacturing platform featuring cinematic animations, responsive layouts, and an elegant shopping experience for school uniforms and custom apparel.",
    color: "#ffdd00",
    url: imgButtonmax,
    link: "https://shagun-fashion.vercel.app/"
  },
  {
    id: 2,
    title: "Domiq AI",
    desc: "An AI-powered platform that analyzes floor plans, recommends personalized interiors, estimates construction costs, and generates immersive 3D visualizations using Gemini AI.",
    color: "#ff007f",
    url: imgPerspective,
    link: "https://domiq-ai-seven.vercel.app/"
  },
  {
    id: 3,
    title: "AgriSort",
    desc: "An intelligent agriculture platform providing real-time crop prices, market trends, and AI-assisted insights to help farmers make informed decisions.",
    color: "#00d2ff",
    url: imgAgrisort,
    link: "https://github.com/"
  },
  {
    id: 7,
    title: "NEXA AI",
    desc: "An intelligent voice-powered AI assistant that understands natural language, answers questions, automates everyday tasks, opens applications, performs web searches, manages files, and delivers real-time responses using advanced generative AI.",
    color: "#00d9ffad",
    url: nexa,
    link: "https://github.com/Jitarth-web/NEXA_AI"
  },
  {
    id: 8,
    title: "Student Management System",
    desc: "A comprehensive student management platform with attendance tracking, social dashboard, academic notes sharing, and streamlined campus management.",
    color: "#ff8533",
    url: imgStudent,
    link: "https://github.com/Jitarth-web/ClassClan"
  },
  {
    id: 4,
    title: "SwachhCity",
    desc: "A smart waste management platform enabling citizens to report waste issues, monitor collection status, and support cleaner urban environments through digital reporting.",
    color: "green",
    url: imgWaste,
    link: "https://swachh-city-16db.vercel.app/"
  },
  {
    id: 5,
    title: "SoundWave AI",
    desc: "An AI-powered music recommendation platform that analyzes listening habits to generate personalized playlists with a modern interactive interface.",
    color: "#00d2ff",
    url: imgSoundwave,
    link: "https://soundwave-ai-ioik.vercel.app"
  }
];
// Glowing background particle system to create space and depth
const SpaceParticles = ({ count = 250 }) => {
    const pointsRef = useRef()

    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3)
        const cols = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            // Position particles in a spherical field surrounding the cylinder
            const radius = 6 + Math.random() * 8
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)

            pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            pos[i * 3 + 2] = radius * Math.cos(phi)

            // Multi-colored particles (warm gold/white glow)
            cols[i * 3] = 1.0
            cols[i * 3 + 1] = 0.85 + Math.random() * 0.15
            cols[i * 3 + 2] = 0.5 + Math.random() * 0.5
        }
        return [pos, cols]
    }, [count])

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.03 * delta
            pointsRef.current.rotation.x += 0.01 * delta
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.5}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </points>
    )
}

// Cylinder segment panel for an individual showcase item
const CylinderPanel = ({
    item,
    index,
    total,
    radius,
    height,
    activeId,
    setActiveId,
    emissiveBase
}) => {
    const meshRef = useRef()
    const materialRef = useRef()
    const [hovered, setHovered] = useState(false)

    // Load texture cleanly
    const texture = useTexture(item.url)
    texture.minFilter = THREE.LinearFilter
    texture.generateMipmaps = false

    // Position angles
    const angle = (index * 2 * Math.PI) / total
    const thetaLength = (2 * Math.PI / total) * 0.82 // Leave a nice, clean gap between panels

    // Reference to hold active animation state
    const animationState = useRef({ hoverProgress: 0 })

    useFrame((state, delta) => {
        if (!meshRef.current || !materialRef.current) return

        // Target hover progress
        let targetProgress = 0
        if (hovered) {
            targetProgress = 1.0
        } else if (activeId === item.id) {
            targetProgress = 0.6 // Keep focused card slightly larger
        } else if (activeId !== null) {
            targetProgress = -0.4 // Dim other cards
        }

        // Smoothly interpolate hover state
        animationState.current.hoverProgress = THREE.MathUtils.lerp(
            animationState.current.hoverProgress,
            targetProgress,
            8 * delta
        )

        const progress = animationState.current.hoverProgress

        // Lerp Scale (Radius, Height)
        const scaleFactor = 1 + progress * 0.08
        meshRef.current.scale.set(radius * scaleFactor, height * scaleFactor, radius * scaleFactor)

        // Lerp Position Y (create a subtle floating or focusing elevation)
        const time = state.clock.getElapsedTime()
        const floatOffset = Math.sin(time * 1.2 + index) * 0.04
        meshRef.current.position.y = progress * 0.2 + floatOffset

        // Lerp Glow Intensity and Color (HDR Bloom triggers values > 1.0)
        const currentGlow = emissiveBase * (1.0 + progress * 2.2)
        materialRef.current.emissiveIntensity = currentGlow
        materialRef.current.opacity = THREE.MathUtils.lerp(0.8, 1.0, progress)
    })

    return (
        <mesh
            ref={meshRef}
            rotation={[0, angle, 0]}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHovered(true)
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={(e) => {
                setHovered(false)
                document.body.style.cursor = 'default'
            }}
            onClick={(e) => {
                e.stopPropagation()
                setActiveId(activeId === item.id ? null : item.id)
            }}
        >
            {/* 
        Geometry creates a cylinder segment of radius 1, height 1. 
        It is scaled dynamically in useFrame to avoid rebuilding geometries. 
      */}
            <cylinderGeometry args={[1, 1, 1, 32, 1, true, -thetaLength / 2, thetaLength]} />
            <meshStandardMaterial
                ref={materialRef}
                map={texture}
                emissiveMap={texture}
                emissive={new THREE.Color(item.color)}
                emissiveIntensity={emissiveBase}
                side={THREE.DoubleSide}
                transparent={true}
                opacity={0.8}
                roughness={0.2}
                metalness={0.8}
                toneMapped={false} /* toneMapped={false} allows colors to exceed HDR threshold and glow! */
            />
        </mesh>
    )
}

// Carousel cylinder rotation manager
const CylinderCarousel = ({
    radius,
    height,
    speed,
    activeId,
    setActiveId,
    emissiveBase
}) => {
    const groupRef = useRef()

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Rotate cylinder group infinitely
            groupRef.current.rotation.y += speed * 0.07 * delta // Increased rotation speed
        }
    })

    return (
        <group
            ref={groupRef}
            rotation={[0.22, 0, -0.12]} // Applied tilt to match the user's screenshot
            position={[0, 0.1, 0]} // Shifted slightly higher to prevent bottom cutoff
        >
            {items.map((item, index) => (
                <CylinderPanel
                    key={item.id}
                    item={item}
                    index={index}
                    total={items.length}
                    radius={radius}
                    height={height}
                    activeId={activeId}
                    setActiveId={setActiveId}
                    emissiveBase={emissiveBase}
                />
            ))}
        </group>
    )
}

const App = () => {
    // UI control states
    const [speed, setSpeed] = useState(1.2) // Balanced speed
    const [radius, setRadius] = useState(4.0) // Wider proportional radius
    const [height, setHeight] = useState(2.5) // Taller balanced height
    const [bloomIntensity, setBloomIntensity] = useState(1.5) // Soft, readable bloom glow
    const [emissiveBase, setEmissiveBase] = useState(1.6) // Balanced self-illumination for crisp text
    const [activeId, setActiveId] = useState(null)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Find active project metadata
    const activeItem = useMemo(() => items.find(item => item.id === activeId), [activeId])

    const activeRadius = isMobile ? 2.1 : radius
    const activeHeight = isMobile ? 1.6 : height

    return (
        <div className="circular-app-root" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* 3D WebGL Canvas */}
            <Canvas
                camera={{ position: [0, 0, isMobile ? 8.5 : 7.5], fov: 50 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >

                {/* Lights */}
                <ambientLight intensity={0.4} />
                <pointLight position={[0, 10, 0]} intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.0} />

                <Suspense fallback={null}>
                    <CylinderCarousel
                        radius={activeRadius}
                        height={activeHeight}
                        speed={speed}
                        activeId={activeId}
                        setActiveId={setActiveId}
                        emissiveBase={emissiveBase}
                    />
                    <SpaceParticles count={120} />
                </Suspense>

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minDistance={isMobile ? 3 : 4}
                    maxDistance={isMobile ? 10 : 12}
                    enableDamping={true}
                    dampingFactor={0.05}
                    makeDefault
                />

                {/* Post-processing Bloom setup to trigger emissive glow */}
                <EffectComposer>
                    <Bloom
                        mipmapBlur
                        intensity={bloomIntensity}
                        luminanceThreshold={0.25} // Increased threshold to preserve sharp details and text readability
                        luminanceSmoothing={0.8}
                    />
                </EffectComposer>
            </Canvas>

            {/* Loader for loading textures smoothly */}
            <Loader />

            {/* Selected Project Info Box (Right Side) */}
            {activeItem && (
                <div className="info-card glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.7rem', color: activeItem.color, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Project Selected</span>
                        <button
                            onClick={() => setActiveId(null)}
                            style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer', opacity: 0.6 }}
                        >
                            &times;
                        </button>
                    </div>
                    <h2>{activeItem.title}</h2>
                    <p>{activeItem.desc}</p>
                    <a href={activeItem.link} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: activeItem.color }}>
                        Launch Showcase Project
                    </a>
                </div>
            )}
        </div>
    )
}

export default App
