import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src', 'knexfile.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
})