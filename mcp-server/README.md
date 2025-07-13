# Simone MCP Server

An MCP (Model Context Protocol) server implementation for Simone - AI-powered project and task management.

## Features

- **Task Management**: Track and manage tasks from multiple sources (GitHub issues, markdown files)
- **Activity Logging**: SQLite-based activity tracking for development progress
- **GitHub Integration**: Deep integration with GitHub for issue and PR management
- **Templated Prompts**: Handlebars-based prompt system with hot-reloading
- **Project Context**: Automatic project understanding through environment configuration

## Installation

```bash
npm install -g @helmi/simone-mcp
```

Or use directly with npx:
```bash
npx @helmi/simone-mcp
```

## Configuration

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "simone": {
      "command": "npx",
      "args": ["@helmi/simone-mcp"],
      "env": {
        "PROJECT_PATH": "/path/to/your/project"
      }
    }
  }
}
```

## Development

### Prerequisites

- Node.js >= 20.0.0
- pnpm 9.15.2

### Setup

```bash
pnpm install
```

### Commands

```bash
# Development mode with hot-reload
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm format

# Type checking
pnpm typecheck
```

### Release Process

```bash
# Patch release (bug fixes)
pnpm release:patch

# Minor release (new features)
pnpm release:minor

# Major release (breaking changes)
pnpm release:major
```

## Architecture

- **TypeScript** with strict mode enabled
- **MCP SDK** for protocol implementation
- **SQLite** for activity logging
- **Handlebars** for prompt templating
- **Vitest** for testing

## License

MIT