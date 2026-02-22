# Contributing to MainWP MCP Server

Thank you for your interest in contributing to the MainWP MCP Server! This document provides guidelines for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher
- Git

### Clone the Repository

```bash
git clone https://github.com/cvsloane/mainwp-mcp.git
cd mainwp-mcp
```

### Install Dependencies

```bash
npm install
```

## Development Setup

### Environment Configuration

1. Copy the environment template:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` with your MainWP Dashboard credentials:
```bash
MAINWP_DASHBOARD_URL=https://your-mainwp-dashboard.com
MAINWP_API_KEY=your_consumer_key==your_consumer_secret
MAINWP_ENABLE_DRY_RUN_BY_DEFAULT=true
MAINWP_REQUIRE_CONFIRMATION_BULK=true
MAINWP_TEST_MODE=false
MAINWP_RATE_LIMIT_PER_MINUTE=60
```

### Development Commands

```bash
# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Clean build artifacts
npm run clean

# Run smoke tests (test mode, no side effects)
npm run smoke-test
```

### Testing with MainWP Dashboard

Before submitting changes, test with a real MainWP Dashboard:

1. **Test Mode**: Enable `MAINWP_TEST_MODE=true` to prevent actual changes
2. **Dry Run**: Use `dry_run: true` parameters for destructive operations
3. **Smoke Test**: Run `npm run smoke-test` to verify all tools work

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Add type annotations for all function parameters and return types
- Use interfaces for complex data structures
- Follow existing code patterns and naming conventions

### JSDoc Documentation

- Add JSDoc comments for all exported functions and classes
- Include parameter descriptions and return types
- Use `@throws` for error cases
- Provide examples for complex functions

```typescript
/**
 * Create a successful tool result
 * @param data - The data to include in the result
 * @returns ToolResult with success content
 */
export function createSuccessResult(data: unknown): ToolResult {
  // implementation
}
```

### File Structure

- Keep files focused on single responsibilities
- Use descriptive file names
- Follow the existing directory structure:
  ```
  src/
  ├── clients/          # API client implementations
  ├── tools/           # MCP tool definitions
  ├── types/           # TypeScript type definitions
  ├── schemas/         # Zod validation schemas
  ├── utils/           # Utility functions
  └── index.ts         # Entry point
  ```

## Testing

### Manual Testing

1. **Tool Verification**: Test each tool with real MainWP data
2. **Error Handling**: Test error cases and edge cases
3. **Rate Limiting**: Verify rate limiting works correctly
4. **Safety Features**: Test dry-run and confirmation features

### Automated Testing

```bash
# Run linting
npm run lint

# Build the project
npm run build

# Run smoke tests
npm run smoke-test
```

## Submitting Changes

### Pull Request Process

1. **Fork the Repository**: Create your own fork
2. **Create Feature Branch**: 
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make Changes**: Follow code style and guidelines
4. **Test Changes**: Run all tests and verify functionality
5. **Build Project**: `npm run build`
6. **Commit Changes**: 
   ```bash
   git commit -m "feat: add your feature description"
   ```
7. **Push Branch**: 
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Create Pull Request**: Use a clear title and description

### Commit Message Guidelines

Use conventional commit format:

```
feat: add new tool for site management
fix: resolve rate limiting issue
docs: update README with installation instructions
chore: update dependencies
```

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Changes Made
- List of specific changes
- Any breaking changes
- New features added

## Testing
- How you tested the changes
- Any test cases added

## Related Issues
- Closes #123
- Related to #456
```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment Details**:
   - Node.js version
   - npm version
   - MainWP Dashboard version
   - MainWP Child plugin version

2. **Steps to Reproduce**:
   - Clear, step-by-step instructions
   - Exact commands used
   - Expected vs actual behavior

3. **Error Messages**:
   - Full error stack traces
   - Any relevant logs

4. **Configuration**:
   - Relevant environment variables
   - API key permissions

### Issue Template

```markdown
## Bug Description
Brief description of the bug

## Environment
- Node.js: [version]
- npm: [version]
- MainWP Dashboard: [version]
- MainWP Child: [version]

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happened

## Error Messages
```

## Feature Requests

When requesting features, please include:

1. **Use Case**: What problem are you trying to solve?
2. **Proposed Solution**: How should the feature work?
3. **Alternatives**: Any alternative approaches considered?
4. **Impact**: How would this benefit users?

### Feature Request Template

```markdown
## Feature Description
What feature would you like to see added?

## Use Case
Describe the problem you're trying to solve

## Proposed Solution
How should this feature work?

## Alternatives
Any other approaches you've considered?

## Impact
How would this benefit users?
```

## Development Workflow

### Local Development

1. **Setup**: Clone and configure environment
2. **Development**: Use `npm run dev` for hot reload
3. **Testing**: Regular smoke tests with `npm run smoke-test`
4. **Build**: `npm run build` before committing

### Code Review

- All PRs require review
- Address review comments promptly
- Keep PRs focused and small
- Update documentation for new features

### Release Process

- Version updates follow semantic versioning
- Changelog entries required for all releases
- Test thoroughly before release
- Update documentation for new features

## Community

- **Discussions**: Use GitHub Discussions for questions
- **Issues**: Report bugs and request features via GitHub Issues
- **Code Review**: Participate in code reviews
- **Documentation**: Help improve documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Acknowledgments

Thank you to all contributors who help make this project better! Special thanks to the MainWP team for their excellent WordPress management platform.