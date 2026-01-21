# Contributing to MainWP MCP Server

## Welcome Contributors!

We're excited that you're interested in contributing to the MainWP MCP Server. This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the Repository**: Create a fork of the project on GitHub.

2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/mainwp-mcp.git
   cd mainwp-mcp
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

## Development Workflow

1. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**:
   - Follow existing code style
   - Add/update tests
   - Ensure documentation is updated
   - Run linter: `npm run lint`
   - Compile the project: `npm run build`

3. **Test Your Changes**:
   ```bash
   # Run smoke tests
   npm run smoke-test
   ```

4. **Commit Your Changes**:
   - Use clear, descriptive commit messages
   - Reference any related issues
   ```bash
   git commit -m "Add feature: brief description of changes"
   ```

5. **Push to Your Fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**:
   - Describe the purpose of your changes
   - Link to any related issues
   - Ensure all CI checks pass

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on collaboration

## Reporting Issues

- Check existing issues before creating a new one
- Provide detailed information
- Include steps to reproduce the issue
- Share relevant environment details

## Feature Requests

- Discuss potential features in GitHub Issues
- Explain the use case and potential implementation
- Be open to feedback and iteration

## Thank You!

Your contributions help improve the MainWP MCP Server for everyone.