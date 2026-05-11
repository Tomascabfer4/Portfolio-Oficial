# K1D T0M1 Portfolio (Vue)

Portfolio profesional de Tomás Cabello (marca `K1D T0M1`) construido con Vue 3 + Vite.

Este proyecto incluye:

- Landing personal bilingue (ES/EN) con animaciones y navegacion one-page.
- Casos de trabajo destacados con enfoque problema/solucion/resultado.
- Explorador de repositorios GitHub con cache local, filtros y paginacion.
- Chat IA en modal flotante, conectado a un Worker externo (Cloudflare Workers + Gemini).
- CTAs directas a WhatsApp y email desde varios puntos de la UI.

---

## 1) Stack tecnico

- **Frontend:** Vue 3 (`script setup`) + Vite.
- **Animaciones:** GSAP (`ScrollTrigger`) + Lenis (smooth scroll).
- **Estilos:** CSS plano en `src/style.css`.
- **Datos de contenido:** ficheros JS (`src/content.js`, `src/chatContent.js`, `src/data.js`).
- **Integracion IA:** HTTP `fetch` contra `VITE_CHAT_API_URL`.

Dependencias principales (segun `package.json`):

- `vue`
- `gsap`
- `lenis`

---

## 2) Estructura del proyecto

```txt
portfolio-vue/
├─ src/
│  ├─ App.vue                         # Orquestacion principal de la SPA
│  ├─ main.js
│  ├─ style.css
│  ├─ content.js                      # Copy general ES/EN del portfolio
│  ├─ chatContent.js                  # Copy ES/EN del chat y errores
│  ├─ data.js                         # Casos, skills, timeline y fallback repos
│  ├─ portfolioChatContext.js         # Contexto estructurado que se manda al chat
│  ├─ composables/
│  │  ├─ useGithubRepos.js            # Carga GitHub + cache + fallback
│  │  └─ useLenis.js                  # Inicializacion/cleanup de Lenis
│  └─ components/
│     ├─ HeroSection.vue
│     ├─ ProjectsCases.vue
│     ├─ ReposExplorer.vue
│     ├─ SkillsGrid.vue
│     ├─ TimelineHorizontal.vue
│     ├─ MusicSection.vue
│     ├─ FloatingContactStack.vue
│     └─ PortfolioChatModal.vue
├─ .env.example
├─ vite.config.js
└─ package.json
```

---

## 3) Requisitos

- Node.js 20+ recomendado.
- npm 10+.

---

## 4) Instalacion y desarrollo

```bash
npm install
npm run dev
```

Scripts disponibles:

```bash
npm run dev      # servidor local Vite
npm run build    # build de produccion
npm run preview  # preview local del build
```

---

## 5) Variables de entorno

Archivo base:

```env
VITE_CHAT_API_URL=Direccion al worker
```

Uso recomendado en local:

```env
VITE_CHAT_API_URL=http://127.0.0.1:8787/chat
```

Uso recomendado en produccion:

```env
VITE_CHAT_API_URL=https://worker-portfolio-oficial.<tu-subdominio>.workers.dev/chat
```

Notas:

- Si defines una URL base sin path (por ejemplo `https://...workers.dev`), el frontend intenta normalizarla a `/chat`.
- Si `VITE_CHAT_API_URL` esta vacia, el modal funciona en modo "sin backend": muestra mensaje de estado y deriva a WhatsApp/email.

---

## 6) Arquitectura funcional del frontend

### App principal (`src/App.vue`)

Gestiona:

- Idioma activo (`es`/`en`) persistido en `localStorage`.
- Estado del menu mobile, seccion activa y visibilidad de nav al hacer scroll.
- Apertura/cierre de modal de chat.
- Carga de repositorios GitHub via composable.
- Inicializacion de Lenis y animaciones GSAP.

### Contenido y traducciones

- `src/content.js`: textos de secciones generales (hero, casos, skills, timeline, contacto, etc.).
- `src/chatContent.js`: textos del chat, prompts iniciales y mensajes de error por codigo.

### Repositorios GitHub

`src/composables/useGithubRepos.js`:

- Consulta API publica:
  - `https://api.github.com/users/Tomascabfer4/repos?sort=updated&per_page=100`
