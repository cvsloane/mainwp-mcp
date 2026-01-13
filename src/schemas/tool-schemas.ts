/**
 * Zod schemas for MCP tool parameters
 */

import { z } from 'zod';

// Common schemas
export const siteIdentifierSchema = z.string().describe(
  'Site ID (number) or domain name (e.g., "1" or "pavinglist.com")'
);

export const dryRunSchema = z.boolean().default(true).describe(
  'Simulate the operation without making changes (default: true)'
);

export const confirmedSchema = z.boolean().default(false).describe(
  'Confirm bulk operation affecting multiple sites (required for bulk ops)'
);

// Site tool schemas
export const listSitesSchema = z.object({
  format: z.enum(['full', 'basic']).default('full').describe(
    'Response format: full (all details) or basic (id, name, url, status)'
  ),
});

export const getSiteSchema = z.object({
  site: siteIdentifierSchema,
});

export const syncSiteSchema = z.object({
  site: siteIdentifierSchema.optional().describe(
    'Site to sync. Omit to sync all sites.'
  ),
  confirmed: confirmedSchema,
});

export const checkSiteSchema = z.object({
  site: siteIdentifierSchema,
});

export const addSiteSchema = z.object({
  url: z.string().url().describe('Full URL of the WordPress site'),
  name: z.string().optional().describe('Display name for the site'),
  admin: z.string().optional().describe('WordPress admin username'),
  uniqueId: z.string().optional().describe('MainWP Child unique security ID'),
  ssl_verify: z.boolean().default(true).describe('Verify SSL certificate'),
  groupids: z.string().optional().describe('Comma-separated group IDs'),
});

// Plugin tool schemas
export const listPluginsSchema = z.object({
  site: siteIdentifierSchema,
});

export const activatePluginSchema = z.object({
  site: siteIdentifierSchema,
  plugins: z.string().describe('Plugin slug(s) to activate, comma-separated'),
  dry_run: dryRunSchema,
});

export const deactivatePluginSchema = z.object({
  site: siteIdentifierSchema,
  plugins: z.string().describe('Plugin slug(s) to deactivate, comma-separated'),
  dry_run: dryRunSchema,
});

// Theme tool schemas
export const listThemesSchema = z.object({
  site: siteIdentifierSchema,
});

export const activateThemeSchema = z.object({
  site: siteIdentifierSchema,
  theme: z.string().describe('Theme slug to activate'),
  dry_run: dryRunSchema,
});

// Update tool schemas
export const listUpdatesSchema = z.object({
  site: siteIdentifierSchema.optional().describe(
    'Filter updates for a specific site. Omit for all sites.'
  ),
});

export const applyUpdatesSchema = z.object({
  site: siteIdentifierSchema,
  type: z.enum(['wp', 'plugins', 'themes', 'all']).describe(
    'Type of updates to apply'
  ),
  items: z.string().optional().describe(
    'Specific plugin/theme slugs to update (comma-separated). Omit to update all.'
  ),
  dry_run: dryRunSchema,
});

// Bulk operation schemas
export const bulkSyncSchema = z.object({
  sites: z.string().optional().describe(
    'Comma-separated site IDs/domains. Omit to sync all sites.'
  ),
  confirmed: confirmedSchema,
});

export const bulkUpdateSchema = z.object({
  sites: z.string().optional().describe(
    'Comma-separated site IDs/domains. Omit to update all sites.'
  ),
  type: z.enum(['wp', 'plugins', 'themes', 'all']).describe(
    'Type of updates to apply'
  ),
  dry_run: dryRunSchema,
  confirmed: confirmedSchema,
});
