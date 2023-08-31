import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Tween, Easing, update } from "three/examples/jsm/libs/tween.module.js";
// gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { cloneDeep } from "lodash";
// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
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
camera.position.set(-20, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 坐标系
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);
/**
 * Light
 */
const directionLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionLight.position.set(-2, -1, -2);
directionLight.shadow.camera.near = 10;
directionLight.shadow.camera.far = 200;
directionLight.shadow.camera.top = 10;
directionLight.shadow.camera.right = 100;
directionLight.shadow.camera.bottom = -10;
directionLight.shadow.camera.left = -10;
// helper
// const helper = new THREE.DirectionalLightHelper(directionLight, 1);
// scene.add(helper);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight, directionLight);
// 自然光
const hemisphereLight = new THREE.HemisphereLight(
  new THREE.Color("#ffffff"),
  new THREE.Color("#000000"),
  1
);
scene.add(hemisphereLight);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// // 创建一个环境光
// var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

// // 创建一个定向光源
// var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(1, 1, 1); // 设置光源的方向
// scene.add(directionalLight);
const fileInput = document.getElementById("file");
fileInput?.addEventListener("change", function (e) {
  const files = e.target.files;
  if (!files) return;
  const fileReader = new FileReader();

  fileReader.onload = (ev) => {
    const cif = ev.target.result;
    const mol = ChemDoodle.readCIF(cif);
    const model = new THREE.Group();
    const molecule = mol.molecule;
    const atoms = molecule.atoms;
    const bonds = molecule.bonds;
    const atomCount = atoms.length;
    const bondCount = bonds.length;
    const gltfLoader = new GLTFLoader();

    // 添加光源以使模型可见
    const light = new THREE.DirectionalLight(0xffffff, 1.5);
    light.position.set(-10, 10, -10);
    scene.add(light);

    gltfLoader.load(
      "./ball/ball.gltf",
      (gltf) => {
        // gltf.scene.scale.set(30, 30, 30);
        // const doorLight = new THREE.PointLight("#ffffff", 1, 7);
        // doorLight.position.set(0, 60, -10);
        // // helper
        // const doorLightHelper = new THREE.PointLightHelper(doorLight, 1);
        // doorLight.castShadow = true;
        // doorLight.shadow.camera.near = 1;
        // doorLight.shadow.camera.far = 20;
        // doorLight.shadow.mapSize.set(1024, 1024);
        // doorLight.shadow.radius = 5;
        // doorLight.shadow.bias = -0.0001;
        // doorLight.shadow.normalBias = 0.02;
        // doorLight.shadow.camera.updateProjectionMatrix();
        // gltf.scene.add(doorLight);
        // scene.add(doorLightHelper);

        // gltf.scene.traverse((item) => {
        //   if (item.name === "Cube") {
        //     item.castShadow = true;
        //     createSquare(5, 5, item, gltf.scene, 4.2);
        //     item.visible = false;
        //   }
        // });

        // gltf.scene.traverse((item) => {
        //   if (item.name === "Box033_Chrome_0001") {
        //     item.castShadow = true;
        //     createLattice(5, item, gltf.scene);
        //     item.visible = false;
        //   }
        // });
        // const _scene2 = gltf.scene.clone();
        // _scene2.name = "right_door";
        // // _scene2.rotation.y = -Math.PI;
        // _scene2.children[0].translateZ(1);
        // _scene2.position.set(0, 0, -2);
        // right_door = _scene2;
        // gltf.scene.add(doorLight);
        // scene.add(doorLightHelper);
        let _ball = gltf.scene;
        // scene.add(_ball);

        for (let i = 0; i < atomCount; i++) {
          // const ball = _ball!.clone();
          // ball.name = "ball_" + i;
          const atom = atoms[i];
          const { x, y, z } = atom;
          // ball.position.set(x, y, z);
          // ball.scale.set(0.5, 0.5, 0.5);
          const color = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
          );
          // (ball as THREE.Mesh).material.color = color;
          const _scene = _ball.clone();
          _scene.position.set(x, y, z);
          _scene.scale.set(0.3, 0.3, 0.3);
          _scene.traverse((child) => {
            if (child.isMesh && child.material) {
              if (Array.isArray(child.material)) {
                // 对于具有多重材质的对象
                child.material = child.material.map((mat) => {
                  const newMat = mat.clone();
                  newMat.color.copy(color);
                  return newMat;
                });
              } else {
                // 对于只有一个材质的对象
                child.material = child.material.clone();
                child.material.color.copy(color);
              }
            }
          });
          model.add(_scene);
        }
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        const c = box.getCenter(center).negate();
        const { x, y, z } = c;

        model.position.set(x, y, z);

        const boxHelper = new THREE.BoxHelper(new THREE.Mesh(), 0xffffff);
        const helper = boxHelper.setFromObject(model);
        scene.add(model, helper);

        for (let i = 0; i < bondCount; i++) {
          const bond = bonds[i];
          const { a1, a2 } = bond;
          // const validA1 = atoms.some(
          //   (atom) => atom.x === a1.x && atom.y === a1.y && atom.z === a1.z
          // );
          // const validA2 = atoms.some(
          //   (atom) => atom.x === a2.x && atom.y === a2.y && atom.z === a2.z
          // );
          // if (!validA1 || !validA2) {
          //   console.log(777);
          //   continue;
          // }
          const height = a2.distance3D(a1);

          const cylinderGeometry = new THREE.CylinderGeometry(
            0.1,
            0.1,
            height,
            8
          );
          const color = new THREE.Color(
            Math.random(),
            Math.random(),
            Math.random()
          );
          const cylinderMaterial = new THREE.MeshPhongMaterial({
            color,
            shininess: 100,
          });
          var cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
          cylinderMesh.position.set(
            (a1.x + a2.x) / 2,
            (a1.y + a2.y) / 2,
            (a1.z + a2.z) / 2
          );
          let direction = new THREE.Vector3();

          direction.subVectors(a2, a1).normalize();

          let axis = new THREE.Vector3(0, 1, 0);
          //使用Quaternion对象创建旋转矩阵，并将其应用于氢键模型
          let quaternion = new THREE.Quaternion();

          quaternion.setFromUnitVectors(axis, direction);
          cylinderMesh.setRotationFromQuaternion(quaternion);
          model.add(cylinderMesh);
        }
      },
      (progress) => {},
      (error) => {
        console.log("error");
        console.log(error);
      }
    );
  };
  fileReader.readAsBinaryString(files[0]);
});

