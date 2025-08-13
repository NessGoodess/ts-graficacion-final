import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createAsteroidBelt, AsteroidBelt } from './models/AsteroidBelt'; 
import { createAxesHelper, toggleAxesVisibility } from './utils/helpers';
import { createPlanet, Planet, createRings } from './models/Planet';
import { AsteroidUserData } from './interfaces/SolarSystemInterfaces';
import { configureShadows } from './utils/shadow';
import { createSun, Sun } from './models/Sun';
import { planetData } from './data/planetData';
import { createMoon } from './models/Moon';

// Configuración inicial
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Controles de órbita

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 10;
controls.maxDistance = 500;

// Posición de la cámara
camera.position.z = 50;
camera.position.y = 20;
camera.lookAt(0, 0, 0);

// Raycaster para interacciones
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Variables globales
let axesVisible: boolean = true;
let axesHelpers: THREE.AxesHelper[] = [];
let rotationSpeedFactor: number = 1;
let orbitSpeedFactor: number = 1;
let hoveredPlanet: string | null = null;
let selectedPlanet: string | null = null;

//variables para control de inclinación
let orbitInclinationX: number = 0;
let orbitInclinationY: number = 0;
let planetTiltFactor: number = 1;

// Variable para controlar el tipo de órbita
let useEllipticalOrbits: boolean = true;

// Objetos del sistema solar
let sun: Sun;
let planets: Planet[] = [];
let asteroidBelt: AsteroidBelt;
let asteroidBeltKuiper: AsteroidBelt;

// Variables globales para estrellas parpadeantes
let twinklingStars: THREE.Points[] = [];
let milkyWay: THREE.Points;

// Al inicio del archivo
let sunLight: THREE.DirectionalLight;

// Función para crear la Vía Láctea
function createMilkyWay(): void {
    const milkyWayGeometry = new THREE.BufferGeometry();
    const milkyWayMaterial = new THREE.PointsMaterial({
        color: 0xCCDDFF,
        size: 0.05,
        transparent: true,
        opacity: 0.6
    });

    const milkyWayVertices: number[] = [];
    
    // Crear una banda elíptica de estrellas (Vía Láctea)
    for (let i = 0; i < 195000; i++) {
        
        const angle = Math.random() * Math.PI * 2;
        const milkyWayBandWidth = 2000;
        const radius = 120 + Math.random() * milkyWayBandWidth;
        const height = (Math.random() - 0.5) * 200;
        
        // Crear forma elíptica
        const x = radius * Math.cos(angle) + (Math.random() - 0.5) * 300;
        const y = height + (Math.random() - 0.5) * 100;
        const z = radius * Math.sin(angle) + (Math.random() - 0.5) * 300;
        
        milkyWayVertices.push(x, y, z);
    }

    milkyWayGeometry.setAttribute('position', new THREE.Float32BufferAttribute(milkyWayVertices, 3));
    milkyWay = new THREE.Points(milkyWayGeometry, milkyWayMaterial);
    
    // Rotar la Vía Láctea para que no sea perpendicular al plano del sistema solar
    milkyWay.rotation.x = Math.PI / 6; // 30 grados de inclinación
    milkyWay.rotation.z = Math.PI / 4; // 45 grados de rotación
    
    scene.add(milkyWay);
}

// Función para crear estrellas
function createStars(): void {
    // Estrellas normales (no parpadeantes)
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.1
    });

    const starsVertices: number[] = [];
    for (let i = 0; i < 8000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Estrellas parpadeantes
    for (let i = 0; i < 5; i++) {
        const twinkleGeometry = new THREE.BufferGeometry();
        const twinkleMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 0.15 + Math.random() * 0.1,
            transparent: true,
            opacity: 0.8
        });

        const twinkleVertices: number[] = [];
        for (let j = 0; j < 400; j++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            twinkleVertices.push(x, y, z);
        }

        twinkleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(twinkleVertices, 3));
        const twinkleStar = new THREE.Points(twinkleGeometry, twinkleMaterial);
        twinkleStar.userData = { 
            twinkleSpeed: 1 + Math.random() * 2,
            twinkleOffset: Math.random() * Math.PI * 2
        };
        scene.add(twinkleStar);
        twinklingStars.push(twinkleStar);
    }
}

