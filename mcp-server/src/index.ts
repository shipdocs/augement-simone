#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  type GetPromptResult,
  ListToolsRequestSchema,
  CallToolRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { getEnvConfig } from './config/index.js';
import { initializeTemplating } from './templates/index.js';
import { initializeLogger, logError } from './utils/logger.js';
import { ActivityLogger } from './tools/activity-logger/index.js';
import { getTools, getToolSchemas, handleToolCall, type ToolContext } from './tools/index.js';

// Get configuration
const config = getEnvConfig();

// Initialize logger
initializeLogger(config.projectPath);

// Initialize templating system
const promptHandler = initializeTemplating(config.projectPath);

// Initialize tool context
const toolContext: ToolContext = {
  projectPath: config.projectPath,
  activityLogger: new ActivityLogger(config.projectPath),
};

// Get available tools
const tools = getTools(toolContext);

// Create server instance
const server = new Server(
  {
    name: 'simone-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      prompts: {},
      tools: {},
    },
  },
);

// Handle prompt listing
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  const availablePrompts = await promptHandler.listAvailablePrompts();
  
  // Convert to MCP format
  const prompts = availablePrompts.map(p => ({
    name: p.name,
    description: p.description,
    arguments: p.arguments?.map(arg => ({
      name: arg.name,
      description: arg.description,
      required: arg.required || false,
    })),
  }));

  return { prompts };
});

// Handle prompt retrieval
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  const messages = await promptHandler.getPromptMessages(name, args || {});
  
  return {
    messages,
  } as GetPromptResult;
});

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: getToolSchemas(tools),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  return handleToolCall(name, args || {}, tools);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Server started successfully - no need to log this
}

main().catch(async (error) => {
  await logError(error instanceof Error ? error : new Error(String(error)));
  process.exit(1);
});