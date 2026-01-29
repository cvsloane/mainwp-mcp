# Contributing to MainWP MCP

We welcome contributions to the MainWP Model Context Protocol (MCP) Server! This document provides guidelines for contributing to the project.

## Getting Started

1. **Fork the Repository**
   - Visit the [GitHub repository](https://github.com/cvsloane/mainwp-mcp)
   - Click "Fork" to create your own copy

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mainwp-mcp.git
   cd mainwp-mcp
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

## Making Contributions

### Code Contribution Process

1. Create a feature branch
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes
   - Follow existing code style
   - Add TypeScript types for new code
   - Update documentation for new features

3. Verify your changes
   ```bash
   npm run build   # Ensure code compiles
   npm run lint    # Run linter
   ```

4. Commit your changes
   ```bash
   git commit -m "Add my feature: brief description"
   ```

5. Push to your fork
   ```bash
   git push origin feature/my-feature
   ```

6. Open a Pull Request against the main repository

### Guidelines

- Maintain existing code quality and style
- Add appropriate TypeScript type definitions
- Update documentation for any new features or changes
- Test thoroughly with a real MainWP Dashboard before submitting
- Be respectful and collaborative in discussions

### Reporting Issues

- Use GitHub Issues to report bugs or request features
- Provide detailed information about your environment
- Include steps to reproduce the issue
- If possible, include a minimal reproducible example

## Development Setup

- **Node.js**: 18.0.0+
- **npm**: 8.0.0+
- Recommended: MainWP Dashboard for testing

## Code of Conduct

Be kind, professional, and considerate of others. Harassment and discrimination are not tolerated.

## Questions?

If you have questions about contributing, please open an issue or contact the maintainers.

Thank you for helping improve MainWP MCP! 🚀