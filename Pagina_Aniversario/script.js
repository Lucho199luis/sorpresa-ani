import * as THREE from 'three';
// Importación ultra-compatible directa para los controles del mouse
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ==========================================
// 1. CONFIGURACIÓN DE DATOS Y ELEMENTOS DOM
// ==========================================
const botonIniciar = document.getElementById('boton-iniciar');
const pantallaInicio = document.getElementById('pantalla-inicio');
const musica = document.getElementById('musica');

const burbujaMensaje = document.getElementById('burbuja-mensaje');
const textoBurbuja = document.getElementById('texto-burbuja');
const cerrarBurbuja = document.getElementById('cerrar-burbuja');

let faseHiperespacio = false;
let faseEscenarioPrincipal = false;
let animacionPausada = false; 

// 7 Órbitas principales con tus fotos y dedicatorias
const configuracionOrbitas = [
    { texto: "Gravedad de Amor 💖", radio: 6, velocidad: 0.5, img: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=300&auto=format&fit=crop", fraseClic: "Así como la gravedad nos une, mi corazón siempre encuentra su centro en ti. Eres mi fuerza de atracción favorita. 🥰" },
    { texto: "Contigo Siempre 🧸", radio: 9, velocidad: 0.38, img: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=300&auto=format&fit=crop", fraseClic: "En las buenas, en las malas y en cada rincón del universo. No importa el momento, mi lugar favorito siempre será a tu lado. 🌹" },
    { texto: "Órbita Eterna 🌌", radio: 12, velocidad: 0.3, img: "https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=300&auto=format&fit=crop", fraseClic: "Daría mil vueltas al espacio entero con tal de coincidir contigo en esta y en todas nuestras vidas. ¡Eres mi eternidad! ✨" },
    { texto: "Mi Lugar Seguro 🪐", radio: 15, velocidad: 0.22, img: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=300&auto=format&fit=crop", fraseClic: "Cuando el mundo se vuelve ruidoso o confuso, me basta con mirarte para recordar lo que es estar en paz. Mi refugio eres tú. 🔒❤️" },
    { texto: "Amor Infinito ✨", radio: 18, velocidad: 0.16, img: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?q=80&w=300&auto=format&fit=crop", fraseClic: "Si contaras todas las estrellas del firmamento, aún no alcanzarías a medir ni la mitad de lo muchísimo que te amo. ♾️" },
    { texto: "Un Beso Estelar 💋", radio: 21, velocidad: 0.12, img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=300&auto=format&fit=crop", fraseClic: "Cada beso tuyo se siente como un viaje directo al espacio, una constelación de magia iluminando mi alma entera. 🌌" },
    { texto: "Eres Mi Galaxia ❤️", radio: 24, velocidad: 0.09, img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=300&auto=format&fit=crop", fraseClic: "Tú no eres una parte de mi mundo... Tú eres todo el universo entero que le da sentido a mis días. ¡Gracias por existir! 🪐✨" }
];

// Frases poéticas tenues flotando al fondo
const frasesFijasUniverso = [
    "Te amo más allá de las estrellas",
    "Tú cambiaste mi órbita",
    "Mirarte es ver mi cielo",
    "Eres mi constelación favorita",
    "Mi corazón late en tu frecuencia",
    "En tu mirada descubrí mi hogar"
];

// Planetas del "Sistema Solar" decorativo de fondo (Color, Radio orbital, Velocidad, Tamaño, Inclinación)
const planetasDecorativosDatos = [
    { color: 0x4cc9f0, radio: 8, velocidad: 0.4, tamano: 0.3, inclinar: 0.2 },   
    { color: 0xf72585, radio: 11, velocidad: 0.28, tamano: 0.4, inclinar: -0.3 }, 
    { color: 0xffb703, radio: 16, velocidad: 0.15, tamano: 0.7, inclinar: 0.1, tieneAnillo: true }, 
    { color: 0x7209b7, radio: 22, velocidad: 0.08, tamano: 0.5, inclinar: 0.4 }   
];

botonIniciar.addEventListener('click', () => {
    pantallaInicio.style.opacity = '0';
    setTimeout(() => {
        pantallaInicio.style.display = 'none';
        faseHiperespacio = true; 
        setTimeout(() => {
            faseHiperespacio = false;
            faseEscenarioPrincipal = true;
            controles.enabled = true;
            crearEtiquetasTextoDOM(); 
            crearFrasesFijasDOM(); 
        }, 1500);
    }, 800);
    if (musica) { musica.play().catch(e => {}); }
});

cerrarBurbuja.addEventListener('click', () => {
    burbujaMensaje.classList.remove('activo');
    animacionPausada = false; 
});

// ==========================================
// 2. CONFIGURACIÓN DE THREE.JS Y CONTROLES
// ==========================================
const lienzo = document.getElementById('lienzo3d');
const escena = new THREE.Scene();
const medidas = { width: window.innerWidth, height: window.innerHeight };

const camara = new THREE.PerspectiveCamera(60, medidas.width / medidas.height, 0.1, 100);
camara.position.set(0, 15, 30); 

const renderizador = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true });
renderizador.setSize(medidas.width, medidas.height);
renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const cargadorTexturas = new THREE.TextureLoader();

const controles = new OrbitControls(camara, renderizador.domElement);
controles.enableDamping = true; 
controles.dampingFactor = 0.05;
controles.maxDistance = 55;     
controles.minDistance = 6;      
controles.enabled = false;      

// ==========================================
// 3. INTRO: LÍNEAS DE VELOCIDAD LUZ
// ==========================================
const conteoLineas = 450; 
const geoLineas = new THREE.BufferGeometry();
const posicionesLineas = new Float32Array(conteoLineas * 6);
const velocidadesLineas = [];

for (let i = 0; i < conteoLineas; i++) {
    const i6 = i * 6;
    const x = (Math.random() - 0.5) * 50;
    const y = (Math.random() - 0.5) * 50;
    const zInicio = (Math.random() - 0.5) * 70;
    posicionesLineas[i6+0] = x; posicionesLineas[i6+1] = y; posicionesLineas[i6+2] = zInicio;
    posicionesLineas[i6+3] = x; posicionesLineas[i6+4] = y; posicionesLineas[i6+5] = zInicio + 3.5;
    velocidadesLineas.push(0.6 + Math.random() * 0.6);
}
geoLineas.setAttribute('position', new THREE.BufferAttribute(posicionesLineas, 3));
const matLineas = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
const estelasHiperespacio = new THREE.LineSegments(geoLineas, matLineas);
escena.add(estelasHiperespacio);

// Fondo estelar estático de estrellas fijas
const geoEstrellasFondo = new THREE.BufferGeometry();
const posEstrellasFondo = new Float32Array(2000 * 3);
for(let i=0; i<2000*3; i+=3) {
    posEstrellasFondo[i] = (Math.random() - 0.5) * 90;
    posEstrellasFondo[i+1] = (Math.random() - 0.5) * 90;
    posEstrellasFondo[i+2] = (Math.random() - 0.5) * 90;
}
geoEstrellasFondo.setAttribute('position', new THREE.BufferAttribute(posEstrellasFondo, 3));
const matEstrellasFondo = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.4 });
const cieloEstrellado = new THREE.Points(geoEstrellasFondo, matEstrellasFondo);
escena.add(cieloEstrellado);

// ==========================================
// 4. EL CORAZÓN 3D CENTRAL
// ==========================================
const conteoCorazon = 6500;
const geoCorazon = new THREE.BufferGeometry();
const posCorazon = new Float32Array(conteoCorazon * 3);

for (let i = 0; i < conteoCorazon; i++) {
    const i3 = i * 3;
    const t = Math.PI * 2 * Math.random();
    const xBorde = 16 * Math.pow(Math.sin(t), 3);
    const yBorde = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    const factorRelleno = Math.sqrt(Math.random()); 
    posCorazon[i3 + 0] = xBorde * 0.2 * factorRelleno; 
    posCorazon[i3 + 1] = yBorde * 0.2 * factorRelleno;
    posCorazon[i3 + 2] = (Math.random() - 0.5) * 1.8; 
}
geoCorazon.setAttribute('position', new THREE.BufferAttribute(posCorazon, 3));
const matCorazon = new THREE.PointsMaterial({ color: 0xff1493, size: 0.07, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
const corazonCentral = new THREE.Points(geoCorazon, matCorazon);
escena.add(corazonCentral);

// ==========================================
// 5. LA GALAXIA ESPIRAL REPOTENCIADA
// ==========================================
const conteoGalaxia = 25000; 
const geoGalaxia = new THREE.BufferGeometry();
const posGalaxia = new Float32Array(conteoGalaxia * 3);
const colGalaxia = new Float32Array(conteoGalaxia * 3);
const colorCentro = new THREE.Color('#ffb6c1'), colorBrazos = new THREE.Color('#9400d3');

for (let i = 0; i < conteoGalaxia; i++) {
    const i3 = i * 3; const radio = Math.random() * 32; 
    const anguloBrazo = ((i % 4) / 4) * Math.PI * 2; const anguloGiro = radio * 0.35; 
    posGalaxia[i3 + 0] = Math.cos(anguloBrazo + anguloGiro) * radio + Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45 * radio;
    posGalaxia[i3 + 1] = (Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.25 * radio) - 1.5; 
    posGalaxia[i3 + 2] = Math.sin(anguloBrazo + anguloGiro) * radio + Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.45 * radio;
    const colorFinal = colorCentro.clone().lerp(colorBrazos, radio / 32);
    colGalaxia[i3 + 0] = colorFinal.r; colGalaxia[i3 + 1] = colorFinal.g; colGalaxia[i3 + 2] = colorFinal.b;
}
geoGalaxia.setAttribute('position', new THREE.BufferAttribute(posGalaxia, 3));
geoGalaxia.setAttribute('color', new THREE.BufferAttribute(colGalaxia, 3));
const matGalaxia = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending }); 
const galaxiaEspiral = new THREE.Points(geoGalaxia, matGalaxia);
escena.add(galaxiaEspiral);

// ==========================================
// 6. PLANETAS/ESFERAS CON FOTOS VISIBLES
// ==========================================
const grupoEsferas = new THREE.Group();
escena.add(grupoEsferas);
const esferasMeshes = [];

configuracionOrbitas.forEach((datos, indice) => {
    const geoEsfera = new THREE.SphereGeometry(1.0, 32, 32); 
    const textura = cargadorTexturas.load(datos.img);
    textura.colorSpace = THREE.SRGBColorSpace; 
    const matEsfera = new THREE.MeshBasicMaterial({ map: textura, transparent: true, opacity: 0, side: THREE.DoubleSide });
    const mallaEsfera = new THREE.Mesh(geoEsfera, matEsfera);
    
    mallaEsfera.userData = { indice: indice };
    grupoEsferas.add(mallaEsfera);

    esferasMeshes.push({
        malla: mallaEsfera, material: matEsfera, radio: datos.radio, velocidad: datos.velocidad, angulo: Math.random() * Math.PI * 2 
    });
});

// ==========================================
// SISTEMA SOLAR DECORATIVO DE FONDO
// ==========================================
const grupoSistemaSolar = new THREE.Group();
escena.add(grupoSistemaSolar);
const listaPlanetasDecorativos = [];

planetasDecorativosDatos.forEach((p) => {
    const puntosAnillo = [];
    for(let j=0; j<=64; j++) {
        const theta = (j/64) * Math.PI * 2;
        puntosAnillo.push(new THREE.Vector3(Math.cos(theta)*p.radio, 0, Math.sin(theta)*p.radio));
    }
    const geoAnillo = new THREE.BufferGeometry().setFromPoints(puntosAnillo);
    const matAnillo = new THREE.LineBasicMaterial({ color: p.color, transparent: true, opacity: 0.12 });
    const lineaOrbital = new THREE.Line(geoAnillo, matAnillo);
    lineaOrbital.rotation.x = p.inclinar;
    grupoSistemaSolar.add(lineaOrbital);

    const geoPlaneta = new THREE.SphereGeometry(p.tamano, 16, 16);
    const matPlaneta = new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0 });
    const mallaPlaneta = new THREE.Mesh(geoPlaneta, matPlaneta);

    if(p.tieneAnillo) {
        const geoDisco = new THREE.RingGeometry(p.tamano * 1.4, p.tamano * 2, 32);
        const matDisco = new THREE.MeshBasicMaterial({ color: p.color, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
        const discoSaturno = new THREE.Mesh(geoDisco, matDisco);
        discoSaturno.rotation.x = Math.PI / 2;
        mallaPlaneta.add(discoSaturno);
    }

    grupoSistemaSolar.add(mallaPlaneta);
    listaPlanetasDecorativos.push({
        malla: mallaPlaneta, material: matPlaneta, radio: p.radio, velocidad: p.velocidad, inclinar: p.inclinar, angulo: Math.random() * Math.PI * 2
    });
});

// ==========================================
// 7. ETIQUETAS Y FRASES EN EL ESPACIO DOM
// ==========================================
const contenedorEtiquetas = document.createElement('div');
contenedorEtiquetas.id = 'contenedor-etiquetas';
document.body.appendChild(contenedorEtiquetas);

function crearEtiquetasTextoDOM() {
    configuracionOrbitas.forEach((datos, indice) => {
        const div = document.createElement('div');
        div.className = 'etiqueta-orbita'; div.innerText = datos.texto; div.id = `etiqueta-${indice}`;
        contenedorEtiquetas.appendChild(div);
    });
}

const objetosFrasesFijas = [];
function crearFrasesFijasDOM() {
    frasesFijasUniverso.forEach((frase) => {
        const div = document.createElement('div');
        div.className = 'frase-espacial'; 
        div.innerText = frase;
        contenedorEtiquetas.appendChild(div);

        const pos3D = new THREE.Vector3(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 45
        );
        objetosFrasesFijas.push({ elHTML: div, posicion: pos3D });
    });
}

function actualizarPosicionEtiquetas(objetoEsfera, indice) {
    const elementoHtml = document.getElementById(`etiqueta-${indice}`);
    if (!elementoHtml) return;
    const posicion3D = new THREE.Vector3();
    objetoEsfera.getWorldPosition(posicion3D);

    const vectorCamara = new THREE.Vector3();
    camara.getWorldDirection(vectorCamara);
    if (posicion3D.clone().sub(camara.position).dot(vectorCamara) < 0) {
        elementoHtml.style.opacity = '0'; return;
    } else { elementoHtml.style.opacity = '1'; }

    posicion3D.project(camara);
    elementoHtml.style.transform = `translate(-50%, -150%)`;
    elementoHtml.style.left = `${(posicion3D.x * .5 + .5) * window.innerWidth}px`;
    elementoHtml.style.top = `${(posicion3D.y * -.5 + .5) * window.innerHeight}px`;
}

function proyectarFrasesFijas() {
    objetosFrasesFijas.forEach(obj => {
        const pos3D = obj.posicion.clone();
        const vectorCamara = new THREE.Vector3();
        camara.getWorldDirection(vectorCamara);
        if (pos3D.clone().sub(camara.position).dot(vectorCamara) < 0) {
            obj.elHTML.style.opacity = '0'; return;
        } else { obj.elHTML.style.opacity = '0.5'; }

        pos3D.project(camara);
        obj.elHTML.style.left = `${(pos3D.x * .5 + .5) * window.innerWidth}px`;
        obj.elHTML.style.top = `${(pos3D.y * -.5 + .5) * window.innerHeight}px`;
    });
}

// ==========================================
// 8. DETECCIÓN DE CLICS (RAYCASTER)
// ==========================================
const emisorRayos = new THREE.Raycaster();
const coordenadasMouse = new THREE.Vector2();

window.addEventListener('click', (evento) => {
    if (pantallaInicio.style.display !== 'none' || animacionPausada) return;

    coordenadasMouse.x = (evento.clientX / window.innerWidth) * 2 - 1;
    coordenadasMouse.y = -(evento.clientY / window.innerHeight) * 2 + 1;

    emisorRayos.setFromCamera(coordenadasMouse, camara);
    const impactos = emisorRayos.intersectObjects(grupoEsferas.children);

    if (impactos.length > 0) {
        const esferaSeleccionada = impactos[0].object;
        const indiceDatos = esferaSeleccionada.userData.indice;
        const datosFoto = configuracionOrbitas[indiceDatos];

        textoBurbuja.innerText = datosFoto.fraseClic;
        burbujaMensaje.classList.add('activo');
        animacionPausada = true; 
    }
});

// ==========================================
// 9. BUCLE DE ANIMACIÓN CONSTANTE
// ==========================================
const reloj = new THREE.Clock();

const bucleAnimacion = () => {
    const tiempo = reloj.getElapsedTime();

    if (faseEscenarioPrincipal) {
        controles.update();
        proyectarFrasesFijas(); 
    }

    if (faseHiperespacio) {
        matLineas.opacity = THREE.MathUtils.lerp(matLineas.opacity, 0.8, 0.05);
        const posiciones = geoLineas.attributes.position.array;
        for (let i = 0; i < conteoLineas; i++) {
            const i6 = i * 6; posiciones[i6+2] += velocidadesLineas[i]; posiciones[i6+5] += velocidadesLineas[i];
            if (posiciones[i6+2] > 30) { posiciones[i6+2] = -40; posiciones[i6+5] = -37; }
        }
        geoLineas.attributes.position.needsUpdate = true;
    } else {
        matLineas.opacity = THREE.MathUtils.lerp(matLineas.opacity, 0, 0.1);
    }

    if (faseEscenarioPrincipal) {
        matCorazon.opacity = THREE.MathUtils.lerp(matCorazon.opacity, 1.0, 0.02);
        matGalaxia.opacity = THREE.MathUtils.lerp(matGalaxia.opacity, 0.8, 0.02); 
        matEstrellasFondo.opacity = THREE.MathUtils.lerp(matEstrellasFondo.opacity, 0.6, 0.01);

        galaxiaEspiral.rotation.y = animacionPausada ? galaxiaEspiral.rotation.y : tiempo * 0.025;

        const factorLatido = 1.0 + Math.pow(Math.abs(Math.sin(tiempo * 2.5)), 4) * 0.08;
        corazonCentral.scale.set(factorLatido, factorLatido, factorLatido);
        corazonCentral.rotation.y = tiempo * 0.08; 

        esferasMeshes.forEach((objeto, indice) => {
            objeto.material.opacity = THREE.MathUtils.lerp(objeto.material.opacity, 1.0, 0.02);
            if (!animacionPausada) { objeto.angulo += objeto.velocidad * 0.012; }

            objeto.malla.position.x = Math.cos(objeto.angulo) * objeto.radio;
            objeto.malla.position.z = Math.sin(objeto.angulo) * objeto.radio;
            objeto.malla.position.y = Math.sin(tiempo * 0.4 + indice) * 0.2; 
            objeto.malla.rotation.y += 0.01;

            actualizarPosicionEtiquetas(objeto.malla, indice);
        });

        listaPlanetasDecorativos.forEach((planeta) => {
            planeta.material.opacity = THREE.MathUtils.lerp(planeta.material.opacity, 0.7, 0.02);
            if (!animacionPausada) { planeta.angulo += planeta.velocidad * 0.015; }

            const posX = Math.cos(planeta.angulo) * planeta.radio;
            const posZ = Math.sin(planeta.angulo) * planeta.radio;

            planeta.malla.position.x = posX;
            planeta.malla.position.z = posZ;
            planeta.malla.position.y = posX * Math.sin(planeta.inclinar); 

            planeta.malla.rotation.y += 0.02;
        });
    }

    renderizador.render(escena, camara);
    window.requestAnimationFrame(bucleAnimacion);
};

window.addEventListener('resize', () => {
    medidas.width = window.innerWidth; medidas.height = window.innerHeight;
    camara.aspect = medidas.width / medidas.height; camara.updateProjectionMatrix();
    renderizador.setSize(medidas.width, medidas.height);
});

bucleAnimacion();