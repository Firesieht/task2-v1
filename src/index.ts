/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import * as BABYLON from 'babylonjs';
import * as ZapparBabylon from '@zappar/zappar-babylonjs';
import * as MAT from 'babylonjs-materials';
import target from '../assets/marker.zpt';
import 'babylonjs-loaders';
import './index.sass';
import * as GUI from "@babylonjs/gui"


if (ZapparBabylon.browserIncompatible()) {
  ZapparBabylon.browserIncompatibleUI();
  throw new Error('Unsupported browser');
}

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);

const engine = new BABYLON.Engine(canvas, true);

const scene = new BABYLON.Scene(engine);

const light = new BABYLON.DirectionalLight('dir02', new BABYLON.Vector3(0, 0, -1), scene);
light.position = new BABYLON.Vector3(0, 1, -10);

const light1 = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(1, -1, 0), scene);
const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
shadowGenerator.usePoissonSampling = true;

const camera = new ZapparBabylon.Camera('ZapparCamera', scene);

ZapparBabylon.permissionRequestUI().then((granted) => {
  if (granted) camera.start();
  else ZapparBabylon.permissionDeniedUI();
});

const imageTracker = new ZapparBabylon.ImageTrackerLoader().load(target);
const trackerTransformNode = new ZapparBabylon.ImageAnchorTransformNode('tracker', camera, imageTracker, scene);

trackerTransformNode.setEnabled(false);
imageTracker.onVisible.bind(() => {
  trackerTransformNode.setEnabled(true);
});
imageTracker.onNotVisible.bind(() => {
  trackerTransformNode.setEnabled(false);
});

const ground = BABYLON.MeshBuilder.CreatePlane('plane', { width: 3.1, height: 2 }, scene);

const shadowMaterial = new MAT.ShadowOnlyMaterial('mat', scene);
shadowMaterial.alpha = 0.5;
shadowMaterial.activeLight = light;
ground.material = shadowMaterial;



ground.parent = trackerTransformNode;
light.parent = trackerTransformNode;


ground.receiveShadows = true;
shadowGenerator.getShadowMap()?.renderList?.push(ground);


window.addEventListener('resize', () => {
  engine.resize();
});

let phrases = [
    "Хорошего нового года!",
    "Исполнения всех желаний и мечт",
    "Побольше любви и доверия",
    "Много подарков и хорошего настроения"
]
var plane = BABYLON.Mesh.CreatePlane("plane", 2, scene);
plane.parent = ground;
plane.position.y = -0.5;
var advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane as any);

var plane_phrase = BABYLON.Mesh.CreatePlane("plane_phrase", 3, scene); 
plane_phrase.parent = ground;
plane_phrase.position.y = 0.5;

var advancedTexture2 = GUI.AdvancedDynamicTexture.CreateForMesh(plane_phrase as any);
var phrase = GUI.Button.CreateSimpleButton("but", phrases[Math.floor(Math.random()*phrases.length)]);
phrase.width = 0.7;
phrase.height = 0.25;
phrase.color = "white";
phrase.fontSize = 50;
phrase.background = "#817AA0";
phrase.cornerRadius = 30
phrase.pointerEnterAnimation = phrase.pointerOutAnimation = phrase.pointerDownAnimation = phrase.pointerUpAnimation = () => null
phrase.thickness = 0


var button1 = GUI.Button.CreateSimpleButton("but1", "Сменить");
button1.width = 0.5;
button1.height = 0.2;
button1.color = "white";
button1.fontSize = 50;
button1.background = "#CE3923";
button1.cornerRadius = 35;
button1.hoverCursor = "pointer"
button1.thickness = 0

button1.onPointerUpObservable.add(function() {
    let phrase_any = phrase as any
    phrase_any.children[0].text = phrases[Math.floor(Math.random()*phrases.length)];
    
});


advancedTexture.addControl(button1);
advancedTexture2.addControl(phrase)

engine.runRenderLoop(() => {
  camera.updateFrame();
  scene.render();
});