// Función para mostrar información del planeta
function showPlanetInfo(planetName: string): void {
    const planetInfo = document.getElementById('planetInfo') as HTMLDivElement;
    const planetInfoTitle = document.getElementById('planetInfoTitle') as HTMLHeadingElement;
    const planetInfoContent = document.getElementById('planetInfoContent') as HTMLDivElement;
    
    planetInfoTitle.textContent = planetName;
    planetInfoContent.innerHTML = '';
    
    const data = planetData[planetName];
    
    if (data) {
        let html = `<p class="mb-3">${data.description}</p>`;
        html += '<div class="grid grid-cols-1 gap-2 mt-3">';
        
        if (data.diameter) html += `<div><strong>Diámetro:</strong> ${data.diameter}</div>`;
        if (data.mass) html += `<div><strong>Masa:</strong> ${data.mass}</div>`;
        if (data.distance) html += `<div><strong>Distancia:</strong> ${data.distance}</div>`;
        if (data.dayLength) html += `<div><strong>Duración del día:</strong> ${data.dayLength}</div>`;
        if (data.yearLength) html += `<div><strong>Duración del año:</strong> ${data.yearLength}</div>`;
        if (data.temperature) html += `<div><strong>Temperatura:</strong> ${data.temperature}</div>`;
        if (data.rotation) html += `<div><strong>Rotación:</strong> ${data.rotation}</div>`;
        
        html += '</div>';
        
        if (data.funFact) {
            html += `<div class="mt-4 p-2 bg-blue-900 bg-opacity-50 rounded">
                <strong>Dato curioso:</strong> ${data.funFact}
            </div>`;
        }
        
        planetInfoContent.innerHTML = html;
        planetInfo.style.display = 'block';
        selectedPlanet = planetName;
    }
}

function closePlanetInfo(): void {
    const planetInfo = document.getElementById('planetInfo') as HTMLDivElement;
    planetInfo.style.display = 'none';
    selectedPlanet = null;
}

// Eventos de ratón
function onMouseMove(event: MouseEvent): void {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    let foundPlanet = false;
    
    for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        
        if (object.userData && object.userData.name) {
            const tooltip = document.getElementById('planetTooltip') as HTMLDivElement;
            tooltip.textContent = object.userData.name;
            tooltip.style.left = event.clientX + 10 + 'px';
            tooltip.style.top = event.clientY + 10 + 'px';
            tooltip.style.display = 'block';
            
            hoveredPlanet = object.userData.name;
            foundPlanet = true;
            break;
        }
    }
    
    if (!foundPlanet) {
        const tooltip = document.getElementById('planetTooltip') as HTMLDivElement;
        tooltip.style.display = 'none';
        hoveredPlanet = null;
    }
}

function onMouseClick(event: MouseEvent): void {
    if (hoveredPlanet) {
        showPlanetInfo(hoveredPlanet);
    }
}

