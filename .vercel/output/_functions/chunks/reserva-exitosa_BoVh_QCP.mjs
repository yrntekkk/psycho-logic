import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { S as createComponent, i as renderComponent, m as maybeRenderHead, u as renderTemplate } from "./server_D0sAaBMA.mjs";
import "./compiler_bqGEvU-1.mjs";
import { n as $$Navbar, r as $$BaseLayout, t as $$Footer } from "./Footer_BmYD9nFX.mjs";
//#region src/pages/reserva-exitosa.astro
var reserva_exitosa_exports = /* @__PURE__ */ __exportAll({
	default: () => $$ReservaExitosa,
	file: () => $$file,
	url: () => $$url
});
var $$ReservaExitosa = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Reserva Exitosa | Psycho-logic",
		"description": "Tu cita ha sido agendada con éxito."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Navbar", $$Navbar, {})}${maybeRenderHead($$result)}<main class="min-h-screen pt-32 pb-20 relative overflow-hidden flex flex-col items-center justify-center"><div class="container mx-auto px-6 max-w-2xl relative z-10 w-full flex-grow flex flex-col items-center justify-center text-center"><div class="bg-white/40 backdrop-blur-md rounded-3xl shadow-lg border border-white/40 p-8 md:p-12 w-full"><div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"><svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div><h1 class="text-3xl md:text-4xl font-semibold text-foreground mb-4 tracking-tight">¡Reserva Confirmada!</h1><p class="text-zinc-600 text-lg mb-6">Hemos recibido tu pago con éxito. Te hemos enviado un correo electrónico con la invitación al evento y el enlace seguro de <strong>Google Meet</strong> para tu sesión.</p><div class="mt-8"><a href="/" class="inline-flex items-center justify-center px-8 py-3 text-base font-medium transition-all duration-200 rounded-2xl bg-primary text-primary-foreground hover:bg-primary-hover shadow-md hover:shadow-lg">Volver al Inicio</a></div></div></div></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "C:/Users/yrntekkk/Documents/GitHub/psycho-logic/src/pages/reserva-exitosa.astro", void 0);
var $$file = "C:/Users/yrntekkk/Documents/GitHub/psycho-logic/src/pages/reserva-exitosa.astro";
var $$url = "/reserva-exitosa";
//#endregion
//#region \0virtual:astro:page:src/pages/reserva-exitosa@_@astro
var page = () => reserva_exitosa_exports;
//#endregion
export { page };
