import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import Stats from 'stats.js'

import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { MeshLambertMaterial, MeshPhongMaterial } from 'three'


/**
 * Stats
 */
const stats = new Stats()
stats.showPanel(0); // fps
document.body.appendChild(stats.dom)

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const displacementTexture = textureLoader.load('./textures/displacementMap.png')

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
camera.position.set(2, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: 'high-performance',  // pick fastest gpu
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Test meshes
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshStandardMaterial()
)
cube.castShadow = true
cube.receiveShadow = true
cube.position.set(- 5, 0, 0)
scene.add(cube)

const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1, 0.4, 128, 32),
    new THREE.MeshStandardMaterial()
)
torusKnot.castShadow = true
torusKnot.receiveShadow = true
scene.add(torusKnot)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial()
)
sphere.position.set(5, 0, 0)
sphere.castShadow = true
sphere.receiveShadow = true
scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial()
)
floor.position.set(0, - 2, 0)
floor.rotation.x = - Math.PI * 0.5
floor.castShadow = true
floor.receiveShadow = true
scene.add(floor)

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.normalBias = 0.05
directionalLight.position.set(0.25, 3, 2.25)
scene.add(directionalLight)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    stats.begin();

    const elapsedTime = clock.getElapsedTime()

    // Update test mesh
    torusKnot.rotation.y = elapsedTime * 0.1

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    stats.end();
}

tick()

/**
 * Tips
 */

// to measure fps with stats.js
// npm install --global stats.js

// remove chrome's fps limit

// # Unix (Terminal)
// open -a "Google Chrome" --args --disable-gpu-vsync --disable-frame-rate-limit

// # Windows (Command prompt)
// start chrome --args --disable-gpu-vsync --disable-frame-rate-limit

// start msedge --args --disable-gpu-vsync --disable-frame-rate-limit

// Didn't work for me.
// chrome://flags/ doesn't show it either

// spector.js chrome extension 
// // Tip 4
// console.log(renderer.info)

// // Tip 6
// scene.remove(cube)
// cube.geometry.dispose()
// cube.material.dispose()
// https://threejs.org/docs/#manual/en/introduction/How-to-dispose-of-objects

// https://discoverthreejs.com/tips-and-tricks/
// https://twitter.com/lewy_blue
// https://github.com/BinomialLLC/basis_universal
// https://tinypng.com/

// // Tip 10
// directionalLight.shadow.camera.top = 3
// directionalLight.shadow.camera.right = 6
// directionalLight.shadow.camera.left = - 6
// directionalLight.shadow.camera.bottom = - 3
// directionalLight.shadow.camera.far = 10
// directionalLight.shadow.mapSize.set(1024, 1024)
// try to use smallest mapsize possible

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

// // Tip 11
// cube.castShadow = true  // only cast/receive where necessary
// cube.receiveShadow = false

// torusKnot.castShadow = true
// torusKnot.receiveShadow = false

// sphere.castShadow = true
// sphere.receiveShadow = false

// floor.castShadow = false
// floor.receiveShadow = true

// // Tip 12
// renderer.shadowMap.autoUpdate = false
// renderer.shadowMap.needsUpdate = true

// // Tip 18
//      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)  // move geometry out and let them share one instance
//  for(let i = 0; i < 50; i++)
//  {
// //     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)  // move geometry out and let them share one instance

//     const material = new THREE.MeshNormalMaterial()
    
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// const geometries = []
// for(let i = 0; i < 50; i++)
// {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)  // move geometry out and let them share one instance
//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2)
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2)

//   geometry.translate(
//       (Math.random() - 0.5) * 10,
//       (Math.random() - 0.5) * 10,
//       (Math.random() - 0.5) * 10
//   )

//   geometries.push(geometry)
// }
// const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries)
// console.log(mergedGeometry)

// const material = new THREE.MeshNormalMaterial()

// const mesh = new THREE.Mesh(mergedGeometry, material)
// scene.add(mesh)


// // Tip 19
// for(let i = 0; i < 50; i++)
// {
//     const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

