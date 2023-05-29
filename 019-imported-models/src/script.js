import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// console.log(GLTFLoader)

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

let mixer = null;
let action = null;
let anim = 0;
let gltfscene = null

let debug = {};
debug.look = () => { 
  scene.remove(gltfscene);
  while(scene.animations.length > 0) scene.remove(scene.animations[0]);
  anim = 0; load(); 
};
debug.walk = () => { 
  scene.remove(gltfscene);
  while(scene.animations.length > 0) scene.remove(scene.animations[0]);
  anim = 1; load(); 
};
debug.run = () => {
  scene.remove(gltfscene);
  while(scene.animations.length > 0) scene.remove(scene.animations[0]);
  anim = 2; load(); 
};
  
gui.add(debug, 'look')
gui.add(debug, 'walk')
gui.add(debug, 'run')


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
let scene = new THREE.Scene()

/**
 * Load Models
 */
const dracoLoader = new DRACOLoader()
// C:\Users\celep\Documents\threejs\21-imported-models\node_modules\three\examples\js\libs\draco
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()

gltfLoader.setDRACOLoader(dracoLoader)

function load() {
gltfLoader.load(
    // '/models/Duck/glTF/Duck.gltf',
    // '/models/Duck/glTF-Binary/Duck.glb',
    // '/models/Duck/glTF-Embedded/Duck.gltf',
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    // '/models/Duck/glTF-Draco/Duck.gltf',
    './models/Fox/glTF/Fox.gltf',
    (gltf) => {
        console.log('success')
        console.log(gltf)

        // scene.add(gltf.scene.children[0])

        // for(const child of gltf.scene.children) scene.add(child);

        // while(gltf.scene.children.length) {
        //     scene.add(gltf.scene.children[0]);
        // }

        // const children = [...gltf.scene.children]
        // for(const child of children) scene.add(child)

        mixer = new THREE.AnimationMixer(gltf.scene)
        action = mixer.clipAction(gltf.animations[anim])
        console.log(action)
        action.play()

        gltf.scene.scale.set(0.025, .025, .025)
        gltfscene = gltf.scene
        scene.add(gltfscene)
    },
    (progress) => {
        console.log('progress')
        console.log(progress)
    },
    (error) => {
        console.log(error)
    }
)
}
load();

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // update mixer
    if (mixer) mixer.update(deltaTime)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()