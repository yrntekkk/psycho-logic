import type { APIRoute } from 'astro';
import crypto from 'crypto';
import { google } from 'googleapis';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const token = formData.get('token')?.toString();

    if (!token) {
      return new Response('Token no proporcionado', { status: 400 });
    }

    const FLOW_API_URL = import.meta.env.FLOW_API_URL || process.env.FLOW_API_URL;
    const FLOW_API_KEY = import.meta.env.FLOW_API_KEY || process.env.FLOW_API_KEY;
    const FLOW_SECRET_KEY = import.meta.env.FLOW_SECRET_KEY || process.env.FLOW_SECRET_KEY;

    if (!FLOW_API_URL || !FLOW_API_KEY || !FLOW_SECRET_KEY) {
      console.error('Configuración de Flow incompleta');
      return new Response('Error', { status: 500 });
    }

    // 1. Consultar estado del pago en Flow
    const params = new URLSearchParams({ apiKey: FLOW_API_KEY, token });
    const keys = Array.from(params.keys()).sort();
    let stringToSign = '';
    keys.forEach(key => { stringToSign += key + params.get(key); });
    
    const signature = crypto.createHmac('sha256', FLOW_SECRET_KEY).update(stringToSign).digest('hex');
    params.append('s', signature);

    const flowRes = await fetch(`${FLOW_API_URL}/payment/getStatus?${params.toString()}`);
    const flowData = await flowRes.json();

    if (flowData.status === 2) { // 2 = Pagado
      // Extraemos la metadata con seguridad
      let startDateTime = '';
      let name = 'Paciente';
      try {
        const optionalData = JSON.parse(flowData.optional || '{}');
        startDateTime = optionalData.startDateTime;
        name = optionalData.name || 'Paciente';
      } catch (e) {
        console.error('Error parseando optionalData:', e);
      }
      
      const email = flowData.payer; 

      // 2. Integrar con Google Calendar
      const GOOGLE_CLIENT_EMAIL = import.meta.env.GOOGLE_CLIENT_EMAIL || process.env.GOOGLE_CLIENT_EMAIL;
      const GOOGLE_PRIVATE_KEY = (import.meta.env.GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
      const GOOGLE_CALENDAR_ID = import.meta.env.GOOGLE_CALENDAR_ID || process.env.GOOGLE_CALENDAR_ID;

      if (!GOOGLE_CLIENT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
        console.error('Credenciales de Google incompletas. Pago procesado pero calendario no actualizado.');
      } else if (startDateTime) {
        try {
          const jwtClient = new google.auth.JWT(
            GOOGLE_CLIENT_EMAIL,
            undefined,
            GOOGLE_PRIVATE_KEY,
            ['https://www.googleapis.com/auth/calendar.events']
          );

          const calendar = google.calendar({ version: 'v3', auth: jwtClient });

          // Calcular la fecha de término (1 hora de duración)
          const startDate = new Date(startDateTime);
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

          await calendar.events.insert({
            calendarId: GOOGLE_CALENDAR_ID,
            conferenceDataVersion: 1, // Crucial para crear enlace de Google Meet
            sendUpdates: 'all', // Obliga a Google a enviar el correo al paciente
            requestBody: {
              summary: `Consulta Psicológica - ${name}`,
              description: `Paciente: ${name}\nCorreo: ${email}\nPagado vía Flow.cl (Orden: ${flowData.commerceOrder})`,
              start: { dateTime: startDate.toISOString() },
              end: { dateTime: endDate.toISOString() },
              attendees: [{ email: email }],
              conferenceData: {
                createRequest: {
                  requestId: `meet-${Date.now()}`,
                  conferenceSolutionKey: { type: 'hangoutsMeet' }
                }
              }
            }
          });
          console.log('Evento de Google Calendar creado con éxito.');
        } catch (calendarError) {
          console.error('Error al crear evento en Google Calendar:', calendarError);
          // Importante: No lanzamos el error para que Flow reciba el status 200 OK
        }
      }
    }

    // A Flow siempre hay que responderle HTTP 200 si se recibe el webhook correctamente.
    return new Response('OK', { status: 200 });

  } catch (error) {
    console.error('Error fatal en webhook de Flow:', error);
    // Retornamos 200 incluso en errores generales para evitar que Flow envíe correos de alerta al paciente asustándolo,
    // ya que si llegó aquí es porque Flow SÍ hizo el cobro.
    return new Response('OK', { status: 200 });
  }
};
