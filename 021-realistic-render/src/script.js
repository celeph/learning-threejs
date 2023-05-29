import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'


/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()

const cubeTextureLoader = new THREE.CubeTextureLoader()


/**
 * Base
 */
// Debug
const gui = new dat.GUI()

const debugObject = {}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Update all materials
 */

const updateAllMaterials = () => {
    scene.traverse((child) => {
        // console.log(child)
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // console.log(child)
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity
            child.material.needsUpdate = true
            child.castShadow = true
            child.receiveShadow = true
        }
    })
}

debugObject.envMapIntensity = 5
// gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(.001).onChange(() => {
//     // console.log('do it')
//     updateAllMaterials()
// })
// or:
gui.add(debugObject, 'envMapIntensity').min(0).max(10).step(.001).onChange(updateAllMaterials)


// we don't need DRACOLoader because model isn't compressed
gltfLoader.load(
    //'./models/hamburger.glb',
     './models/FlightHelmet/glTF/FlightHelmet.gltf',
    (gltf) => {
        console.log('success')
        console.log(gltf)
        gltf.scene.scale.set(10,10,10)
        //gltf.scene.scale.set(.3,.3,.3)
        gltf.scene.position.set(0,-4,0)
        gltf.scene.rotation.y = Math.PI * .5
        scene.add(gltf.scene)
        gui.add(gltf.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(.001).name('rotation')
        updateAllMaterials()
    }
)

const environmentMap = cubeTextureLoader.load([
    './textures/environmentMaps/0/px.jpg',
    './textures/environmentMaps/0/nx.jpg',
    './textures/environmentMaps/0/py.jpg',
    './textures/environmentMaps/0/ny.jpg',
    './textures/environmentMaps/0/pz.jpg',
    './textures/environmentMaps/0/nz.jpg'
])

// normal textures and others should use LinearEncoding
// only textures we can see directly 
// gltf loader adds encoding automatically
environmentMap.encoding = THREE.sRGBEncoding
scene.background = environmentMap
scene.environment = environmentMap

/**
 * Test sphere
 */
// const testSphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial()
// )
// scene.add(testSphere)

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
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(.25, 3, -2.25)
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 15
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.normalBias = .05
scene.add(directionalLight)

gui.add(directionalLight, 'intensity').min(0).max(10).step(.001).name('lightIntensity')
gui.add(directionalLight.position, 'x').min(-5).max(5).step(.001).name('lightX')
gui.add(directionalLight.position, 'y').min(-5).max(5).step(.001).name('lightY')
gui.add(directionalLight.position, 'z').min(-5).max(5).step(.001).name('lightZ')

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 1, - 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.physicallyCorrectLights = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

renderer.outputEncoding = THREE.sRGBEncoding
// srgb gamma factor of 2.2, common value
renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMapping = THREE.CineonToneMapping
// renderer.toneMapping = THREE.ReinhardToneMapping
// renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 3
gui.add(renderer, 'toneMappingExposure').min(0).max(10).step(.01)

gui.add(renderer, 'toneMapping', {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
})
.onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping)
    updateAllMaterials()
})

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()