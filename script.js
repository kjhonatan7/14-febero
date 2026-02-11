document.addEventListener('DOMContentLoaded', () => {
    
    // 1. GENERAR FONDO DE CORAZONES
    const bgContainer = document.getElementById('bg-hearts');
    const symbols = ['❤️', '💖', '💕', '🌹', '✨'];
    const heartCount = 40;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Aleatoriedad en posición y animación
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        heart.style.animationDuration = Math.random() * 5 + 5 + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        
        bgContainer.appendChild(heart);
    }

    // 2. MANEJO DEL CLIC (ABRIR SOBRE)
    const container = document.querySelector('.container');
    const envelope = document.getElementById('envelope');

    container.addEventListener('click', () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            
            // Disparar confeti cuando la carta sale (aprox 800ms después del click)
            setTimeout(() => {
                fireConfetti();
            }, 800);
        }
    });

    // 3. FUNCIÓN DE CONFETI (EXPLOSIÓN)
    function fireConfetti() {
        const colors = ['#ff7675', '#fd79a8', '#ffeaa7', '#55efc4', '#74b9ff'];
        const confettiCount = 100; // Número de partículas

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            document.body.appendChild(confetti);

            // Posición inicial (centro de la pantalla)
            const rect = envelope.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2; // Desde el centro del sobre

            confetti.style.left = startX + 'px';
            confetti.style.top = startY + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Física aleatoria
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 100; // Velocidad de explosión
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100; // -100 para que salten hacia arriba

            // Animación
            const animation = confetti.animate([
                { transform: 'translate(0,0) rotate(0)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random()*360}deg)`, opacity: 1, offset: 0.6 },
                { transform: `translate(${tx}px, ${ty + 200}px) rotate(${Math.random()*360}deg)`, opacity: 0 } // Caen por gravedad
            ], {
                duration: 1500 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            animation.onfinish = () => confetti.remove();
        }
    }
});
