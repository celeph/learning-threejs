import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// npm install --save cannon
import CANNON from 'cannon'

/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}
debugObject.createSphere = () => {
    createSphere(Math.random() * .5, {x:(Math.random()-.5) *3, y:3, z:(Math.random()-.5) *3})
}
gui.add(debugObject, 'createSphere')

debugObject.createBox = () => {
    createBox(Math.random(), Math.random(), Math.random(), {x:(Math.random()-.5) *3, y:3, z:(Math.random()-.5) *3})
}
gui.add(debugObject, 'createBox')

debugObject.reset = () => {
    for(const object of objectsToUpdate) {
        // remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // remove mesh
        scene.remove(object.mesh)
    }
}
gui.add(debugObject, 'reset')


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sound
 */
const hitSound = new Audio('./sounds/hit.mp3')
const playHitSound = (collision) => {
    // console.log(collision) // event object
    const impactStrength = collision.contact.getImpactVelocityAlongNormal();

    console.log(impactStrength);
    if (impactStrength > 1.5) {
        hitSound.volume = Math.random() // (impactStrength/2)
        hitSound.currentTime = 0
        
        // see https://developer.chrome.com/blog/autoplay/
        var promise = hitSound.play();
        if (promise !== undefined) {
          promise.then(_ => {
            // Autoplay started!
          }).catch(error => {
              console.log(error);
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
          });
        }
    }
}


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    './textures/environmentMaps/0/px.png',
    './textures/environmentMaps/0/nx.png',
    './textures/environmentMaps/0/py.png',
    './textures/environmentMaps/0/ny.png',
    './textures/environmentMaps/0/pz.png',
    './textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
// world
const world = new CANNON.World()

world.broadphase = new CANNON.SAPBroadphase(world)

world.allowSleep = true

world.gravity.set(0, -9.82, 0)  // gravity is a Vec3  (not threejs's Vector3)


// materials
const defaultMaterial = new CANNON.Material('default')
//const plasticMaterial = new CANNON.Material('plastic')

const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial, // plasticMaterial
    {
        friction: .1,
        restitution: .7 // bounce
    }
)
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial

// sphere
// const sphereShape = new CANNON.Sphere(.5)  // same as SphereGeometry below
// const sphereBody = new CANNON.Body({
//     mass: 1,
//     position: new CANNON.Vec3(0, 3, 0),
//     shape: sphereShape
// })
// sphereBody.applyLocalForce(
//     new CANNON.Vec3(150,0,0),  // force
//     new CANNON.Vec3(0,0,0))    // 
// //sphereBody.material = defaultMaterial
// world.addBody(sphereBody)

// floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0 // object is static and won't move
floorBody.addShape(floorShape) // you can add multiple shapes to a body
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * .5)
//floorBody.material = defaultMaterial
world.addBody(floorBody)



/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
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
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
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
 * Utils
 */
const objectsToUpdate = [];

// sphere
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20); 
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: .3,
    roughness: .4,
    envMap: environmentMapTexture
})

const createSphere = (radius, position) => {

    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // cannon.js body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,0),
        shape, // : shape
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // save in objectsToUpdate
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}

createSphere(.5, {x:0, y:3, z:0})
//createSphere(.5, {x:2, y:3, z:2})


// box
const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1); 
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: .3,
    roughness: .4,
    envMap: environmentMapTexture
})

const createBox = (width, height, depth, position) => {

    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    )
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // cannon.js body
    const shape = new CANNON.Box(new CANNON.Vec3(width*.5, height*.5, depth*.5))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0,3,0),
        shape, // : shape
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // save in objectsToUpdate
    objectsToUpdate.push({
        mesh: mesh,
        body: body
    })
}


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update physics world
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // sphereBody.applyForce(new CANNON.Vec3(-.5,0,0), sphereBody.position) // new CANNON.Vec3(0,0,0)

    world.step(
        1/60, // fixed timestep, 60 fps
        deltaTime, // how much time passed since last step
        3 // how many iterations the world can apply to catch up with potential delay
    )
    //console.log(sphereBody.position.y)

    // Update threejs world
    // sphere.position.copy(sphereBody.position)
    // sphere.position.x = sphereBody.position.x
    // sphere.position.y = sphereBody.position.y
    // sphere.position.z = sphereBody.position.z
    
    for(const object of objectsToUpdate) {
        object.mesh.position.copy(object.body.position)

        object.mesh.quaternion.copy(object.body.quaternion)
    }


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()