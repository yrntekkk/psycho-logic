# 🧠 Psychologic - Sistema de Agendamiento Clínico

Plataforma web personalizada para agendamiento de consultas psicológicas. Construida con Astro, cuenta con un flujo de reserva customizado, integración de pagos con Webpay (vía Flow.cl) y sincronización automatizada con Google Calendar y Google Meet.

## 🚀 Tecnologías Principales

*   **Framework:** [Astro](https://astro.build)
*   **Estilos:** Tailwind CSS (Glassmorphism UI)
*   **Pasarela de Pagos:** API de [Flow.cl](https://www.flow.cl) (Webpay Plus)
*   **Automatización:** Google Calendar API (Service Account)

## 📁 Estructura del Proyecto

Dentro de este proyecto de Astro, encontrarás la siguiente estructura clave:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── BookingCalendar.astro   # UI del calendario y formulario de paciente
│   ├── layouts/
│   │   └── Layout.astro            # Plantilla base y metadatos
│   └── pages/
│       ├── index.astro             # Landing page / Home
│       ├── agendar.astro           # Página principal de reserva
│       └── api/
│           ├── crear-pago.ts       # Endpoint POST: Conecta con API Flow Sandbox/Prod
│           └── confirmar.ts        # Endpoint Webhook: Valida pago y crea evento en G. Calendar
├── .env                            # Variables de entorno (NO subir a GitHub)
└── package.json
