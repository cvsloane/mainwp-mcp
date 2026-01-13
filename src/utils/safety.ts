/**
 * Safety utilities for destructive operations
 */

import type { ToolResult } from '../types/mainwp-types.js';

/**
 * Check if dry-run mode is enabled by default
 */
export function isDryRunDefault(): boolean {
  return process.env.MAINWP_ENABLE_DRY_RUN_BY_DEFAULT === 'true';
}

/**
 * Resolve the effective dry-run value for a tool invocation.
 * If the caller does not provide dry_run, fall back to env default.
 */
export function resolveDryRun(dryRun?: boolean): boolean {
  return typeof dryRun === 'boolean' ? dryRun : isDryRunDefault();
}

/**
 * Check if test mode is enabled (no side effects)
 */
export function isTestMode(): boolean {
  return process.env.MAINWP_TEST_MODE === 'true';
}

/**
 * Check if bulk operations require confirmation
 */
export function requiresBulkConfirmation(): boolean {
  return process.env.MAINWP_REQUIRE_CONFIRMATION_BULK === 'true';
}

/**
 * Create a dry-run result showing what would happen
 */
export function createDryRunResult(
  operation: string,
  targets: string[],
  details?: Record<string, unknown>
): ToolResult {
  const message = [
    `DRY RUN - ${operation}`,
    '',
    `Would affect ${targets.length} target(s):`,
    ...targets.map(t => `  - ${t}`),
  ];

  if (details) {
    message.push('', 'Details:', JSON.stringify(details, null, 2));
  }

  message.push('', 'To execute this operation, set dry_run=false');

  return {
    content: [{
      type: 'text',
      text: message.join('\n'),
    }],
  };
}

/**
 * Create a test-mode result showing what would happen without side effects
 */
export function createTestModeResult(
  operation: string,
  targets: string[],
  details?: Record<string, unknown>
): ToolResult {
  const message = [
    `TEST MODE - ${operation}`,
    '',
    `Would affect ${targets.length} target(s):`,
    ...targets.map(t => `  - ${t}`),
  ];

  if (details) {
    message.push('', 'Details:', JSON.stringify(details, null, 2));
  }

  message.push('', 'No API call was made. Disable MAINWP_TEST_MODE to execute.');

  return {
    content: [{
      type: 'text',
      text: message.join('\n'),
    }],
  };
}

/**
 * Check if bulk operation is allowed
 */
export function checkBulkOperation(
  targetCount: number,
  confirmed: boolean
): { allowed: boolean; message?: string } {
  if (targetCount <= 1) {
    return { allowed: true };
  }

  if (!requiresBulkConfirmation()) {
    return { allowed: true };
  }

  if (!confirmed) {
    return {
      allowed: false,
      message: `This operation affects ${targetCount} targets. Set confirmed=true to proceed with bulk operation.`,
    };
  }

  return { allowed: true };
}

/**
 * Validate that a site ID or domain is provided
 */
export function validateSiteIdentifier(idOrDomain: string | undefined): {
  valid: boolean;
  message?: string;
} {
  if (!idOrDomain || idOrDomain.trim() === '') {
    return {
      valid: false,
      message: 'Site ID or domain is required',
    };
  }

  return { valid: true };
}

/**
 * Parse site identifiers from various formats
 */
export function parseSiteIdentifiers(input: string | string[]): string[] {
  if (Array.isArray(input)) {
    return input.map(s => s.trim()).filter(Boolean);
  }

  // Handle comma-separated string
  return input.split(',').map(s => s.trim()).filter(Boolean);
}
