import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import crypto from "crypto";
import { google } from "googleapis";
//#region src/pages/api/confirmar.ts
var confirmar_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	try {
		const token = (await request.formData()).get("token")?.toString();
		if (!token) return new Response("Token no proporcionado", { status: 400 });
		const FLOW_API_URL = "https://sandbox.flow.cl/api";
		const FLOW_API_KEY = "21FC00D1-1818-426A-8992-8347F600LC0E";
		const FLOW_SECRET_KEY = "733a03b3b69de5cd9b7b4239cddd52e6778350e9";
		const params = new URLSearchParams({
			apiKey: FLOW_API_KEY,
			token
		});
		const keys = Array.from(params.keys()).sort();
		let stringToSign = "";
		keys.forEach((key) => {
			stringToSign += key + params.get(key);
		});
		const signature = crypto.createHmac("sha256", FLOW_SECRET_KEY).update(stringToSign).digest("hex");
		params.append("s", signature);
		const flowData = await (await fetch(`${FLOW_API_URL}/payment/getStatus?${params.toString()}`)).json();
		if (flowData.status === 2) {
			const { startDateTime, name } = JSON.parse(flowData.optional || "{}");
			const email = flowData.payer;
			const GOOGLE_CLIENT_EMAIL = "tu-service-account@tu-proyecto.iam.gserviceaccount.com";
			const GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIICdQIBADANBgk...\n-----END PRIVATE KEY-----\n".replace(/\\n/g, "\n");
			const GOOGLE_CALENDAR_ID = "correo_del_psicologo@gmail.com";
			if (!GOOGLE_PRIVATE_KEY || false) {
				console.error("Credenciales de Google incompletas. Pago procesado pero calendario no actualizado.");
				return new Response("OK", { status: 200 });
			}
			const jwtClient = new google.auth.JWT(GOOGLE_CLIENT_EMAIL, void 0, GOOGLE_PRIVATE_KEY, ["https://www.googleapis.com/auth/calendar.events"]);
			const calendar = google.calendar({
				version: "v3",
				auth: jwtClient
			});
			const startDate = new Date(startDateTime);
			const endDate = new Date(startDate.getTime() + 3600 * 1e3);
			await calendar.events.insert({
				calendarId: GOOGLE_CALENDAR_ID,
				conferenceDataVersion: 1,
				sendUpdates: "all",
				requestBody: {
					summary: `Consulta Psicológica - ${name}`,
					description: `Paciente: ${name}
Correo: ${email}
Pagado vía Flow.cl (Orden: ${flowData.commerceOrder})`,
					start: { dateTime: startDate.toISOString() },
					end: { dateTime: endDate.toISOString() },
					attendees: [{ email }],
					conferenceData: { createRequest: {
						requestId: `meet-${Date.now()}`,
						conferenceSolutionKey: { type: "hangoutsMeet" }
					} }
				}
			});
			console.log("Evento de Google Calendar creado con éxito.");
		}
		return new Response("OK", { status: 200 });
	} catch (error) {
		console.error("Error en webhook de Flow:", error);
		return new Response("Error", { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/confirmar@_@ts
var page = () => confirmar_exports;
//#endregion
export { page };
