import * as THREE from 'three';
import { AsteroidUserData } from '../interfaces/SolarSystemInterfaces';

export interface AsteroidBelt {
    group: THREE.Group;
    asteroids: THREE.Mesh[];
}

export function createAsteroidBelt(
    scene: THREE.Scene,
    innerRadius: number,
    outerRadius: number,
    count: number,
    useEllipticalOrbit: boolean = true
): AsteroidBelt {
    const asteroidGroup = new THREE.Group();
    scene.add(asteroidGroup);
    
    const asteroids: THREE.Mesh[] = [];
    
    for (let i = 0; i < count; i++) {
        const size = 0.05 + Math.random() * 0.2;
        const asteroidGeometry = new THREE.DodecahedronGeometry(size, 0);
        
        const vertices = asteroidGeometry.attributes.position.array as Float32Array;
        for (let j = 0; j < vertices.length; j += 3) {
            vertices[j] += (Math.random() - 0.5) * 0.2 * size;
            vertices[j + 1] += (Math.random() - 0.5) * 0.2 * size;
            vertices[j + 2] += (Math.random() - 0.5) * 0.2 * size;
        }
        
        const color = new THREE.Color(
            0.3 + Math.random() * 0.2,
            0.3 + Math.random() * 0.1,
            0.2 + Math.random() * 0.1
        );
        
        const asteroidMaterial = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.9,
            metalness: 0.1
        });
        
        const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
        
        const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 2;
        
        let a: number, b: number;
        if (useEllipticalOrbit) {
            a = radius;
            b = radius * 0.7;
        } else {
            a = radius;
            b = radius; // Para órbitas circulares, ambos ejes son iguales
        }
        
        asteroid.position.x = a * Math.cos(angle);
        asteroid.position.y = height;
        asteroid.position.z = b * Math.sin(angle);
        
        asteroid.rotation.x = Math.random() * Math.PI;
        asteroid.rotation.y = Math.random() * Math.PI;
        asteroid.rotation.z = Math.random() * Math.PI;
        
        const userData: AsteroidUserData = {
            radius: radius,
            angle: angle,
            height: height,
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            orbitSpeed: 0.001 + Math.random() * 0.002,
            a: a,
            b: b
        };
        
        asteroid.userData = userData;
        asteroidGroup.add(asteroid);
        asteroids.push(asteroid);
    }
    
    return {
        group: asteroidGroup,
        asteroids: asteroids
    };
}