import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { ShaderService } from './utils/services/shader.service';
import { ThrusterService } from './utils/services/thruster.service';

interface Turbine {
  Blades: THREE.Object3D;
}

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  public scene: THREE.Scene;
  private turbine: Turbine;

  private frameId: number = null;


  public constructor(
    private ngZone: NgZone,
    private shaderService: ShaderService,
    private thrusterService: ThrusterService
  ) { }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }
  private setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,      // transparent background
      antialias: true,  // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  public initialize(canvas: HTMLCanvasElement) {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas;
    this.setupRenderer();
    // create the scene
    this.scene = this.createScene();
    // create camera
    this.camera = this.setupCamera();
    this.scene.add(this.camera);
    this.controls = this.setupControls(this.camera, this.canvas);
  }
  private setupControls(camera: THREE.PerspectiveCamera, canvas: HTMLCanvasElement) {
    var controls = new OrbitControls(camera, canvas);
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.autoRotate = true;
    controls.enableDamping = false;
    return controls
  }
  private setupCamera(): THREE.PerspectiveCamera {
    var camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 50000
    );
    camera.position.z = 8000;
    camera.position.y = 1000;
    camera.position.x = 0;
    return camera;
  }
  private createScene(): THREE.Scene {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000)
    this.loadFBX('../../assets/models/EolicFBX.fbx').then(
      (windturbine) => {
        console.log(windturbine);
        // Remove default lighting
        windturbine.children[0].children.shift();
        scene.add(windturbine);
        this.turbine = {
          Blades: windturbine.children[0].children[5]
        };
        this.controls.target = this.turbine.Blades.position;
        this.controls.update();
      }
    );
    for (const light of this.createSceneLighting()) {
      scene.add(light);
    }

    return scene;
  }
  private createSceneLighting(): THREE.Object3D[] {
    var ambientLight = new THREE.AmbientLight(0xFDCC6C, 0.25); // soft white light
    ambientLight.position.y = 5;
    var directionalLight = new THREE.DirectionalLight(0xE4F6F8, 1); // soft white light
    directionalLight.position.x = 5000;
    directionalLight.position.y = 5000;
    return [directionalLight, ambientLight];
  }
  rad = 0;
  radIncrement = 0.1;
  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      this.controls.update();
      if (document.readyState !== 'loading') {
        this.render();
      }
      else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.renderer.render(this.scene, this.camera);
    this.rad = + this.thrusterService.configuration.speedConfig.value;
    //this.blades.rotateX(this.rad);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  loadFBX(modelPath: string): Promise<THREE.Object3D> {
    return new Promise((resolve, reject) => {
      var container = new THREE.Object3D();
      const fbxLoader = new FBXLoader();
      let pathParts = modelPath.split('/');
      fbxLoader.setResourcePath(pathParts.slice(0,pathParts.length-1).join('/') + "/textures/");
      fbxLoader.load(modelPath, function (object) {
        container.add(object);
        resolve(container);
      }, (prog) => {
        console.log(`${prog.loaded}/${prog.total}`);
      },
      (err) => {
        reject();
      });
    })
  }
}
