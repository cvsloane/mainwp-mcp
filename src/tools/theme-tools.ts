/**
 * Theme management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import { listThemesSchema, activateThemeSchema } from '../schemas/tool-schemas.js';
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
}
