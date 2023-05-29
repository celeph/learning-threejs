import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// console.log(gsap);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)


let time = Date.now();

const clock = new THREE.Clock();

gsap.to(mesh.position, { duration:2, delay:2, x: 2 });
gsap.to(mesh.position, { duration:2, delay:6, x: 0 });

// Animations
const tick = () => {
    // console.log('tick');
    // time
    const currentTime = Date.now();
    const deltaTime = currentTime - time;
    time = currentTime;

    const elapsedTime = clock.getElapsedTime();

    //console.log(deltaTime);
    //console.log(time);

    // update objects
    // mesh.rotation.y += .001 * deltaTime;
    // mesh.rotation.y = elapsedTime;
    // mesh.rotation.y = elapsedTime * Math.PI * 2 * .25;

    // mesh.position.y = Math.sin(elapsedTime);
    // mesh.position.x = Math.cos(elapsedTime);

    //camera.position.y = Math.sin(elapsedTime);
    //camera.position.x = Math.cos(elapsedTime);
    //camera.lookAt(mesh.position);

    // render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick);
}

tick();

// add GSAP with
// npm install --save gsap@3.5.1
// --save adds it to the dependencies so the next dev can install it with npm install


