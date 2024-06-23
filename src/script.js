import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 });
const debugObject = {}

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

const generateRandomFloat = (count) => {
  const arr = new Float32Array(count);

  for (const i in arr) {
    arr[i] = Math.random();
  }

  return arr;
};

/**
 * Water
 */

// Geometry
const waterGeometry = new THREE.PlaneGeometry(5, 5, 512, 512);
const randomUvCount = generateRandomFloat(waterGeometry.attributes.uv.count);
waterGeometry.setAttribute("aRandomUvCount", new THREE.BufferAttribute(randomUvCount, 1));

// Color
debugObject.depthColor = "#186691";
debugObject.surfaceColor = "#9bd8ff";

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uWaveElevation: { value: 0.2 },
    uWaveFrequency: { value: new THREE.Vector2(4, 1.5) },
    uWaveDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uWaveSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },

    uSmallWaveElevation: { value: 0.15 },
    uSmallWaveFrequency: { value: 3 },
    uSmallWaveSpeed: { value: 0.2 },
    uSmallWaveIterations: { value: 3.0 },

    uColorOffset: { value: 0.07 },
    uColorMultiplier: { value: 1.75 },
  },
});

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

// GUI
gui.add(waterMaterial.uniforms.uWaveElevation, "value").min(0).max(1).step(0.001).name("Wave Elavation");
gui.add(waterMaterial.uniforms.uWaveFrequency.value, "x").min(0).max(10).step(0.01).name("Wave Frequency X");
gui.add(waterMaterial.uniforms.uWaveFrequency.value, "y").min(0).max(10).step(0.01).name("Wave Frequency Y");
gui.add(waterMaterial.uniforms.uColorOffset, "value").min(0).max(1.0).step(0.01).name("Color Offset");
gui.add(waterMaterial.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.01).name("Color Multiplier");

gui.add(waterMaterial.uniforms.uSmallWaveElevation, "value").min(0).max(1.0).step(0.01).name("uSmallWaveElevation");
gui.add(waterMaterial.uniforms.uSmallWaveFrequency, "value").min(0).max(30).step(0.01).name("uSmallWaveFrequency");
gui.add(waterMaterial.uniforms.uSmallWaveSpeed, "value").min(0).max(4).step(0.01).name("uSmallWaveSpeed");
gui.add(waterMaterial.uniforms.uSmallWaveIterations, "value").min(0).max(5).step(0.01).name("uSmallWaveIterations");

gui
  .addColor(debugObject, "depthColor")
  .onChange(() => {
    waterMaterial.uniforms.uWaveDepthColor.value.set(debugObject.depthColor);
  }
);
gui
  .addColor(debugObject, "surfaceColor")
  .onChange(() => {
    waterMaterial.uniforms.uWaveSurfaceColor.value.set(debugObject.surfaceColor);
  }
);
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

const axesHelper = new THREE.AxesHelper();
// axesHelper.setColors("red", "green", "blue");
// scene.add(axesHelper);

camera.position.set(0, 1, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // console.log("z", camera.position.z);

  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
