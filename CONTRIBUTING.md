# Contributing to MainWP MCP Server

Thank you for your interest in contributing to the MainWP MCP Server! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the Repository**
   - Visit the GitHub repository
   - Click the "Fork" button in the top-right corner
   - Clone your forked repository locally

2. **Set Up Development Environment**
   ```bash
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/mainwp-mcp.git
   cd mainwp-mcp

   # Install dependencies
   npm install

   # Build the project
   npm run build
   ```

## Contributing Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Add TypeScript types for new code
   - Write clear, concise code
   - Include comments where necessary

3. **Verify Your Changes**
   ```bash
   # Build the project
   npm run build

   # Run any available tests
   npm run test  # If tests are added
   ```

## Code Guidelines

- Use TypeScript and provide type annotations
- Follow existing project structure in `src/`
- Add corresponding tool schemas in `src/schemas/`
- Register new tools in `src/tools/index.ts`
- Update documentation for new features

## Testing

- Always test with a real MainWP Dashboard before submitting a Pull Request
- Ensure no regressions are introduced
- If possible, add unit tests for new functionality

## Pull Request Process

1. Push your changes to your fork
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request
   - Provide a clear, descriptive title
   - Explain the purpose and details of your changes
   - Reference any related issues

## Reporting Issues

- Use GitHub Issues to report bugs or suggest features
- Provide detailed information:
  - Steps to reproduce
  - Expected behavior
  - Actual behavior
  - Environment details (Node.js version, MainWP version)

## Code of Conduct

Be respectful, inclusive, and collaborative. We welcome contributions from everyone.

## Questions?

If you have questions about contributing, please open an issue or reach out to the maintainers.

Thank you for helping improve MainWP MCP Server! 🚀