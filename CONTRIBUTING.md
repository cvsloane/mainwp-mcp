# Contributing to MainWP MCP Server

Thank you for your interest in contributing to the MainWP MCP Server! This document provides guidelines and instructions for contributing to the project.

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

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/mainwp-mcp.git
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

2. Edit `.env.local` with your MainWP Dashboard credentials (for testing only):
   ```bash
   MAINWP_DASHBOARD_URL=https://your-mainwp-dashboard.com
   MAINWP_API_KEY=your_consumer_key==your_consumer_secret
   MAINWP_TEST_MODE=true  # Enable for safe testing
   ```

### Development Commands

```bash
# Run in development mode with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Clean build artifacts
npm run clean
```

### Testing

For safety, all testing should be done with `MAINWP_TEST_MODE=true` enabled.

```bash
# Run smoke test (safe, no side effects)
npm run smoke-test
```

## Code Style

### TypeScript Guidelines

- Use TypeScript strict mode
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

### File Organization

- Keep files focused on a single responsibility
- Use descriptive file names
- Follow the existing directory structure:
  ```
  src/
  ├── clients/          # API clients
  ├── tools/           # MCP tool implementations
  ├── types/           # TypeScript interfaces
  ├── schemas/         # Zod validation schemas
  └── utils/           # Utility functions
  ```

### JSDoc Standards

Add JSDoc comments for all exported functions and classes:

```typescript
/**
 * Describes what the function does
 * @param paramName - Description of the parameter
 * @returns Description of the return value
 * @throws {ErrorType} Description of error conditions
 */
export function myFunction(paramName: string): Promise<string> {
  // implementation
}
```

## Testing

### Unit Tests

Currently, the project does not have a formal unit testing framework. When adding new features:

1. Test manually with a real MainWP Dashboard (in test mode)
2. Verify all tool schemas are correct
3. Test error conditions and edge cases

### Integration Tests

Use the smoke test script to verify all tools are working:

```bash
npm run smoke-test
```

## Submitting Changes

### Pull Request Process

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and ensure they pass linting:
   ```bash
   npm run lint
   npm run build
   ```

3. Test your changes thoroughly (use test mode!)

4. Commit your changes:
   ```bash
   git commit -m "feat: add new tool for X"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request on the main repository

### Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build process or auxiliary tool changes

Examples:
```
feat(tools): add mainwp_sites_health_check tool
fix(api): handle rate limiting errors properly
docs(readme): update installation instructions
```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment Information**
   - Node.js version
   - npm version
   - Operating system
   - MainWP Dashboard version

2. **Steps to Reproduce**
   - Clear, step-by-step instructions
   - Sample commands or API calls
   - Expected vs actual behavior

3. **Error Messages**
   - Full error stack traces
   - Screenshots if applicable

4. **Additional Context**
   - Any relevant configuration
   - Network environment details

### Issue Template

```markdown
## Bug Description
Brief description of the issue

## Environment
- Node.js: [version]
- npm: [version]
- OS: [name and version]
- MainWP: [version]

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
error message here
```

## Additional Context
Any other relevant information
```

## Feature Requests

### Suggesting New Features

When suggesting new features:

1. Check if the feature already exists
2. Describe the use case and problem it solves
3. Provide examples of how it should work
4. Consider the safety implications

### Feature Request Template

```markdown
## Feature Description
Brief description of the requested feature

## Use Case
What problem does this feature solve? Who is it for?

## Proposed Implementation
How should this feature work? Include:
- Tool name and parameters
- Expected behavior
- Any configuration options needed

## Alternatives Considered
What other approaches did you consider?

## Additional Context
Any other relevant information
```

## Development Guidelines

### Adding New Tools

1. **Create Tool Schema** in `src/schemas/tool-schemas.ts`:
   ```typescript
   export const newToolSchema = z.object({
     param1: z.string().describe('Description of parameter'),
     param2: z.boolean().optional().describe('Optional parameter'),
   });
   ```

2. **Implement Tool Logic** in appropriate `src/tools/*.ts` file:
   ```typescript
   server.tool(
     'mainwp_new_tool',
     'Description of what the tool does',
     newToolSchema.shape,
     async ({ param1, param2 }) => {
       // implementation
     }
   );
   ```

3. **Register Tool** in `src/tools/index.ts`

4. **Add API Method** in `src/clients/mainwp-api-client.ts` if needed

5. **Update Documentation** in README.md

### Safety Considerations

- All destructive operations should default to dry-run mode
- Bulk operations should require confirmation
- Add proper error handling for API failures
- Validate all inputs with Zod schemas
- Test with `MAINWP_TEST_MODE=true` first

## Community

- Join discussions in GitHub Issues
- Ask questions in Discussions
- Follow the project for updates

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.