// Función de animación
function animate(): void {
    requestAnimationFrame(animate);

    if (sun.group.rotation.y % (Math.PI/4) < 0.01) {
        sunLight.shadow.map?.dispose();
        sunLight.shadow.map = null;
    }

    controls.update();
    
    const time = Date.now() * 0.001;
    
    // Rotación del sol
    sun.group.rotation.y += 0.002 * rotationSpeedFactor;
    
    // Animar corona solar
    sun.corona.forEach((layer, index) => {
        const scale = 1 + Math.sin(time * (0.5 + index * 0.2)) * 0.05;
        layer.scale.set(scale, scale, scale);
    });
    
    // Animar rayos de sol de caricatura
    /*sun.flares.forEach(flare => {
        // Hacer que los rayos pulsen suavemente
        const scale = 1 + Math.sin(time * flare.pulseSpeed) * 0.2;
        flare.mesh.scale.y = scale;
        
        // Cambiar ligeramente la opacidad para efecto de brillo
        const opacity = 0.8 + Math.sin(time * flare.pulseSpeed * 1.5) * 0.1;
        (flare.mesh.material as THREE.MeshBasicMaterial).opacity = opacity;
    });*/
    
    // Actualizar planetas

    /*planets.forEach(planet => {
        planet.planet.rotation.y += planet.rotationSpeed * rotationSpeedFactor;
        planet.group.rotation.y += planet.orbitSpeed * orbitSpeedFactor;
    });*/
    planets.forEach(planet => {
        planet.planet.rotation.y += planet.rotationSpeed * rotationSpeedFactor;
        // Calcular el ángulo de la órbita
        if (!planet.group.userData.angle) planet.group.userData.angle = Math.random() * Math.PI * 2;
        planet.group.userData.angle += planet.orbitSpeed * orbitSpeedFactor;
        const angle = planet.group.userData.angle;
        
        // Calcular posición base en el plano XY según el tipo de órbita
        let baseX: number, baseZ: number;
        
        if (useEllipticalOrbits) {
            // Órbita elíptica
            baseX = planet.a * Math.cos(angle);
            baseZ = planet.b * Math.sin(angle);
        } else {
            // Órbita circular
            baseX = planet.distance * Math.cos(angle);
            baseZ = planet.distance * Math.sin(angle);
        }
        
        // Aplicar inclinaciones de órbita individuales del planeta
        const cosX = Math.cos(planet.orbitInclinationX * Math.PI / 180);
        const sinX = Math.sin(planet.orbitInclinationX * Math.PI / 180);
        const cosY = Math.cos(planet.orbitInclinationY * Math.PI / 180);
        const sinY = Math.sin(planet.orbitInclinationY * Math.PI / 180);
        
        // Rotación en X (inclinación hacia arriba/abajo)
        const rotatedX = baseX;
        const rotatedY = baseZ * sinX;
        const rotatedZ = baseZ * cosX;
        
        // Rotación en Y (inclinación lateral)
        const finalX = rotatedX * cosY - rotatedY * sinY;
        const finalY = rotatedX * sinY + rotatedY * cosY;
        const finalZ = rotatedZ;
        
        planet.group.position.set(finalX, finalY, finalZ);
    });
    
    // Animar cinturón de asteroides
    if (asteroidBelt) {
        asteroidBelt.asteroids.forEach(asteroid => {
            const userData = asteroid.userData as AsteroidUserData;
            
            asteroid.rotation.x += userData.rotationSpeed.x * rotationSpeedFactor;
            asteroid.rotation.y += userData.rotationSpeed.y * rotationSpeedFactor;
            asteroid.rotation.z += userData.rotationSpeed.z * rotationSpeedFactor;
            
            userData.angle += userData.orbitSpeed * orbitSpeedFactor;
            
            // Calcular posición según el tipo de órbita
            if (useEllipticalOrbits) {
                asteroid.position.x = Math.cos(userData.angle) * userData.a;
                asteroid.position.z = Math.sin(userData.angle) * userData.b;
            } else {
                // Para órbitas circulares, usar el radio como distancia
                asteroid.position.x = Math.cos(userData.angle) * userData.radius;
                asteroid.position.z = Math.sin(userData.angle) * userData.radius;
            }
        });
    }
    
    // Animar estrellas parpadeantes
    twinklingStars.forEach(star => {
        const userData = star.userData;
        const opacity = 0.3 + Math.sin(time * userData.twinkleSpeed + userData.twinkleOffset) * 0.5;
        (star.material as THREE.PointsMaterial).opacity = opacity;
    });
    
    renderer.render(scene, camera);
}

