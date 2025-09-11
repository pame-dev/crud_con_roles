// src/api/turnosApi.js
export async function fetchHistorialTurnos(params, options = {}) {
  const url = new URL("http://127.0.0.1:8000/api/turnos/historial"); // cambia si usas otro host
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const res = await fetch(url, { ...options });
  if (!res.ok) throw new Error("Error al obtener historial");
  return res.json();
}

export async function fetchFilaActual(options = {}) {
  const res = await fetch("http://127.0.0.1:8000/api/turnos/fila", options);
  if (!res.ok) throw new Error("Error al obtener fila actual");
  return res.json();
}

