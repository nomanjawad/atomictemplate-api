/**
 * @module config
 * @description Application configuration with validation
 * Ensures all required environment variables are present and valid
 */
import { z } from 'zod';
/**
 * Environment variables schema
 * Validates and type-casts environment variables
 */
const envSchema = z.object({
    // Node environment
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    // Server configuration
    PORT: z
        .string()
        .regex(/^\d+$/)
        .transform(Number)
        .default('3000'),
    // Supabase configuration (required)
    SUPABASE_URL: z
        .string()
        .url('SUPABASE_URL must be a valid URL'),
    SUPABASE_ANON_KEY: z
        .string()
        .min(1, 'SUPABASE_ANON_KEY is required'),
    // Supabase configuration (optional)
    SUPABASE_SERVICE_ROLE_KEY: z
        .string()
        .optional(),
    SUPABASE_STORAGE_BUCKET: z
        .string()
        .default('images'),
    // Frontend configuration
    FRONTEND_URL: z
        .string()
        .url()
        .optional(),
    CORS_ALLOWED_ORIGIN: z
        .string()
        .default('*'),
    // Database configuration (for direct Postgres connection if needed)
    PGHOST: z.string().optional(),
    PGPORT: z.string().regex(/^\d+$/).transform(Number).optional(),
    PGDATABASE: z.string().optional(),
    PGUSER: z.string().optional(),
    PGPASSWORD: z.string().optional(),
    // Legacy/backward compatibility
    NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
    SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
});
/**
 * Parse and validate environment variables
 * Throws error if validation fails
 */
function validateEnv() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error('❌ Invalid environment variables:');
        console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2));
        throw new Error('Invalid environment configuration. Check your .env file.');
    }
    return parsed.data;
}
/**
 * Validated and typed configuration object
 * Access environment variables through this object instead of process.env
 */
export const config = validateEnv();
/**
 * Helper functions for common configuration checks
 */
export const isProduction = config.NODE_ENV === 'production';
export const isDevelopment = config.NODE_ENV === 'development';
export const isTest = config.NODE_ENV === 'test';
/**
 * Log configuration summary (without sensitive data)
 */
export function logConfigSummary() {
    console.log('\n📋 Configuration Summary:');
    console.log(`  Environment: ${config.NODE_ENV}`);
    console.log(`  Port: ${config.PORT}`);
    console.log(`  Supabase URL: ${config.SUPABASE_URL}`);
    console.log(`  Storage Bucket: ${config.SUPABASE_STORAGE_BUCKET}`);
    console.log(`  CORS Origin: ${config.CORS_ALLOWED_ORIGIN}`);
    if (config.FRONTEND_URL) {
        console.log(`  Frontend URL: ${config.FRONTEND_URL}`);
    }
    console.log('');
}
