// Lee el objeto "empleado" que ustedes ya guardan en localStorage
// y deduce el rol intentando varios campos/nombres comunes.

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem("empleado")) || null;
  } catch {
    return null;
  }
}

export function getCurrentUserRole() {
  const u = getCurrentUser();
  if (!u) return null;

  const candidates = [
    u.ROL,
    u.role,
    u.rol,
    u.CARGO,   
    u.cargo,
    u.perfil,
  ]
    .filter(Boolean)
    .map((x) => String(x).toLowerCase());

  if (candidates.some((v) => ["superadmin", "super", "root", "general"].includes(v))) {
    return "superadmin";
  }
  if (candidates.some((v) => ["gerente", "manager"].includes(v))) {
    return "gerente";
  }
  // Si en gerente se usa el cargo del área como "reparacion"/"cotizacion", mapea a gerente
  if (candidates.some((v) => ["reparacion", "cotizacion"].includes(v))) {
    return "gerente";
  }
  return "empleado";
}
