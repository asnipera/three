import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Tween, Easing, update } from "three/examples/jsm/libs/tween.module.js";
// gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
// 创建场景
const scene = new THREE.Scene();
scene.background = new THREE.Color("#ffffff");
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
camera.position.set(-15, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 坐标系
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
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
const helper = new THREE.DirectionalLightHelper(directionLight, 1);
scene.add(helper);

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

const cif = `# generated using pymatgen
data_Ac2CuSi
_symmetry_space_group_name_H-M   'P 1'
_cell_length_a   7.65983084
_cell_length_b   7.65983084
_cell_length_c   7.65983084
_cell_angle_alpha   90.00000000
_cell_angle_beta   90.00000000
_cell_angle_gamma   90.00000000
_symmetry_Int_Tables_number   1
_chemical_formula_structural   Ac2CuSi
_chemical_formula_sum   'Ac8 Cu4 Si4'
_cell_volume   449.42531996
_cell_formula_units_Z   4
loop_
 _symmetry_equiv_pos_site_id
 _symmetry_equiv_pos_as_xyz
  1  'x, y, z'
loop_
 _atom_site_type_symbol
 _atom_site_label
 _atom_site_symmetry_multiplicity
 _atom_site_fract_x
 _atom_site_fract_y
 _atom_site_fract_z
 _atom_site_occupancy
  Ac  Ac0  1  0.75000000  0.75000000  0.25000000  1
  Ac  Ac1  1  0.25000000  0.75000000  0.25000000  1
  Ac  Ac2  1  0.75000000  0.25000000  0.75000000  1
  Ac  Ac3  1  0.25000000  0.25000000  0.75000000  1
  Ac  Ac4  1  0.25000000  0.75000000  0.75000000  1
  Ac  Ac5  1  0.75000000  0.75000000  0.75000000  1
  Ac  Ac6  1  0.25000000  0.25000000  0.25000000  1
  Ac  Ac7  1  0.75000000  0.25000000  0.25000000  1
  Cu  Cu8  1  0.00000000  0.50000000  0.00000000  1
  Cu  Cu9  1  0.00000000  0.00000000  0.50000000  1
  Cu  Cu10  1  0.50000000  0.50000000  0.50000000  1
  Cu  Cu11  1  0.50000000  0.00000000  0.00000000  1
  Si  Si12  1  0.00000000  0.00000000  0.00000000  1
  Si  Si13  1  0.00000000  0.50000000  0.50000000  1
  Si  Si14  1  0.50000000  0.00000000  0.50000000  1
  Si  Si15  1  0.50000000  0.50000000  0.00000000  1
`;
const mol = ChemDoodle.readCIF(cif);
const model = new THREE.Group();
const molecule = mol.molecule;
const atoms = molecule.atoms;
const atomCount = atoms.length;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/ball/ball.gltf",
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
    console.log(gltf);

    for (let i = 0; i < atomCount; i++) {
      const ball = gltf.scene.children[0].clone();
      const atom = atoms[i];

      const { x, y, z } = atom;
      ball.position.set(x, y, z);
      model.add(ball);
    }

    model.position.setX(-3);
    model.position.setY(-3);
    model.position.setZ(-3);

    scene.add(model);

    // scene.add(gltf.scene);
  },
  (progress) => {},
  (error) => {
    console.log("error");
    console.log(error);
  }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
