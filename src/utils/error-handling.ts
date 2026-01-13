/**
 * Error handling utilities
 */

import type { ToolResult } from '../types/mainwp-types.js';

/**
 * Create a successful tool result
 */
export function createSuccessResult(data: unknown): ToolResult {
  return {
    content: [{
      type: 'text',
      text: typeof data === 'string' ? data : JSON.stringify(data, null, 2),
    }],
  };
}

/**
 * Create an error tool result
 */
export function createErrorResult(message: string, error?: unknown): ToolResult {
  let errorMessage = message;

  if (error instanceof Error) {
    errorMessage = `${message}: ${error.message}`;
  } else if (error) {
    errorMessage = `${message}: ${String(error)}`;
  }

  return {
    content: [{
      type: 'text',
      text: errorMessage,
    }],
    isError: true,
  };
}

/**
 * Wrap an async operation with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorPrefix: string
): Promise<ToolResult> {
  try {
    const result = await operation();
    return createSuccessResult(result);
  } catch (error) {
    return createErrorResult(errorPrefix, error);
  }
}
