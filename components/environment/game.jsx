import { useEffect, useRef } from "react";
import React from "react";
import * as BABYLON from "@babylonjs/core";
import "babylonjs-loaders";
import "/libs/navMeshWorker.js";

const Game = () => {
  const canvasRef = useRef(null);
  let idleAnim;
  let currentAnim;
  let walkAnim;
  let runAnim;

  let canvas, engine, scene, camera;
  let shadowGenerator;
  let dirLight;
  let ground;
  let box1, box, box3;
  let envRootNode, envMeshes, section01, section02, section03;

  let player, runnerMeshes, runnerBody;
  let runnerMeshesArray = [];
  let runnerParentNode;
  let pointNav;
  let mergedMesh;
  let navigationPlugin;

  let recastLoaded;

  let triggerBox;
  let sparks;
  let smoke;
  let gltfGroupNode;
  let characterScale = 0.01;
  let cameraNodeOffest;

  useEffect(() => {
    document.addEventListener("DOMContentLoaded", startGame);

    let createScene = function (engine) {
      recastLoaded = false;

      const loaded = 0;
      // Scene //
      scene = new BABYLON.Scene(engine);

      // Hemispheric Light //
      let light = new BABYLON.HemisphericLight(
        "light",
        new BABYLON.Vector3(0, 1, 0),
        scene
      );
      light.intensity = 0.25;

      // Define a general environment texture
      const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
        "textures/environment.dds",
        scene
      );
      scene.environmentTexture = hdrTexture;
      scene.environmentIntensity = 0.5;
      scene.createDefaultSkybox(hdrTexture, true, 2000, 0.7);

      // Directional Light //
      dirLight = new BABYLON.DirectionalLight(
        "dirLight",
        new BABYLON.Vector3(-2, -2, -1),
        scene
      );
      dirLight.intensity = 2;
      dirLight.position = new BABYLON.Vector3(2, 3.5, 1.25);
      //dirLight.autoUpdateExtends = true;
      //dirLight.autoCalcShadowZBounds = true;
      dirLight.shadowMinZ = -5;
      dirLight.shadowMaxZ = 50;
      // Ground //
      ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 100, height: 100 },
        scene
      );
      ground.position.y = -5;
      let groundMat = new BABYLON.StandardMaterial("groundMaterial", scene);
      groundMat.diffuseTexture = new BABYLON.Texture(
        "textures/concrete.jpg",
        scene
      );
      groundMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      groundMat.diffuseTexture.uScale = 30;
      groundMat.diffuseTexture.vScale = 30;
      groundMat.roughness = 0.9;
      groundMat.specularColor = new BABYLON.Color3(0.01, 0.01, 0.01);
      ground.material = groundMat;

      let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
      boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
      boxMaterial.diffuseTexture = new BABYLON.Texture(
        "textures/concrete.jpg",
        scene
      );
      boxMaterial.diffuseTexture.uScale = 0.5;
      boxMaterial.diffuseTexture.vScale = 0.5;
      boxMaterial.roughness = 0.5;
      boxMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

      triggerBox = BABYLON.MeshBuilder.CreateBox(
        "box",
        {
          size: 2,
          width: 2,
          height: 0.5,
        },
        scene
      );
      triggerBox.position.y = 0.25;
      triggerBox.position.x = 1;
      triggerBox.position.z = -6;
      triggerBox.checkCollisions = false;
      triggerBox.visibility = 0.4;

      BABYLON.ParticleHelper.CreateFromSnippetAsync(
        "UY098C#3",
        scene,
        false
      ).then((system) => {
        system.emitter = triggerBox;
        sparks = system;
        system.stop();
      });

      BABYLON.ParticleHelper.CreateFromSnippetAsync(
        "UY098C#6",
        scene,
        false
      ).then((system) => {
        system.emitter = triggerBox;
        smoke = system;
        system.stop();
      });

      // box1 = BABYLON.MeshBuilder.CreateBox("box", {size: 1}, scene);
      // box1.material = boxMaterial;
      // box1.position.y = 0.5;
      // box1.position.x = 4;

      // box2 = BABYLON.MeshBuilder.CreateBox("box", {size: 2}, scene);
      // box2.material = boxMaterial;
      // box2.position.y = 1;
      // box2.position.x = -5;

      // box3 = BABYLON.MeshBuilder.CreateBox("box", {size: 2, height:4}, scene);
      // box3.material = boxMaterial;
      // box3.position.y = 2;
      // box3.position.x = -4;
      // box3.position.z = -9;

      // Fog //
      scene.fogColor = new BABYLON.Color3(0.6, 0.7, 0.85);
      scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
      scene.fogDensity = 0.023;
      scene.fogStart = 20;
      scene.fogEnd = 1000;

      // Shadows //
      shadowGenerator = new BABYLON.CascadedShadowGenerator(
        2048,
        dirLight,
        true
      );
      //shadowGenerator.debug = true;
      shadowGenerator.lambda = 1;
      shadowGenerator.darkness = 0.1;
      shadowGenerator.bias = 0.01;
      // shadowGenerator.useBlurExponentialShadowMap = true;
      // shadowGenerator.blurKernel = 32;
      // ground.receiveShadows = true;

      // Register Before Render //
      // let intersenting = false;
      // let badge = document.getElementById("badge");
      // let hl = new BABYLON.HighlightLayer("hl1", scene);
      // scene.registerBeforeRender(function () {
      //   if (player) {
      //     if (triggerBox.intersectsMesh(runnerBody)) {
      //       if (intersenting == false) {
      //         if (sparks) sparks.start();
      //         if (smoke) smoke.start();
      //         badge.innerHTML = "Intersecting ZONE";
      //         intersenting = true;
      //         hl.addMesh(triggerBox, BABYLON.Color3.White());
      //       }
      //     } else {
      //       if (intersenting == true) {
      //         if (sparks) sparks.stop();
      //         if (smoke) smoke.stop();
      //         intersenting = false;
      //         hl.removeMesh(triggerBox);
      //         if (recastLoaded) badge.innerHTML = " Click/Tap to Navigate ";
      //         else badge.innerHTML = " Init Navigation, Please Wait... ";
      //       }
      //     }
      //   }
      // });
      //for now
      loadModel(scene, "GLTF/F_Runner/", "F_Runner.gltf");
      setPostProcessing(scene);

      scene.onMeshRemovedObservable.add((mesh) => {
        if (mesh.skeleton) {
          mesh.skeleton.dispose();
        }
      });

      scene.clearColor = new BABYLON.Color3(0, 0, 0);
      scene.ambientColor = new BABYLON.Color3(0, 0, 0);
      scene.autoClear = false; // Color buffer
      scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously

      /*
    setTimeout(function doSomething() {
        if (recastLoaded == false)
        {
            let badgeInfo = document.getElementById("badge");
            badgeInfo.innerHTML = " Retrying Recast";
            if (scene && player)
            {
                loadRecast(scene);
            }
        }
        setTimeout(doSomething, 2500);
    }, 3000);
    */

      return scene;
    };
    function startGame() {
      // Set Canvas & Engine //
      canvas = canvasRef.current;
      engine = new BABYLON.Engine(canvas, false);
      scene = createScene(engine);
      loadRecast(scene);

      engine.runRenderLoop(() => {
        scene.render();
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });
    }

    function createFollowCamera(scene, target) {
      camera = new BABYLON.FollowCamera(
        "tankFollowCamera",
        target.position,
        scene,
        target
      );
      camera.radius = 10; // how far from the object to follow
      camera.heightOffset = 1; // how high above the object to place the camera
      camera.rotationOffset = 180; // the viewing angle
      camera.cameraAcceleration = 0.1; // how fast to move
      camera.maxCameraSpeed = 2; // speed limit

      scene.backgroundColor = new BABYLON.Color3(0, 0, 0);
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      scene.autoClear = false; // Color buffer
      scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
      return camera;
    }

    window.addEventListener("resize", function () {
      engine.resize();
    });

    function loadModel(scene, path, character) {
      // parent Node:
      runnerParentNode = new BABYLON.TransformNode("runnerParentNode");
      cameraNodeOffest = new BABYLON.TransformNode("cameraNodeOffest");

      Promise.all([
        BABYLON.SceneLoader.ImportMeshAsync("", path, character).then(function (
          result
        ) {
          gltfGroupNode = scene.getTransformNodeByName("Runner_F_Parent");

          runnerMeshes = gltfGroupNode.getChildMeshes();

          runnerMeshes.forEach(function (item) {
            shadowGenerator.addShadowCaster(item, true);
            shadowGenerator.getShadowMap().renderList.push(item);
            item.useVertexColors = false;
            item.useVertexAlpha = false;
            item.isPickable = false;
            runnerMeshesArray.push(item);
          });

          gltfGroupNode.scaling = new BABYLON.Vector3(
            characterScale,
            characterScale,
            characterScale
          );

          gltfGroupNode.setParent(runnerParentNode); //2
          cameraNodeOffest.setParent(runnerParentNode);
          cameraNodeOffest.position.y = 0.75;

          player = runnerParentNode;

          runnerBody = scene.getMeshByName("F_Body:PIV_primitive0");
          runnerBody.isPickable = false;

          createArcRotateCameraWithTarget(scene, runnerParentNode.position);

          camera.lockedTarget = cameraNodeOffest;

          idleAnim = scene.getAnimationGroupByName("FRunner_Idle");
          walkAnim = scene.getAnimationGroupByName("F_Runner_WalkingStart");
          runAnim = scene.getAnimationGroupByName("Running");

          currentAnim = idleAnim;

          player.rotate(new BABYLON.Vector3.Up(), Math.PI * 2);
          //setAttributes(scene);
        }),
        BABYLON.SceneLoader.ImportMeshAsync(
          null,
          "/GLTF/MR_Home/",
          "MR_Home.gltf",
          scene
        ).then(function (result) {
          // result.meshes[0].position.x = -0.01;
          // result.meshes[0].position.y = -0.01;
          // result.meshes[0].scaling.scaleInPlace(0.5);
          envRootNode = scene.getTransformNodeByName("MR_Home_LOW");

          section01 = scene.getMeshByName("Floor_LOW");
          // section02 = scene.getMeshByName("section02");
          // section03 = scene.getMeshByName("section03");

          envRootNode.scaling = new BABYLON.Vector3(2, 2, 2);
          //envRootNode.position.y = -0.65;

          envMeshes = envRootNode.getChildMeshes();
          //console.log('envMeshes:' + envMeshes)

          envMeshes.forEach(function (item) {
            shadowGenerator.addShadowCaster(item, true);
            shadowGenerator.getShadowMap().renderList.push(item);
            item.receiveShadows = true;
          });
        }),
      ]).then(() => {
        setTimeout(() => {
          setNavigation(scene, player);
        }, 500);

        let toRender = function () {
          scene.render();
        };
        engine.runRenderLoop(toRender);
      });
    }

    function setAttributes(scene) {
      scene.meshes.forEach(function (mesh) {
        //console.log("meshes: " + mesh.name);
        mesh.isPickable = false;
        mesh.alwaysSelectAsActiveMesh = true;
        if (
          mesh.name != "skyBox" &&
          mesh.name != "ground" &&
          mesh.name != "_root_"
        ) {
          shadowGenerator.getShadowMap().renderList.push(mesh);
        }
      });
    }

    let blendingSpeed = 0.06;
    function* animationBlending(fromAnim, toAnim, speed) {
      let currentWeight = 1;
      let newWeight = 0;
      toAnim.start(true, speed, toAnim.from, toAnim.to, false);
      while (newWeight < 1) {
        newWeight += blendingSpeed;
        currentWeight -= blendingSpeed;
        toAnim.setWeightForAllAnimatables(newWeight);
        fromAnim.setWeightForAllAnimatables(currentWeight);
        yield;
      }
    }

    function setPostProcessing(scene) {
      //return;
      let pipeline = new BABYLON.DefaultRenderingPipeline(
        "defaultPipeline", // The name of the pipeline
        false, // Do you want the pipeline to use HDR texture?
        scene, // The scene instance
        [scene.activeCamera] // The list of cameras to be attached to
      );
      let gl = new BABYLON.GlowLayer("glow", scene);
      gl.intensity = 1.3;

      pipeline.imageProcessing.exposure = 1; // 1 by default
      //pipeline.samples = 4;
      pipeline.bloomEnabled = false;
      pipeline.sharpenEnabled = true;
      pipeline.imageProcessing.vignetteEnabled = true;
      pipeline.imageProcessing.vignetteWeight = 5;
    }

    function loadRecast(scene) {
      async function asyncRecast() {
        // setTimeout(() => {
        //   let badgeInfo = document.getElementById("badge");
        //   badgeInfo.innerHTML = " Loading Recast, Please Wait... ";
        // }, 300);
        //for now

        await Recast();
        navigationPlugin = new BABYLON.RecastJSPlugin();
        navigationPlugin.setWorkerURL("/libs/navMeshWorker.js");
      }
      asyncRecast();
    }

    function setNavigation(scene, player) {
      // setTimeout(() => {
      //   let badgeInfo = document.getElementById("badge");
      //   badgeInfo.innerHTML = " Init Navigation, Please Wait... ";
      // }, 300);

      let navmeshParameters = {
        cs: 0.4,
        ch: 0.02,
        walkableSlopeAngle: 35,
        walkableHeight: 1,
        walkableClimb: 1,
        walkableRadius: 1,
        maxEdgeLen: 12,
        maxSimplificationError: 1.3,
        minRegionArea: 8,
        mergeRegionArea: 20,
        maxVertsPerPoly: 6,
        detailSampleDist: 6,
        detailSampleMaxError: 1,
      };

      //navigationPlugin.createNavMesh([section01, box1, box2, box3], navmeshParameters,(navmeshData) =>
      navigationPlugin.createNavMesh(
        [section01],
        navmeshParameters,
        (navmeshData) => {
          player.position.frontVector = new BABYLON.Vector3(0, 1, 0);

          //console.log("got worker data", navmeshData);
          navigationPlugin.buildFromNavmeshData(navmeshData);

          let navmeshdebug = navigationPlugin.createDebugNavMesh(scene);
          navmeshdebug.position = new BABYLON.Vector3(0, 0.01, 0);
          let matdebug = new BABYLON.StandardMaterial("matdebug", scene);
          matdebug.diffuseColor = new BABYLON.Color3(0.1, 0.2, 1);
          matdebug.alpha = 0.01;
          navmeshdebug.material = matdebug;

          // setTimeout(() => {
          //   let badgeInfo = document.getElementById("badge");
          //   badgeInfo.innerHTML = " Click/Tap to Navigate ";
          // }, 300);

          recastLoaded = true;
          let crowd = navigationPlugin.createCrowd(1, 0.1, scene);

          // crowd
          let agentParams = {
            radius: 0.3,
            height: 0.1,
            maxAcceleration: 50.0,
            maxSpeed: 5,
            collisionQueryRange: 0.5,
            pathOptimizationRange: 0.2,
            separationWeight: 1.0,
          };

          let randomPos = navigationPlugin.getClosestPoint(
            new BABYLON.Vector3(0, 0, 0)
          );
          let transform = new BABYLON.TransformNode();
          let agentIndex = crowd.addAgent(randomPos, agentParams, transform);
          player.idx = agentIndex;
          player.trf = transform;
          player.mesh = runnerMeshesArray[0];

          let startingPoint;
          let currentMesh;
          let pathLine;
          let getGroundPosition = function () {
            let pickinfo = scene.pick(scene.pointerX, scene.pointerY);
            if (pickinfo.hit) {
              return pickinfo.pickedPoint;
              console.log(pickinfo.pickedPoint);
            }
            return null;
          };

          let pointerTap = function (mesh) {
            //console.log('pointer tap')
            currentMesh = mesh;
            startingPoint = getGroundPosition();

            if (pointNav) pointNav.dispose();

            pointNav = BABYLON.MeshBuilder.CreateSphere(
              "sphere",
              { diameter: 0.15 },
              scene
            );
            let pointNavMaterial = new BABYLON.StandardMaterial(
              "pointNavMaterial",
              scene
            );
            pointNavMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.3);
            pointNav.material = pointNavMaterial;
            pointNav.position = startingPoint;

            let agents = crowd.getAgents();
            let i;
            for (i = 0; i < agents.length; i++) {
              if (currentAnim == idleAnim) {
                currentAnim = walkAnim;
                scene.onBeforeRenderObservable.runCoroutineAsync(
                  animationBlending(idleAnim, runAnim, 1.5)
                );
              }
              let randomPos = navigationPlugin.getRandomPointAround(
                startingPoint,
                1.0
              );
              crowd.agentGoto(
                agents[i],
                navigationPlugin.getClosestPoint(startingPoint)
              );
            }
          };

          scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
              case BABYLON.PointerEventTypes.POINTERTAP:
                if (pointerInfo.pickInfo.hit) {
                  pointerTap(pointerInfo.pickInfo.pickedMesh);
                }
                break;
            }
          });

          scene.onBeforeRenderObservable.add(() => {
            player.position = crowd.getAgentPosition(player.idx);
            let vel = crowd.getAgentVelocity(player.idx);
            crowd.getAgentPositionToRef(player.idx, player.position);
            if (vel.length() > 1) {
              vel.normalize();
              let desiredRotation = Math.atan2(vel.x, vel.z);
              //player.rotation.z = player.rotation.z + (desiredRotation - player.rotation.z);
              //player[1].rotation.z = player[1].rotation.z + (desiredRotation - player[1].rotation.z);
              // player[0].rotation.y = player[0].rotation.y + (desiredRotation - player[0].rotation.y);
              player.rotation = new BABYLON.Vector3(
                player.rotation.x,
                player.rotation.y + (desiredRotation - player.rotation.y),
                player.rotation.z
              );
            }
            player.position.y = -0.01;
          });

          crowd.onReachTargetObservable.add((agentInfos) => {
            console.log("agent reach destination");
            currentAnim = idleAnim;
            scene.onBeforeRenderObservable.runCoroutineAsync(
              animationBlending(runAnim, idleAnim, 5)
            );
            pointNav.dispose();
          });
        }
      ); // worker
    }

    //Debug Layer:
    window.addEventListener(
      "keydown",
      function (event) {
        switch (event.code) {
          case "KeyQ":
            // Handle "back"
            scene.debugLayer.show();
            // document.getElementById("desktop-UI").style.display = "none";
            // document.getElementById("mobile-UI").style.display = "none";

            break;
        }
      },
      true
    );
    startGame();
  }, []);
  return <canvas id="renderCanvas" ref={canvasRef} />;
};
export default Game;
