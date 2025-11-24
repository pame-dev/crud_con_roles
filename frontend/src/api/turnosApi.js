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
  console.log("🔵 pasarTurno - Enviando petición con:", { empleadoId, cargo });
  
  const res = await fetch(`${API_URL}/turnos/pasar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ empleado_id: empleadoId, cargo }),
    ...options,
  });

  console.log("🔵 pasarTurno - Status de respuesta:", res.status, res.statusText);

  // Intentar parsear la respuesta JSON primero
  let data;
  try {
    const textResponse = await res.text();
    console.log("🔵 pasarTurno - Respuesta en texto:", textResponse);
    
    data = textResponse ? JSON.parse(textResponse) : {};
    console.log("🔵 pasarTurno - Respuesta parseada:", data);
  } catch (err) {
    console.error("🔴 pasarTurno - Error al parsear JSON:", err);
    // Si no hay JSON, lanzar error genérico
    if (!res.ok) throw new Error("Error al pasar turno");
    return {};
  }

  // Si la respuesta no es OK, verificar si es por falta de turnos
  if (!res.ok) {
    console.log("🔵 pasarTurno - Respuesta no OK, verificando mensaje...");
    
    // Si el servidor devuelve un mensaje específico
    if (data && data.message) {
      const mensaje = data.message.toLowerCase();
      console.log("🔵 pasarTurno - Mensaje del servidor:", mensaje);
      
      if (mensaje.includes("no hay turnos") || 
          mensaje.includes("sin turnos") || 
          mensaje.includes("pendientes") ||
          mensaje.includes("no hay más turnos")) {
        console.log("✅ pasarTurno - Detectado: Sin turnos pendientes");
        // Retornar el objeto con el mensaje en lugar de lanzar error
        return { success: false, message: data.message, noTurnos: true };
      }
    }
    
    // Si es otro tipo de error, lanzarlo
    console.log("🔴 pasarTurno - Lanzando error:", data.message || "Error al pasar turno");
    throw new Error(data.message || "Error al pasar turno");
  }

  // Si todo está bien, retornar los datos
  console.log("✅ pasarTurno - Turno pasado exitosamente");
  return data;
}

export async function fetchTurnoEnAtencion(options = {}) {
  const res = await fetch(`${API_URL}/turnos/en_atencion`, options);
  if (!res.ok) throw new Error("Error al obtener turno en atención");
  return res.json();
}