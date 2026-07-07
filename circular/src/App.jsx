import React, { useState, useRef, useMemo, Suspense } from 'react'
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

// Showcase items with custom titles, descriptions, theme colors, and local imported images
const items = [
    {
        id: 1,
        title: "Buttonmax Studio",
        desc: "A premium interactive button lab demonstrating physical simulation, fluid spring dynamics, and custom CSS micro-interactions.",
        color: "#ffdd00", // Yellow glow
        url: imgButtonmax,
        link: "https://github.com"
    },
    {
        id: 2,
        title: "Spatial Perspective Lab",
        desc: "A design workspace illustrating responsive grid systems, layered CSS variables, and modern visual typography layouts.",
        color: "#ff3333", // Red glow
        url: imgPerspective,
        link: "https://github.com"
    },
    {
        id: 3,
        title: "Agrisort AI Classifier",
        desc: "An automated fruit and agricultural sorting interface powered by computer vision. Recognizes quality, size, and sorting paths in real-time.",
        color: "#00d2ff", // Cyan/blue glow
        url: imgAgrisort,
        link: "https://github.com"
    },
    {
        id: 4,
        title: "IoT Smart Waste Portal",
        desc: "An IoT administrative panel tracking fill levels of garbage containers dynamically. Displays geographic maps and optimal collection schedules.",
        color: "#00ffcc", // Mint glow
        url: imgWaste,
        link: "https://github.com"
    },
    {
        id: 5,
        title: "Soundwave AI Hub",
        desc: "A next-generation browser-based sound synthesizer and voice cloning workspace powered by transformer-based audio synthesis.",
        color: "#ff007f", // Neon pink glow
        url: imgSoundwave,
        link: "https://github.com"
    },
    {
        id: 6,
        title: "EduManage Portal",
        desc: "A secure, robust administrative suite managing courses, schedules, enrollment ratios, and records through a unified react database console.",
        color: "#ff5e00", // Orange glow
        url: imgStudent,
        link: "https://github.com"
    }
]

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
            position={[0, 0.4, 0]} // Shifted slightly higher to prevent bottom cutoff
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

    // Find active project metadata
    const activeItem = useMemo(() => items.find(item => item.id === activeId), [activeId])

    return (
        <div className="circular-app-root" style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* 3D WebGL Canvas */}
            <Canvas
                camera={{ position: [0, 0, 7.5], fov: 50 }}
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
            >

                {/* Lights */}
                <ambientLight intensity={0.4} />
                <pointLight position={[0, 10, 0]} intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.0} />

                <Suspense fallback={null}>
                    <CylinderCarousel
                        radius={radius}
                        height={height}
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
                    minDistance={4}
                    maxDistance={12}
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
