// --- CONFIGURACIÓN ---
const radius = 240; // Radio del carrusel (qué tan abierto es el círculo)
const autoRotateSpeed = 0.3; // Velocidad automática (grados por frame)
const dragFactor = 0.2; // Sensibilidad del tacto (más alto = más rápido)

// --- VARIABLES INTERNAS ---
const odrag = document.getElementById('drag-container');
const ospin = document.getElementById('spin-container');
const aImg = ospin.getElementsByTagName('img');
const aEle = [...aImg]; // Convertir a array

// Ajustar tamaño del contenedor
ospin.style.width = aImg[0].width + "px";
ospin.style.height = aImg[0].height + "px";

// Base del suelo
const ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

// --- 1. POSICIONAMIENTO INICIAL ---
function init(delayTime) {
    for (let i = 0; i < aEle.length; i++) {
        // Calcular ángulo para cada foto
        aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
        
        // Evento Click para Zoom
        aEle[i].addEventListener('click', function(e) {
            // Solo abrir si no se está arrastrando mucho
            if(Math.abs(desX) < 5 && Math.abs(desY) < 5) {
                openLightbox(this.src);
            }
        });
    }
}

// Iniciar con animación de entrada
setTimeout(init, 1000);


// --- 2. MOTOR DE FÍSICA (Auto + Manual) ---
let count = 0; // Grados actuales
let desX = 0;
let desY = 0;
let tX = 0;
let tY = 10; // Ángulo vertical inicial

// Variables para el ciclo de animación
let autoSpin = true;
let isDragging = false;

// Esta función se ejecuta 60 veces por segundo
function animate() {
    
    if (isDragging) {
        // SI ARRASTRAS: No hacemos nada automático, el evento mousemove controla 'tY'
        // Pero aplicamos un poco de fricción a la velocidad (desX) para que no se dispare
        desX *= 0.95;
        desY *= 0.95;
    } else {
        // SI NO ARRASTRAS:
        
        // 1. Efecto Inercia (frenado suave después de soltar)
        if (Math.abs(desX) > 0.5) {
            tY += desX * 0.5; // Seguir girando con el impulso
            desX *= 0.92; // Fricción (frenado)
        } else {
            // 2. Auto-Rotación (cuando ya frenó)
            tY += autoRotateSpeed; // Velocidad constante
        }
        
        // Suavizado vertical (volver al centro)
        if (Math.abs(desY) > 0.5) {
            tX += desY * 0.5;
            desY *= 0.92;
        }
    }

    // Aplicar la rotación al contenedor
    // rotateY controla el giro horizontal (carrusel)
    // rotateX controla la inclinación vertical (ver desde arriba/abajo)
    odrag.style.transform = `rotateX(${-tX}deg) rotateY(${tY}deg)`;

    requestAnimationFrame(animate);
}

// Arrancar motor
animate();


// --- 3. CONTROL TÁCTIL Y MOUSE ---
let sX, sY, nX, nY;

// Función unificada para empezar arrastre
function startDrag(e) {
    clearInterval(odrag.timer);
    // Detectar si es touch o mouse
    e = e || window.event;
    sX = e.clientX || e.touches[0].clientX;
    sY = e.clientY || e.touches[0].clientY;
    
    isDragging = true; // Pausar auto-rotación pura
}

// Función unificada para mover
function moveDrag(e) {
    if (!isDragging) return;
    
    e = e || window.event;
    nX = e.clientX || e.touches[0].clientX;
    nY = e.clientY || e.touches[0].clientY;

    // Calcular distancia movida y velocidad
    desX = (nX - sX) * dragFactor;
    desY = (nY - sY) * dragFactor;

    // Actualizar rotación acumulada inmediatamente (respuesta táctil)
    tY += desX;
    tX -= desY * 0.5; // Menos movimiento vertical para no marear

    // Guardar posición actual para el siguiente frame
    sX = nX;
    sY = nY;
}

// Función unificada para soltar
function endDrag(e) {
    isDragging = false; // Reactivar física (inercia -> auto)
    // No ponemos desX a 0, dejamos que 'animate' use el último desX para la inercia
}


// Eventos Mouse (PC)
document.onmousedown = startDrag;
document.onmousemove = moveDrag;
document.onmouseup = endDrag;

// Eventos Touch (Móvil)
document.ontouchstart = startDrag;
document.ontouchmove = moveDrag;
document.ontouchend = endDrag;


// --- 4. LIGHTBOX (ZOOM) ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close-btn');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    // Pausar interacción mientras se ve la foto
    isDragging = false; 
}

closeBtn.onclick = () => {
    lightbox.classList.remove('active');
};

lightbox.onclick = (e) => {
    if(e.target !== lightboxImg) lightbox.classList.remove('active');
}
