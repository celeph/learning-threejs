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

const group = new THREE.Group();
scene.add(group);

const geometry = new THREE.BoxGeometry(1, 1, 1); // 1x1x1 units size
const material = new THREE.MeshBasicMaterial({ color: 0xcc0000}); // or '#ff0000', or 'red'
const mesh = new THREE.Mesh(geometry, material);
group.add(mesh);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
group.add(cube1);

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);
cube2.position.x = -2;
group.add(cube2);

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
);
cube3.position.x = 2;
group.add(cube3);

group.position.y = 1;
group.scale.y = 0.5;

// Position
// mesh.position.x = .7;
// mesh.position.y = -.6;
// mesh.position.z = 1;
mesh.position.set(.7, -.6, 1);

// console.log(mesh.position.normalize());
// console.log(mesh.position.length());

// Axes helper
const axesHelper  = new THREE.AxesHelper(); // length can be adjusted
scene.add(axesHelper); // r=x, g=y, b=z

// Scale
mesh.scale.x = 2;
mesh.scale.y = .25;
mesh.scale.z = .5;

// Rotate
mesh.rotation.reorder('YXZ');
mesh.rotation.x = Math.PI * .25;
mesh.rotation.y = Math.PI * .25;
// mesh.rotation.z = Math.PI * .5;
// avoid "gimbal lock"

// 3. camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height); // fov in degrees, aspect ratio width/height
camera.position.z = 3;
// camera.position.x = 1;
// camera.position.y = 1;
// camera.lookAt(mesh.position);
scene.add(camera);

console.log(mesh.position.distanceTo(camera.position));

// 4. renderer
const canvas = document.querySelector('.webgl');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

renderer.render(scene, camera);
