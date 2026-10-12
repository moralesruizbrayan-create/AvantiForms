const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// Configuración de WebSockets para @neondatabase/serverless en entornos Node.js / Vercel
if (!neonConfig.webSocketConstructor) {
  neonConfig.webSocketConstructor = ws;
}

/**
 * Obtiene la URL de conexión optimizada para Pooling (PgBouncer de Neon).
 * Si la URL es de Neon y no tiene la terminación '-pooler', la añade automáticamente
 * para garantizar la reutilización de conexiones en serverless.
 */
function getConnectionString() {
  let url = process.env.DATABASE_URL || '';
  if (url.includes('.neon.tech') && !url.includes('-pooler.')) {
    url = url.replace(/@([a-zA-Z0-9_-]+)(\.[a-zA-Z0-9_.-]*neon\.tech)/, '@$1-pooler$2');
  }
  return url;
}

// Pool global en caché para reutilizar conexiones entre invocaciones calientes (warm) de Vercel
let poolInstance = null;

function getPool() {
  if (!poolInstance) {
    const connectionString = getConnectionString();
    if (!connectionString) {
      throw new Error('CRÍTICO: No se encontró DATABASE_URL en las variables de entorno de Vercel.');
    }
    poolInstance = new Pool({
      connectionString,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return poolInstance;
}

module.exports = {
  getPool,
  getConnectionString,
  query: (text, params) => getPool().query(text, params),
};
