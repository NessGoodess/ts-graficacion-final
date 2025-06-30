import * as THREE from 'three';
import { SolarFlare } from '../interfaces/SolarSystemInterfaces';

export interface Sun {
    group: THREE.Group;
    core: THREE.Mesh;
    corona: THREE.Mesh[];
    //flares: SolarFlare[];
}

export function createSun(scene: THREE.Scene): Sun {
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    // Núcleo del sol
    const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
    const sunMaterial = new THREE.MeshStandardMaterial({
        color: 0xffcc00,
        emissive: 0xffcc00,
        emissiveIntensity: 1
    });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sunGroup.add(sun);
    sun.userData = { name: "Sol" };

    // Luz del sol
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(0, 0, 0);
    sun.add(sunLight);

    // Corona solar
    const coronaGeometry = new THREE.SphereGeometry(5.5, 32, 32);
    const coronaMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        transparent: true,
        opacity: 0.3,
        side: THREE.BackSide
    });
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sunGroup.add(corona);

    // Segunda capa de corona
    const corona2Geometry = new THREE.SphereGeometry(6, 32, 32);
    const corona2Material = new THREE.MeshBasicMaterial({
        color: 0xff7700,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide
    });
    const corona2 = new THREE.Mesh(corona2Geometry, corona2Material);
    sunGroup.add(corona2);

    // Tercera capa de corona
    const corona3Geometry = new THREE.SphereGeometry(7, 32, 32);
    const corona3Material = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide
    });
    const corona3 = new THREE.Mesh(corona3Geometry, corona3Material);
    sunGroup.add(corona3);

    // Rayos de sol de caricatura
    /*const flares: SolarFlare[] = [];
    for (let i = 0; i < 16; i++) {
        const rayLength = 3 + Math.random() * 2; // Rayos más largos
        const rayWidth = 0.8 + Math.random() * 0.4; // Rayos más gruesos
        
        // Crear cono para el rayo de caricatura
        const rayGeometry = new THREE.ConeGeometry(rayWidth, rayLength, 6, 1, true);
        const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0xffff00, // Amarillo brillante como en caricaturas
            transparent: true,
            opacity: 0.9
        });
        
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        
        // Distribuir los rayos en 360 grados alrededor del sol
        const angle = (i / 16) * Math.PI * 2; // 16 rayos distribuidos uniformemente
        const radius = 5; // Radio del sol
        
        // Posicionar en la superficie del sol (solo en el plano XY)
        ray.position.x = radius * Math.cos(angle);
        ray.position.y = radius * Math.sin(angle);
        ray.position.z = 0;
        
        // Orientar hacia afuera desde el centro
        ray.lookAt(
            ray.position.x * 2,
            ray.position.y * 2,
            ray.position.z
        );
        
        sunGroup.add(ray);
        flares.push({
            mesh: ray,
            initialHeight: rayLength,
            pulseFactor: 0.2 + Math.random() * 0.3,
            pulseSpeed: 0.03 + Math.random() * 0.05
        });
    }*/

    return {
        group: sunGroup,
        core: sun,
        corona: [corona, corona2, corona3],
        //flares: flares
    };
}
