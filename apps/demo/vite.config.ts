import { defineConfig, type AliasOptions } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// dev: alias to package src for instant HMR without building packages first
// build/preview: use workspace package dist (run `pnpm build:packages` first)
const devAliases: AliasOptions = {
  '@leejaehyeok/use-roving-focus': resolve(
    __dirname,
    '../../packages/use-roving-focus/src/index.ts',
  ),
}

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: '/react-hooks/',
  resolve: {
    alias: command === 'serve' ? devAliases : {},
  },
}))
