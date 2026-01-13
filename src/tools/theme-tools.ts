/**
 * Theme management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listThemesSchema,
  activateThemeSchema,
  installThemeSchema,
  deleteThemeSchema,
} from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';
import { createDryRunResult } from '../utils/safety.js';

export function registerThemeTools(server: McpServer): void {
  const client = getMainWPClient();

  // List themes on a site
  server.tool(
    'mainwp_themes_list',
    'List all themes installed on a WordPress site',
    listThemesSchema.shape,
    async ({ site }) => {
      try {
        const result = await client.listThemes(site);
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult(`Failed to list themes on ${site}`, error);
      }
    }
  );

  // Activate theme
  server.tool(
    'mainwp_themes_activate',
    'Activate a theme on a WordPress site',
    activateThemeSchema.shape,
    async ({ site, theme, dry_run }) => {
      try {
        if (!theme || theme.trim() === '') {
          return createErrorResult('Theme slug is required');
        }

        if (dry_run) {
          return createDryRunResult(
            `Activate theme "${theme}" on ${site}`,
            [site],
            { theme, action: 'activate' }
          );
        }

        const result = await client.activateTheme(site, theme);
        return createSuccessResult({
          message: `Successfully activated theme "${theme}" on ${site}`,
          theme,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to activate theme on ${site}`, error);
      }
    }
  );

  // Install theme
  server.tool(
    'mainwp_themes_install',
    'Install a theme from WordPress.org on a site',
    installThemeSchema.shape,
    async ({ site, slug, dry_run }) => {
      try {
        if (!slug || slug.trim() === '') {
          return createErrorResult('Theme slug is required');
        }

        if (dry_run) {
          return createDryRunResult(
            `Install theme "${slug}" on ${site}`,
            [site],
            { theme: slug, action: 'install' }
          );
        }

        const result = await client.installTheme(site, slug);
        return createSuccessResult({
          message: `Successfully installed theme "${slug}" on ${site}`,
          theme: slug,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to install theme "${slug}" on ${site}`, error);
      }
    }
  );

  // Delete theme
  server.tool(
    'mainwp_themes_delete',
    'Delete a theme from a WordPress site (must not be active)',
    deleteThemeSchema.shape,
    async ({ site, slug, dry_run }) => {
      try {
        if (!slug || slug.trim() === '') {
          return createErrorResult('Theme slug is required');
        }

        if (dry_run) {
          return createDryRunResult(
            `Delete theme "${slug}" from ${site}`,
            [site],
            { theme: slug, action: 'delete' }
          );
        }

        const result = await client.deleteTheme(site, slug);
        return createSuccessResult({
          message: `Successfully deleted theme "${slug}" from ${site}`,
          theme: slug,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to delete theme "${slug}" from ${site}`, error);
      }
    }
  );
}
