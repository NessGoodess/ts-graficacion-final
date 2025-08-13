import * as THREE from 'three';

export interface Planet {
    group: THREE.Group;
    planet: THREE.Mesh;
    distance: number;
    rotationSpeed: number;
    orbitSpeed: number;
    name: string;
    size: number;
    a: number;
    b: number;
    orbitInclinationX: number;
    orbitInclinationY: number;
}

export function createPlanet(
    scene: THREE.Scene,
    size: number,
    color: number,
    distance: number,
    name: string,
    tilt: number = 0,
    orbitInclinationX: number = 0,
    orbitInclinationY: number = 0,
    useEllipticalOrbit: boolean = true,
): Planet {
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    let orbit: THREE.Mesh;

    if (useEllipticalOrbit) {
        // Órbita visible elíptica
        const a = distance;      // Semieje mayor
        const b = distance * 0.7; // Semieje menor (ajusta el factor para la excentricidad)

        const segments = 128;
        const outerPoints: THREE.Vector2[] = [];
        const innerPoints: THREE.Vector2[] = [];
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            outerPoints.push(new THREE.Vector2(a * Math.cos(theta), b * Math.sin(theta)));
            innerPoints.push(new THREE.Vector2((a - 0.05) * Math.cos(theta), (b - 0.05) * Math.sin(theta)));
        }

        const orbitShape = new THREE.Shape(outerPoints);
        orbitShape.holes.push(new THREE.Path(innerPoints));
        const geometry = new THREE.ShapeGeometry(orbitShape);

        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        orbit = new THREE.Mesh(geometry, orbitMaterial);
    } else {
        // Órbita visible circular
        const orbitGeometry = new THREE.RingGeometry(distance - 0.05, distance + 0.05, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    }

    orbit.rotation.x = Math.PI / 2 + orbitInclinationX * Math.PI / 180;
    orbit.rotation.y = orbitInclinationY * Math.PI / 180;
    orbit.userData = { isOrbit: true, isElliptical: useEllipticalOrbit };
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
    planet.position.x = 0;
    planet.castShadow = true;
    planet.receiveShadow = true;
    //planet.rotation.y
    planet.rotation.z = tilt * Math.PI / 180;
    planet.userData = { name: name, originalTilt: tilt };
    planetGroup.add(planet);
    //planet.userData = { name: name };

    // Calcular a y b para el retorno
    const a = distance;      // Semieje mayor
    const b = distance * 0.7; // Semieje menor

    return {
        group: planetGroup,
        planet: planet,
        distance: distance,
        rotationSpeed: 0.01 + Math.random() * 0.01,
        orbitSpeed: 0.005 / (distance / 10),
        name: name,
        size: size,
        a: a,
        b: b,
        orbitInclinationX: orbitInclinationX,
        orbitInclinationY: orbitInclinationY
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