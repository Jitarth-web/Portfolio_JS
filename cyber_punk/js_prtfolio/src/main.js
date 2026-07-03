import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import './style.css';
import gsap from "gsap";

// Custom Radial RGB Shift Shader for sci-fi edge aberration while keeping the center sharp
const RadialRGBShiftShader = {
  name: 'RadialRGBShiftShader',
  uniforms: {
    'tDiffuse': { value: null },
    'amount': { value: 0.03 } // Strength of the split at the outer edges
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float amount;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      
      // Shift scales quadratically with distance from the center (center = 0, edges = max)
      vec2 offset = uv * dist * amount;
      
      vec4 cr = texture2D(tDiffuse, vUv + offset);
      vec4 cga = texture2D(tDiffuse, vUv);
      vec4 cb = texture2D(tDiffuse, vUv - offset);
      
      vec4 color = vec4(cr.r, cga.g, cb.b, cga.a);
      
      // 1. Increase Contrast (1.25 factor)
      color.rgb = (color.rgb - 0.5) * 1.25 + 0.5;
      
      // 2. Increase Saturation (1.35 factor)
      float luma = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      color.rgb = mix(vec3(luma), color.rgb, 1.35);
      
      // IMPORTANT: Multiply by alpha to preserve transparency, otherwise WebGL renders black box
      gl_FragColor = vec4(color.rgb * color.a, color.a);
    }
  `
};
let model;
// Scene setup
const scene = new THREE.Scene();

// HUD Scene setup (for crisp logo unaffected by post-processing)
const hudScene = new THREE.Scene();
const hudCamera = new THREE.OrthographicCamera(-window.innerWidth/2, window.innerWidth/2, window.innerHeight/2, -window.innerHeight/2, -10, 10);
hudCamera.position.z = 5;

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 3);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("cybercanvas"),
  antialias: true,
  alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Configure tone mapping for HDR reflections
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0; // Lowered to make the HDRI environment darker

// Soft fill lighting so the helmet remains clearly visible
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(0, 2, 4);
scene.add(directionalLight);

// Cyberpunk theme lights matching the logo colors (Yellow, Cyan, and Magenta/Red)
const yellowLight = new THREE.PointLight(0xffe600, 5, 25); // Cyberpunk Yellow
yellowLight.position.set(2, 2, 1.5);
scene.add(yellowLight);

const cyanLight = new THREE.PointLight(0x00f0ff, 4, 25); // Cyberpunk Cyan
cyanLight.position.set(-2, 1, 1.5);
scene.add(cyanLight);

const magentaLight = new THREE.PointLight(0xff0055, 3, 25); // Cyberpunk Magenta/Red
magentaLight.position.set(0, -2, 1.5);
scene.add(magentaLight);


// Post-processing setup with MSAA (Antialiasing) for sharp 4K rendering
const renderTarget = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  {
    samples: 4 // Hardware multisampling in WebGL2
  }
);
const composer = new EffectComposer(renderer, renderTarget);
composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// 1. Radial RGB Shift Pass (Sharp center, glitched edges)
const rgbShiftPass = new ShaderPass(RadialRGBShiftShader);
rgbShiftPass.uniforms['amount'].value = 0.05; // Very subtle outer edge split intensity
composer.addPass(rgbShiftPass);

// 2. Final Output Pass
const outputPass = new OutputPass();
composer.addPass(outputPass);

// Controls setup
// Lighting is handled exclusively by the HDRI environment map (scene.environment)
// to prevent the PBR model from being washed out and to maintain high contrast reflections.

// Load HDRI Environment Map
const rgbeLoader = new RGBELoader();
rgbeLoader.load('./pedestrian_overpass_1k.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  // Set the environment map for reflections
  scene.environment = texture;

  console.log('HDRI Environment loaded successfully!');
});

// GLTF Model loading
let helmetMesh = null;
const loader = new GLTFLoader();

loader.load(
  './DamagedHelmet.gltf',
  (gltf) => {
    helmetMesh = gltf.scene;
    helmetMesh.scale.set(1.5, 1.5, 1.5);
    scene.add(helmetMesh);
    console.log('GLTF Model loaded successfully!');
  },
  (progress) => {
    console.log(`Loading model: ${(progress.loaded / progress.total * 100).toFixed(2)}%`);
  },
  (error) => {
    console.error('Error loading GLTF model:', error);
  }
);

// Load Cyberpunk Logo as a HUD Sprite to stay crisp and convert black to transparent
const textureLoader = new THREE.TextureLoader();
textureLoader.load('./cyberpunk_logo.png', (texture) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: texture }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main() {
        vec4 texColor = texture2D(tDiffuse, vUv);
        // Calculate brightness to use as alpha (so black becomes transparent)
        float luma = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
        
        // Since it bypasses composer, add a slight contrast and brightness boost natively
        texColor.rgb = (texColor.rgb - 0.5) * 1.25 + 0.5;
        texColor.rgb *= 1.2;
        
        gl_FragColor = vec4(texColor.rgb, luma);
      }
    `,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  
  // Use the actual image dimensions to maintain perfect aspect ratio
  const imgWidth = texture.image ? texture.image.width : 800;
  const imgHeight = texture.image ? texture.image.height : 250;
  
  // We want it to take 90% of screen width (max 1200px)
  const desiredWidth = Math.min(window.innerWidth * 0.9, 1200);
  const scale = desiredWidth / imgWidth;
  
  // Stretch the height slightly (15%) as requested, without stretching width
  const geometry = new THREE.PlaneGeometry(imgWidth * scale, imgHeight * scale * 1.15); 
  const plane = new THREE.Mesh(geometry, material);
  
  // Center it in the HUD
  plane.position.set(0, 0, 0);
  hudScene.add(plane);
  
  // Store properties for resizing
  hudScene.userData.logoPlane = plane;
  hudScene.userData.baseWidth = imgWidth;
  hudScene.userData.baseHeight = imgHeight;
});

