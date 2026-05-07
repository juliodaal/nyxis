import { defineConfig } from 'tsup';

const isWatch = process.argv.includes('--watch');

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'server/index': 'src/server/index.ts',
  },
  format: ['esm'],
  target: 'es2022',
  platform: 'neutral',
  outDir: 'dist',
  dts: true,
  sourcemap: true,
  clean: !isWatch,
  splitting: false,
  treeshake: true,
  minify: false,
  external: [
    'react',
    'react/jsx-runtime',
    'ai',
    '@ai-sdk/anthropic',
    '@ai-sdk/openai',
    '@ai-sdk/google',
    '@ai-sdk/mistral',
    'ollama-ai-provider',
  ],
  esbuildOptions(options) {
    options.legalComments = 'none';
  },
});
