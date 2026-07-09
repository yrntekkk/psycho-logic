import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import crypto from "crypto";
//#region src/pages/api/retorno.ts
var retorno_exports = /* @__PURE__ */ __exportAll({
	GET: () => GET,
	POST: () => POST
});
var POST = async ({ request, redirect }) => {
	try {
		const token = (await request.formData()).get("token")?.toString();
		if (!token) return redirect("/agendar?error=token_invalido", 302);
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
		if ((await (await fetch(`${FLOW_API_URL}/payment/getStatus?${params.toString()}`)).json()).status === 2) return redirect("/reserva-exitosa", 302);
		else return redirect("/agendar?error=pago_rechazado", 302);
	} catch (error) {
		console.error("Error en retorno de Flow:", error);
		return redirect("/agendar?error=error_servidor", 302);
	}
};
var GET = async ({ redirect }) => {
	return redirect("/agendar", 302);
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/retorno@_@ts
var page = () => retorno_exports;
//#endregion
export { page };
