import { PlanetData } from '../interfaces/SolarSystemInterfaces';

export const planetData: Record<string, PlanetData> = {
    "Sol": {
        description: "El Sol es la estrella en el centro de nuestro sistema solar. Es una esfera casi perfecta de plasma caliente que proporciona la mayor parte de la energía de la Tierra a través de la radiación solar.",
        diameter: "1,392,684 km (109 veces la Tierra)",
        mass: "1.989 × 10^30 kg (333,000 veces la Tierra)",
        temperature: "5,500°C en la superficie, 15 millones °C en el núcleo",
        rotation: "25-35 días dependiendo de la latitud",
        funFact: "El Sol contiene más del 99.8% de toda la masa del sistema solar."
    },
    "Mercurio": {
        description: "Mercurio es el planeta más pequeño y más cercano al Sol. Su superficie está llena de cráteres similares a la Luna.",
        diameter: "4,879 km",
        mass: "3.3011 × 10^23 kg",
        distance: "57.9 millones km del Sol",
        dayLength: "176 días terrestres",
        yearLength: "88 días terrestres",
        funFact: "A pesar de ser el planeta más cercano al Sol, no es el más caliente (ese es Venus)."
    },
    "Venus": {
        description: "Venus es el segundo planeta desde el Sol y el más caliente del sistema solar debido a su densa atmósfera que atrapa el calor.",
        diameter: "12,104 km",
        mass: "4.8675 × 10^24 kg",
        distance: "108.2 millones km del Sol",
        dayLength: "243 días terrestres",
        yearLength: "225 días terrestres",
        funFact: "Venus gira en dirección opuesta a la mayoría de los planetas."
    },
    "Tierra": {
        description: "La Tierra es nuestro hogar y el único planeta conocido que alberga vida. Tiene un satélite natural, la Luna.",
        diameter: "12,742 km",
        mass: "5.972 × 10^24 kg",
        distance: "149.6 millones km del Sol",
        dayLength: "24 horas",
        yearLength: "365.25 días",
        funFact: "La Tierra es el único planeta que no recibe su nombre de un dios romano o griego."
    },
    "Marte": {
        description: "Marte es conocido como el Planeta Rojo debido a su superficie oxidada. Tiene dos pequeñas lunas y es el foco de muchas misiones de exploración.",
        diameter: "6,779 km",
        mass: "6.4171 × 10^23 kg",
        distance: "227.9 millones km del Sol",
        dayLength: "24.6 horas",
        yearLength: "687 días terrestres",
        funFact: "Marte alberga el monte más alto del sistema solar: el Monte Olimpo, con 21 km de altura."
    },
    "Júpiter": {
        description: "Júpiter es el planeta más grande del sistema solar. Es un gigante gaseoso con una característica Gran Mancha Roja, una tormenta que ha durado siglos.",
        diameter: "139,820 km",
        mass: "1.8982 × 10^27 kg",
        distance: "778.5 millones km del Sol",
        dayLength: "9.9 horas",
        yearLength: "11.9 años terrestres",
        funFact: "Júpiter tiene al menos 79 lunas, incluyendo las cuatro grandes lunas galileanas."
    },
    "Saturno": {
        description: "Saturno es famoso por sus impresionantes anillos compuestos principalmente de partículas de hielo y roca. Es otro gigante gaseoso.",
        diameter: "116,460 km",
        mass: "5.6834 × 10^26 kg",
        distance: "1,434 millones km del Sol",
        dayLength: "10.7 horas",
        yearLength: "29.5 años terrestres",
        funFact: "Saturno tiene una densidad tan baja que flotaría en agua si existiera un océano lo suficientemente grande."
    },
    "Urano": {
        description: "Urano es único porque gira de lado, con su eje de rotación casi paralelo a su órbita. Es un gigante de hielo con una atmósfera fría.",
        diameter: "50,724 km",
        mass: "8.6810 × 10^25 kg",
        distance: "2,871 millones km del Sol",
        dayLength: "17.2 horas",
        yearLength: "84 años terrestres",
        funFact: "Urano fue el primer planeta descubierto con un telescopio."
    },
    "Neptuno": {
        description: "Neptuno es el planeta más lejano del Sol. Es otro gigante de hielo con vientos extremadamente rápidos y una gran mancha oscura similar a la de Júpiter.",
        diameter: "49,244 km",
        mass: "1.02413 × 10^26 kg",
        distance: "4,495 millones km del Sol",
        dayLength: "16.1 horas",
        yearLength: "165 años terrestres",
        funFact: "Neptuno fue descubierto mediante cálculos matemáticos antes de ser observado."
    }
};