# Contributing to MainWP MCP

We welcome contributions to the MainWP Model Context Protocol (MCP) Server! This document provides guidelines for contributing to the project.

## How to Contribute

1. **Fork the Repository**
   - Visit the [GitHub repository](https://github.com/cvsloane/mainwp-mcp)
   - Click "Fork" in the top-right corner

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/mainwp-mcp.git
   cd mainwp-mcp
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/my-feature
   ```

4. **Make Your Changes**
   - Follow existing code style
   - Add TypeScript types for new code
   - Update documentation for new features
   - Test with a real MainWP Dashboard

5. **Verify Your Changes**
   ```bash
   npm run build    # Ensure code compiles
   npm run lint     # Check code quality
   ```

6. **Commit and Push**
   ```bash
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```

7. **Open a Pull Request**
   - Go to the [GitHub repository](https://github.com/cvsloane/mainwp-mcp)
   - Click "Pull Request"
   - Describe your changes

## Development Setup

- **Node.js**: >= 18.0.0
- **Install Dependencies**: `npm install`
- **Development Mode**: `npm run dev`
- **Build**: `npm run build`
- **Test**: `npm run smoke-test`

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help maintain a welcoming community

## Reporting Issues

- Check existing issues before creating a new one
- Provide clear, detailed information
- Include steps to reproduce the issue

## Questions?

Open an issue or reach out to the maintainers.

Thank you for contributing! 🚀