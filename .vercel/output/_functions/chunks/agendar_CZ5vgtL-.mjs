import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { S as createComponent, i as renderComponent, m as maybeRenderHead, u as renderTemplate, x as createAstro } from "./server_D0sAaBMA.mjs";
import "./compiler_bqGEvU-1.mjs";
import { n as $$Navbar, r as $$BaseLayout, t as $$Footer } from "./Footer_BmYD9nFX.mjs";
import React, { useEffect, useState } from "react";
import { Calendar, ChevronRight, Clock, Mail, User } from "lucide-react";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/components/react/BookingCalendar.tsx
var TIME_SLOTS = [
	"09:00",
	"10:00",
	"11:00",
	"12:00",
	"14:00",
	"15:00",
	"16:00",
	"17:00"
];
var WEEKDAYS = [
	"Dom",
	"Lun",
	"Mar",
	"Mié",
	"Jue",
	"Vie",
	"Sáb"
];
function BookingCalendar() {
	const [currentMonth, setCurrentMonth] = useState(() => {
		const today = /* @__PURE__ */ new Date();
		return new Date(today.getFullYear(), today.getMonth(), 1);
	});
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const interval = setInterval(() => {
			const today = /* @__PURE__ */ new Date();
			const newMonth = new Date(today.getFullYear(), today.getMonth(), 1);
			if (newMonth.getTime() !== currentMonth.getTime()) setCurrentMonth(newMonth);
		}, 1e3 * 60 * 60);
		return () => clearInterval(interval);
	}, [currentMonth]);
	const getDaysInMonth = (monthDate) => {
		const year = monthDate.getFullYear();
		const month = monthDate.getMonth();
		const days = [];
		const date = new Date(year, month, 1);
		while (date.getMonth() === month) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return days;
	};
	const daysInMonth = React.useMemo(() => getDaysInMonth(currentMonth), [currentMonth]);
	const firstDayOfWeek = daysInMonth[0].getDay();
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedDate || !selectedTime || !name || !email) return;
		setLoading(true);
		const startDateTime = `${selectedDate.toISOString().split("T")[0]}T${selectedTime}:00-04:00`;
		try {
			const data = await (await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					email,
					startDateTime
				})
			})).json();
			if (data.url) window.location.href = data.url;
			else alert("Error al iniciar el pago: " + (data.error || "Desconocido"));
		} catch (error) {
			console.error(error);
			alert("Error al conectar con el servidor.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-6 md:p-8 shadow-xl max-w-5xl mx-auto w-full",
		children: /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "grid grid-cols-1 lg:grid-cols-2 gap-10",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "space-y-8",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("h3", {
						className: "text-xl font-medium text-foreground mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Calendar, { className: "w-5 h-5 text-primary" }), "1. Selecciona el Día"]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mb-4 flex items-center justify-center bg-white/20 p-3 rounded-2xl border border-white/30",
						children: /* @__PURE__ */ jsx("span", {
							className: "font-semibold text-zinc-800 capitalize text-lg",
							children: new Intl.DateTimeFormat("es-ES", {
								month: "long",
								year: "numeric"
							}).format(currentMonth)
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "bg-white/30 p-4 rounded-2xl border border-white/40 shadow-inner",
						children: [/* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-7 gap-1 text-center mb-2",
							children: WEEKDAYS.map((day) => /* @__PURE__ */ jsx("div", {
								className: "text-xs font-bold text-zinc-500 tracking-wide uppercase",
								children: day
							}, day))
						}), /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-7 gap-2",
							children: [Array.from({ length: firstDayOfWeek }).map((_, i) => /* @__PURE__ */ jsx("div", {}, `empty-${i}`)), daysInMonth.map((date, i) => {
								const today = /* @__PURE__ */ new Date();
								today.setHours(0, 0, 0, 0);
								const isDisabled = date < today;
								const isSelected = selectedDate?.toDateString() === date.toDateString();
								return /* @__PURE__ */ jsx("button", {
									type: "button",
									disabled: isDisabled,
									onClick: () => {
										setSelectedDate(date);
										setSelectedTime(null);
									},
									className: `aspect-square flex items-center justify-center rounded-xl text-sm transition-all
                        ${isDisabled ? "opacity-40 cursor-not-allowed bg-white/10 text-zinc-400" : "hover:-translate-y-0.5 shadow-sm"}
                        ${isSelected ? "bg-primary text-white font-bold shadow-lg shadow-primary/40 scale-105" : !isDisabled ? "bg-white/60 text-zinc-700 hover:bg-white hover:text-primary font-medium" : ""}`,
									children: date.getDate()
								}, i);
							})]
						})]
					})
				] }), selectedDate && /* @__PURE__ */ jsxs("div", {
					className: "animate-in fade-in slide-in-from-top-4 duration-500",
					children: [/* @__PURE__ */ jsxs("h3", {
						className: "text-xl font-medium text-foreground mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(Clock, { className: "w-5 h-5 text-primary" }), "2. Selecciona la Hora"]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-3 sm:grid-cols-4 gap-3",
						children: TIME_SLOTS.map((time) => {
							return /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setSelectedTime(time),
								className: `py-3 px-3 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5
                        ${selectedTime === time ? "border-primary bg-primary text-white shadow-lg shadow-primary/30 scale-105" : "border-white/50 bg-white/50 text-zinc-700 hover:bg-white/80 shadow-sm"}`,
								children: time
							}, time);
						})
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("h3", {
						className: "text-xl font-medium text-foreground mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ jsx(User, { className: "w-5 h-5 text-primary" }), "3. Tus Datos"]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "space-y-5",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "block text-sm font-medium text-zinc-700 mb-1.5 ml-1",
							children: "Nombre Completo"
						}), /* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx("div", {
								className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
								children: /* @__PURE__ */ jsx(User, { className: "h-5 w-5 text-zinc-400" })
							}), /* @__PURE__ */ jsx("input", {
								type: "text",
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								className: "block w-full pl-11 pr-4 py-3.5 border border-white/50 rounded-2xl bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-zinc-400 text-zinc-800 shadow-inner",
								placeholder: "Ej. María Pérez"
							})]
						})] }), /* @__PURE__ */ jsxs("div", { children: [
							/* @__PURE__ */ jsx("label", {
								className: "block text-sm font-medium text-zinc-700 mb-1.5 ml-1",
								children: "Correo Electrónico"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("div", {
									className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
									children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5 text-zinc-400" })
								}), /* @__PURE__ */ jsx("input", {
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									className: "block w-full pl-11 pr-4 py-3.5 border border-white/50 rounded-2xl bg-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder-zinc-400 text-zinc-800 shadow-inner",
									placeholder: "ejemplo@correo.com"
								})]
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "mt-2 ml-1 text-xs text-zinc-500 flex items-center gap-1",
								children: [/* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-sage-400 inline-block" }), "Recibirás el enlace de Google Meet en este correo."]
							})
						] })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-8 mt-2",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "bg-white/40 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/60 shadow-sm",
								children: [
									/* @__PURE__ */ jsx("h4", {
										className: "font-semibold text-zinc-800 mb-3 text-sm uppercase tracking-wider",
										children: "Resumen de tu reserva"
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-sm text-zinc-600 flex items-center gap-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "bg-white p-1.5 rounded-lg text-primary shadow-sm",
											children: /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4" })
										}), selectedDate ? new Intl.DateTimeFormat("es-ES", { dateStyle: "long" }).format(selectedDate) : "Día no seleccionado"]
									}),
									/* @__PURE__ */ jsxs("p", {
										className: "text-sm text-zinc-600 flex items-center gap-3 mt-3",
										children: [/* @__PURE__ */ jsx("div", {
											className: "bg-white p-1.5 rounded-lg text-primary shadow-sm",
											children: /* @__PURE__ */ jsx(Clock, { className: "w-4 h-4" })
										}), selectedTime ? `${selectedTime} hrs (Hora de Chile)` : "Hora no seleccionada"]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "mt-4 pt-4 border-t border-white/50 flex justify-between items-center",
										children: [/* @__PURE__ */ jsx("span", {
											className: "text-sm font-medium text-zinc-500",
											children: "Valor Consulta"
										}), /* @__PURE__ */ jsxs("span", {
											className: "text-lg font-bold text-zinc-800",
											children: ["$18.000 ", /* @__PURE__ */ jsx("span", {
												className: "text-xs text-zinc-500 font-normal",
												children: "CLP"
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: !selectedDate || !selectedTime || !name || !email || loading,
								className: "w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-white font-medium bg-primary hover:bg-primary-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0",
								children: loading ? "Procesando de forma segura..." : /* @__PURE__ */ jsxs(Fragment$1, { children: ["Pagar de forma segura en Flow", /* @__PURE__ */ jsx(ChevronRight, { className: "w-5 h-5" })] })
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-center mt-4",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-[11px] text-zinc-400 font-medium",
									children: "Conexión cifrada de extremo a extremo"
								})
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/pages/agendar.astro
var agendar_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Agendar,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Agendar = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Agendar;
	const error = Astro.url.searchParams.get("error");
	return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, {
		"title": "Agendar Hora | Psycho-logic",
		"description": "Reserva tu sesión de terapia online. Elige el día y la hora que mejor se adapte a ti."
	}, { "default": ($$result) => renderTemplate`${renderComponent($$result, "Navbar", $$Navbar, {})}${maybeRenderHead($$result)}<main class="min-h-screen pt-32 pb-20 relative overflow-hidden flex flex-col"><div class="container mx-auto px-6 max-w-5xl relative z-10 w-full flex-grow flex flex-col items-center justify-center">${error === "pago_rechazado" && renderTemplate`<div class="w-full max-w-3xl mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-sm"><svg class="w-8 h-8 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg><div><p class="font-bold text-red-800 text-lg">Pago Rechazado o Anulado</p><p class="text-sm mt-0.5">Tu reserva no se pudo confirmar. Por favor, selecciona la fecha nuevamente e intenta con otro método de pago.</p></div></div>`}<div class="text-center mb-10 mt-8"><h1 class="text-3xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">Reserva tu sesión online</h1><p class="text-zinc-600 text-lg max-w-2xl mx-auto">Elige el día y la hora que mejor se adapte a ti.</p></div><div class="w-full mt-4">${renderComponent($$result, "BookingCalendar", BookingCalendar, {
		"client:load": true,
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/yrntekkk/Documents/GitHub/psycho-logic/src/components/react/BookingCalendar.tsx",
		"client:component-export": "default"
	})}</div></div></main>${renderComponent($$result, "Footer", $$Footer, {})}` })}`;
}, "C:/Users/yrntekkk/Documents/GitHub/psycho-logic/src/pages/agendar.astro", void 0);
var $$file = "C:/Users/yrntekkk/Documents/GitHub/psycho-logic/src/pages/agendar.astro";
var $$url = "/agendar";
//#endregion
//#region \0virtual:astro:page:src/pages/agendar@_@astro
var page = () => agendar_exports;
//#endregion
export { page };
