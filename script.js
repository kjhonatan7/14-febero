document.addEventListener('DOMContentLoaded', () => {
    
    const carousel = document.getElementById('carousel');
    const panels = document.querySelectorAll('.panel');
    const n = panels.length;
    const angleStep = 360 / n;
    
    // Distancia del centro (Radio del carrusel)
    // Ajustar si agregas más fotos: más fotos = número más grande
    const radius = 320; 

    // 1. POSICIONAR PANELES EN 3D
    panels.forEach((panel, i) => {
        const angle = angleStep * i;
        // Rotamos y empujamos hacia afuera
        panel.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
        
        // Guardar el ángulo original para referencias
        panel.dataset.angle = angle;
        
        // Evento Click para Zoom
        panel.addEventListener('click', () => {
            // Solo abrir si NO se está arrastrando
            if (!isDragging) {
                openLightbox(panel.querySelector('img').src);
            }
        });
    });

    // 2. LOGICA DE ARRASTRE (DRAG & SWIPE)
    let currentAngle = 0;
    let startX = 0;
    let isDown = false;
    let isDragging = false; // Diferencia entre click y drag

    // Eventos Mouse y Touch unificados
    const startInteraction = (x) => {
        isDown = true;
        isDragging = false;
        startX = x;
        carousel.style.transition = 'none'; // Quitamos transición para respuesta instantánea
    };

    const moveInteraction = (x) => {
        if (!isDown) return;
        
        const xDiff = x - startX;
        
        // Si se mueve más de 5px, lo consideramos arrastre (no click)
        if (Math.abs(xDiff) > 5) isDragging = true;

        // Rotar: Dividimos por 5 para controlar la sensibilidad
        const newAngle = currentAngle + (xDiff / 5);
        carousel.style.transform = `rotateY(${newAngle}deg)`;
    };

    const endInteraction = (x) => {
        if (!isDown) return;
        isDown = false;
        
        const xDiff = x - startX;
        currentAngle += (xDiff / 5); // Guardamos la nueva posición
        
        // Volvemos a poner la transición suave para inercia futura (opcional)
        carousel.style.transition = 'transform 0.5s ease-out';
        carousel.style.transform = `rotateY(${currentAngle}deg)`;
    };

    // Listeners Mouse
    document.addEventListener('mousedown', (e) => startInteraction(e.clientX));
    document.addEventListener('mousemove', (e) => moveInteraction(e.clientX));
    document.addEventListener('mouseup', (e) => endInteraction(e.clientX));

    // Listeners Touch (Celulares)
    document.addEventListener('touchstart', (e) => startInteraction(e.touches[0].clientX));
    document.addEventListener('touchmove', (e) => moveInteraction(e.touches[0].clientX));
    document.addEventListener('touchend', (e) => endInteraction(e.changedTouches[0].clientX));


    // 3. LOGICA DEL LIGHTBOX (ZOOM)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg) closeLightbox();
    });
});
