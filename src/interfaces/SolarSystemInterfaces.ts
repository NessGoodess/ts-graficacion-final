import * as THREE from 'three';

export interface PlanetData {
    description: string;
    diameter?: string;
    mass?: string;
    distance?: string;
    dayLength?: string;
    yearLength?: string;
    temperature?: string;
    rotation?: string;
    funFact?: string;
}

export interface SolarFlare {
    mesh: THREE.Mesh;
    initialHeight: number;
    pulseFactor: number;
    pulseSpeed: number;
}

export interface AsteroidUserData {
    radius: number;
    angle: number;
    height: number;
    rotationSpeed: {
        x: number;
        y: number;
        z: number;
    };
    orbitSpeed: number;
}