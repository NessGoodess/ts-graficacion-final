import * as THREE from 'three';
import { Planet } from './Planet';

export interface Moon {
    group: THREE.Group;
    moon: THREE.Mesh;
    rotationSpeed: number;
    orbitSpeed: number;
    name: string;
}

export function createMoon(
    planet: Planet,
    size: number,
    color: number,
    distance: number,
    name: string
): Moon {
    const moonGroup = new THREE.Group();
    planet.planet.add(moonGroup);

    const moonGeometry = new THREE.SphereGeometry(size, 16, 16);
    const moonMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.8,
        metalness: 0.2
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.position.x = distance;
    moon.castShadow = true;
    moon.receiveShadow = true;
    moonGroup.add(moon);
    moon.userData = { name: name };

    return {
        group: moonGroup,
        moon: moon,
        rotationSpeed: 0.02,
        orbitSpeed: 0.02,
        name: name
    };
}