# Contributing to MainWP MCP

We welcome contributions to the MainWP Model Context Protocol (MCP) Server! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the Repository**
   - Click "Fork" on the GitHub repository
   - Clone your fork locally: `git clone https://github.com/YOUR_USERNAME/mainwp-mcp.git`
   - Add the original repository as a remote:
     ```bash
     cd mainwp-mcp
     git remote add upstream https://github.com/cvsloane/mainwp-mcp.git
     ```

2. **Set Up Development Environment**
   ```bash
   # Install dependencies
   npm install

   # Build the project
   npm run build

   # Run in development mode
   npm run dev
   ```

## Contributing Process

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow existing code style
   - Add TypeScript types for new code
   - Update documentation for new features
   - Ensure code passes linting: `npm run lint`

3. **Test Your Changes**
   ```bash
   # Build the project
   npm run build

   # Run smoke tests to verify functionality
   npm run smoke-test
   ```

4. **Commit Your Changes**
   - Use clear, descriptive commit messages
   - Include the purpose and context of your changes

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Target the `main` branch of the original repository
   - Provide a clear description of your changes
   - Link any related issues

## Contribution Guidelines

- **Code Quality**
  - Write clean, well-documented TypeScript code
  - Add comprehensive type annotations
  - Follow existing project structure
  - Maintain backward compatibility when possible

- **Documentation**
  - Update README.md and other docs for new features
  - Add inline comments explaining complex logic
  - Update JSDoc/TypeDoc comments for public APIs

- **Testing**
  - Add tests for new functionality
  - Ensure existing tests continue to pass
  - Test with real MainWP Dashboard instances

## Reporting Issues

- Use GitHub Issues to report bugs or request features
- Provide detailed information:
  - Steps to reproduce
  - Expected vs. actual behavior
  - MainWP Dashboard version
  - MCP Server version
  - Any relevant error logs

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Collaborate and communicate openly

## Questions?

If you have questions about contributing, please open an issue or reach out to the maintainers.

Thank you for helping improve MainWP MCP! 🌟