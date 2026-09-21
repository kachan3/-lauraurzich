# Página Web — Productora Asesora de Seguros

Sitio web estático institucional para productora de seguros. 100% frontend, hosteado en GitHub Pages.

## Stack Tecnológico

| Tecnología | Propósito |
|---|---|
| HTML5 + CSS3 | Estructura y estilos |
| Bootstrap 5.3 | Framework CSS responsive (CDN) |
| Bootstrap Icons | Iconografía (CDN) |
| JavaScript ES6+ | Interactividad (vanilla, sin frameworks) |
| AOS.js | Animaciones on-scroll (CDN) |
| Formspree | Envío de formularios por email (plan gratuito) |

## Estructura del Proyecto

```
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos personalizados
├── js/
│   └── main.js         # Lógica JavaScript
├── img/                # Imágenes (logos, QR, fotos)
├── CNAME               # Dominio personalizado
└── README.md           # Este archivo
```

## Desarrollo Local

1. Clonar el repositorio
2. Abrir `index.html` en un navegador (no requiere servidor)
3. Para live-reload, usar extensión "Live Server" de VS Code

## Deploy en GitHub Pages

1. Crear repositorio en GitHub
2. Subir los archivos
3. Ir a Settings → Pages → Source: `main` branch → `/` (root)
4. Configurar dominio personalizado en CNAME y DNS del proveedor

## Configuración

### Formspree (Formulario de Contacto)
1. Crear cuenta gratuita en [formspree.io](https://formspree.io)
2. Crear nuevo formulario
3. Copiar el Form ID
4. Reemplazar `YOUR_FORM_ID` en `js/main.js` → `CONFIG.formspreeEndpoint`

### WhatsApp
- Actualizar `CONFIG.whatsappNumber` en `js/main.js` con el número real (con código de país, sin + ni espacios)

### Sistema Anti-Spam
El sitio implementa un rate limiter client-side con localStorage:
- Máximo 2 envíos por Formspree por día por navegador
- Si se supera el límite, el formulario abre automáticamente el cliente de correo del usuario (mailto:)
- Si Formspree falla por cualquier razón (cuota, red), también se activa el fallback a mailto

## Placeholders Pendientes
- [ ] Datos de contacto reales (teléfono, email, dirección)
- [ ] Logos de compañías aseguradoras
- [ ] Imagen QR de matrícula
- [ ] Foto profesional
- [ ] Paleta de colores de las tarjetas de presentación
- [ ] Nombre del dominio .com.ar
- [ ] ID de Formspree

## Licencia

Proyecto privado. Todos los derechos reservados.
