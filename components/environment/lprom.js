// Textures:
let urlList = [
    "textures/LatestWork.png",
];

let videoList = [
    "videos/MDP-LATEST-WORK.mp4",
    "videos/MDP-MOTION_1.mp4",
    "videos/MDP-DESIGN_1.mp4",
    "videos/MDP-PLAY_1.mp4"
]


let canvas = document.getElementById("renderCanvas");
let exImportMesh, exImportMaterial, exNodeMaterial;
let GLTFimport = "/GLTF/MR_Home/MR_Home.gltf";
let scaleFactor = 1;
let gltfRootNode;
let videoScreen, videoTexture, videoURL, videoMat,scratchScreen,scratchScreenMat,videoTexture2;
let motionBTN, designBTN, playBTN, pauseBTN, contactBTN,resetBTN;
let buttonPressAnimation;
let firstPlay = false;
let rightDir,upDir,sensitivity;
let RUNNER_HOME, anchor, panel, pushButtonCore, newPushButton, newPbr,turnTable,sixDofDragBehavior;
let index = 0;
let panelCount = 12;
let currentLP;

let camera, hdrTexture, shadowGenerator, light, light2, helper, advancedTexture;
let loadingScreenDiv = document.getElementById("loadingScreen"); 
let loaded = document.getElementById("loaded");
const nmeMats = {};

let startRenderLoop = function (engine, canvas) {
    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
}
let engine = null;
let scene = null;
let sceneToRender = null;
let rotating = false;

let createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false }); };

let createScene = async function () {

    let scene = new BABYLON.Scene(engine);

    function customLoadingScreen() {
        console.log("customLoadingScreen creation")
    }
    customLoadingScreen.prototype.displayLoadingUI = function () {
        console.log("customLoadingScreen loading")
    };

    customLoadingScreen.prototype.hideLoadingUI = function () {
        console.log("customLoadingScreen loaded")
        loadingScreenDiv.style.display = "none";
    };
    let loadingScreen = new customLoadingScreen();
    engine.loadingScreen = loadingScreen;

    engine.displayLoadingUI();

    // create camera and lights for scene
    const lights = {};
    const env = {};


    async function initScene() {

        camera = new BABYLON.ArcRotateCamera("cam", Math.PI / 3, Math.PI / 3, 12,new BABYLON.Vector3(0, 0.5, 0));
        light = new BABYLON.HemisphericLight("sun", new BABYLON.Vector3(0, 1, 0), scene);

        camera.wheelDeltaPercentage = 0.01;
        camera.attachControl(canvas, true);
        camera.lowerBetaLimit = 0.5;
        camera.upperBetaLimit = (Math.PI / 2) * 0.9;

        // Define a general environment texture
        hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
        scene.environmentTexture = hdrTexture;

        scene.createDefaultSkybox(hdrTexture, true, 200, 0.7);

        light2 = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), scene);
        light2.position = new BABYLON.Vector3(-5, 10, -5)
        light2.direction = new BABYLON.Vector3(0.25, -0.25, 1)
        light2.intensity = 0.5;
        scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        // Shadows
        shadowGenerator = new BABYLON.ShadowGenerator(1024, light2);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;

        shadowGenerator.bias = 0.001;
        shadowGenerator.normalBias = 0.02;
        light2.shadowMaxZ = 100;
        light2.shadowMinZ = 10;
        shadowGenerator.useContactHardeningShadow = true;
        shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
        //shadowGenerator.setDarkness(0.5);

        // Establish GUI:
        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI")

    }

    async function loadMeshes() {

        videoURL = videoList[0];

        //videoMat = new BABYLON.StandardMaterial("mat", scene);
        //videoTexture = new BABYLON.VideoTexture("video", videoURL, scene, true, true);
        //videoTexture.video.muted = true;
        //videoMat.diffuseTexture = videoTexture;

        // scratchScreenMat = new BABYLON.StandardMaterial("mat", scene);
        // videoTexture2 = new BABYLON.VideoTexture("video", "videos/Scratch_Clip_1.mp4", scene, true, true);
        // videoTexture2.video.muted = true;
        // scratchScreenMat.diffuseTexture = videoTexture2;
        //videoTexture2.video.pause();
        //scratchScreenMat.albedoColor = new BABYLON.Color3(1, 1, 1);


        BABYLON.SceneLoader.ImportMeshAsync("", GLTFimport, "", scene, function (evt) {

            let loadedPercent = 0;
            if (evt.lengthComputable) {
                loadedPercent = (evt.loaded * 100 / evt.total).toFixed();
            }
            else {
                let dlCount = evt.loaded / (2048 * 2048);
                loadedPercent = Math.floor(dlCount * 100.0) / 100.0;

            }
            loadedPercent = Math.min(loadedPercent, 95)
            let loadedText = loadedPercent.toString()
            loaded.innerHTML = loadedText + '%';

        }

        ).then(result => {

            RUNNER_HOME = scene.getTransformNodeByName("MR_Home_LOW");
            RUNNER_HOME.scaling = new BABYLON.Vector3(scaleFactor, scaleFactor, scaleFactor);


            for (let i = 0; i < scene.materials.length; i++) {
                let m = scene.materials[i];
                m.environmentIntensity = 0.1;
                m.usePhysicalLightFalloff = true;
            }

            shadowGenerator.addShadowCaster(result.meshes[0], true);
            for (let index = 0; index < result.meshes.length; index++) {

                let currentMesh = result.meshes[index];
                let currentMeshChildren = currentMesh.getChildren();

                // let currentLightmap = new BABYLON.Texture(
                //     GLTFimport + currentMesh.name + ".lightmap.jpg",
                //     scene,
                //     false,
                //     false);
                // switch(currentMesh.getClassName()){
                //     case "Mesh":
                //         assignLightmapOnMaterial(currentMesh.material, currentLightmap);
                //         break;
                //     case "TransformNode": 
                //         currentMeshChildren.forEach(function(mesh){
                //             assignLightmapOnMaterial(mesh.material, currentLightmap);
                //         });
                //         break;  
                // }

                currentMesh.receiveShadows = true;

            }

            let helper = scene.createDefaultEnvironment({
                enableGroundShadow: true, createSkybox: false
            });

            helper.setMainColor(BABYLON.Color3.Gray());
            engine.hideLoadingUI();

        });



    }

    let manager;

    initScene();
    await loadMeshes();

    return scene;
}

window.initFunction = async function () {


    let asyncEngineCreation = async function () {
        try {
            return createDefaultEngine();
        } catch (e) {
            console.log("the available createEngine function failed. Creating the default engine instead");
            return createDefaultEngine();
        }
    }

    window.engine = await asyncEngineCreation();
    if (!engine) throw 'engine should not be null.';
    window.scene = createScene();
};
initFunction().then(() => {
    scene.then(returnedScene => { sceneToRender = returnedScene; });


    engine.runRenderLoop(function () {
        if (sceneToRender && sceneToRender.activeCamera) {
            sceneToRender.render();
        }
    });
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});

//Debug Layer:
window.addEventListener("keydown", function (event) {
    switch (event.code) {
        case "KeyQ":
            // Handle "back"
            sceneToRender.debugLayer.show();
            // document.getElementById("desktop-UI").style.display = "none";
            // document.getElementById("mobile-UI").style.display = "none";

            break;
    }
}, true);