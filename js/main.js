/* ============================================
   Main JavaScript — Productora de Seguros
   ============================================ */

(function () {
  'use strict';

  // Forzar HTTPS en producción si el usuario accede por HTTP no seguro
  if (location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1' && !location.hostname.endsWith('.local')) {
    location.replace(`https:${location.href.substring(location.protocol.length)}`);
  }

  /* ------------------------------------------
     Configuration
     ------------------------------------------ */
  const CONFIG = {
    whatsappNumber: '5493487706399',        // Número con código de país sin + ni espacios
    emailTo: 'contacto@lauraurzich.com.ar',     // Email destino para mailto fallback
    emailjs: {
      serviceId: 'service_rie669u',
      templateId: 'template_989xabe',
      publicKey: 'DwzTsGbtuzj7urUys',
    },
    dailyEmailLimit: 8,                     // Máximo de emails automáticos por día por navegador
    storageKey: 'seguro_email_rate',        // Key de localStorage para rate limiting
  };

  // Inicializar EmailJS SDK si está cargado
  if (typeof emailjs !== 'undefined' && CONFIG.emailjs?.publicKey) {
    try {
      emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
    } catch (e) {
      console.warn('Error inicializando EmailJS:', e);
    }
  }

  /* ------------------------------------------
     Rate Limiter (localStorage)
     ------------------------------------------ */
  const RateLimiter = {
    /**
     * Obtiene el conteo de emails enviados hoy.
     */
    getCount() {
      try {
        const data = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '{}');
        const today = new Date().toDateString();
        if (data.date !== today) {
          // Día diferente, reiniciar contador
          this.reset();
          return 0;
        }
        return data.count || 0;
      } catch {
        return 0;
      }
    },

    /**
     * Incrementa el contador de emails enviados hoy.
     */
    increment() {
      try {
        const today = new Date().toDateString();
        const count = this.getCount() + 1;
        localStorage.setItem(CONFIG.storageKey, JSON.stringify({ date: today, count }));
        return count;
      } catch {
        return 0;
      }
    },

    /**
     * Reinicia el contador.
     */
    reset() {
      try {
        const today = new Date().toDateString();
        localStorage.setItem(CONFIG.storageKey, JSON.stringify({ date: today, count: 0 }));
      } catch {
        // Silently fail
      }
    },

    /**
     * ¿Se puede enviar por email automático?
     */
    canSendAutoEmail() {
      return this.getCount() < CONFIG.dailyEmailLimit;
    },

    canSendFormspree() {
      return this.canSendAutoEmail();
    },

    /**
     * Retorna cuántos envíos quedan hoy.
     */
    remaining() {
      return Math.max(0, CONFIG.dailyEmailLimit - this.getCount());
    }
  };

  /* ------------------------------------------
     WhatsApp Link Generator
     ------------------------------------------ */
  function generateWhatsAppLink(insuranceType) {
    const messages = {
      default: '¡Hola Laura! Me gustaría recibir más información sobre sus servicios de seguros.',
      'seguro-automotor': '¡Hola Laura! Me interesa cotizar un *Seguro Automotor*. ¿Podrías brindarme información?',
      'seguro-hogar': '¡Hola Laura! Me interesa cotizar un *Seguro de Hogar*. ¿Podrías brindarme información?',
      'tecno-portatil': '¡Hola Laura! Me interesa cotizar un *Seguro de Tecno Portátil*. ¿Podrías brindarme información?',
      'seguro-motos': '¡Hola Laura! Me interesa cotizar un *Seguro para Motos*. ¿Podrías brindarme información?',
      'movilidad-sustentable': '¡Hola Laura! Me interesa cotizar un seguro de *Movilidad Sustentable*. ¿Podrías brindarme información?',
      'accidentes-personales': '¡Hola Laura! Me interesa cotizar un seguro de *Accidentes Personales*. ¿Podrías brindarme información?',
      'vida-individual': '¡Hola Laura! Me interesa cotizar un *Seguro de Vida Individual*. ¿Podrías brindarme información?',
      'garantia-alquileres': '¡Hola Laura! Me interesa cotizar un *Seguro de Garantía para Alquileres*. ¿Podrías brindarme información?',
      'embarcaciones': '¡Hola Laura! Me interesa cotizar un seguro para *Embarcaciones de Placer*. ¿Podrías brindarme información?',
      'seguro-salud': '¡Hola Laura! Me interesa cotizar un *Seguro de Salud*. ¿Podrías brindarme información?',
      'seguro-sepelio': '¡Hola Laura! Me interesa cotizar un *Seguro de Sepelio*. ¿Podrías brindarme información?',
      'bolso-protegido': '¡Hola Laura! Me interesa cotizar *Bolso Protegido*. ¿Podrías brindarme información?',
      'seguro-comercio': '¡Hola Laura! Me interesa cotizar un *Seguro para Comercios y PyMEs*. ¿Podrías brindarme información?',
      'seguro-consorcio': '¡Hola Laura! Me interesa cotizar un *Seguro Integral de Consorcio*. ¿Podrías brindarme información?',
      'seguro-art': '¡Hola Laura! Me interesa cotizar una *ART / Riesgos del Trabajo*. ¿Podrías brindarme información?',
      'seguro-caucion': '¡Hola Laura! Me interesa cotizar un *Seguro de Caución*. ¿Podrías brindarme información?',
      'rc-profesional': '¡Hola Laura! Me interesa cotizar un seguro de *Responsabilidad Civil Profesional*. ¿Podrías brindarme información?',
      'rc-eventos': '¡Hola Laura! Me interesa cotizar un seguro de *RC para Eventos*. ¿Podrías brindarme información?',
      'seguro-transporte': '¡Hola Laura! Me interesa cotizar un *Seguro de Transporte*. ¿Podrías brindarme información?',
      'seguro-tecnico': '¡Hola Laura! Me interesa cotizar un *Seguro Técnico para Empresas*. ¿Podrías brindarme información?',
      'seguro-agrario': '¡Hola Laura! Me interesa cotizar *Seguros Agrarios*. ¿Podrías brindarme información?',
      'seguro-granizo': '¡Hola Laura! Me interesa cotizar un *Seguro contra Granizo*. ¿Podrías brindarme información?',
      'seguro-incendio': '¡Hola Laura! Me interesa cotizar un *Seguro contra Incendio*. ¿Podrías brindarme información?',
      'vida-colectivo': '¡Hola Laura! Me interesa cotizar un *Seguro de Vida Colectivo*. ¿Podrías brindarme información?',
    };

    const message = messages[insuranceType] || messages.default;
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  /* ------------------------------------------
     Mailto Fallback Builder
     ------------------------------------------ */
  function buildMailtoLink(formData) {
    const subject = `Consulta Web — ${formData.tipoSeguro || 'General'}`;
    const body = [
      `Nombre: ${formData.nombre}`,
      `Email: ${formData.email}`,
      `Teléfono: ${formData.telefono || 'No proporcionado'}`,
      `Tipo de Seguro: ${formData.tipoSeguro || 'No especificado'}`,
      ``,
      `Mensaje:`,
      formData.mensaje || '(Sin mensaje adicional)',
    ].join('\n');

    return `mailto:${CONFIG.emailTo}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /* ------------------------------------------
     Contact Form Handler
     ------------------------------------------ */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    const statusEl = document.getElementById('form-status');
    const rateLimitNotice = document.getElementById('rate-limit-notice');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');

    if (!form) return;

    // Mostrar aviso de rate limit si ya se alcanzó el límite
    updateRateLimitUI();

    // Mejora UX: Clic simple para sumar o quitar opciones sin requerir la tecla Ctrl
    const multiSelect = form.querySelector('#input-tipo-seguro');
    if (multiSelect) {
      multiSelect.addEventListener('mousedown', function (e) {
        if (e.target && e.target.tagName === 'OPTION') {
          e.preventDefault();
          e.target.selected = !e.target.selected;
          multiSelect.dispatchEvent(new Event('change'));
        }
      });
    }

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Validación Bootstrap
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      // Recolectar todas las opciones seleccionadas
      const selectedOpts = Array.from(form.querySelectorAll('#input-tipo-seguro option:checked')).map(opt => opt.value);

      // Recolectar datos del formulario
      const formData = {
        nombre: form.querySelector('#input-nombre').value.trim(),
        email: form.querySelector('#input-email').value.trim(),
        telefono: form.querySelector('#input-telefono').value.trim(),
        tipoSeguro: selectedOpts.length > 0 ? selectedOpts.join(', ') : 'Consulta general',
        mensaje: form.querySelector('#input-mensaje').value.trim(),
      };

      if (RateLimiter.canSendAutoEmail()) {
        // ► Ruta primaria: enviar vía EmailJS
        await sendViaEmailJS(form, formData, statusEl, submitBtn, submitText);
      } else {
        // ► Ruta fallback: abrir mailto
        sendViaMailto(formData, statusEl);
      }
    });
  }

  /**
   * Envía el formulario vía EmailJS (SDK oficial o REST API).
   */
  async function sendViaEmailJS(form, formData, statusEl, submitBtn, submitText) {
    // UI: estado de carga
    submitBtn.disabled = true;
    submitText.textContent = 'Enviando...';
    statusEl.textContent = '';
    statusEl.className = '';

    // Preparar enlace de WhatsApp hacia el cliente para la plantilla
    const cleanDigits = (formData.telefono || '').replace(/\D/g, '');
    const waLink = cleanDigits.length >= 8 ? `https://wa.me/${cleanDigits}` : `https://wa.me/${CONFIG.whatsappNumber}`;

    const templateParams = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      tipo_seguro: formData.tipoSeguro,
      mensaje: formData.mensaje || '(Sin mensaje adicional)',
      whatsapp_link: waLink,
      reply_to: formData.email,
    };

    try {
      if (typeof emailjs !== 'undefined' && typeof emailjs.send === 'function') {
        await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, templateParams);
      } else {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: CONFIG.emailjs.serviceId,
            template_id: CONFIG.emailjs.templateId,
            user_id: CONFIG.emailjs.publicKey,
            template_params: templateParams,
          }),
        });
        if (!response.ok) {
          throw new Error(`EmailJS HTTP ${response.status}: ${await response.text()}`);
        }
      }

      RateLimiter.increment();

      // Disparar modal de éxito personalizado
      const modalEl = document.getElementById('formSuccessModal');
      const nameEl = document.getElementById('modal-user-name');
      if (modalEl && typeof bootstrap !== 'undefined') {
        if (nameEl) {
          nameEl.textContent = formData.nombre ? `${formData.nombre}` : '';
        }
        const successModal = bootstrap.Modal.getOrCreateInstance(modalEl);
        successModal.show();
      }

      statusEl.textContent = '✅ ¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.';
      statusEl.className = 'text-success';
      form.reset();
      form.classList.remove('was-validated');
      updateRateLimitUI();
    } catch (error) {
      console.warn('EmailJS respondió con error, usando fallback mailto:', error);
      sendViaMailto(formData, statusEl);
    } finally {
      submitBtn.disabled = false;
      submitText.textContent = 'Enviar Mensaje';
    }
  }

  /**
   * Fallback: abre mailto: en el cliente de correo del usuario.
   */
  function sendViaMailto(formData, statusEl) {
    const mailtoLink = buildMailtoLink(formData);
    window.location.href = mailtoLink;
    statusEl.innerHTML = '📧 Se abrió tu cliente de correo. Si no se abrió, <a href="' + mailtoLink + '" class="text-warning text-decoration-underline">hacé clic acá</a>.';
    statusEl.className = 'text-warning';
  }

  /**
   * Actualiza la UI según el estado del rate limiter.
   */
  function updateRateLimitUI() {
    const rateLimitNotice = document.getElementById('rate-limit-notice');
    if (!rateLimitNotice) return;

    const remaining = RateLimiter.remaining();

    if (remaining <= 0) {
      rateLimitNotice.textContent = '📋 Se alcanzó el límite diario de envíos automáticos. Tu consulta se enviará abriendo tu cliente de correo electrónico.';
      rateLimitNotice.classList.add('show');
    } else if (remaining === 1) {
      rateLimitNotice.textContent = `📋 Te queda ${remaining} envío automático disponible hoy.`;
      rateLimitNotice.classList.add('show');
    } else {
      rateLimitNotice.classList.remove('show');
    }
  }

  /* ------------------------------------------
     WhatsApp Buttons — Bind Events
     ------------------------------------------ */
  function initWhatsAppButtons() {
    document.querySelectorAll('[data-whatsapp]').forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        const type = this.getAttribute('data-whatsapp');
        const url = generateWhatsAppLink(type);
        window.open(url, '_blank');
      });
    });

    // Botón flotante
    const floatingBtn = document.getElementById('whatsapp-float');
    if (floatingBtn) {
      floatingBtn.href = generateWhatsAppLink('default');
    }
  }

  /* ------------------------------------------
     Navbar Scroll Effect
     ------------------------------------------ */
  function initNavbarScroll() {
    const navbar = document.getElementById('main-navbar');
    if (!navbar) return;

    function handleScroll() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check on load
  }

  /* ------------------------------------------
     Active Nav Link Updater (scroll spy)
     ------------------------------------------ */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

    if (!sections.length || !navLinks.length) return;

    function updateActiveLink() {
      const scrollPos = window.scrollY + 120;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ------------------------------------------
     Close Mobile Nav on Link Click
     ------------------------------------------ */
  function initMobileNavClose() {
    const navCollapse = document.getElementById('navbarNav');
    if (!navCollapse) return;

    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      });
    });
  }

  /* ------------------------------------------
     AOS Init
     ------------------------------------------ */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        disable: 'mobile', // Desactiva en mobile para rendimiento
      });
    }
  }

  /* ------------------------------------------
     Counter Animation (for stats)
     ------------------------------------------ */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  function animateCounter(element, target) {
    const duration = 1500;
    const start = performance.now();
    const initial = 0;

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      // Easing: ease-out-cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(initial + (target - initial) * easedProgress);

      element.textContent = current + (element.dataset.suffix || '');

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* ------------------------------------------
     Initialize Everything on DOM Ready
     ------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    initNavbarScroll();
    initScrollSpy();
    initMobileNavClose();
    initWhatsAppButtons();
    initContactForm();
    initCounters();
    initAOS();
  });

})();
