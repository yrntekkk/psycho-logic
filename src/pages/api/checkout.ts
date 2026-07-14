import type { APIRoute } from 'astro';
import crypto from 'node:crypto';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { name, email, startDateTime } = await request.json();

    const FLOW_API_URL = import.meta.env.FLOW_API_URL || process.env.FLOW_API_URL;
    const FLOW_API_KEY = import.meta.env.FLOW_API_KEY || process.env.FLOW_API_KEY;
    const FLOW_SECRET_KEY = import.meta.env.FLOW_SECRET_KEY || process.env.FLOW_SECRET_KEY;
    const PUBLIC_SITE_URL = import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL || 'http://localhost:4321';

    if (!FLOW_API_URL || !FLOW_API_KEY || !FLOW_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Configuración de Flow incompleta' }), { status: 500 });
    }

    // Guardar información relevante en el order o como metadata
    // Flow soporta un campo 'optional' que puede usarse para guardar datos temporales que luego llegan al webhook
    const optionalData = JSON.stringify({ startDateTime, name });

    const params = new URLSearchParams({
      apiKey: FLOW_API_KEY,
      commerceOrder: `ORD-${Date.now()}`,
      subject: 'Reserva Sesión Psicológica',
      currency: 'CLP',
      amount: '18000',
      email: email,
      urlConfirmation: `${PUBLIC_SITE_URL}/api/confirmar`,
      urlReturn: `${PUBLIC_SITE_URL}/api/retorno`,
      optional: optionalData,
    });

    // Ordenar alfabéticamente para la firma
    const keys = Array.from(params.keys()).sort();
    let stringToSign = '';
    keys.forEach(key => {
      stringToSign += key + params.get(key);
    });

    const signature = crypto.createHmac('sha256', FLOW_SECRET_KEY).update(stringToSign).digest('hex');
    params.append('s', signature);

    // Hacer petición a Flow
    const flowRes = await fetch(`${FLOW_API_URL}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const flowData = await flowRes.json();

    if (flowData.url) {
      // Flow devuelve la base de redirección y un token. Debemos armar la URL final.
      return new Response(JSON.stringify({ url: `${flowData.url}?token=${flowData.token}` }), { status: 200 });
    } else {
      console.error('Error de Flow:', flowData);
      return new Response(JSON.stringify({ error: flowData.message || 'Error en pasarela de pago' }), { status: 400 });
    }

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
};
