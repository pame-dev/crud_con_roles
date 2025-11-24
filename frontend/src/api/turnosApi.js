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

  // Intentar parsear la respuesta JSON primero
  let data;
  try {
    data = await res.json();
  } catch (err) {
    // Si no hay JSON, lanzar error genérico
    if (!res.ok) throw new Error("Error al pasar turno");
    return {};
  }

  // Si la respuesta no es OK, verificar si es por falta de turnos
  if (!res.ok) {
    // Si el servidor devuelve un mensaje específico
    if (data && data.message) {
      const mensaje = data.message.toLowerCase();
      if (mensaje.includes("no hay turnos") || 
          mensaje.includes("sin turnos") || 
          mensaje.includes("pendientes")) {
        // Retornar el objeto con el mensaje en lugar de lanzar error
        return { success: false, message: data.message };
      }
    }
    
    // Si es otro tipo de error, lanzarlo
    throw new Error(data.message || "Error al pasar turno");
  }

  // Si todo está bien, retornar los datos
  return data;
}

export async function fetchTurnoEnAtencion(options = {}) {
  const res = await fetch(`${API_URL}/turnos/en_atencion`, options);
  if (!res.ok) throw new Error("Error al obtener turno en atención");
  return res.json();
}


