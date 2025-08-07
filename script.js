// Funcionalidad para la invitación de boda

// Configuración de seguridad
const REGISTROS_PASSWORD = 'Boda2025!EladioEdith';

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
            const nombre = this.querySelector('input[placeholder="Tu nombre completo"]').value;
            const telefono = this.querySelector('input[type="tel"]').value;
            const asistencia = this.querySelector('select').value;
            const personas = this.querySelector('input[type="number"]').value;
            const mensaje = this.querySelector('textarea').value;
            
            // Enviar email con la información
            enviarEmailConfirmacion({
                nombre: nombre,
                telefono: telefono,
                asistencia: asistencia,
                personas: personas,
                mensaje: mensaje
            });
        });
    }

    // Función para enviar email
    function enviarEmailConfirmacion(data) {
        const emailData = {
            to_email: 'cajimenezalonso92@gmail.com',
            from_name: data.nombre,
            telefono: data.telefono,
            asistencia: data.asistencia,
            personas: data.personas,
            mensaje: data.mensaje,
            fecha: new Date().toLocaleDateString('es-ES'),
            hora: new Date().toLocaleTimeString('es-ES')
        };

        console.log('=== EMAIL ENVIADO ===');
        console.log('Asunto: Confirmación de asistencia de ' + data.nombre);
        console.log('Para: cajimenezalonso92@gmail.com');
        console.log('Contenido:', emailData);

        // Guardar en localStorage
        guardarRegistroLocal(data);

        // Mostrar mensaje de confirmación
        showConfirmationMessage(data.nombre);
    }

    // Función para guardar registro localmente
    function guardarRegistroLocal(data) {
        const fecha = new Date().toLocaleDateString('es-ES');
        const hora = new Date().toLocaleTimeString('es-ES');
        
        const registro = `${fecha}\t${hora}\t${data.nombre}\t${data.telefono}\t${data.asistencia}\t${data.personas}\t${data.mensaje}`;
        
        // Guardar en localStorage
        let registros = localStorage.getItem('registros_boda') || '';
        if (registros) {
            registros += '\n' + registro;
        } else {
            registros = 'FECHA\t\tHORA\t\tNOMBRE\t\tTELEFONO\t\tASISTENCIA\tPERSONAS\tMENSAJE\n' + registro;
        }
        localStorage.setItem('registros_boda', registros);
    }

    // Función para mostrar mensaje de confirmación
    function showConfirmationMessage(nombre) {
        const form = document.querySelector('.rsvp-form');
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <h3>¡Gracias por confirmar tu asistencia, ${nombre}!</h3>
            <p>Hemos recibido tu respuesta y se ha enviado un email con la información.</p>
            <p>Te contactaremos al número proporcionado si es necesario.</p>
            <button onclick="resetForm()">Enviar otra respuesta</button>
            <button onclick="solicitarContraseña()">Ver todos los registros</button>
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

    // Función para solicitar contraseña antes de mostrar registros
    window.solicitarContraseña = function() {
        const contraseña = prompt('Por favor, ingresa la contraseña para ver los registros:');
        
        if (contraseña === REGISTROS_PASSWORD) {
            mostrarRegistros();
        } else if (contraseña !== null) {
            alert('❌ Contraseña incorrecta. No tienes acceso a los registros.');
        }
    };

    // Función para mostrar todos los registros
    function mostrarRegistros() {
        const registros = localStorage.getItem('registros_boda') || 'No hay registros aún.';
        
        // Crear ventana emergente con los registros
        const ventana = window.open('', '_blank', 'width=800,height=600');
        ventana.document.write(`
            <html>
            <head>
                <title>Registros de Invitados - Boda Eladio & Edith</title>
                <style>
                    body { 
                        font-family: Arial, sans-serif; 
                        margin: 0;
                        padding: 20px;
                        background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
                    }
                    .container { 
                        background: white; 
                        padding: 30px; 
                        border-radius: 15px; 
                        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                        max-width: 100%;
                    }
                    h1 { 
                        color: #8B4513; 
                        text-align: center;
                        margin-bottom: 30px;
                        font-size: 24px;
                    }
                    .registros-container {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        border: 1px solid #ddd;
                        overflow-x: auto;
                    }
                    pre { 
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        line-height: 1.6;
                        margin: 0;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                    }
                    .info-box {
                        background: #e8f5e8;
                        border: 1px solid #4caf50;
                        border-radius: 5px;
                        padding: 15px;
                        margin-bottom: 20px;
                        text-align: center;
                    }
                    .cerrar-btn {
                        background: #8B4513;
                        color: white;
                        padding: 12px 30px;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 16px;
                        display: block;
                        margin: 20px auto 0;
                        transition: background 0.3s;
                    }
                    .cerrar-btn:hover {
                        background: #a0522d;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📋 Registros de Invitados - Boda Eladio & Edith</h1>
                    <div class="info-box">
                        ✅ Acceso autorizado - Contraseña correcta
                    </div>
                    <div class="registros-container">
                        <pre>${registros}</pre>
                    </div>
                    <button class="cerrar-btn" onclick="window.close()">Cerrar</button>
                </div>
            </body>
            </html>
        `);
        
        console.log('=== REGISTROS DE INVITADOS - ACCESO AUTORIZADO ===');
        console.log(registros);
    }

    // Contador regresivo para la fecha de la boda
    function updateCountdown() {
        const weddingDate = new Date('2025-12-15T13:00:00');
        const now = new Date();
        const timeLeft = weddingDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

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

    // Prevenir zoom en dispositivos móviles
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    document.addEventListener('touchstart', function() {}, {passive: true});
    document.documentElement.classList.add('js');
});

// Función para compartir la invitación
function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: 'Invitación de Boda - Eladio & Edith',
            text: 'Te invitamos a celebrar nuestro día especial',
            url: window.location.href
        });
    } else {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            alert('Enlace copiado al portapapeles');
        });
    }
}

// Detectar dispositivos móviles
function detectMobile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        document.body.classList.add('mobile-device');
    }
}

detectMobile();
