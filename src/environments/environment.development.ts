export const environment = {
  // En desarrollo usamos proxy para evitar problemas de CORS.
  // Desde el navegador las peticiones irán a rutas relativas (ej: /api/reservas).
  backendUrl: ''
} as const;

