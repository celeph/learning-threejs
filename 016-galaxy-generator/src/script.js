import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({width:400})

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {
    count: 100000,
    size: .01,
    radius: 5,
    branches: 3,
    spin: 1,
    randomness: .2,
    randomnessPower: 3,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
}

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    console.log('Generate the galaxy')

    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i=0; i < parameters.count; i++) {
        const i3 = i * 3;

        // positions[i3] = (Math.random() - 0.5) * 3 // x
        // positions[i3+1] = (Math.random() - 0.5) * 3 // y 
        // positions[i3+2] = (Math.random() - 0.5) * 3 // z

        const radius = Math.random() * parameters.radius
        
        // line
        // positions[i3] = radius
        // positions[i3+1] = 0
        // positions[i3+2] = 0

        // branches
        // const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        // positions[i3] = Math.cos(branchAngle) * radius
        // positions[i3+1] = 0
        // positions[i3+2] = Math.sin(branchAngle) * radius

        // spin
        // const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        // const spinAngle = radius * parameters.spin
        // positions[i3] = Math.cos(branchAngle + spinAngle) * radius
        // positions[i3+1] = 0
        // positions[i3+2] = Math.sin(branchAngle + spinAngle) * radius

        // randomness
        // const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        // const spinAngle = radius * parameters.spin
        // const randomX = (Math.random()-.5) * parameters.randomness
        // const randomY = (Math.random()-.5) * parameters.randomness
        // const randomZ = (Math.random()-.5) * parameters.randomness

        // positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        // positions[i3+1] = randomY
        // positions[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // randomnessPower
        // const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        // const spinAngle = radius * parameters.spin
        // const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness
        // const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness
        // const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness

        // positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        // positions[i3+1] = randomY
        // positions[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        // adding colors
        const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2
        const spinAngle = radius * parameters.spin
        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < .5 ? 1 : -1) * parameters.randomness

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3+1] = randomY
        positions[i3+2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parameters.radius)

        colors[i3] = mixedColor.r
        colors[i3+1] = mixedColor.g
        colors[i3+2] = mixedColor.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    points = new THREE.Points(geometry, material)
    scene.add(points)
}

gui.add(parameters, 'count', 100, 100000, 100).onFinishChange(generateGalaxy); // or gui.add(parameters, 'count').min(100).max(1000000).step(100)  // step usually same as min value
gui.add(parameters, 'size', .001, .1, .001).onFinishChange(generateGalaxy);
gui.add(parameters, 'radius', .001, 20, .001).onFinishChange(generateGalaxy);
gui.add(parameters, 'branches', 2, 20, 1).onFinishChange(generateGalaxy);
gui.add(parameters, 'spin', -5, 5, .001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomness', 0, 2, .001).onFinishChange(generateGalaxy);
gui.add(parameters, 'randomnessPower', 1, 10, .001).onFinishChange(generateGalaxy);
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);
generateGalaxy()


/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
// scene.add(cube)

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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // generateGalaxy()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()