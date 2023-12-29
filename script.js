import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import{DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
console.log(DRACOLoader)
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader)


// Initialization of cursor object
const cursor = { x: 0, y: 0 }; 
// CANVAS*************************************
const canvas = document.querySelector('canvas.webgl')
// const canvas = document.createElement('canvas');
// canvas.width = 512; // Set the canvas width
// canvas.height = 512; // Set the canvas height



// Define sizes object to capture window size
const sizes = {
width: window.innerWidth,
height: window.innerHeight,
};
//debug gui
const gui = new dat.GUI()

// **************RESIZE FUNCTION***********
window.addEventListener('resize',()=>
{
	sizes.width = window.innerWidth 
	sizes.height = window.innerHeight

	//UPDATE CAMERA
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	// UPDATE RENDERER
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setPixelRatio(Math.min(window.devicePixelRatio,10))
    renderer.setClearAlpha()


})


// For turning window in full screen
window.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
        console.log('go fullscreen')
    } else {
        console.log('leave fullscreen')
        document.exitFullscreen()
    }
})
// *******FUNCTION FOR CONTROLLING BY MOUSE********
window.addEventListener('mousemove', (event) => {
cursor.x = event.clientX / sizes.width - 0.5;
cursor.y = -(event.clientY / sizes.height - 0.5);
// console.log(cursor.x);
// console.log(cursor.y);
});

/**
 * SCENE And FOG
 */
const scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0x01AFA3, 3, 18 );
/**
 * CAMERA
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
/**
 * RENDERER
 */
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// renderer.shadowMap.type = THREE.PCFSoftShadowMap  // shadow radius doen't work with this map 
// renderer.shadowMap.enabled = true;
renderer.setClearColor(0x01AFA3, 1);
renderer.outputColorSpace = THREE.SRGBColorSpace

// Texture Loader
const textureloader = new THREE.TextureLoader()
const bakedTexture = textureloader.load('static/baked2.jpg')
bakedTexture.flipY = false
bakedTexture.colorSpace = THREE.SRGBColorSpace 
// Textures
// const imagetexture = textureloader.load('Assets/background.jpg')
// 	imagetexture.wrapS = THREE.RepeatWrapping;
//   	imagetexture.wrapT = THREE.RepeatWrapping;
//   	imagetexture.repeat.set(1,1);
// scene.background = imagetexture

// const context = canvas.getContext('2d');

// // Generate scratchy pattern using Perlin noise
// for (let i = 0; i < canvas.width; i++) {
//   for (let j = 0; j < canvas.height; j++) {
//     const value = Math.floor(Math.random() * 505);
//     context.fillStyle = `rgb(${value},${value},${value})`;
//     context.fillRect(i, j, 1, 1);
//   }
// }
// const texture = new THREE.CanvasTexture(canvas);
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set(1, 1); // Adjust the repeat values as needed
// scene.background = imagetexture;

const directionalLight = new THREE.DirectionalLight( 0xffffff,0.3);
directionalLight.position.set(0.2,1.06,0.19)
directionalLight.castShadow = true // Important to note for shadows
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.mapSize.top = 3
directionalLight.shadow.mapSize.right= 3
directionalLight.shadow.mapSize.bottom = -3
directionalLight.shadow.mapSize.left = -3
directionalLight.shadow.camera.near = -4
directionalLight.shadow.camera.far = 45
//********TWEAKS********
// gui.add(directionalLight,'intensity').min(0).max(10).step(0.0001)
// gui.add(directionalLight.position,'x').min(-10).max(10).step(0.1)
// gui.add(directionalLight.position,'y').min(-10).max(10).step(0.0001)
// gui.add(directionalLight.position,'z').min(-10).max(10).step(0.0001)
// directionalLight.shadow.radius = 10
scene.add( directionalLight );

/**
 * Materials
 */
const material2 = new THREE.MeshStandardMaterial({
	color: 0x01AFA3,
	// map: imagetexture
})
material2.metalness = 0.2
material2.roughness = 0

const material3 = new THREE.MeshBasicMaterial({
    // color: 0xff0000,
    map: bakedTexture
}

)
// gui.add(material2,'metalness').min(0).max(1).step(0.0001)
// gui.add(material2,'roughness').min(0).max(1).step(0.0001)

// 
let loadedModel;
// NEW WAY TO DO add geometry as well as material
gltfLoader.load('static/FULL LOGO.glb',
    (gltf) =>{
        gltf.scene.traverse((child) =>{
            child.material = material3
        })
        // gltf.scene.position.y = -1
        // gltf.scene.position.x = 2
        // // gltf.scene.rotation.y 
        // scene.add(gltf.scene)
        // Store the loaded model for later manipulation
        loadedModel = gltf.scene;
        loadedModel.position.y = -1
        loadedModel.position.x = 2
        loadedModel.rotation.y = Math.PI*0.5 
        loadedModel.castShadow = true,
        scene.add(loadedModel);
    }
)


// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1.5,50,100),
//     material2
// )
// sphere.position.x = 3
// sphere.rotation.x += 1
// // sphere.position.z = -5
// sphere.castShadow = true
// scene.add(sphere)

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10,10),
    material2
)
floor.rotation.x = -Math.PI *0.5
floor.position.y = -1.5
floor.receiveShadow = true
scene.add(floor)

// *******Axes Helper => Very Important***
const axesHelper = new THREE.AxesHelper(3);
scene.add( axesHelper );

//Controls
const controls = new OrbitControls( camera, renderer.domElement);
controls.enableDamping = true;
// controls.dampingFactor = 0; // Adjust damping factor as needed

// const fontLoader = new FontLoader()
// fontLoader.load(
//     'static/textures/Fonts/optimer_bold.typeface.json', 
//     (font)=>
//     {
//         console.log(font)
//             const textGeometry = new TextGeometry( 'DHANKAK 2024', {
//                 font: font,
// 				width: 0.01,
//                 size: 0.5,
//                 height: 0.3,
//                 curveSegments: 6,
//                 bevelEnabled: true,
//                 bevelThickness: 0.03,
//                 bevelSize: 0.02,
//                 bevelOffset: 0,
//                 bevelSegments: 8
//             } 
//         )
//         textGeometry.computeBoundingBox()
//         textGeometry.center()
//         // Textures 
//         const textureloader = new THREE.TextureLoader()
//         const matcapTexture = textureloader.load('static/textures/matcaps/matcap (7).png')
//         const material = new THREE.MeshMatcapMaterial({
//             // flatShading: true,
//             matcap: matcapTexture
//         })
//         const text =  new THREE.Mesh(textGeometry,material)
//         scene.add(text)
       

//         console.log('font loaded')
//     }
// )
//clock
const clock = new THREE.Clock()
let oldElapsedTime = 0
//*****************ANIMATION************
function animate() {
	const elapsedTime = clock.getElapsedTime()
	const deltaTime = elapsedTime-oldElapsedTime
	oldElapsedTime = elapsedTime
	// console.log(deltaTime)
	camera.lookAt(new THREE.Vector3())
	
    // // // Rotate the model
    if (loadedModel) {
        loadedModel.rotation.y = elapsedTime*0.1; // Adjust the rotation speed as needed
        // loadedModel.rotation.y = elapsedTime*0.01; // Adjust the rotation speed as needed
    }



	controls.update();
	renderer.render( scene, camera );
	requestAnimationFrame( animate );

	// console.log(renderer.info) // We can see the calls and other performance related things
	
}
// Start the animation loop
animate(); 