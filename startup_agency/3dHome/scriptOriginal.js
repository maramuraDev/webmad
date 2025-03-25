import * as THREE from "three";

import { FontLoader } from "fontLoader";
import { TextGeometry } from "textGeometry";

// Execute after waiting for the page to load
window.addEventListener("DOMContentLoaded", init);

function init() {
  // Rendering size
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Background color: blackish (alpha set to 1 for opaque)
  const bgColor = 0xffffff;


/*   const bgColor = 0xffffff;
 */  const canvas = document.querySelector("#canvas");

  // Create renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    devicePixelRatio: window.devicePixelRatio,
  });
  renderer.setSize(width, height);
  renderer.setClearColor(bgColor, 1);

  // Create scene
  const scene = new THREE.Scene();

  // Light sources
  const directionalLight = new THREE.DirectionalLight(0xff0000, 0);
  directionalLight.position.set(1, 2, 3);
  scene.add(directionalLight);
 
 
  const rimLight = new THREE.DirectionalLight(0xff0000, 5);
  rimLight.position.set(0, 2, -5);
  scene.add(rimLight);



/*   scene.add(new THREE.AmbientLight(0xffffff, 1));
 */
  // Create camera
  const camera = new THREE.PerspectiveCamera(45, width / height);
  camera.position.set(0, 0, 12);

  // Create an interesting shape: a torus knot geometry.
  // Adjust parameters as desired: radius, tube thickness, tubular segments, radial segments.
  const geometry = new THREE.TorusKnotGeometry(8, 1, 100, 20,30); 
  const params = {
    color: 0xffffff,
    transmission: 2,
    opacity: 1,
    metalness: 0,
    roughness: 0,
    ior: 1.6,
    thickness: 2,
    specularIntensity: 1,
    specularColor: 0xffffff,
    dispersion: 5,
  };

  const material = new THREE.MeshPhysicalMaterial({
    color: params.color,
    metalness: params.metalness,
    roughness: params.roughness,
    ior: params.ior,
    thickness: params.thickness,
    transmission: params.transmission,
    specularIntensity: params.specularIntensity,
    specularColor: params.specularColor,
    opacity: params.opacity,
    side: THREE.DoubleSide,
    dispersion: params.dispersion,
    transparent: true,
  });

  // Create the mesh and rotate slightly for better initial presentation.
  const interestingShape = new THREE.Mesh(geometry, material);
  interestingShape.rotateZ(0);
  interestingShape.rotateX(0);
  interestingShape.position.z = -10;
  interestingShape.position.x = 0;
  interestingShape.position.y = 0;

  // Group the shape (allows for easy interactive rotation)
  const group = new THREE.Group();
  group.add(interestingShape);

  // Optionally load some text (here left empty)
  const fontLoader = new FontLoader();
  fontLoader.load(
    "Arial_regular.json",
    function (font) {
      const textGeometry = new TextGeometry("Bold Ideas Welcome, ", {
        font: font,
        size: .5,
        depth: 0,
        weight: "100",
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 0,
        letterSpacing: 100
       
      });
      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.z = 0;
      textMesh.position.x = 0;
      textMesh.position.y = 1;


      scene.add(textMesh);
      scene.add(group);
    }
  );

  fontLoader.load(
    "Arial_regular.json",
    function (font) {
      const textGeometry = new TextGeometry("Daring Visions Required", {
        font: font,
        size: .5,
         depth: 0,
      
      });
      textGeometry.center();

      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.z = 0;
      textMesh.position.x = 0;
      textMesh.position.y = 0;

      scene.add(textMesh);
    }
  );

  

  // Mouse interaction to rotate the group dynamically
/*   renderer.domElement.addEventListener("mousemove", function (e) {
    group.rotation.x = e.pageY / 100.0;
    group.rotation.y = e.pageX / 100.0;
  });
 */
  // Animation loop
  function animate() {
    interestingShape.rotation.y += 0.002;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
} 