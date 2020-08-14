import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { MeshStandardMaterial, AmbientLight, MeshBasicMaterial } from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { ShaderService } from './shader.service';
import { ObjectInfo } from './object-info';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private controls: OrbitControls;
  public scene: THREE.Scene;
  private light: THREE.AmbientLight;
  private sunlight: THREE.DirectionalLight;
  private impactAnimation: any;

  private frameId: number = null;

  private impactRatio : { value: number } = { value: 0 }
  

  public constructor(private ngZone: NgZone, private shaderService: ShaderService) {}

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;

    this.scene.add(this.camera);
    let thrusterInfo : ObjectInfo = {
      MTL_path: '../../assets/models/Thruster.mtl',
      OBJ_path: '../../assets/models/Thruster.obj'
    }
    this.createObject(thrusterInfo);

    var ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    ambientLight.position.y = 5;
    this.scene.add( ambientLight );

    var directionalLight = new THREE.DirectionalLight( 0x404040 ); // soft white light
    directionalLight.position.y = 5;
    this.scene.add( directionalLight );

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enablePan = false;
    this.controls.enableRotate = true;
    this.controls.autoRotate = true;
    this.controls.enableDamping = false;
    // Tweak this value based on how far/away you'd like the camera
    // to be from the globe.
    this.camera.position.z = -8;
  }
  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    
    this.ngZone.runOutsideAngular(() => {
      this.controls.update();
      if (document.readyState !== 'loading') {
          this.render();
      } else {
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
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( width, height );
  }

  createObject(object_info: ObjectInfo){
    const mtlLoader = new MTLLoader();
    mtlLoader.load(object_info.MTL_path, materials => {
        materials.preload();

        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(
            object_info.OBJ_path,
            obj => {
              console.log(obj.children);
              this.scene.add(obj);
            },
            xhr => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            }
        );
    });
  }
}
