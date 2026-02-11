// --- CONFIGURACIÓN ---
const radius = window.innerWidth < 768 ? 240 : 340; // Radio del círculo
const autoRotateSpeed = 0.5; // Velocidad de giro

// --- INICIALIZACIÓN ---
const odrag = document.getElementById('drag-container');
const ospin = document.getElementById('spin-container');
const aImg = ospin.getElementsByTagName('img');
const aEle = [...aImg];

// Configurar suelo
const ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
    for (let i = 0; i < aEle.length; i++) {
        // Distribuir fotos en círculo
        aEle[i].style.transform = `rotateY(${i * (360 / aEle.length)}deg) translateZ(${radius}px)`;
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
        
        // Click para Zoom
        aEle[i].addEventListener('click', function(e) {
            // Solo abrir si no se arrastró
            if (Math.abs(desX) < 5 && Math.abs(desY) < 5) {
                openLightbox(this.src);
            }
        });
    }
}

// EJECUTAR INMEDIATAMENTE (Sin esperas)
init(0); 


// --- FÍSICA DE GIRO ---
let desX = 0, desY = 0;
let tX = 0, tY = 0;
let autoSpin = true; 

function animate() {
    // Rotación Automática o Inercia
    if(autoSpin) {
        if (Math.abs(desX) > 0.5) {
            tY += desX * 0.5; 
            desX *= 0.95; 
        } else {
            tY += autoRotateSpeed; 
        }
    } else {
        desX *= 0.95; 
    }

    // Aplicar Transformación
    // Solo rotamos el spin-container, el drag-container ya está centrado por CSS
    ospin.style.transform = `rotateX(${-10 - tX}deg) rotateY(${tY}deg)`;
    
    requestAnimationFrame(animate);
}
animate();


// --- CONTROLES TÁCTILES ---
let sX, sY, nX, nY;

function startDrag(e) {
    e = e || window.event;
    sX = e.clientX || e.touches[0].clientX;
    sY = e.clientY || e.touches[0].clientY;
    autoSpin = false; 
}

function moveDrag(e) {
    if (autoSpin) return;
    
    e = e || window.event;
    nX = e.clientX || e.touches[0].clientX;
    nY = e.clientY || e.touches[0].clientY;

    desX = (nX - sX) * 0.2; 
    desY = (nY - sY) * 0.1; 

    tY += desX; 
    tX -= desY; 

    sX = nX;
    sY = nY;
}

function endDrag(e) {
    autoSpin = true; // Volver a girar al soltar
}

// Eventos Mouse
document.onmousedown = startDrag;
document.onmousemove = moveDrag;
document.onmouseup = endDrag;

// Eventos Touch
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
    autoSpin = false;
}

closeBtn.onclick = () => {
    lightbox.classList.remove('active');
    autoSpin = true;
};
lightbox.onclick = (e) => {
    if(e.target !== lightboxImg) {
        lightbox.classList.remove('active');
        autoSpin = true;
    }
}
