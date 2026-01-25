# Contributing to MainWP MCP Server

We welcome contributions to the MainWP Model Context Protocol (MCP) Server! This document provides guidelines for contributing to the project.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to [project maintainers].

## How to Contribute

### Reporting Issues

1. Check existing issues to avoid duplicates
2. Use the issue template provided
3. Provide:
   - Clear description of the issue
   - Steps to reproduce
   - Expected vs actual behavior
   - Version information

### Feature Requests

1. Open an issue describing the feature
2. Provide:
   - Detailed use case
   - Potential implementation approach
   - Any relevant context

### Pull Request Process

1. Fork the repository
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Ensure code follows project standards:
   - Run `npm run build`
   - Ensure TypeScript types are correct
   - Add/update tests if applicable
5. Commit with a clear, descriptive message
6. Push to your fork
7. Open a pull request with:
   - Clear title
   - Detailed description of changes
   - Link to any related issues

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up `.env.local` with test credentials
4. Run development server:
   ```bash
   npm run dev
   ```

### Testing

- Run all tests:
  ```bash
  npm test
  ```
- Run specific tool tests:
  ```bash
  npm run test:tools
  ```
- Perform smoke test before submitting:
  ```bash
  npm run smoke-test
  ```

## Development Guidelines

- Follow existing code style
- Add TypeScript types for all new code
- Write clear, concise comments
- Keep functions small and focused
- Update documentation for new features
- Ensure all tools have:
  - Input validation
  - Error handling
  - Dry-run support

## Releasing

Releases are managed by project maintainers. Contributors should:
- Not modify version numbers
- Not publish to npm
- Follow semantic versioning principles in PRs

## Questions?

Open an issue or contact the maintainers directly.

---

Thank you for contributing to MainWP MCP Server! 🚀