// Handle window resizing
window.addEventListener('resize', () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update HUD camera
  hudCamera.left = -window.innerWidth / 2;
  hudCamera.right = window.innerWidth / 2;
  hudCamera.top = window.innerHeight / 2;
  hudCamera.bottom = -window.innerHeight / 2;
  hudCamera.updateProjectionMatrix();

  // Update logo scale
  if (hudScene.userData.logoPlane) {
     const plane = hudScene.userData.logoPlane;
     const imgWidth = hudScene.userData.baseWidth;
     const imgHeight = hudScene.userData.baseHeight;
     const desiredWidth = Math.min(window.innerWidth * 0.9, 1200);
     const scale = desiredWidth / imgWidth;
     
     plane.geometry.dispose();
     plane.geometry = new THREE.PlaneGeometry(imgWidth * scale, imgHeight * scale * 1.15);
  }

  // Update renderer & composer size
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  composer.setSize(window.innerWidth, window.innerHeight);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Interactive mouse-follow rotation (centered correctly and mapped to correct axes)
window.addEventListener("mousemove", (e) => {
  if (helmetMesh) {
    // Horizontal mouse movement rotates around Y-axis (left/right)
    // Vertical mouse movement rotates around X-axis (up/down)
    // Subtract 0.5 to align center to the middle of the screen
    helmetMesh.rotation.y = (e.clientX / window.innerWidth - 0.5) * Math.PI * 0.4;
    helmetMesh.rotation.x = (e.clientY / window.innerHeight - 0.5) * Math.PI * 0.25;
  }
});
// Animation loop
const animate = () => {
  requestAnimationFrame(animate);

  // Render the scene via the Composer (includes helmet + post-processing)
  composer.render();
  
  // Render the crisp HUD directly to the canvas on top (bypasses post-processing blur)
  renderer.autoClear = false;
  renderer.render(hudScene, hudCamera);
  renderer.autoClear = true;
};

animate();
