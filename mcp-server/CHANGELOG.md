# Changelog

All notable changes to the Simone MCP Server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note**: This changelog tracks the MCP server implementation only. The legacy Simone command system has its own versioning.

## [Unreleased]

## [0.1.0] - 2025-01-13

### Added
- Initial MCP server implementation with stdio transport
- Handlebars-based templating system with hot-reloading
- Multi-context project configuration support
- GitHub integration prompts (create-task, update-issue, list-issues)
- SQLite-based activity logging system with `log_activity` tool
- Comprehensive prompt system with partials and helpers
- TypeScript with strict mode and modern tooling setup
- Conventional commits with commitlint
- Development tools: ESLint, Prettier, Vitest, Husky

### Changed
- Complete architectural rewrite from directory-based commands to MCP protocol
- New codebase structure with modular design

### Notes
- This is the first release of the MCP server implementation
- Currently in development on the `feature/mcp-server` branch
- Not yet published to npm