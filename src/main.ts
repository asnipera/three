import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Tween, Easing, update } from "three/examples/jsm/libs/tween.module.js";
// gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color("#BFE3DD");
// 给scene添加一个背景图片
// scene.background = new THREE.CubeTextureLoader().load([
//   "/skybox/px.jpg",
//   "/skybox/nx.jpg",
//   "/skybox/py.jpg",
//   "/skybox/ny.jpg",
//   "/skybox/pz.jpg",
//   "/skybox/nz.jpg",
// ]);

// 创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(5, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/**
 * Light
 */
const directionLight = new THREE.DirectionalLight();
directionLight.castShadow = true;
directionLight.position.set(5, 5, 6);
directionLight.shadow.camera.near = 1;
directionLight.shadow.camera.far = 20;
directionLight.shadow.camera.top = 10;
directionLight.shadow.camera.right = 10;
directionLight.shadow.camera.bottom = -10;
directionLight.shadow.camera.left = -10;

const directionLightHelper = new THREE.DirectionalLightHelper(
  directionLight,
  2
);
directionLightHelper.visible = false;
scene.add(directionLightHelper);

const directionalLightCameraHelper = new THREE.CameraHelper(
  directionLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
// scene.add(directionalLightCameraHelper);

const ambientLight = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.3);
scene.add(ambientLight, directionLight);

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
let left_door: THREE.Group;
let right_door: THREE.Group;
gltfLoader.load(
  "/box/6.gltf",
  (gltf) => {
    const _scene1 = gltf.scene.clone();
    _scene1.name = "left_door";
    _scene1.children[0].translateZ(-1);
    _scene1.position.set(0, 0, 2);
    left_door = _scene1;
    scene.add(_scene1);
  },
  (progress) => {
    console.log("progress");
    console.log(progress);
  },
  (error) => {
    console.log("error");
    console.log(error);
  }
);

gltfLoader.load(
  "/box/8.gltf",
  (gltf) => {
    const _scene2 = gltf.scene.clone();
    _scene2.name = "right_door";
    // _scene2.rotation.y = -Math.PI;
    _scene2.children[0].translateZ(1);
    _scene2.position.set(0, 0, -2);
    right_door = _scene2;
    scene.add(_scene2);
  },
  (progress) => {
    console.log("progress");
    console.log(progress);
  },
  (error) => {
    console.log("error");
    console.log(error);
  }
);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// 创建面板的几何体
const geometry = new THREE.PlaneGeometry(2, 2);
// 将面板的中心点移动到左侧边框
geometry.translate(1, 0, 0);
// 创建面板的材质（可以自定义颜色或纹理）
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  side: THREE.DoubleSide,
});

// 坐标系
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 创建面板的网格，并设置初始位置和旋转角度
const panel = new THREE.Mesh(geometry, material);
panel.position.set(-1, 0, 0);
// panel.rotation.y = Math.PI / 2; // 初始旋转角度，这里使用弧度制
panel.name = "door";
// scene.add(panel);

// // 动画循环
// function animate() {
//   // 调用旋转动画函数
//   rotatePanel();
//   // 渲染场景
//   renderer.render(scene, camera);
//   update();
// }

// // 启动动画循环
// animate();

// var tween = new Tween(panel.position)
//   .to({ x: 100, y: 100, z: 100 }, 10000)
//   .onUpdate(function (this: { lv: number }) {
//     console.log(this);
//   })
//   .start();
// tween.start();

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  update();
}
animate();

// 创建gui单击按钮
const gui = new GUI();
const folder = gui.addFolder("folder");
folder
  .add(
    {
      click: () =>
        new Tween(left_door.rotation)
          .to(
            {
              y: -0.6 * Math.PI,
            },
            1000
          )
          // 打开冰箱门
          .easing(Easing.Linear.None)
          .start(),
    },
    "click"
  )
  .name("打开左侧门");

folder
  .add(
    {
      click: () =>
        new Tween(right_door.rotation)
          .to(
            {
              y: 0.6 * Math.PI,
            },
            1000
          )
          // 打开冰箱门
          .easing(Easing.Linear.None)
          .start(),
    },
    "click"
  )
  .name("打开右侧门");
