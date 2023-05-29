import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


// three.js fonts in /node_modules/three/examples/fonts
//import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
//console.log(typefaceFont)


/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()
fontLoader.load(
    'fonts/helvetiker_regular.typeface.json',
    (font) => {
        console.log('font loaded');
        const textGeometry = new THREE.TextBufferGeometry(
            'Hello Three.js', {
                font: font,  // if property is same as variable, can use just "font,"
                size: .5,
                height: .2,
                curveSegments: 5, //12,
                bevelEnabled: true,
                bevelThickness: .03,
                bevelSize: .02,
                bevelOffset: 0,
                bevelSegments: 4 //5
            }
        )

        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)

        textGeometry.translate(
            - (textGeometry.boundingBox.max.x - .02) * 0.5,
            - (textGeometry.boundingBox.max.y - .02) * 0.5,
            - (textGeometry.boundingBox.max.z - .03) * 0.5
        )

        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)

        textGeometry.center()

        // const textMaterial = new THREE.MeshBasicMaterial({ 
        //     wireframe: true
        // })


        const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture
        })

        const text = new THREE.Mesh(textGeometry, textMaterial)

        scene.add(text)

        console.time('donuts')

        const donutGeometry = new THREE.TorusBufferGeometry(.3, .2, 20, 45)
        //const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

        for(let i=0; i< 100; i++) {
            // const donutGeometry = new THREE.TorusBufferGeometry(.3, .2, 20, 45)
            // const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
            //const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            const donut = new THREE.Mesh(donutGeometry, textMaterial)

            donut.position.x = (Math.random() -.5) * 10
            donut.position.y = (Math.random() -.5) * 10
            donut.position.z = (Math.random() -.5) * 10

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            scene.add(donut)
        }

        console.timeEnd('donuts')
    }
);

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('./textures/matcaps/8.png')
 
/**
 * Object
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
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

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()