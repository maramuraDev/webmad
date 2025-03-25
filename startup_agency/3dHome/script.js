import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { DRACOLoader } from "https://unpkg.com/three@0.165.0/examples/jsm/loaders/DRACOLoader.js";
import { FontLoader } from "fontLoader";
import { TextGeometry } from "textGeometry";

window.addEventListener("DOMContentLoaded", init);

function init() {
  // ======== 1. Basic Setup ========
  const width = window.innerWidth;
  const height = window.innerHeight;
  const canvas = document.querySelector("#canvas");

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    devicePixelRatio: window.devicePixelRatio,
  });
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 1); // Black background
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();

  // ======== 2. Camera ========
  // Placed at z=50 looking toward the origin
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 200);
  camera.position.set(0, 0, 50);
  camera.lookAt(0, 0, 0);

  // ======== 3. Environment Texture (optional) ========
  const textureLoader = new THREE.TextureLoader();
  const envTexture = textureLoader.load("small.hdr");
  envTexture.mapping = THREE.EquirectangularReflectionMapping;
  envTexture.colorSpace = THREE.SRGBColorSpace;
  scene.environment = envTexture;

  // ======== 4. Spotlight from the Camera ========
  // Make it red, attach to camera so it shines forward from camera's POV
  const spotLight = new THREE.SpotLight(0xff0000, 3);
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.2;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;

  // When you add a light to the camera, set the light’s position to (0,0,0)
  // so it’s at the camera’s local origin. The spotlight will shine along -Z.
  spotLight.position.set(0, 0, 0);

  // A tiny offset so the cone doesn’t clip the camera’s near plane
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.mapSize.set(1024, 1024);

  // Attach the spotlight to the camera, then add camera to the scene
  camera.add(spotLight);
  scene.add(camera);

  // ======== (Optional) SpotLight Helper ========
  // Helps visualize the cone
  const spotLightHelper = new THREE.SpotLightHelper(spotLight);
  scene.add(spotLightHelper);

  // ======== 5. Ambient Light (dim, so we still see the spotlight effect) ========
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  // ======== 6. Glass-like Material ========
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.05,
    ior: 1.6,
    thickness: 2,
    transmission: 0.9,
    specularIntensity: 1,
    specularColor: 0xffffff,
    envMap: envTexture,
    envMapIntensity: 1,
    side: THREE.DoubleSide,
    transparent: true,
  });

  // ======== 7. Load Model at the Origin ========
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const modelGroup = new THREE.Group();
  scene.add(modelGroup);

  gltfLoader.load("romualdo.glb", function (gltf) {
    const model = gltf.scene;
    model.traverse((child) => {
      if (child.isMesh) {
        child.material = glassMaterial;
        child.castShadow = true;
      }
    });
    // Place the model near the origin
    model.position.set(0, -5, 0);
    model.scale.set(8, 8, 8);
    modelGroup.add(model);
  });

  // ======== 8. Plane Behind the Model ========
  // Large plane at z = -10, to catch spotlight behind the model
  const planeGeometry = new THREE.PlaneGeometry(200, 100);
  const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.position.set(0, 0, -10);
  scene.add(plane);

  // ======== 9. Text (optional) ========
  const fontLoader = new FontLoader();
  fontLoader.load("miamo.json", function (font) {
    const textGeometry = new TextGeometry("NO. MAD", {
      font: font,
      size: 5,
      depth: 0.5,
      bevelEnabled: false,
    });
    textGeometry.center();
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 10, 0);
    scene.add(textMesh);
  });

  // ======== 10. Render Loop ========
  function animate() {
    requestAnimationFrame(animate);
    // Keep helper updated
    spotLightHelper.update();
    renderer.render(scene, camera);
  }

  animate();
}