// 加载CIF文件并创建模型
// const loader = new THREE.FileLoader();
// loader.load("/cif/ZrNb (3).cif", function (cif) {
//   const mol = ChemDoodle.readCIF(cif);
//   console.log(mol);

//   const model = new THREE.Group();
//   const molecule = mol.molecule;
//   const atoms = molecule.atoms;
//   const bonds = molecule.bonds;
//   const atomCount = atoms.length;
//   const bondCount = bonds.length;
//   const gltfLoader = new GLTFLoader();

//   // 添加光源以使模型可见
//   const light = new THREE.DirectionalLight(0xffffff, 1.5);
//   light.position.set(-10, 10, -10);
//   scene.add(light);

//   gltfLoader.load(
//     "/ball/ball.gltf",
//     (gltf) => {
//       // gltf.scene.scale.set(30, 30, 30);
//       // const doorLight = new THREE.PointLight("#ffffff", 1, 7);
//       // doorLight.position.set(0, 60, -10);
//       // // helper
//       // const doorLightHelper = new THREE.PointLightHelper(doorLight, 1);
//       // doorLight.castShadow = true;
//       // doorLight.shadow.camera.near = 1;
//       // doorLight.shadow.camera.far = 20;
//       // doorLight.shadow.mapSize.set(1024, 1024);
//       // doorLight.shadow.radius = 5;
//       // doorLight.shadow.bias = -0.0001;
//       // doorLight.shadow.normalBias = 0.02;
//       // doorLight.shadow.camera.updateProjectionMatrix();
//       // gltf.scene.add(doorLight);
//       // scene.add(doorLightHelper);