//     const material = new THREE.MeshNormalMaterial()  // move material out
    
//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// use cheap materials
// MeshLambertMaterial MeshPhongMaterial

// // Tip 20
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
    
// for(let i = 0; i < 50; i++)
// {
//     const material = new THREE.MeshNormalMaterial()

//     const mesh = new THREE.Mesh(geometry, material)
//     mesh.position.x = (Math.random() - 0.5) * 10
//     mesh.position.y = (Math.random() - 0.5) * 10
//     mesh.position.z = (Math.random() - 0.5) * 10
//     mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
//     mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

//     scene.add(mesh)
// }

// // Tip 22
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.InstancedMesh(geometry, material, 50)
scene.add(mesh);

for(let i = 0; i < 50; i++)
{
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  )

  const quaternion = new THREE.Quaternion()
  quaternion.setFromEuler(new THREE.Euler(
    (Math.random() - .5) * Math.PI * 2,
    (Math.random() - .5) * Math.PI * 2,
    0
  ))

  const matrix = new THREE.Matrix4()
  matrix.makeRotationFromQuaternion(quaternion)
  matrix.setPosition(position)

  mesh.setMatrixAt(i, matrix)
    // const mesh = new THREE.Mesh(geometry, material)
    // mesh.position.x = (Math.random() - 0.5) * 10
    // mesh.position.y = (Math.random() - 0.5) * 10
    // mesh.position.z = (Math.random() - 0.5) * 10
    // mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2
    // mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2

    // scene.add(mesh)
}



// // Tip 29
// don't just set to devicePixelRatio, but max of 2 - 2 is more than enough
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// // Tip 31, 32, 34 and 35
// const shaderGeometry = new THREE.PlaneGeometry(10, 10, 256, 256)

// const shaderMaterial = new THREE.ShaderMaterial({
  // precision: 'lowp', // default is mediump
  // defines: {
  // DISPLACEMENT_STRENGTH: 1.3
  //},
 // is the same as #define DISPLACEMENT_STRENGTH 1.3 in the shader code
//     uniforms:
//     {
//         uDisplacementTexture: { value: displacementTexture },
//         uDisplacementStrength: { value: 1.5 }
//     },
//     vertexShader: `
//         uniform sampler2D uDisplacementTexture;
//         uniform float uDisplacementStrength;

//         varying vec2 vUv;

//         void main()
//         {

// position
//             vec4 modelPosition = modelMatrix * vec4(position, 1.0);

// varying vec3 vColor;
//             float elevation = texture2D(uDisplacementTexture, uv).r;
//             if(elevation < 0.5)
//             {
//                 elevation = 0.5;
//             }
            // use clamp(elevation, 0.5, 1.0)  or max(elevation, .5) to eliminate if() condition



//             modelPosition.y += elevation * uDisplacementStrength;

//             gl_Position = projectionMatrix * viewMatrix * modelPosition;

// color
  //float colorElevation = max(elevation, .25);
// vec3 color = mix(vec3(1.,.1,.1), vec3(.1,0.,.5), colorElevation)
// vColor = color
//             vUv = uv;
//         }
//     `,
//     fragmentShader: `
//         uniform sampler2D uDisplacementTexture;

//         varying vec2 vUv;
//         varying vec3 vColor;
//         void main()
//         {
//             float elevation = texture2D(uDisplacementTexture, vUv).r;
//             if(elevation < 0.25)
//             {
//                 elevation = 0.25;
//             }

//             vec3 depthColor = vec3(1.0, 0.1, 0.1);
//             vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
//             vec3 finalColor = vec3(0.0);
//             finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
//             finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
//             finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
            // ^^
            // use finalColor = mix(depthColor, surfaceColor, elevation) instead of finalcolor.rgb

//             gl_FragColor = vec4(vColor, 1.0); //vec4(finalColor, 1.0);
//         }
//     `
// })

// const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial)
// shaderMesh.rotation.x = - Math.PI * 0.5
// scene.add(shaderMesh)