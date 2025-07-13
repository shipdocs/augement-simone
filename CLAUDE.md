# CLAUDE Instructions - Simone Repository

**IMPORTANT:** This repository contains both the legacy Simone system and the new MCP server implementation.

Include @CLAUDE.local.md

## Repository Structure

This repository has been reorganized to contain three components:

1. **`/legacy`** - The stable, production-ready Simone system
   - Directory-based command system
   - Fully functional and documented
   - Use this for actual project management

2. **`/hello-simone`** - NPM installer for legacy Simone
   - Installs the legacy system
   - Run with `npx hello-simone`

3. **`/mcp-server`** - New MCP implementation (early development)
   - Model Context Protocol based
   - Not ready for use
   - Active development

## Development Context

### When Working on Legacy System

- Make changes in `/legacy` directory
- Maintain backward compatibility
- Update documentation as needed

### When Working on MCP Server

- All code in `/mcp-server` directory
- This is a complete rewrite - no legacy dependencies
- See `/mcp-server/CLAUDE.md` for detailed development guidelines
- The `/mcp-server` folder will become an npm package

## Activity Logging

You have access to the `log_activity` tool. Use it to record your activities after every activity that is relevant for the project. This helps track development progress and understand what has been done.

## Important Notes

- The legacy system is fully functional - use it for actual project management
- The MCP server is in early development and not ready for use
