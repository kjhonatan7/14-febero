document.addEventListener('DOMContentLoaded', () => {
    
    // Crear estrellas de fondo
    const body = document.body;
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        
        // Posición aleatoria
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        star.style.left = x + '%';
        star.style.top = y + '%';
        
        // Brillo aleatorio
        const duration = Math.random() * 3 + 2;
        star.style.animation = `twinkle ${duration}s infinite ease-in-out`;
        star.style.opacity = Math.random();

        body.appendChild(star);
    }

    // Agregar estilo de animación dinámicamente
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
        }
    `;
    document.head.appendChild(style);
});
