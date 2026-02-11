// --- 1. CONFIGURACIÓN INTELIGENTE ---
// Si el ancho de pantalla es menor a 768px (móvil), usa radio pequeño (230), sino grande (340)
const radius = window.innerWidth < 768 ? 230 : 340;
const autoRotateSpeed = 0.4; // Velocidad suave

// --- INICIALIZACIÓN ---
const odrag = document.getElementById('drag-container');
const ospin = document.getElementById('spin-container');
const aImg = ospin.getElementsByTagName('img');
const aEle = [...aImg];

// Tamaño del contenedor basado en la primera foto
ospin.style.width = aImg[0].width + "px";
ospin.style.height = aImg[0].height + "px";

// Base del suelo
const ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
    for (let i = 0; i < aEle.length; i++) {
        // Distribuir fotos en círculo (360 / cantidad)
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

// Iniciar animación de entrada
setTimeout(init, 1000);


// --- 2. FÍSICA DE GIRO (AUTO + MANUAL) ---
let desX = 0, desY = 0;
let tX = 0, tY = 0; // Ángulo inicial
let autoSpin = true; 

function animate() {
    if(autoSpin) {
        if (Math.abs(desX) > 0.5) {
            tY += desX * 0.5; // Inercia residual
            desX *= 0.95; // Fricción
        } else {
            tY += autoRotateSpeed; // Velocidad automática constante
        }
    } else {
        desX *= 0.95; // Si se arrastra, desacelerar input suavemente
    }

    // Aplicar rotación
    // rotateX(-20deg) es la base para ver desde arriba
    // tX se suma para permitir inclinarlo manualmente si se desea
    odrag.style.transform = `rotateX(${-10 - tX}deg) rotateY(${tY}deg)`;
    
    requestAnimationFrame(animate);
}
animate();


// --- 3. CONTROLES TÁCTILES Y MOUSE ---
let sX, sY, nX, nY;

function startDrag(e) {
    e = e || window.event;
    sX = e.clientX || e.touches[0].clientX;
    sY = e.clientY || e.touches[0].clientY;
    autoSpin = false; // Detener auto-giro
}

function moveDrag(e) {
    if (autoSpin) return;
    
    e = e || window.event;
    nX = e.clientX || e.touches[0].clientX;
    nY = e.clientY || e.touches[0].clientY;

    desX = (nX - sX) * 0.2; // Sensibilidad horizontal
    desY = (nY - sY) * 0.1; // Sensibilidad vertical

    tY += desX; // Girar horizontalmente
    tX -= desY; // Inclinar verticalmente

    sX = nX;
    sY = nY;
}

function endDrag(e) {
    // Al soltar, reactivamos el ciclo de animación que usará la inercia (desX)
    // Luego volverá a autoSpin cuando la inercia se acabe
    
    // Hack: Si quieres que vuelva a girar solo siempre después de soltar:
    // autoSpin = true; 
    
    // Si quieres que se quede quieto o siga inercia y luego gire:
    autoSpin = true;
}

// Mouse
document.onmousedown = startDrag;
document.onmousemove = moveDrag;
document.onmouseup = endDrag;

// Touch
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
