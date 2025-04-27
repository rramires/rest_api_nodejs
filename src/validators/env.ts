import { config } from 'dotenv'
import { z } from 'zod'

// Checking the environment
if (process.env.NODE_ENV === 'test') {
    config({ path: '.env.test' })
} else {
    config()
}

// Rules for environment variables
const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    HTTP_PORT: z.coerce.number().default(3333),
    DATABASE_PATH: z.string()
})

// Validate environment variables
const _env = envSchema.safeParse(process.env)
if (_env.success === false) {
    console.error('Invalid environment variables:', _env.error.format())
    throw new Error('Invalid environment variables')
}
// Export the validated environment variables
export const env = _env.data
