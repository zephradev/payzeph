import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z
        .enum(['development', 'production', 'test'])
        .default('development'),
    PORT: z.coerce.number().default(3001),

    DATABASE_URL: z.string().min(1),

    REDIS_URL: z.string().min(1),

    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: z.string().default('2h'),
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

    FLW_SECRET_KEY: z.string().default(''),
    FLW_PUBLIC_KEY: z.string().default(''),
    FLW_WEBHOOK_HASH: z.string().default(''),

    VTPASS_API_KEY: z.string().default(''),
    VTPASS_SECRET_KEY: z.string().default(''),
    VTPASS_BASE_URL: z.string().default('https://sandbox.vtpass.com/api'),

    // RESEND_API_KEY: z.string().min(1),
    // RESEND_FROM_EMAIL: z.string().email(),

    // CLOUDINARY_CLOUD_NAME: z.string().min(1),
    // CLOUDINARY_API_KEY: z.string().min(1),
    // CLOUDINARY_API_SECRET: z.string().min(1),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>) {
    const result = envSchema.safeParse(config);

    if (!result.success) {
        console.error('Invalid environment variables:');
        console.error(result.error.flatten().fieldErrors);
        throw new Error('Invalid environment variables — app cannot start');
    }

    return result.data;
}
