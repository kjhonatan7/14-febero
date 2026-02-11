// --- CONFIGURACIÓN ---
const radius = 240; // Radio del círculo
const autoRotateSpeed = 0.5; // Velocidad de giro automático

// --- INICIALIZACIÓN ---
const odrag = document.getElementById('drag-container');
const ospin = document.getElementById('spin-container');
const aImg = ospin.getElementsByTagName('img');
const aEle = [...aImg];

// Tamaño del contenedor
ospin.style.width = aImg[0].width + "px";
ospin.style.height = aImg[0].height + "px";

// Base del suelo
const ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
    for (let i = 0; i < aEle.length; i++) {
        aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
        
        // Click para Zoom
        aEle[i].addEventListener('click', function(e) {
            // Solo abre si no estamos arrastrando
            if (Math.abs(desX) < 5 && Math.abs(desY) < 5) {
                openLightbox(this.src);
            }
        });
    }
}

setTimeout(init, 1000);

// --- MOTOR DE ANIMACIÓN ---
let desX = 0, desY = 0;
let tX = 0, tY = 10;
let autoSpin = true; // Empieza girando solo

function animate() {
    // Si NO estamos arrastrando, giramos solo o frenamos la inercia
    if(autoSpin) {
        if (Math.abs(desX) > 0.5) {
            tY += desX * 0.5;
            desX *= 0.95; // Fricción
        } else {
            tY += autoRotateSpeed; // Velocidad constante
        }
    } else {
        // Si estamos arrastrando, solo aplicamos fricción a la velocidad para que no se dispare
        desX *= 0.95; 
    }

    // Aplicar rotación
    odrag.style.transform = `rotateX(${-tX}deg) rotateY(${tY}deg)`;
    requestAnimationFrame(animate);
}
animate();

// --- EVENTOS DE ARRASTRE ---
let sX, sY, nX, nY;

function startDrag(e) {
    e = e || window.event;
    sX = e.clientX || e.touches[0].clientX;
    sY = e.clientY || e.touches[0].clientY;
    autoSpin = false; // Detener auto-giro al tocar
}

function moveDrag(e) {
    if (autoSpin) return; // Si no hemos empezado, salir
    
    e = e || window.event;
    nX = e.clientX || e.touches[0].clientX;
    nY = e.clientY || e.touches[0].clientY;

    desX = (nX - sX) * 0.2; // Velocidad horizontal
    desY = (nY - sY) * 0.1; // Velocidad vertical (menor para no marear)

    tY += desX; // Girar
    tX -= desY; // Inclinar

    sX = nX;
    sY = nY;
}

function endDrag(e) {
    autoSpin = true; // Volver a activar física al soltar
}

// Mouse
document.onmousedown = startDrag;
document.onmousemove = moveDrag;
document.onmouseup = endDrag;

// Touch (Celular)
document.ontouchstart = startDrag;
document.ontouchmove = moveDrag;
document.ontouchend = endDrag;

// --- LIGHTBOX ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close-btn');

function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    autoSpin = false; // Pausar giro
}

closeBtn.onclick = () => {
    lightbox.classList.remove('active');
    autoSpin = true; // Reanudar
};
lightbox.onclick = (e) => {
    if(e.target !== lightboxImg) {
        lightbox.classList.remove('active');
        autoSpin = true;
    }
}