// Inicializar el sistema solar
function initSolarSystem(): void {
    createStars();
    createMilkyWay();
    sun = createSun(scene);

    if (sun.core.children[0] instanceof THREE.DirectionalLight) {
        configureShadows(sun.core.children[0]);
    }
    sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
    sunLight.position.set(0, 0, 0);
    sunLight.castShadow = true;

    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.1;
    sunLight.shadow.camera.far = 500;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;    
    sunLight.shadow.bias = 0.001;
    
    // Configuración de luces
    scene.background = new THREE.Color(0x000000);
    
    // Luz ambiental
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Crear planetas
    const mercury = createPlanet(scene, 0.4, 0xaaaaaa, 8, "Mercurio",0,0,65, useEllipticalOrbits);
    const venus = createPlanet(scene, 0.9, 0xe39e1c, 12, "Venus",0,0,-65, useEllipticalOrbits);
    const earth = createPlanet(scene, 1, 0x2233ff, 16, "Tierra",0,0,0, useEllipticalOrbits);
    const mars = createPlanet(scene, 0.7, 0xdd4422, 20, "Marte",0,0,55, useEllipticalOrbits);
    const jupiter = createPlanet(scene, 3, 0xeebb99, 28, "Júpiter",0,0,45, useEllipticalOrbits);
    const saturn = createPlanet(scene, 2.5, 0xddcc88, 36, "Saturno",0,0, -45, useEllipticalOrbits);
    const uranus = createPlanet(scene, 1.8, 0x88ccff, 44, "Urano", 97,0,25, useEllipticalOrbits);
    const neptune = createPlanet(scene, 1.7, 0x3355dd, 52, "Neptuno",0,0,-25, useEllipticalOrbits);
    
    // Agregar ejes a todos los planetas
    axesHelpers.push(createAxesHelper(mercury.group, 0.6));
    axesHelpers.push(createAxesHelper(venus.group, 1.35));
    axesHelpers.push(createAxesHelper(earth.group, 1.5));
    axesHelpers.push(createAxesHelper(mars.group, 1.05));
    axesHelpers.push(createAxesHelper(jupiter.group, 4.5));
    axesHelpers.push(createAxesHelper(saturn.group, 3.75));
    axesHelpers.push(createAxesHelper(uranus.group, 2.7));
    axesHelpers.push(createAxesHelper(neptune.group, 2.55));
    
    
    // Crear lunas y anillos
    createMoon(earth, 0.3, 0xcccccc, 2, "Luna");
    // En la función initSolarSystem, después de crear los planetas:
    createRings(saturn, 3, 3.2, 0xddbb99);
    createRings(saturn, 3.21, 3.4, 0xddbb89);
    createRings(saturn, 3.4, 3.6, 0xddbb80);
    createRings(saturn, 3.6, 3.8, 0xddbb70);
    createRings(saturn, 3.81, 4, 0xddbb60);
    createRings(saturn, 4.1, 4.6, 0xbbaa78);
    createRings(saturn, 4.61, 4.8, 0xbbaa78);

    
    createRings(uranus, 2.4, 2.6, 0x666666);
    createRings(uranus, 2.6, 2.8, 0x999999);
    createRings(uranus, 2.8, 3,0xcccccc );
    // Crear cinturón de asteroides
    asteroidBelt = createAsteroidBelt(scene, 22, 26, 500, useEllipticalOrbits);
    
    planets = [mercury, venus, earth, mars, jupiter, saturn, uranus, neptune];
    


    // createRings(uranus, 2, 2.2, 0x000000);
    scene.background = new THREE.Color(0x000000);
   
    
    // Ocultar pantalla de carga
    const loading = document.getElementById('loading') as HTMLDivElement;
    loading.style.display = 'none';
}

function toggleAxes(): void {
    axesVisible = toggleAxesVisibility(axesHelpers);
}

function toggleMilkyWay(): void {
    if (milkyWay) {
        milkyWay.visible = !milkyWay.visible;
    }
}

