import * as THREE from 'three';

export function configureShadows(light: THREE.DirectionalLight): void {
    light.shadow.mapSize.width = 4096;  // Mayor resolución
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;
    
    // Ajusta según el tamaño de tu escena
    light.shadow.camera.left = -200;
    light.shadow.camera.right = 200;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = -200;
    
    light.shadow.bias = -0.0001;
    light.shadow.normalBias = 0.05;
}