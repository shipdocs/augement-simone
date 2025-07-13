import { promises as fs } from 'fs';
import { join, dirname } from 'path';

let logPath: string | null = null;

/**
 * Initialize the logger with the project path
 */
export function initializeLogger(projectPath: string): void {
  logPath = join(projectPath, '.simone', 'logs', 'mcp-server.error.log');
}

/**
 * Log an error to the error log file
 */
export async function logError(error: Error | string): Promise<void> {
  if (!logPath) {
    return; // Logger not initialized, silently skip
  }

  try {
    const timestamp = new Date().toISOString();
    const message = error instanceof Error 
      ? `${error.message}\n${error.stack || ''}`
      : error;
    
    const logEntry = `[${timestamp}] ERROR: ${message}\n\n`;
    
    // Ensure log directory exists
    await fs.mkdir(dirname(logPath), { recursive: true });
    
    // Append to log file
    await fs.appendFile(logPath, logEntry, 'utf8');
  } catch {
    // Silently fail if logging fails - we don't want to crash the server
  }
}