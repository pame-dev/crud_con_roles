// src/services/turnosApi.js

// Se cambia por la API real
const API = import.meta.env.VITE_API_URL || "";

/**
 * Como no hay API devuelve MOCK (para desarrollo).
 */
export async function fetchHistorialTurnos(
  { q = "", estado = "todos", desde = "", hasta = "", page = 1, limit = 12 } = {},
  { signal } = {}
) {
  if (API) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (estado && estado !== "todos") params.set("estado", estado);
    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    params.set("page", String(page));
    params.set("limit", String(limit));

    const res = await fetch(`${API}/api/turnos/historial?${params}`, {
      credentials: "include",
      signal,
    });

    if (!res.ok) {
      let msg = "Error al cargar historial";
      try { const j = await res.json(); msg = j?.msg || msg; } catch {}
      throw new Error(msg);
    }
    return res.json(); // { ok, data, page, totalPages, total }
  }

  //  MOCK: datos de ejemplo para ver la UI sin backend
  const all = Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    folio: String(100 + i),
    cliente: ["JUAN PEREZ", "ANA LÓPEZ", "CARLOS RAMOS", "LUCÍA MEJÍA"][i % 4],
    servicio: ["COTIZACIÓN", "MANTENIMIENTO", "ALINEACIÓN", "BALANCEO"][i % 4],
    fecha: "2025-09-12",
    hora: `${10 + (i % 5)}:${i % 2 ? "05" : "30"}`,
    placa: ["JKL-12-34", "XYZ-55-88", "MNO-90-12", "AAA-00-01"][i % 4],
    estado: ["cotizacion", "en_proceso", "completado", "cancelado"][i % 4],
  }));

  // filtros muy básicos para que se vea como funciona
  let filtered = all.filter(t =>
    (q ? (t.folio.includes(q) || t.cliente.toLowerCase().includes(q.toLowerCase()) || (t.placa||"").toLowerCase().includes(q.toLowerCase())) : true) &&
    (estado === "todos" ? true : t.estado === estado)
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);

  // pequeña demora para mostrar skeletons
  await new Promise(r => setTimeout(r, 400));

  return { ok: true, data, page, totalPages, total };
}
