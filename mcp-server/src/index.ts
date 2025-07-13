#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
  type GetPromptResult,
  ListToolsRequestSchema,
  CallToolRequestSchema,
  type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';

import { getEnvConfig } from './config/index.js';
import { initializeTemplating } from './templates/index.js';
import { initializeLogger, logError } from './utils/logger.js';
import { ActivityLogger } from './tools/activity-logger/index.js';

// Get configuration
const config = getEnvConfig();

// Initialize logger
initializeLogger(config.projectPath);

// Initialize templating system
const promptHandler = initializeTemplating(config.projectPath);

// Initialize activity logger
const activityLogger = new ActivityLogger(config.projectPath);

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
    tools: [
      {
        name: 'log_activity',
        description: `Log your AI-assisted development activities to track progress and patterns.

Required parameters:
- activity: Describe what you did (e.g., "Created GitHub issue for authentication refactor")
- tool_name: The tool or feature used (e.g., "create-task", "github-cli", "code-analysis")

Optional parameters:
- success: Whether the operation succeeded (defaults to true)
- error: Error message if the operation failed
- tags: Up to 3 categories from: [task-management, github, feature, improvement, refactoring, bug-fix, research, documentation, testing, configuration, review, planning, analysis] - or create your own if needed
- context: Additional notes or outcomes
- files_affected: List of files created/modified/deleted
- issue_number: Related GitHub issue number
- link: Relevant URL (GitHub issue, PR, documentation, etc.)

The system will automatically:
- Add a timestamp
- Determine activity type (create, update, fix, etc.) from your description
- Store the data for analysis and reporting

IMPORTANT: Only log factual information. Do not estimate or invent data.`,
        inputSchema: {
          type: 'object',
          properties: {
            activity: {
              type: 'string',
              description: 'What was done',
            },
            tool_name: {
              type: 'string',
              description: 'Tool or feature used',
            },
            success: {
              type: 'boolean',
              description: 'Whether the operation succeeded',
              default: true,
            },
            error: {
              type: 'string',
              description: 'Error message if failed',
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Categories (max 3)',
            },
            context: {
              type: 'string',
              description: 'Additional notes',
            },
            files_affected: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files created/modified/deleted',
            },
            issue_number: {
              type: 'number',
              description: 'Related GitHub issue',
            },
            link: {
              type: 'string',
              description: 'Relevant URL',
            },
          },
          required: ['activity', 'tool_name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'log_activity') {
    try {
      const result = activityLogger.logActivity(args as any);
      
      if (result.success) {
        return {
          content: [
            {
              type: 'text',
              text: `📋 Activity logged successfully (ID: ${result.activityId})`,
            },
          ],
        } as CallToolResult;
      } else {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to log activity: ${result.error}`,
            },
          ],
          isError: true,
        } as CallToolResult;
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error logging activity: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      } as CallToolResult;
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: `Unknown tool: ${name}`,
      },
    ],
    isError: true,
  } as CallToolResult;
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