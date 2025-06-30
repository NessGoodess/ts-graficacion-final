import * as THREE from 'three';

export interface Planet {
    group: THREE.Group;
    planet: THREE.Mesh;
    distance: number;
    rotationSpeed: number;
    orbitSpeed: number;
    name: string;
    size: number;
}

export function createPlanet(
    scene: THREE.Scene,
    size: number,
    color: number,
    distance: number,
    name: string,
    tilt: number = 0
): Planet {
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Órbita visible
    const orbitGeometry = new THREE.RingGeometry(distance - 0.05, distance + 0.05, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.2
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);

    // Planeta
    const planetMaterial = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5,
        metalness: 0.5,
        emissive: color,
        emissiveIntensity: 0.1
    });

    const planetGeometry = new THREE.SphereGeometry(size, 32, 32);
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    planet.position.x = distance;
    planet.castShadow = true;
    planet.receiveShadow = true;
    planet.rotation.z = tilt * Math.PI / 180;
    planetGroup.add(planet);
    planet.userData = { name: name };

    return {
        group: planetGroup,
        planet: planet,
        distance: distance,
        rotationSpeed: 0.01 + Math.random() * 0.01,
        orbitSpeed: 0.005 / (distance / 10),
        name: name,
        size: size
    };
}

export function createRings(planet: Planet, innerRadius: number, outerRadius: number, color: number): THREE.Mesh {
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    const ringMaterial = new THREE.MeshStandardMaterial({
        color: color,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.3,
        transparent: true,
        opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    planet.planet.add(ring);
    return ring;
}