function toggleAsteroidBeltKuiper(): void {
    if (asteroidBeltKuiper) {   
        asteroidBeltKuiper.group.visible = !asteroidBeltKuiper.group.visible;
    } else {
        asteroidBeltKuiper = createAsteroidBelt(scene, 62, 120, 6000);
        asteroidBeltKuiper.group.visible = true;
    }
}

function toggleOrbitType(): void {
    // Obtener el estado actual del checkbox
    const toggleButton = document.getElementById('toggleOrbitType') as HTMLInputElement;
    useEllipticalOrbits = toggleButton.checked;
    
    console.log('Cambiando a órbitas:', useEllipticalOrbits ? 'Elípticas' : 'Circulares');
    
    // Remover órbitas existentes de manera más robusta
    const orbitsToRemove: THREE.Object3D[] = [];
    scene.children.forEach(child => {
        if (child.userData && child.userData.isOrbit) {
            orbitsToRemove.push(child);
        }
    });
    
    // Remover las órbitas encontradas
    orbitsToRemove.forEach(orbit => {
        scene.remove(orbit);
        // También limpiar la geometría y material para liberar memoria
        if (orbit instanceof THREE.Mesh) {
            orbit.geometry.dispose();
            if (orbit.material instanceof THREE.Material) {
                orbit.material.dispose();
            }
        }
    });
    
    console.log('Órbitas removidas:', orbitsToRemove.length);
    
    // Recrear órbitas con el nuevo tipo
    planets.forEach(planet => {
        let orbit: THREE.Mesh;
        
        if (useEllipticalOrbits) {
            // Órbita elíptica
            const a = planet.distance;      // Semieje mayor
            const b = planet.distance * 0.7; // Semieje menor
            
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
            // Órbita circular
            const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.05, planet.distance + 0.05, 64);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.2
            });
            orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        }
        
        orbit.rotation.x = Math.PI / 2 + planet.orbitInclinationX * Math.PI / 180;
        orbit.rotation.y = planet.orbitInclinationY * Math.PI / 180;
        orbit.userData = { isOrbit: true, isElliptical: useEllipticalOrbits };
        scene.add(orbit);
    });
    
    console.log('Órbitas recreadas:', planets.length);
    
    // Recrear cinturón de asteroides con el nuevo tipo de órbita
    if (asteroidBelt) {
        // Remover el cinturón existente
        scene.remove(asteroidBelt.group);
        asteroidBelt.asteroids.forEach(asteroid => {
            asteroid.geometry.dispose();
            if (asteroid.material instanceof THREE.Material) {
                asteroid.material.dispose();
            }
        });
        
        // Crear nuevo cinturón con el tipo de órbita correcto
        asteroidBelt = createAsteroidBelt(scene, 22, 26, 500, useEllipticalOrbits);
    }
    
    // Reiniciar las posiciones de los planetas para evitar saltos bruscos
    planets.forEach(planet => {
        if (planet.group.userData.angle) {
            const angle = planet.group.userData.angle;
            let baseX: number, baseZ: number;
            
            if (useEllipticalOrbits) {
                baseX = planet.a * Math.cos(angle);
                baseZ = planet.b * Math.sin(angle);
            } else {
                baseX = planet.distance * Math.cos(angle);
                baseZ = planet.distance * Math.sin(angle);
            }
            
            // Aplicar inclinaciones
            const cosX = Math.cos(planet.orbitInclinationX * Math.PI / 180);
            const sinX = Math.sin(planet.orbitInclinationX * Math.PI / 180);
            const cosY = Math.cos(planet.orbitInclinationY * Math.PI / 180);
            const sinY = Math.sin(planet.orbitInclinationY * Math.PI / 180);
            
            const rotatedX = baseX;
            const rotatedY = baseZ * sinX;
            const rotatedZ = baseZ * cosX;
            
            const finalX = rotatedX * cosY - rotatedY * sinY;
            const finalY = rotatedX * sinY + rotatedY * cosY;
            const finalZ = rotatedZ;
            
            planet.group.position.set(finalX, finalY, finalZ);
        }
    });
    
    // Actualizar el texto del botón
    const label = toggleButton?.nextElementSibling?.nextElementSibling as HTMLElement;
    if (label) {
        label.textContent = useEllipticalOrbits ? 'Órbitas Elípticas' : 'Órbitas Circulares';
    }
}

