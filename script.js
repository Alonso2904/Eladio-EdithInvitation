// Funcionalidad para la invitación de boda

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Animación de entrada suave al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar todas las secciones
    const sections = document.querySelectorAll('.details-section, .reception-section, .rsvp-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

    // Manejo del formulario RSVP
    const rsvpForm = document.querySelector('.rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simular envío (en producción, esto se enviaría a un servidor)
            console.log('Datos del RSVP:', data);
            
            // Mostrar mensaje de confirmación
            showConfirmationMessage();
        });
    }

    // Función para mostrar mensaje de confirmación
    function showConfirmationMessage() {
        const form = document.querySelector('.rsvp-form');
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <h3>¡Gracias por confirmar tu asistencia!</h3>
            <p>Hemos recibido tu respuesta. Nos vemos pronto.</p>
            <button onclick="resetForm()">Enviar otra respuesta</button>
        `;
        
        form.style.display = 'none';
        form.parentNode.insertBefore(thankYouMessage, form.nextSibling);
    }

    // Función para resetear el formulario
    window.resetForm = function() {
        const form = document.querySelector('.rsvp-form');
        const thankYouMessage = document.querySelector('.thank-you-message');
        
        if (thankYouMessage) {
            thankYouMessage.remove();
        }
        
        form.style.display = 'flex';
        form.reset();
    };

    // Contador regresivo para la fecha de la boda
    function updateCountdown() {
        const weddingDate = new Date('2024-12-15T16:00:00');
        const now = new Date();
        const timeLeft = weddingDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            // Actualizar el contador si existe un elemento para mostrarlo
            const countdownElement = document.querySelector('.countdown');
            if (countdownElement) {
                countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        }
    }

    // Actualizar contador cada segundo
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Efecto parallax suave para la sección hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Prevenir zoom en dispositivos móviles al hacer doble tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Mejorar la experiencia táctil
    document.addEventListener('touchstart', function() {}, {passive: true});

    // Añadir clase para mejorar la accesibilidad
    document.documentElement.classList.add('js');
});

// Función para compartir la invitación
function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: 'Invitación de Boda - Carlos & [Nombre de la Novia]',
            text: 'Te invitamos a celebrar nuestro día especial',
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que no soportan Web Share API
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Enlace copiado al portapapeles');
        });
    }
}

// Detectar si es un dispositivo móvil y ajustar estilos
function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

detectMobile();
