# Simone - Project and Task Management for Claude Code

This repository contains the Simone project management system, currently undergoing a major architectural transition from a directory-based command system to a Model Context Protocol (MCP) server.

[![Mentioned in Awesome Claude Code](https://awesome.re/mentioned-badge.svg)](https://github.com/hesreallyhim/awesome-claude-code)

## Current Status

⚠️ **Repository in Transition**: This repository contains both the stable legacy system and an early-stage MCP server implementation.

## Repository Structure

### `/legacy` - Stable Simone System

The current, production-ready version of Simone. This is a directory-based task management system that works today.

**To use Simone right now, see [/legacy/README.md](/legacy/README.md) for installation and usage instructions.**

### `/hello-simone` - NPM Installer

The installer package for the legacy Simone system. Install with:

```bash
npx hello-simone
```

### `/mcp-server` - Early Development

🚧 **Very early development stage** - The future MCP-based implementation of Simone.

- No documentation yet
- Not ready for use
- Active development in progress
- Will eventually replace the legacy system

## Getting Started

For the current, working version of Simone:

1. Navigate to [/legacy/README.md](/legacy/README.md)
2. Follow the installation instructions there
3. Or simply run `npx hello-simone` in your project

## Contributing

As we're in a transition period, please open an issue before contributing to discuss whether changes should target the legacy system or the new MCP implementation.

## License

MIT License - see LICENSE file for details.