//       // gltf.scene.traverse((item) => {
//       //   if (item.name === "Cube") {
//       //     item.castShadow = true;
//       //     createSquare(5, 5, item, gltf.scene, 4.2);
//       //     item.visible = false;
//       //   }
//       // });

//       // gltf.scene.traverse((item) => {
//       //   if (item.name === "Box033_Chrome_0001") {
//       //     item.castShadow = true;
//       //     createLattice(5, item, gltf.scene);
//       //     item.visible = false;
//       //   }
//       // });
//       // const _scene2 = gltf.scene.clone();
//       // _scene2.name = "right_door";
//       // // _scene2.rotation.y = -Math.PI;
//       // _scene2.children[0].translateZ(1);
//       // _scene2.position.set(0, 0, -2);
//       // right_door = _scene2;
//       // gltf.scene.add(doorLight);
//       // scene.add(doorLightHelper);
//       let _ball = gltf.scene;
//       // scene.add(_ball);

//       for (let i = 0; i < atomCount; i++) {
//         // const ball = _ball!.clone();
//         // ball.name = "ball_" + i;
//         const atom = atoms[i];
//         const { x, y, z } = atom;
//         // ball.position.set(x, y, z);
//         // ball.scale.set(0.5, 0.5, 0.5);
//         const color = new THREE.Color(
//           Math.random(),
//           Math.random(),
//           Math.random()
//         );
//         // (ball as THREE.Mesh).material.color = color;
//         const _scene = _ball.clone();
//         _scene.position.set(x, y, z);
//         _scene.scale.set(0.3, 0.3, 0.3);
//         _scene.traverse((child) => {
//           if (child.isMesh && child.material) {
//             if (Array.isArray(child.material)) {
//               // 对于具有多重材质的对象
//               child.material = child.material.map((mat) => {
//                 const newMat = mat.clone();
//                 newMat.color.copy(color);
//                 return newMat;
//               });
//             } else {
//               // 对于只有一个材质的对象
//               child.material = child.material.clone();
//               child.material.color.copy(color);
//             }
//           }
//         });
//         model.add(_scene);
//       }
//       const box = new THREE.Box3().setFromObject(model);
//       const center = new THREE.Vector3();
//       const c = box.getCenter(center).negate();
//       const { x, y, z } = c;

//       model.position.set(x, y, z);

//       const boxHelper = new THREE.BoxHelper(new THREE.Mesh(), 0xffffff);
//       const helper = boxHelper.setFromObject(model);
//       scene.add(model, helper);

//       for (let i = 0; i < bondCount; i++) {
//         const bond = bonds[i];
//         const { a1, a2 } = bond;
//         // const validA1 = atoms.some(
//         //   (atom) => atom.x === a1.x && atom.y === a1.y && atom.z === a1.z
//         // );
//         // const validA2 = atoms.some(
//         //   (atom) => atom.x === a2.x && atom.y === a2.y && atom.z === a2.z
//         // );
//         // if (!validA1 || !validA2) {
//         //   console.log(777);
//         //   continue;
//         // }
//         const height = a2.distance3D(a1);

//         const cylinderGeometry = new THREE.CylinderGeometry(
//           0.1,
//           0.1,
//           height,
//           8
//         );
//         const color = new THREE.Color(
//           Math.random(),
//           Math.random(),
//           Math.random()
//         );
//         const cylinderMaterial = new THREE.MeshPhongMaterial({
//           color,
//           shininess: 100,
//         });
//         var cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
//         cylinderMesh.position.set(
//           (a1.x + a2.x) / 2,
//           (a1.y + a2.y) / 2,
//           (a1.z + a2.z) / 2
//         );
//         let direction = new THREE.Vector3();

//         direction.subVectors(a2, a1).normalize();

//         let axis = new THREE.Vector3(0, 1, 0);
//         //使用Quaternion对象创建旋转矩阵，并将其应用于氢键模型
//         let quaternion = new THREE.Quaternion();

//         quaternion.setFromUnitVectors(axis, direction);
//         cylinderMesh.setRotationFromQuaternion(quaternion);
//         model.add(cylinderMesh);
//       }
//     },
//     (progress) => {},
//     (error) => {
//       console.log("error");
//       console.log(error);
//     }
//   );
// });

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
