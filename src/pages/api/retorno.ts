import type { APIRoute } from 'astro';
import crypto from 'crypto';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    const token = formData.get('token')?.toString();

    if (!token) {
      return redirect('/agendar?error=token_invalido', 302);
    }

    const FLOW_API_URL = import.meta.env.FLOW_API_URL || process.env.FLOW_API_URL;
    const FLOW_API_KEY = import.meta.env.FLOW_API_KEY || process.env.FLOW_API_KEY;
    const FLOW_SECRET_KEY = import.meta.env.FLOW_SECRET_KEY || process.env.FLOW_SECRET_KEY;

    if (!FLOW_API_URL || !FLOW_API_KEY || !FLOW_SECRET_KEY) {
      return redirect('/agendar?error=configuracion_flow', 302);
    }

    // Consultar estado del pago en Flow
    const params = new URLSearchParams({ apiKey: FLOW_API_KEY, token });
    const keys = Array.from(params.keys()).sort();
    let stringToSign = '';
    keys.forEach(key => { stringToSign += key + params.get(key); });
    
    const signature = crypto.createHmac('sha256', FLOW_SECRET_KEY).update(stringToSign).digest('hex');
    params.append('s', signature);

    const flowRes = await fetch(`${FLOW_API_URL}/payment/getStatus?${params.toString()}`);
    const flowData = await flowRes.json();

    if (flowData.status === 2) { // 2 = Pagado
      return redirect('/reserva-exitosa', 302);
    } else {
      // status 3: Rechazado, 4: Anulado, etc.
      return redirect('/agendar?error=pago_rechazado', 302);
    }
  } catch (error) {
    console.error('Error en retorno de Flow:', error);
    return redirect('/agendar?error=error_servidor', 302);
  }
};

export const GET: APIRoute = async ({ redirect }) => {
  return redirect('/agendar', 302);
};
