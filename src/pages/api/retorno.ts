import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ redirect }) => {
  // Flow envía un POST con el token a la urlReturn.
  // Como Astro bloquea POSTs directos a páginas .astro a menos que se manejen,
  // atrapamos el POST aquí y redirigimos al usuario a la página de éxito usando GET.
  return redirect('/reserva-exitosa', 302);
};

export const GET: APIRoute = async ({ redirect }) => {
  return redirect('/reserva-exitosa', 302);
};