- Cachea en `localStorage` (`portfolio-repos-cache`) con TTL de 30 minutos.
- Si falla la API, usa `fallbackRepos` desde `src/data.js`.

### Chat IA (frontend)

`src/components/PortfolioChatModal.vue`:

- Construye historico de mensajes `user/assistant`.
- Envia `POST` al endpoint de `VITE_CHAT_API_URL`.
- Incluye:
  - `locale` (idioma del documento),
  - `messages` (historial normalizado),
  - `context` (salida de `createPortfolioChatContext`).
- Si hay error de backend, muestra copy amigable segun el codigo de error.
- Si no hay backend, muestra `emptyState` y CTAs alternativas.

---

## 7) Integracion con chat-api (repo externo)

El backend del chat vive en:

`D:\Escritorio_Compartido\APPS\worker_chat_api_portfolios`

### Resumen del worker analizado

- Runtime: Cloudflare Workers.
- Entrada principal: `src/index.js`.
- Provider IA actual: Gemini (`generateContent`).
- CORS abierto para web (`Access-Control-Allow-Origin: *`).

### Endpoints expuestos por el worker

- `POST /chat` (principal)
- `POST /` (alias aceptado por backend)
- `GET /chat` y `GET /health` (health/info)

### Contrato de request esperado por `POST /chat`

```json
{
  "source": "floating_button",
  "locale": "es",
  "messages": [
    { "role": "user", "content": "Hola" },
    { "role": "assistant", "content": "..." }
  ],
  "context": {
    "identity": {},
    "projects": [],
    "skills": [],
    "timeline": [],
    "creative": {},
    "contact": {}
  }
}
```

### Respuesta esperada

```json
{
  "reply": "Texto generado por el modelo"
}
```

### Errores relevantes mapeados en frontend

- `provider_auth_failed`
- `provider_model_not_found`
- `provider_rate_limited`
- `bad_provider_request`
- fallback generico: `chat_failed`

Estos codigos se traducen en `src/chatContent.js` para ES y EN.

---

## 8) Contexto que se envia al modelo

`src/portfolioChatContext.js` construye un contexto rico con:

- identidad profesional (marca, nombre, rol, resumen),
- casos de proyecto con problema/solucion/resultado,
- grupos de skills,
- timeline profesional,
- enlace de lado creativo (DJ),
- datos de contacto (email + redes).

El worker utiliza este contexto para generar respuestas mas situadas y utiles.

---

## 9) Accesibilidad y UX

- Respeta `prefers-reduced-motion` para reducir animaciones.
- Navegacion con teclado para cierre de modal (`Escape`) y envio (`Enter` sin `Shift`).
- Mensajes de estado en chat (`thinking`, errores, fallback).

---

## 10) Despliegue

Frontend (este repo):

1. Configura `VITE_CHAT_API_URL` en entorno de build.
2. Ejecuta `npm run build`.
3. Publica `dist/` en tu plataforma (Cloudflare Pages, Vercel, Netlify, etc.).

Backend (repo worker):

1. Configura secretos Gemini (`GEMINI_API_KEY`) con Wrangler.
2. Ajusta `GEMINI_MODEL` y `GEMINI_API_BASE_URL` si aplica.
3. Ejecuta `npm run deploy` en `worker_chat_api_portfolios`.

---

## 11) Troubleshooting rapido

- **El chat muestra "sin configurar":**
  - revisa que `VITE_CHAT_API_URL` exista y sea accesible.
- **Responde con errores de provider:**
  - revisa `GEMINI_API_KEY`/`GEMINI_MODEL` en el worker.
- **No cargan repos de GitHub:**
  - puede ser rate limit o fallo temporal; se usara fallback local automaticamente.
- **Scroll/animaciones raras en desarrollo:**
  - valida que no haya dobles inicializaciones y recarga limpia del navegador.

---

## 12) Roadmap sugerido

- Rate limiting y anti-abuso en el worker.
- Telemetria basica de prompts/errores (sin almacenar datos sensibles).
- Tests de contrato frontend-backend para el payload de chat.
- Ajuste fino de prompt system para separar mejor modo portfolio vs modo DJ.
