document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. FONDO DE CORAZONES ---
    const bgContainer = document.getElementById('bg-hearts');
    const symbols = ['❤', '♥', '✨', '🌸']; 
    const heartCount = 50;

    for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = symbols[Math.floor(Math.random() * symbols.length)];
        
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.top = Math.random() * 100 + 'vh';
        heart.style.fontSize = (Math.random() * 15 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
        heart.style.animationDelay = '-' + (Math.random() * 10) + 's';
        
        bgContainer.appendChild(heart);
    }

    // --- 2. ABRIR EL SOBRE ---
    const container = document.querySelector('.container');
    const envelope = document.getElementById('envelope');

    container.addEventListener('click', (e) => {
        // Evita cerrar si tocas una foto
        if (e.target.closest('.polaroid') && envelope.classList.contains('open')) return;

        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            setTimeout(fireConfetti, 600);
        }
    });

    // --- 3. EXPLOSIÓN DE CONFETI ---
    function fireConfetti() {
        const colors = ['#d63031', '#fd79a8', '#ffeaa7', '#00b894', '#fff'];
        const confettiCount = 100;
        const rect = envelope.getBoundingClientRect();
        // Centro relativo
        const startX = rect.left + rect.width / 2; 
        const startY = rect.top + rect.height / 2;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            document.body.appendChild(confetti);

            confetti.style.left = startX + 'px';
            confetti.style.top = startY + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

            // Matemáticas de explosión
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 150 + 60; 
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100; // -100 empuja hacia arriba

            const animation = confetti.animate([
                { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 },
                { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random()*360}deg) scale(1)`, opacity: 1, offset: 0.6 },
                { transform: `translate(${tx}px, ${ty + 300}px) rotate(${Math.random()*360}deg) scale(0.5)`, opacity: 0 }
            ], {
                duration: Math.random() * 1000 + 1500,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                fill: 'forwards'
            });

            animation.onfinish = () => confetti.remove();
        }
    }
});
