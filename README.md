<div align="center">
  <h1>🧠 PSYCHOLOGIC</h1>
  <p><strong>Sistema de Agendamiento Clínico Customizado & Automatizado</strong></p>
  
  ![Astro](https://img.shields.io/badge/Astro-0C1120?style=for-the-badge&logo=astro&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Google Calendar API](https://img.shields.io/badge/Google_Calendar-4285F4?style=for-the-badge&logo=google-calendar&logoColor=white)
</div>

---

> **No más iframes genéricos ni mensualidades.** Esta plataforma web fue construida desde cero para gestionar reservas de consultas psicológicas con un flujo de usuario impecable. Integra pagos directos vía Webpay y automatiza la creación de citas y enlaces de videollamada sin intervención manual. 🚀

## ⚡ Arquitectura y Tech Stack

*   🌌 **Frontend SSR:** Construido con [Astro](https://astro.build/) para máxima velocidad.
*   🎨 **UI/UX:** Diseño interactivo con *Glassmorphism* usando Tailwind CSS.
*   💸 **Pasarela de Pagos:** Integración nativa con la API REST de [Flow.cl](https://www.flow.cl).
*   📅 **Automatización Core:** Google Calendar API (vía Service Account) para agendamiento y creación de Google Meet.

## 📁 Estructura del Código

La magia ocurre en estos directorios principales:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── BookingCalendar.astro   # UI del calendario y lógica de estado del paciente
│   ├── layouts/
│   │   └── Layout.astro            # Wrapper global
│   └── pages/
│       ├── agendar.astro           # Vista principal de reservas
│       └── api/
│           ├── crear-pago.ts       # POST: Firma de datos y conexión con API Flow
│           └── confirmar.ts        # GET/POST (Webhook): Validación, G. Calendar y Meet
├── .env                            # Keys de seguridad (Ignorado en git)
└── package.json
