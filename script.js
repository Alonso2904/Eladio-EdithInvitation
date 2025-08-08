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

// Funciones de manejo de registros con archivo registros.txt
function guardarRegistroEnArchivo(registro) {
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
    
    // También guardar en formato texto para visualización
    const registroTexto = `Fecha: ${registro.fecha} | Hora: ${registro.hora} | Nombre: ${registro.nombre} | Teléfono: ${registro.telefono} | Asistencia: ${registro.asistencia} | Personas: ${registro.personas} | Mensaje: ${registro.mensaje || 'Sin mensaje'}\n`;
    
    // Simular guardado en archivo (en producción esto requeriría backend)
    console.log('Registro guardado:', registroTexto);
    return registros;
}

function obtenerRegistros() {
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
    
    // Si no hay registros, crear algunos de ejemplo
    if (registros.length === 0) {
        registros = [
            {
                fecha: '15/12/2025',
                hora: '14:30:00',
                nombre: 'Juan Pérez García',
                telefono: '555-123-4567',
                asistencia: 'Sí, asistiré',
                personas: '2',
                mensaje: '¡Felicitaciones! Esperamos con ansias la celebración.'
            },
            {
                fecha: '16/12/2025',
                hora: '10:15:00',
                nombre: 'María López Hernández',
                telefono: '555-987-6543',
                asistencia: 'Sí, asistiré',
                personas: '1',
                mensaje: 'Gracias por la invitación, será un honor compartir este día especial.'
            },
            {
                fecha: '17/12/2025',
                hora: '16:45:00',
                nombre: 'Carlos Rodríguez Martínez',
                telefono: '555-456-7890',
                asistencia: 'No podré asistir',
                personas: '0',
                mensaje: 'Lamentablemente no podré asistir, pero les deseo toda la felicidad del mundo.'
            }
        ];
        localStorage.setItem('registros_boda', JSON.stringify(registros));
    }
    
    return registros;
}

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
            
            // Crear registro
            const fecha = new Date().toLocaleDateString('es-ES');
            const hora = new Date().toLocaleTimeString('es-ES');
            
            const registro = {
                fecha: fecha,
                hora: hora,
                nombre: nombre,
                telefono: telefono,
                asistencia: asistencia,
                personas: personas,
                mensaje: mensaje
            };
            
            // Guardar registro
            const registros = guardarRegistroEnArchivo(registro);
            
            // Enviar email con EmailJS
            enviarEmailConfirmacion(registro);
        });
    }

    // Función para enviar email con EmailJS
    function enviarEmailConfirmacion(data) {
        const emailData = {
            to_email: EMAILJS_CONFIG.toEmail,
            from_name: data.nombre,
            telefono: data.telefono,
            asistencia: data.asistencia,
            personas: data.personas,
            mensaje: data.mensaje || 'Sin mensaje',
            fecha: data.fecha,
            hora: data.hora
        };

        // Enviar email usando EmailJS
        emailjs.send(EMAILJS_CONFIG.serviceID, EMAILJS_CONFIG.templateID, emailData)
            .then(function(response) {
                console.log('✅ Email enviado exitosamente:', response);
                // Mostrar mensaje de confirmación
                showConfirmationMessage(data.nombre);
            }, function(error) {
                console.error('❌ Error al enviar email:', error);
                alert('Hubo un error al enviar la confirmación. Por favor, intenta de nuevo.');
            });
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
        const registros = obtenerRegistros();
        
        if (registros.length === 0) {
            alert('No hay registros aún.');
            return;
        }

        // Calcular estadísticas
        const asistentes = registros.filter(r => r.asistencia === 'Sí, asistiré');
        const noAsistentes = registros.filter(r => r.asistencia === 'No podré asistir');
        const totalPersonas = asistentes.reduce((sum, r) => sum + (parseInt(r.personas) || 0), 0);

        // Crear ventana emergente con los registros
        const ventana = window.open('', '_blank', 'width=1000,height=700');
        if (!ventana || ventana.closed) {
            alert('Error al abrir la ventana. Por favor, verifica que los bloqueadores de ventanas emergentes estén deshabilitados.');
            return;
        }

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
                    .stats-container {
                        display: flex;
                        justify-content: space-around;
                        margin-bottom: 30px;
                        flex-wrap: wrap;
                    }
                    .stat-card {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        text-align: center;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        margin: 10px;
                        flex: 1;
                        min-width: 150px;
                    }
                    .stat-number {
                        font-size: 36px;
                        font-weight: bold;
                        color: #8B4513;
                    }
                    .stat-label {
                        color: #666;
                        margin-top: 5px;
                    }
                    .registros-container {
                        background: #f9f9f9;
                        padding: 20px;
                        border-radius: 10px;
                        border: 1px solid #ddd;
                        margin-bottom: 20px;
                        overflow-x: auto;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                        min-width: 800px;
                    }
                    th, td {
                        padding: 12px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                        word-wrap: break-word;
                    }
                    th {
                        background-color: #8B4513;
                        color: white;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    tr:hover {
                        background-color: #e8e8e8;
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
                    .btn-success {
                        background: #28a745;
                    }
                    .btn-success:hover {
                        background: #218838;
                    }
                    .checkbox {
                        margin-right: 10px;
                    }
                    .asistencia-si {
                        color: #28a745;
                        font-weight: bold;
                    }
                    .asistencia-no {
                        color: #dc3545;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>📋 Registros de Invitados - Boda Eladio & Edith</h1>
                    
                    <div class="stats-container">
                        <div class="stat-card">
                            <div class="stat-number">${registros.length}</div>
                            <div class="stat-label">Total Invitados</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${asistentes.length}</div>
                            <div class="stat-label">Confirmaron Asistencia</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${noAsistentes.length}</div>
                            <div class="stat-label">No Asistirán</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">${totalPersonas}</div>
                            <div class="stat-label">Total Personas</div>
                        </div>
                    </div>
                    
                    <div class="registros-container">
                        <table id="registrosTable">
                            <thead>
                                <tr>
                                    <th>#</th>
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
                        <button class="btn btn-success" onclick="enviarListadoCompleto()">📧 Enviar Listado por Email</button>
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
                            const asistenciaClass = registro.asistencia === 'Sí, asistiré' ? 'asistencia-si' : 'asistencia-no';
                            row.innerHTML = \`
                                <td>\${index + 1}</td>
                                <td>\${registro.fecha}</td>
                                <td>\${registro.hora}</td>
                                <td>\${registro.nombre}</td>
                                <td>\${registro.telefono}</td>
                                <td class="\${asistenciaClass}">\${registro.asistencia}</td>
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

                    function enviarListadoCompleto() {
                        if (confirm('¿Deseas enviar el listado completo de invitados a tu correo?')) {
                            const emailData = {
                                to_email: 'cajimenezalonso92@gmail.com',
                                subject: 'Listado Completo de Invitados - Boda Eladio & Edith',
                                message: generarReporteHTML()
                            };

                            emailjs.send('service_aj86xib', 'template_9uyxp0w', emailData)
                                .then(function(response) {
                                    console.log('✅ Listado enviado exitosamente:', response);
                                    alert('✅ Listado enviado exitosamente a tu correo!');
                                }, function(error) {
                                    console.error('❌ Error al enviar el listado:', error);
                                    alert('❌ Error al enviar el listado. Por favor, intenta de nuevo.');
                                });
                        }
                    }

                    function generarReporteHTML() {
                        const asistentes = registros.filter(r => r.asistencia === 'Sí, asistiré');
                        const noAsistentes = registros.filter(r => r.asistencia === 'No podré asistir');
                        const totalPersonas = asistentes.reduce((sum, r) => sum + (parseInt(r.personas) || 0), 0);

                        let reporte = '<h2>Reporte de Invitados - Boda Eladio & Edith</h2>';
                        reporte += '<h3>Resumen:</h3>';
                        reporte += '<p><strong>Total Invitados:</strong> ${registros.length}</p>';
                        reporte += '<p><strong>Confirmaron Asistencia:</strong> ${asistentes.length}</p>';
                        reporte += '<p><strong>No Asistirán:</strong> ${noAsistentes.length}</p>';
                        reporte += '<p><strong>Total Personas:</strong> ${totalPersonas}</p>';
                        reporte += '<h3>Detalle de Invitados:</h3>';
                        reporte += '<table border="1" style="border-collapse: collapse; width: 100%;">';
                        reporte += '<tr><th>Nombre</th><th>Teléfono</th><th>Asistencia</th><th>Personas</th><th>Mensaje</th></tr>';
                        
                        registros.forEach(registro => {
                            reporte += '<tr>';
                            reporte += '<td>' + registro.nombre + '</td>';
                            reporte += '<td>' + registro.telefono + '</td>';
                            reporte += '<td>' + registro.asistencia + '</td>';
                            reporte += '<td>' + (registro.personas || '0') + '</td>';
                            reporte += '<td>' + (registro.mensaje || 'Sin mensaje') + '</td>';
                            reporte += '</tr>';
                        });
                        
                        reporte += '</table>';
                        return reporte;
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
