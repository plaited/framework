import { esbuildPlugin } from '@web/dev-server-esbuild'

export default {
  plugins: [ esbuildPlugin({ ts: true, target: 'esnext' }) ],
  port: 8080,
}
