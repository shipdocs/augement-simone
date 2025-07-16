#!/usr/bin/env node

/**
 * Post-edit hook for Claude Code
 * Runs various actions after file edits
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { lint } from 'markdownlint/promise';
import { applyFixes } from 'markdownlint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(__dirname);

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath || !existsSync(filePath)) {
  // Exit gracefully to not block Claude
  process.exit(0);
}

// Markdown linting
if (filePath.endsWith('.md')) {
  try {
    // Read the original content
    const originalContent = readFileSync(filePath, 'utf8');
    
    // Configure markdownlint - use or create config
    let config = {
      default: true,
      MD013: false, // Line length
      MD024: { siblings_only: true }, // Duplicate headings  
      MD033: false, // No HTML
      MD041: false  // First line heading
    };
    
    // Try to load config from repo root if it exists
    const configPaths = [
      path.join(repoRoot, '.markdownlint.jsonc'),
      path.join(repoRoot, '.markdownlint.json')
    ];
    
    for (const configPath of configPaths) {
      if (existsSync(configPath)) {
        try {
          // Read file and strip comments for JSONC files
          let configContent = readFileSync(configPath, 'utf8');
          if (configPath.endsWith('.jsonc')) {
            // Simple comment stripping (not perfect but works for our case)
            configContent = configContent.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
          }
          const loadedConfig = JSON.parse(configContent);
          config = loadedConfig.config || loadedConfig;
          break;
        } catch (e) {
          // Use default config if parse fails
        }
      }
    }
    
    // Run markdownlint to get results with fix information
    const results = await lint({
      files: [filePath],
      config
    });
    
    // Apply fixes if there are any
    if (results[filePath] && results[filePath].length > 0) {
      const fixedContent = applyFixes(originalContent, results[filePath]);
      if (fixedContent !== originalContent) {
        writeFileSync(filePath, fixedContent, 'utf8');
      }
    }
  } catch (error) {
    // Silently handle errors to not disrupt Claude
    // Uncomment for debugging:
    // console.error(`Markdown lint error: ${error.message}`);
  }
}

// Always exit successfully
process.exit(0);