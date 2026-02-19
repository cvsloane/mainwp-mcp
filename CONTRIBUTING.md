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

### First-Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/mainwp-mcp.git
   cd mainwp-mcp
   ```
3. **Set up your environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your MainWP Dashboard credentials
   npm install
   npm run build
   ```
4. **Verify the setup**:
   ```bash
   npm start
   ```

## Development Setup

### Project Structure

```
mainwp-mcp/
├── src/
│   ├── index.ts                 # Entry point
│   ├── server.ts                # MCP server setup
│   ├── clients/
│   │   └── mainwp-api-client.ts # REST API HTTP client
│   ├── tools/
│   │   ├── index.ts             # Tool registration
│   │   ├── site-tools.ts        # Site management tools
│   │   ├── update-tools.ts      # Update tools
│   │   ├── plugin-tools.ts      # Plugin tools
│   │   ├── theme-tools.ts       # Theme tools
│   │   ├── client-tools.ts      # Client management tools
│   │   ├── cost-tools.ts        # Cost tracking tools
│   │   └── tag-tools.ts         # Tag management tools
│   ├── types/
│   │   └── mainwp-types.ts      # TypeScript interfaces
│   ├── schemas/
│   │   └── tool-schemas.ts      # Zod validation schemas
│   └── utils/
│       ├── safety.ts            # Dry-run & confirmation logic
│       └── error-handling.ts    # Error utilities
├── dist/                        # Compiled JavaScript (git-ignored)
├── scripts/                     # Utility scripts
├── .env.example                 # Environment template
├── .env.local                   # Your config (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

### Development Commands

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean build artifacts
npm run clean

# Run linting
npm run lint

# Run smoke test (no side effects)
npm run smoke-test
```

### Adding New Tools

1. **Create tool file** in `src/tools/` (e.g., `new-tools.ts`)
2. **Define tool schema** in `src/schemas/tool-schemas.ts`
3. **Register the tool** in `src/tools/index.ts`
4. **Add API methods** in `src/clients/mainwp-api-client.ts`
5. **Update documentation** in README.md
6. **Build and test**:
   ```bash
   npm run build
   npm start
   ```

Example tool structure:
```typescript
// src/tools/new-tools.ts
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import { newToolSchema } from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';

export function registerNewTools(server: McpServer): void {
  const client = getMainWPClient();

  server.tool(
    'mainwp_new_tool',
    'Description of what this tool does',
    newToolSchema.shape,
    async ({ param1, param2 }) => {
      try {
        const result = await client.someApiCall(param1, param2);
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult('Failed to perform operation', error);
      }
    }
  );
}
```

## Code Style

### TypeScript Guidelines

- **Use TypeScript types** for all function parameters and return values
- **Export interfaces** for complex data structures
- **Use Zod schemas** for tool input validation
- **Follow existing naming conventions** (camelCase for functions, PascalCase for classes/interfaces)

### Documentation Standards

- **JSDoc comments** for all exported functions and classes
- **Clear parameter descriptions** with types
- **Return value documentation**
- **Error handling documentation** where relevant

Example:
```typescript
/**
 * Perform an operation on a MainWP site
 * @param siteId - The site ID or domain to operate on
 * @param options - Operation options
 * @returns Promise resolving to the operation result
 * @throws Error if the operation fails
 */
export async function performSiteOperation(
  siteId: string,
  options: OperationOptions
): Promise<OperationResult> {
  // implementation
}
```

### Error Handling

- **Use createSuccessResult and createErrorResult** utilities
- **Provide meaningful error messages**
- **Handle API errors gracefully** with proper status codes
- **Log errors appropriately** for debugging

## Testing

### Manual Testing

1. **Test with real MainWP Dashboard** - Ensure you have a test environment
2. **Use dry-run mode** for destructive operations:
   ```bash
   MAINWP_ENABLE_DRY_RUN_BY_DEFAULT=true npm start
   ```
3. **Test edge cases** - invalid inputs, error responses, etc.
4. **Verify Claude Code integration** - Test tools through Claude Code interface

### Smoke Testing

Use the provided smoke test script to verify all tools work without side effects:
```bash
npm run smoke-test
```

## Submitting Changes

### Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. **Make your changes** following the guidelines above
3. **Update documentation** if adding new features
4. **Build and test** your changes:
   ```bash
   npm run build
   npm run lint
   ```
5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request** on GitHub

### Commit Message Guidelines

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): description

[optional body]

[optional footer(s)]
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
feat: add plugin management tools
fix: handle API timeout errors properly
docs: update installation instructions
test: add smoke test for site tools
```

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Environment details**:
   - Node.js version
   - MainWP MCP Server version
   - MainWP Dashboard version
   - Browser/OS (if applicable)

2. **Steps to reproduce**:
   - Clear, step-by-step instructions
   - Sample commands or API calls

3. **Expected behavior**:
   - What should happen

4. **Actual behavior**:
   - What actually happened

5. **Error messages**:
   - Full error logs and stack traces

6. **Additional context**:
   - Screenshots if helpful
   - Any other relevant information

### Issue Template

```markdown
## Bug Report

**Description**: A clear description of the bug

**Environment**:
- Node.js: [version]
- MainWP MCP: [version]
- MainWP Dashboard: [version]

**Steps to Reproduce**:
1. Step one
2. Step two
3. Step three

**Expected Behavior**: What should happen

**Actual Behavior**: What actually happened

**Error Messages**:
```
[error output here]
```

**Additional Context**: Any other relevant information
```

## Feature Requests

### Suggesting Features

When suggesting new features, please include:

1. **Problem statement**: What problem are you trying to solve?
2. **Proposed solution**: How would you like this feature to work?
3. **Use cases**: Who would benefit from this feature?
4. **Alternatives**: Any alternative approaches you've considered?

### Feature Request Template

```markdown
## Feature Request

**Problem**: Describe the problem you're trying to solve

**Proposed Solution**: Describe your proposed solution

**Use Cases**: 
- Use case 1
- Use case 2
- Use case 3

**Alternatives Considered**: List any alternatives you've considered

**Additional Context**: Any other relevant information
```

## Development Status

This project is actively maintained. For the latest development activity, see [project_status.md](./project_status.md).

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Getting Help

If you need help with development:

1. **Check the README** first for setup and usage instructions
2. **Search existing issues** on GitHub
3. **Open a new issue** if you can't find a solution
4. **Join discussions** in existing issues and PRs

Thank you for contributing to MainWP MCP Server! 🚀