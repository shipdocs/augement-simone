import { defineConfig } from 'tsup';
import { promises as fs } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  target: 'node20',
  minify: process.env.NODE_ENV === 'production',
  async onSuccess() {
    // Cross-platform copy of prompts directory
    async function copyDir(src: string, dest: string) {
      await fs.mkdir(dest, { recursive: true });
      const entries = await fs.readdir(src, { withFileTypes: true });
      
      for (const entry of entries) {
        const srcPath = join(src, entry.name);
        const destPath = join(dest, entry.name);
        
        if (entry.isDirectory()) {
          await copyDir(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    }
    
    await copyDir(
      join('src', 'templates', 'prompts'),
      join('dist', 'prompts')
    );
    
    // Copy .simone templates
    await copyDir(
      join('.simone'),
      join('dist', '.simone')
    );
  },
});