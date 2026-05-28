// ============================================================
//  SCOIN – Endpoints de la API
//  Base URL configurable por entorno
// ============================================================

export const BASE_URL = 'https://api.scoin.pe/v1';

export const ENDPOINTS = {
  // ── Auth ────────────────────────────────────────────────
  AUTH: {
    /**
     * POST /auth/registro
     * Body: { nombre: string, numero: string }
     * Response: { id: string, nombre: string, token: string }
     */
    REGISTER: `${BASE_URL}/auth/registro`,

    /**
     * POST /auth/login
     * Body: { nombre: string, numero: string }
     * Response: { id: string, nombre: string, token: string }
     */
    LOGIN: `${BASE_URL}/auth/login`,
  },

  // ── Monedas ─────────────────────────────────────────────
  COINS: {
    /**
     * POST /monedas/identificar
     * Body: multipart/form-data { imagen: File, tipo: 'moneda' | 'billete' }
     * Response: {
     *   identificado: boolean,
     *   moneda: {
     *     id: string,
     *     nombre: string,       // e.g. "1 Sol"
     *     valor: number,        // e.g. 1.00
     *     año_emision: string,
     *     descripcion: string,
     *     imagen_url: string,
     *     confianza: number     // 0-100
     *   } | null,
     *   mensaje: string
     * }
     */
    IDENTIFY: `${BASE_URL}/monedas/identificar`,

    /**
     * GET /monedas/catalogo?tipo=moneda|billete
     * Response: { monedas: Moneda[] }
     */
    CATALOG: `${BASE_URL}/monedas/catalogo`,

    /**
     * GET /monedas/:id
     * Response: Moneda (ver estructura arriba)
     */
    DETAIL: (id) => `${BASE_URL}/monedas/${id}`,
  },

  // ── Audios ──────────────────────────────────────────────
  AUDIO: {
    /**
     * GET /audios/:monedaId
     * Response: { url: string, duracion: number }
     * El audio describe la moneda en voz alta (accesibilidad)
     */
    GET: (monedaId) => `${BASE_URL}/audios/${monedaId}`,
  },

  // ── Historial ────────────────────────────────────────────
  HISTORY: {
    /**
     * GET /historial?usuarioId=...&page=1&limit=20
     * Response: { escaneos: Escaneo[], total: number }
     */
    LIST: `${BASE_URL}/historial`,

    /**
     * DELETE /historial/:id
     * Response: { ok: boolean }
     */
    DELETE: (id) => `${BASE_URL}/historial/${id}`,
  },
};

// ── Monedas mock para desarrollo frontend ─────────────────
export const MOCK_COINS = [
  { id: '1', nombre: '5 Céntimos', valor: 0.05, color: '#B87333', imagen: null },
  { id: '2', nombre: '10 Céntimos', valor: 0.10, color: '#C0C0C0', imagen: null },
  { id: '3', nombre: '20 Céntimos', valor: 0.20, color: '#C0C0C0', imagen: null },
  { id: '4', nombre: '50 Céntimos', valor: 0.50, color: '#C0C0C0', imagen: null },
  { id: '5', nombre: '1 Sol', valor: 1.00, color: '#FFD700', imagen: null },
  { id: '6', nombre: '2 Soles', valor: 2.00, color: '#FFD700', imagen: null },
  { id: '7', nombre: '5 Soles', valor: 5.00, color: '#FFD700', imagen: null },
];