function updateOrbitInclinationY(value: number): void {
    orbitInclinationY = value;
    // Actualizar todas las órbitas visibles
    scene.children.forEach(child => {
        if (child.userData && child.userData.isOrbit) {
            child.rotation.y = orbitInclinationY * Math.PI / 180;
        }
    });
}
function updatePlanetTilt(value: number): void {
    planetTiltFactor = value;
    // Actualizar la inclinación de todos los planetas
    planets.forEach(planet => {
        // Aplicar inclinación basada en el factor y la inclinación original del planeta
        const originalTilt = planet.planet.userData.originalTilt || 0;
        planet.planet.rotation.z = (originalTilt * planetTiltFactor) * Math.PI / 180;
    });
}
function resetInclinations(): void {
    orbitInclinationX = 0;
    orbitInclinationY = 0;
    planetTiltFactor = 1;
    
    // Actualizar controles UI
    const orbitInclinationXSlider = document.getElementById('orbitInclinationX') as HTMLInputElement;
    const orbitInclinationYSlider = document.getElementById('orbitInclinationY') as HTMLInputElement;
    const planetTiltSlider = document.getElementById('planetTilt') as HTMLInputElement;
    
    if (orbitInclinationXSlider) orbitInclinationXSlider.value = '0';
    if (orbitInclinationYSlider) orbitInclinationYSlider.value = '0';
    if (planetTiltSlider) planetTiltSlider.value = '100';
    
    updateOrbitInclinationY(0);
    updatePlanetTilt(1);
}

// Event listeners
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('click', onMouseClick);

document.getElementById('toggleAxes')?.addEventListener('click', toggleAxes);

document.getElementById('toggleMilkyWay')?.addEventListener('click', toggleMilkyWay);
document.getElementById('toggleAsteroidBeltKuiper')?.addEventListener('click', toggleAsteroidBeltKuiper);
document.getElementById('toggleOrbitType')?.addEventListener('click', toggleOrbitType);

document.getElementById('closePlanetInfo')?.addEventListener('click', closePlanetInfo);

const rotationSpeedSlider = document.getElementById('rotationSpeed') as HTMLInputElement;
rotationSpeedSlider?.addEventListener('input', function(e) {
    const target = e.target as HTMLInputElement;
    rotationSpeedFactor = parseInt(target.value) / 100;
});

const orbitSpeedSlider = document.getElementById('orbitSpeed') as HTMLInputElement;
orbitSpeedSlider?.addEventListener('input', function(e) {
    const target = e.target as HTMLInputElement;
    orbitSpeedFactor = parseInt(target.value) / 100;
});
const orbitInclinationYSlider = document.getElementById('orbitInclinationY') as HTMLInputElement;
orbitInclinationYSlider?.addEventListener('input', function(e) {
    const target = e.target as HTMLInputElement;
    updateOrbitInclinationY(parseInt(target.value));
});

const planetTiltSlider = document.getElementById('planetTilt') as HTMLInputElement;
planetTiltSlider?.addEventListener('input', function(e) {
    const target = e.target as HTMLInputElement;
    updatePlanetTilt(parseInt(target.value) / 100);
});

document.getElementById('resetInclinations')?.addEventListener('click', resetInclinations);


// Iniciar
initSolarSystem();

// Inicializar el estado del botón de órbitas
const toggleOrbitButton = document.getElementById('toggleOrbitType') as HTMLInputElement;
if (toggleOrbitButton) {
    toggleOrbitButton.checked = useEllipticalOrbits;
    const label = toggleOrbitButton.nextElementSibling?.nextElementSibling as HTMLElement;
    if (label) {
        label.textContent = useEllipticalOrbits ? 'Órbitas Elípticas' : 'Órbitas Circulares';
    }
}

animate();