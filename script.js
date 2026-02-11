document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FONDO DINÁMICO (Más partículas, más sutiles) ---
    const bgContainer = document.getElementById('bg-hearts');
    const symbols = ['❤', '♥', '✨', '🌸']; 
    const heartCount = 50; // Más elementos de fondo

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        
        // Distribución aleatoria completa en la pantalla
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh'; // Empiezan en cualquier altura
        
        const size = Math.random() * 15 + 8;
        heart.style.fontSize = size + 'px';
        heart.style.animationDuration = Math.random() * 10 + 10 + 's'; // Más lentos
        heart.style.animationDelay = '-' + Math.random() * 10 + 's'; // Empiezan ya animados
        
        bgContainer.appendChild(heart);
    }

    // --- 2. INTERACCIÓN DE ABRIR ---
    const container = document.querySelector('.container');
    const envelope = document.getElementById('envelope');

    container.addEventListener('click', (e) => {
        // Evitar que el click en una foto (cuando ya está abierto) cierre o reinicie
        if (e.target.closest('.polaroid') && envelope.classList.contains('open')) {
            return;
        }

        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            
            // Sincronizar confeti con la salida de las fotos (aprox 0.7s)
            setTimeout(() => {
                fireConfetti();
            }, 700);
        }
    });

    // --- 3. EXPLOSIÓN DE CONFETI (Física Mejorada) ---
    function fireConfetti() {
        const colors = ['#ff3860', '#ffb74d', '#fff', '#ffd700', '#4db6ac'];
        const confettiCount = 120;

        const rect = envelope.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            document.body.appendChild(confetti);

            confetti.style.left = startX + 'px';
            confetti.style.top = startY + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Física de explosión circular
            const angle = Math.random() * Math.PI * 2;
            // Velocidad variable para que unos lleguen más lejos que otros
            const velocity = Math.random() * 200 + 100; 
            const tx = Math.cos(angle) * velocity;
            // Restamos más a Y para que la explosión sea hacia arriba
            const ty = Math.sin(angle) * velocity - 150; 

            const animation = confetti.animate([
                // Keyframe 1: Inicio
                { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 },
                // Keyframe 2: Punto más alto de la explosión
                { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random()*720}deg) scale(1.2)`, opacity: 1, offset: 0.4 },
                // Keyframe 3: Caída con gravedad
                { transform: `translate(${tx * 1.2}px, ${ty + 400}px) rotate(${Math.random()*1080}deg) scale(0.5)`, opacity: 0 }
            ], {
                duration: Math.random() * 1000 + 1500, // Entre 1.5 y 2.5 segundos
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // Caída realista
                fill: 'forwards'
            });

            animation.onfinish = () => confetti.remove();
        }
    }
});
