<div align="center">
  <h1>🧠 PSYCHOLOGIC</h1>
  <p><strong>Sistema de Agendamiento Clínico Customizado & Automatizado</strong></p>
  
  ![Astro](https://img.shields.io/badge/Astro-0C1120?style=for-the-badge&logo=astro&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Google Calendar API](https://img.shields.io/badge/Google_Calendar-4285F4?style=for-the-badge&logo=google-calendar&logoColor=white)
</div>

---

>  Esta plataforma web fue construida desde cero para gestionar reservas de consultas psicológicas con un flujo de usuario impecable. Integra pagos directos vía Webpay y automatiza la creación de citas y enlaces de videollamada sin intervención manual.

<img width="1853" height="969" alt="image" src="https://github.com/user-attachments/assets/15dff421-ceae-4c13-bc9e-bc2fd3997e02" />

<br />
  <br />

  [![Vercel](https://img.shields.io/badge/🔴_VER_DEMO_EN_VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://psycho-logic-40s01mtxh-tesseron-tech.vercel.app)

  <br />

## Arquitectura y Tech Stack

*   **Frontend SSR:** Construido con Astro para máxima velocidad.
*   **UI/UX:** Diseño interactivo con *Glassmorphism* usando Tailwind CSS.
*   **Pasarela de Pagos:** Integración nativa con la API REST de Flow.cl.
*   **Automatización Core:** Google Calendar API (vía Service Account) para agendamiento y creación de Google Meet.

## 📁 Estructura del Código

La magia ocurre en estos directorios principales:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── BookingCalendar.astro   # UI del calendario y lógica de estado
│   ├── layouts/
│   │   └── Layout.astro            # Wrapper global
│   └── pages/
│       ├── agendar.astro           # Vista principal de reservas
│       └── api/
│           ├── crear-pago.ts       # POST: Firma de datos y conexión con Flow
│           └── confirmar.ts        # Webhook: Validación, G. Calendar y Meet
├── .env                            # Keys de seguridad (Ignorado en git)
└── package.json
```

## 🔐 Configuración de Entorno (.env)

El sistema requiere llaves criptográficas para funcionar. Crea tu archivo `.env` en la raíz del proyecto. 

```env
# Integración Flow (Sandbox o Producción)
FLOW_API_KEY=tu_api_key_aqui
FLOW_SECRET_KEY=tu_secret_key_aqui
FLOW_API_URL=[https://sandbox.flow.cl/api](https://sandbox.flow.cl/api)

# Credenciales Google Cloud (Service Account)
GOOGLE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_LLAVE_AQUI\n-----END PRIVATE KEY-----\n"
```

## Despliegue Local

Clona el repo, instala las dependencias y levanta el servidor:

| Comando | Acción |
| :--- | :--- |
| `npm install` | Instala los paquetes (incluyendo `googleapis`). |
| `npm run dev` | Levanta el servidor de desarrollo en `localhost:4321`. |
| `npm run build` | Compila el proyecto para subirlo a producción (Vercel/Netlify). |

## ⚙️ Flujo del Sistema (Cómo funciona)

1.  **Captura (UI):** El paciente selecciona fecha/bloque e ingresa sus datos. Todo se maneja en el estado reactivo del cliente.
2.  **Creación de Orden:** El backend de Astro (`/api/crear-pago`) recibe los datos, firma la petición con HMAC-SHA256 y obtiene un token de Flow.
3.  **Transacción:** El paciente es redirigido a la pasarela segura de Webpay/Flow.
4.  **Confirmación y Sincronización:** Si el pago es exitoso (`/api/confirmar`), el servidor valida el estado 2 (Pagado) con Flow y dispara la API de Google para inyectar el evento en la agenda primaria, generando un enlace de `hangoutsMeet` automático.
