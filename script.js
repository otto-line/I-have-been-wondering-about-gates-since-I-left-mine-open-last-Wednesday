import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** Shared Setup */
const sizes = {
  width: 800,
  height: 600
};

// Scene creation function
function createScene(canvasSelector, modelPath, cameraPos, targetPos, animated = false,addLights = true) {
  const scene = new THREE.Scene();
  scene.background = null;

  // Lighting
  if (addLights) {
    // Add lights only if addLights is true
    const light = new THREE.SpotLight(0xadd8e6, 150);
    light.position.set(10, 10, 20);
    light.target.position.set(0, 0, 0);
    light.distance = 200;
    scene.add(light);
    scene.add(light.target);
  }

  // Camera
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
  camera.position.set(...cameraPos);
  scene.add(camera);

  // Renderer
  const canvas = document.querySelector(canvasSelector);
if (!canvas) {
  console.error(`Canvas element not found for selector: ${canvasSelector}`);
  return; // or throw error to prevent further execution
}

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.NoToneMapping;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...targetPos);
  controls.update();

  // Optional: Log camera + target on change
  controls.addEventListener('change', () => {
    console.log(`🧭 Canvas: ${canvasSelector}`);
    console.log('🎥 Camera Position:', camera.position.toArray());
    console.log('🎯 Controls Target:', controls.target.toArray());
  });

  // Clock and mixer for animation
  const clock = new THREE.Clock();
  let mixer = null;

  // Load model
  const loader = new GLTFLoader();
  loader.load(
    modelPath,
    (gltf) => {
      const model = gltf.scene;
      scene.add(model);

      // Center model
      const box = new THREE.Box3().setFromObject(model);
      const center = new THREE.Vector3();
      box.getCenter(center);
      model.position.sub(center);

      model.scale.set(2, 2, 2);

      // Handle animations
      if (animated && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
        console.log(`✅ Loaded ${gltf.animations.length} animation(s) for ${modelPath}`);
      } else if (animated) {
        console.warn(`⚠️ No animations found in ${modelPath}`);
      }
    },
    undefined,
    (error) => {
      console.error(`❌ Failed to load model: ${modelPath}`, error);
    }
  );

  return { scene, camera, renderer, controls, mixer, clock };
}

// First scene (Open Gates)
const first = createScene(
  '#canvas1',
  '/models/GATEBRIDGE.glb',
  [27, 6, 15],
  [-0.8, -0.5, -0.8]
);

// Second scene (90th Street)
const second = createScene(
  '#canvas2',
  '/models/90thstreet.glb',
  [11, 1.9, 6],
  [-1.6, -0.8, 4]
);

// Third scene (Gate5 with animation)
const third = createScene(
  '#canvas3',
  '/models/Gate5.glb',
  [-7.496778114469109, 0.1469599845322775, 3.5533819551275307],
  [90.3999, -0.00003, -67.6],
  true
);

// Fourth scene (New model — change path & positions as needed)
const fourth = createScene(
  '#canvas4',
  '/models/Nowheregate.glb',       // ⬅️ Update with your real path
  [14, -1, -11],                    // ⬅️ Camera position
  [2.4, 2.7, -4.6],                     // ⬅️ Target position
  false,
  true                          // ⬅️ Set to true if animated
);

// Shared animation loop
function animate() {
  requestAnimationFrame(animate);

  [first, second, third, fourth].forEach((sceneObj) => {
    const delta = sceneObj.clock.getDelta();
    if (sceneObj.mixer) {
      sceneObj.mixer.update(delta);
    }
    sceneObj.controls.update();
    sceneObj.renderer.render(sceneObj.scene, sceneObj.camera);
  });
}
animate();
