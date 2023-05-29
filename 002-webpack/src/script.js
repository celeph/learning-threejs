import './style.css'
import * as THREE from 'three'

console.log(THREE);

const sizes = {
  width: 640,
  height: 480
};

// 1. scene (container)
const scene = new THREE.Scene();

// 2. objects inside the scene (primitive, imported, particles, lights etc)
//    mesh: geometry (shape) and material
const geometry = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 units size
const material = new THREE.MeshBasicMaterial({ color: 0xcc0000}); // or '#ff0000', or 'red'
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 3. camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); // fov in degrees, aspect ratio width/height
camera.position.z = 3;
//camera.position.x = 1;
//camera.position.y = 1;
scene.add(camera);

// 4. renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
