// src/api/turnosApi.js
import API_URL from "./config";

export async function fetchHistorialTurnos(params, options = {}) {
  const url = new URL(`${API_URL}/turnos/historial`);
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const res = await fetch(url, { ...options });
  if (!res.ok) throw new Error("Error al obtener historial");
  return res.json();
}

export async function fetchFilaActual(options = {}) {
  const res = await fetch(`${API_URL}/turnos/fila`, options);
  if (!res.ok) throw new Error("Error al obtener fila actual");
  return res.json();
}


export async function pasarTurno(empleadoId, cargo, options = {}) {
  const res = await fetch(`${API_URL}/turnos/pasar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ empleado_id: empleadoId, cargo }),
    ...options,
  });

  if (!res.ok) throw new Error("Error al pasar turno");
  return res.json();
}

export async function fetchTurnoEnAtencion(options = {}) {
  const res = await fetch(`${API_URL}/turnos/en_atencion`, options);
  if (!res.ok) throw new Error("Error al obtener turno en atención");
  return res.json();
}


