/**
 * db/config.ts
 * Centralized Postgres env mapping for migration tools and DB clients
 */
export const PGHOST = process.env.PGHOST || process.env.DB_HOST || '';
export const PGPORT = process.env.PGPORT || process.env.DB_PORT || '5432';
export const PGDATABASE = process.env.PGDATABASE || process.env.DB_NAME || process.env.DATABASE_NAME || '';
export const PGUSER = process.env.PGUSER || process.env.DB_USER || '';
export const PGPASSWORD = process.env.PGPASSWORD || process.env.DB_PASSWORD || '';
export const pgConnectionString = `postgresql://${PGUSER}:${encodeURIComponent(PGPASSWORD)}@${PGHOST}:${PGPORT}/${PGDATABASE}`;
export default {
    PGHOST,
    PGPORT,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    pgConnectionString,
};
