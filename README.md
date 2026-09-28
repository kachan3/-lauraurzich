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

## Configuración de Dominio y Certificado SSL (HTTPS)

Para que el dominio `lauraurzich.com.ar` funcione con el candado verde/gris de **Sitio Seguro (HTTPS)** en GitHub Pages:

### 1. En el proveedor de DNS (NIC.ar / Cloudflare / DonWeb / etc.):
Configurar los siguientes registros DNS para `lauraurzich.com.ar`:

- **Registros A (para el dominio raíz `lauraurzich.com.ar`):**
  - Host: `@` (o en blanco) → `185.199.108.153`
  - Host: `@` (o en blanco) → `185.199.109.153`
  - Host: `@` (o en blanco) → `185.199.110.153`
  - Host: `@` (o en blanco) → `185.199.111.153`

- **Registro CNAME (para el subdominio `www.lauraurzich.com.ar`):**
  - Host: `www` → `<tu-usuario-o-organizacion>.github.io`

### 2. En GitHub Pages (Repositorio):
1. Ir a **Settings** → pestaña **Pages**.
2. En **Custom domain**, verificar que figure `lauraurzich.com.ar`.
3. Tildar la casilla **"Enforce HTTPS"** (Forzar HTTPS). *Nota: si recién apuntaste las DNS, puede demorar entre 15 minutos y un par de horas en emitirse el certificado TLS gratuito de Let's Encrypt para habilitar el checkbox.*

Una vez activado, cualquier persona que entre a `http://lauraurzich.com.ar` o `http://www.lauraurzich.com.ar` será redirigida automáticamente a `https://` con conexión cifrada y segura.

## Estado del Proyecto
- [x] Datos de contacto reales integrados
- [x] Logos oficiales de aseguradoras (tarjetas 16:9 full-bleed uniformes)
- [x] Código QR oficial SSN integrado y vinculado a REPAS
- [x] Foto profesional de Laura Urzich integrada en el Hero
- [x] Paleta de colores oficial aplicada
- [x] CNAME configurado para `lauraurzich.com.ar`
- [x] Políticas de seguridad CSP y forzado de HTTPS
- [ ] ID de Formspree en `js/main.js` (pendiente asignar por la clienta)

## Licencia

Proyecto privado. Todos los derechos reservados.
