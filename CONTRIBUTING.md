# Contributing to MainWP MCP Server

We welcome contributions to the MainWP MCP Server! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the Repository**
   - Navigate to [the GitHub repository](https://github.com/cvsloane/mainwp-mcp)
   - Click "Fork" to create your own copy of the project

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mainwp-mcp.git
   cd mainwp-mcp
   ```

3. **Set Up Development Environment**
   ```bash
   npm install
   ```

## Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Add TypeScript types for new code
   - Write or update tests if applicable

3. **Build and Test**
   ```bash
   npm run build      # Compile TypeScript
   npm run lint       # Check code style
   npm run smoke-test # Run smoke tests
   ```

4. **Commit Your Changes**
   - Write clear, descriptive commit messages
   - Include the purpose and context of your changes
   ```bash
   git commit -m "Add feature: brief description of change"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/my-feature
   ```

6. **Open a Pull Request**
   - Describe your changes in detail
   - Reference any related issues
   - Ensure all CI checks pass

## Contribution Guidelines

- Follow existing TypeScript and project conventions
- Add comprehensive TypeScript type definitions
- Update documentation for new features
- Test thoroughly with a real MainWP Dashboard
- Be respectful and constructive in discussions

## Reporting Issues

- Check existing issues before creating a new one
- Use the GitHub issue template
- Provide detailed information about your environment
- Include steps to reproduce the issue

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment. Please be respectful of all contributors.

## Questions?

If you have any questions about contributing, please open an issue or reach out to the maintainers.

Thank you for helping improve MainWP MCP Server! 🚀