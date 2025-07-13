import { basename } from 'path';
import type { TemplateContext } from '../types/prompt.js';

export function buildTemplateContext(
  projectPath: string,
  args: Record<string, any> = {}
): TemplateContext {
  // Get project name from path
  const projectName = basename(projectPath);
  
  // Create ISO timestamp with timezone
  const timestamp = new Date().toISOString();
  
  return {
    PROJECT_PATH: projectPath,
    PROJECT_NAME: projectName,
    TIMESTAMP: timestamp,
    ...args, // Merge in any user arguments
  };
}