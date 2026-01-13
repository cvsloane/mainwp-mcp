/**
 * Zod schemas for MCP tool parameters
 */

import { z } from 'zod';

// Common schemas
export const siteIdentifierSchema = z.string().describe(
  'Site ID (number) or domain name (e.g., "1" or "pavinglist.com")'
);

export const dryRunSchema = z.boolean().optional().describe(
  'Simulate the operation without making changes (defaults to MAINWP_ENABLE_DRY_RUN_BY_DEFAULT)'
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

// ============ Extended Site Schemas ============

export const editSiteSchema = z.object({
  site: siteIdentifierSchema,
  name: z.string().optional().describe('New display name for the site'),
  groupids: z.string().optional().describe('Comma-separated group IDs to assign'),
  dry_run: dryRunSchema,
});

export const suspendSiteSchema = z.object({
  site: siteIdentifierSchema,
  dry_run: dryRunSchema,
});

export const unsuspendSiteSchema = z.object({
  site: siteIdentifierSchema,
  dry_run: dryRunSchema,
});

export const nonMainWPChangesSchema = z.object({
  site: siteIdentifierSchema,
});

export const removeSiteSchema = z.object({
  site: siteIdentifierSchema,
  confirmed: confirmedSchema.describe('Must be true to confirm permanent deletion'),
});

// ============ Extended Plugin Schemas ============

export const installPluginSchema = z.object({
  site: siteIdentifierSchema,
  slug: z.string().describe('Plugin slug from WordPress.org (e.g., "akismet")'),
  dry_run: dryRunSchema,
});

export const deletePluginSchema = z.object({
  site: siteIdentifierSchema,
  slug: z.string().describe('Plugin slug to delete (e.g., "akismet/akismet.php")'),
  dry_run: dryRunSchema,
});

// ============ Extended Theme Schemas ============

export const installThemeSchema = z.object({
  site: siteIdentifierSchema,
  slug: z.string().describe('Theme slug from WordPress.org (e.g., "flavor")'),
  dry_run: dryRunSchema,
});

export const deleteThemeSchema = z.object({
  site: siteIdentifierSchema,
  slug: z.string().describe('Theme slug to delete (e.g., "flavor")'),
  dry_run: dryRunSchema,
});

// ============ Extended Update Schemas ============

export const updateTranslationsSchema = z.object({
  site: siteIdentifierSchema,
  dry_run: dryRunSchema,
});

export const ignoreUpdateSchema = z.object({
  type: z.enum(['plugin', 'theme']).describe('Type of update to ignore'),
  slug: z.string().describe('Plugin or theme slug to ignore'),
  site: siteIdentifierSchema.optional().describe('Specific site (omit to ignore globally)'),
});

export const unignoreUpdateSchema = z.object({
  type: z.enum(['plugin', 'theme']).describe('Type of update to unignore'),
  slug: z.string().describe('Plugin or theme slug to unignore'),
  site: siteIdentifierSchema.optional().describe('Specific site (omit for global)'),
});

export const listIgnoredUpdatesSchema = z.object({
  site: siteIdentifierSchema.optional().describe('Filter by specific site'),
});

// ============ Client Schemas (Pro) ============

export const clientIdentifierSchema = z.string().describe(
  'Client ID (number) or email address'
);

export const listClientsSchema = z.object({
  search: z.string().optional().describe('Search clients by name or email'),
  page: z.number().optional().describe('Page number for pagination'),
  per_page: z.number().optional().describe('Results per page (default: 20)'),
});

export const getClientSchema = z.object({
  client: clientIdentifierSchema,
});

export const addClientSchema = z.object({
  name: z.string().describe('Client name (required)'),
  email: z.string().email().describe('Client email address (required)'),
  company: z.string().optional().describe('Company name'),
  phone: z.string().optional().describe('Phone number'),
  address: z.string().optional().describe('Street address'),
  city: z.string().optional().describe('City'),
  state: z.string().optional().describe('State/Province'),
  zip: z.string().optional().describe('ZIP/Postal code'),
  country: z.string().optional().describe('Country'),
  note: z.string().optional().describe('Internal notes about client'),
  selected_sites: z.string().optional().describe('Comma-separated site IDs to assign'),
});

export const editClientSchema = z.object({
  client: clientIdentifierSchema,
  name: z.string().optional().describe('Updated client name'),
  email: z.string().email().optional().describe('Updated email address'),
  company: z.string().optional().describe('Company name'),
  phone: z.string().optional().describe('Phone number'),
  address: z.string().optional().describe('Street address'),
  city: z.string().optional().describe('City'),
  state: z.string().optional().describe('State/Province'),
  zip: z.string().optional().describe('ZIP/Postal code'),
  country: z.string().optional().describe('Country'),
  note: z.string().optional().describe('Internal notes'),
  selected_sites: z.string().optional().describe('Comma-separated site IDs'),
  dry_run: dryRunSchema,
});

export const deleteClientSchema = z.object({
  client: clientIdentifierSchema,
  confirmed: confirmedSchema.describe('Must be true to confirm deletion'),
});

// ============ Cost Schemas (Pro) ============

export const costIdentifierSchema = z.string().describe('Cost ID (number)');

export const listCostsSchema = z.object({
  search: z.string().optional().describe('Search costs by name'),
  type: z.enum(['single', 'recurring']).optional().describe('Filter by cost type'),
  product_type: z.enum(['plugin', 'theme', 'hosting', 'domain', 'service', 'other']).optional()
    .describe('Filter by product type'),
  page: z.number().optional().describe('Page number for pagination'),
  per_page: z.number().optional().describe('Results per page (default: 20)'),
});

export const getCostSchema = z.object({
  cost: costIdentifierSchema,
});

export const addCostSchema = z.object({
  name: z.string().describe('Cost name/description (required)'),
  type: z.enum(['single', 'recurring']).default('single').describe('One-time or recurring cost'),
  product_type: z.enum(['plugin', 'theme', 'hosting', 'domain', 'service', 'other']).default('other')
    .describe('Category of the cost'),
  price: z.number().optional().describe('Cost amount'),
  currency: z.string().default('USD').describe('Currency code (e.g., USD, EUR)'),
  renewal_frequency: z.enum(['monthly', 'yearly', 'lifetime']).optional()
    .describe('For recurring costs: billing frequency'),
  last_renewal: z.string().optional().describe('Last renewal date (YYYY-MM-DD)'),
  next_renewal: z.string().optional().describe('Next renewal date (YYYY-MM-DD)'),
  sites: z.string().optional().describe('Comma-separated site IDs this cost applies to'),
  note: z.string().optional().describe('Additional notes'),
});

export const editCostSchema = z.object({
  cost: costIdentifierSchema,
  name: z.string().optional().describe('Updated cost name'),
  type: z.enum(['single', 'recurring']).optional().describe('Cost type'),
  product_type: z.enum(['plugin', 'theme', 'hosting', 'domain', 'service', 'other']).optional()
    .describe('Product category'),
  price: z.number().optional().describe('Cost amount'),
  currency: z.string().optional().describe('Currency code'),
  renewal_frequency: z.enum(['monthly', 'yearly', 'lifetime']).optional()
    .describe('Billing frequency'),
  last_renewal: z.string().optional().describe('Last renewal date'),
  next_renewal: z.string().optional().describe('Next renewal date'),
  sites: z.string().optional().describe('Site IDs this cost applies to'),
  note: z.string().optional().describe('Additional notes'),
  dry_run: dryRunSchema,
});

export const deleteCostSchema = z.object({
  cost: costIdentifierSchema,
  confirmed: confirmedSchema.describe('Must be true to confirm deletion'),
});

// ============ Tag Schemas ============

export const listTagsSchema = z.object({
  search: z.string().optional().describe('Search tags by name'),
});

export const getTagSitesSchema = z.object({
  tag: z.string().describe('Tag ID or name'),
});
