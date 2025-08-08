// Funcionalidad para la invitación de boda con EmailJS configurado
// Configuración de EmailJS con tus credenciales
const EMAILJS_CONFIG = {
    serviceID: 'service_aj86xib',
    templateID: 'template_ku1p4br',
    publicKey: '7PouY7v1GnE4F29Dm',
    toEmail: 'cajimenezalonso92@gmail.com'
};

// Configuración de seguridad
const REGISTROS_PASSWORD = 'Boda2025!EladioEdith';

// Cargar EmailJS SDK
(function() {
    emailjs.init(EMAILJS_CONFIG.publicKey);
})();

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
            
            // Enviar email con EmailJS
            enviarEmailConfirmacion({
                nombre: nombre,
                telefono: telefono,
                asistencia: asistencia,
                personas: personas,
                mensaje: mensaje
            });
        });
    }

    // Función para enviar email con EmailJS
    function enviarEmailConfirmacion(data) {
        const fecha = new Date().toLocaleDateString('es-ES');
        const hora = new Date().toLocaleTimeString('es-ES');
        
        const emailData = {
            to_email: EMAILJS_CONFIG.toEmail,
            from_name: data.nombre,
            telefono: data.telefono,
            asistencia: data.asistencia,
            personas: data.personas,
            mensaje: data.mensaje || 'Sin mensaje',
            fecha: fecha,
            hora: hora
        };

        // Enviar email usando EmailJS
        emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, emailData)
            .then(function(response) {
                console.log('✅ Email enviado exitosamente:', response);
                // Guardar registro localmente
                guardarRegistroLocal(data);
                // Mostrar mensaje de confirmación
                showConfirmationMessage(data.nombre);
            }, function(error) {
                console.error('❌ Error al enviar email:', error);
                alert('Hubo un error al enviar la confirmación. Por favor, intenta de nuevo.');
            });
    }

    // Función para guardar registro localmente
    function guardarRegistroLocal(data) {
        const fecha = new Date().toLocaleDateString('es-ES');
        const hora = new Date().toLocaleTimeString('es-ES');
        
        const registro = {
            fecha: fecha,
            hora: hora,
            nombre: data.nombre,
            telefono: data.telefono,
            asistencia: data.asistencia,
            personas: data.personas,
            mensaje: data.mensaje
        };

        // Guardar en localStorage
        let registros = [];
        try {
            const stored = localStorage.getItem('registros_boda');
            if (stored) {
                registros = JSON.parse(stored);
                if (!Array.isArray(registros)) {
                    registros = [];
                }
            }
        } catch (e) {
            console.warn('Error al parsear registros existentes, creando nuevo array');
            registros = [];
        }
        
        registros.push(registro);
        localStorage.setItem('registros_boda', JSON.stringify(registros));
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
        let registros = [];
        try {
            const stored = localStorage.getItem('registros_boda');
            if (stored) {
                registros = JSON.parse(stored);
                if (!Array.isArray(registros)) {
                    registros = [];
                }
            }
        } catch (e) {
            console.warn('Error al cargar registros, creando nuevo array');
            registros = [];
        }
        
        if (registros.length === 0) {
            alert('No hay registros aún.');
            return;
        }

        // Crear ventana emergente con los registros
        const ventana = window.open('', '_blank', 'width=900,height=700');
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
                        margin-bottom: 20px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #8B4513;
                        color: white;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    .action-buttons {
                        text-align: center;
                        margin-top: 20px;
                    }
                    .btn {
                        background: #8B4513;
                        color: white;
                        padding: 12px 24px;
                        border: none;
                        border-radius: 25px;
                        cursor: pointer;
                        font-size: 16px;
                        margin: 0 10px;
                        transition: background 0.3s;
                    }
                    .btn:hover {
                        background: #a0522d;
                    }
                    .btn-danger {
                        background: #dc3545;
                    }
                    .btn-danger:hover {
                        background: #c82333;
                    }
                    .checkbox {
                        margin-right: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📋 Registros de Invitados - Boda Eladio & Edith</h1>
                    <div class="registros-container">
                        <table id="registrosTable">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="selectAll" onclick="toggleSelectAll()"></th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>Nombre</th>
                                    <th>Teléfono</th>
                                    <th>Asistencia</th>
                                    <th>Personas</th>
                                    <th>Mensaje</th>
                                </tr>
                            </thead>
                            <tbody id="registrosBody">
                            </tbody>
                        </table>
                    </div>
                    <div class="action-buttons">
                        <button class="btn btn-danger" onclick="borrarSeleccionados()">Borrar Seleccionados</button>
                        <button class="btn btn-danger" onclick="borrarTodos()">Borrar Todos</button>
                        <button class="btn" onclick="window.close()">Cerrar</button>
                    </div>
                </div>

                <script>
                    const registros = ${JSON.stringify(registros)};
                    
                    function cargarRegistros() {
                        const tbody = document.getElementById('registrosBody');
                        tbody.innerHTML = '';
                        
                        registros.forEach((registro, index) => {
                            const row = tbody.insertRow();
                            row.innerHTML = \`
                                <td><input type="checkbox" class="registro-checkbox" data-index="\${index}"></td>
                                <td>\${registro.fecha}</td>
                                <td>\${registro.hora}</td>
                                <td>\${registro.nombre}</td>
                                <td>\${registro.telefono}</td>
                                <td>\${registro.asistencia}</td>
                                <td>\${registro.personas}</td>
                                <td>\${registro.mensaje || 'Sin mensaje'}</td>
                            \`;
                        });
                    }

                    function toggleSelectAll() {
                        const checkboxes = document.querySelectorAll('.registro-checkbox');
                        const selectAll = document.getElementById('selectAll');
                        checkboxes.forEach(checkbox => {
                            checkbox.checked = selectAll.checked;
                        });
                    }

                    function borrarSeleccionados() {
                        const checkboxes = document.querySelectorAll('.registro-checkbox:checked');
                        if (checkboxes.length === 0) {
                            alert('Por favor, selecciona al menos un registro para borrar.');
                            return;
                        }

                        if (confirm('¿Estás seguro de borrar los registros seleccionados?')) {
                            const indices = Array.from(checkboxes).map(cb => parseInt(cb.dataset.index));
                            const nuevosRegistros = registros.filter((_, index) => !indices.includes(index));
                            
                            localStorage.setItem('registros_boda', JSON.stringify(nuevosRegistros));
                            alert('Registros borrados exitosamente.');
                            window.location.reload();
                        }
                    }

                    function borrarTodos() {
                        if (confirm('¿Estás seguro de borrar TODOS los registros? Esta acción no se puede deshacer.')) {
                            localStorage.setItem('registros_boda', JSON.stringify([]));
                            alert('Todos los registros han sido borrados.');
                            window.location.reload();
                        }
                    }

                    // Cargar registros al abrir la ventana
                    cargarRegistros();
                </script>
            </body>
            </html>
        `);
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

