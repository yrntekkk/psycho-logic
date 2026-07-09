import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import crypto from "crypto";
//#region src/pages/api/checkout.ts
var checkout_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	try {
		const { name, email, startDateTime } = await request.json();
		const FLOW_API_URL = "https://sandbox.flow.cl/api";
		const FLOW_API_KEY = "21FC00D1-1818-426A-8992-8347F600LC0E";
		const FLOW_SECRET_KEY = "733a03b3b69de5cd9b7b4239cddd52e6778350e9";
		const PUBLIC_SITE_URL = "http://localhost:4321";
		const optionalData = JSON.stringify({
			startDateTime,
			name
		});
		const params = new URLSearchParams({
			apiKey: FLOW_API_KEY,
			commerceOrder: `ORD-${Date.now()}`,
			subject: "Reserva Sesión Psicológica",
			currency: "CLP",
			amount: "18000",
			email,
			urlConfirmation: `${PUBLIC_SITE_URL}/api/confirmar`,
			urlReturn: `${PUBLIC_SITE_URL}/api/retorno`,
			optional: optionalData
		});
		const keys = Array.from(params.keys()).sort();
		let stringToSign = "";
		keys.forEach((key) => {
			stringToSign += key + params.get(key);
		});
		const signature = crypto.createHmac("sha256", FLOW_SECRET_KEY).update(stringToSign).digest("hex");
		params.append("s", signature);
		const flowData = await (await fetch(`${FLOW_API_URL}/payment/create`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: params.toString()
		})).json();
		if (flowData.url) return new Response(JSON.stringify({ url: `${flowData.url}?token=${flowData.token}` }), { status: 200 });
		else {
			console.error("Error de Flow:", flowData);
			return new Response(JSON.stringify({ error: flowData.message || "Error en pasarela de pago" }), { status: 400 });
		}
	} catch (error) {
		console.error(error);
		return new Response(JSON.stringify({ error: "Error interno del servidor" }), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/checkout@_@ts
var page = () => checkout_exports;
//#endregion
export { page };
