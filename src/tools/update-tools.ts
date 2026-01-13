/**
 * Update management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import { listUpdatesSchema, applyUpdatesSchema } from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';
import { createDryRunResult, isDryRunDefault } from '../utils/safety.js';

export function registerUpdateTools(server: McpServer): void {
  const client = getMainWPClient();

  // List pending updates
  server.tool(
    'mainwp_updates_list',
    'List all pending updates across WordPress sites (core, plugins, themes)',
    listUpdatesSchema.shape,
    async ({ site }) => {
      try {
        if (site) {
          const result = await client.getSiteUpdates(site);
          return createSuccessResult(result);
        } else {
          const result = await client.listUpdates();
          return createSuccessResult(result);
        }
      } catch (error) {
        return createErrorResult('Failed to list updates', error);
      }
    }
  );

  // Apply updates
  server.tool(
    'mainwp_updates_apply',
    'Apply updates to a WordPress site (supports dry-run mode)',
    applyUpdatesSchema.shape,
    async ({ site, type, items, dry_run }) => {
      try {
        // Parse items if provided
        const itemList = items ? items.split(',').map(s => s.trim()).filter(Boolean) : undefined;

        // Determine what updates will be applied
        const updateDescription = itemList
          ? `${type} updates for: ${itemList.join(', ')}`
          : `all ${type} updates`;

        // Handle dry-run mode
        if (dry_run) {
          // Fetch current updates to show what would be applied
          const updates = await client.getSiteUpdates(site);

          return createDryRunResult(
            `Apply ${updateDescription} on ${site}`,
            [site],
            {
              type,
              items: itemList || 'all',
              current_updates: updates,
            }
          );
        }

        // Execute the actual updates
        let result;
        switch (type) {
          case 'wp':
            result = await client.updateWordPress(site);
            break;
          case 'plugins':
            result = await client.updatePlugins(site, itemList);
            break;
          case 'themes':
            result = await client.updateThemes(site, itemList);
            break;
          case 'all':
            // Apply all update types sequentially
            const wpResult = await client.updateWordPress(site);
            const pluginsResult = await client.updatePlugins(site);
            const themesResult = await client.updateThemes(site);
            result = {
              wordpress: wpResult,
              plugins: pluginsResult,
              themes: themesResult,
            };
            break;
        }

        return createSuccessResult({
          message: `Successfully applied ${updateDescription} on ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to apply updates on ${site}`, error);
      }
    }
  );

  // Update WordPress core only
  server.tool(
    'mainwp_updates_wp',
    'Update WordPress core to the latest version',
    {
      site: applyUpdatesSchema.shape.site,
      dry_run: applyUpdatesSchema.shape.dry_run,
    },
    async ({ site, dry_run }) => {
      try {
        if (dry_run) {
          const updates = await client.getSiteUpdates(site);
          return createDryRunResult(
            `Update WordPress core on ${site}`,
            [site],
            { current_updates: updates }
          );
        }

        const result = await client.updateWordPress(site);
        return createSuccessResult({
          message: `Successfully updated WordPress on ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to update WordPress on ${site}`, error);
      }
    }
  );

  // Update plugins
  server.tool(
    'mainwp_updates_plugins',
    'Update plugins on a WordPress site',
    {
      site: applyUpdatesSchema.shape.site,
      plugins: applyUpdatesSchema.shape.items,
      dry_run: applyUpdatesSchema.shape.dry_run,
    },
    async ({ site, plugins, dry_run }) => {
      try {
        const pluginList = plugins ? plugins.split(',').map(s => s.trim()).filter(Boolean) : undefined;
        const target = pluginList ? pluginList.join(', ') : 'all plugins';

        if (dry_run) {
          const updates = await client.getSiteUpdates(site);
          return createDryRunResult(
            `Update ${target} on ${site}`,
            [site],
            {
              plugins: pluginList || 'all',
              current_updates: updates,
            }
          );
        }

        const result = await client.updatePlugins(site, pluginList);
        return createSuccessResult({
          message: `Successfully updated ${target} on ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to update plugins on ${site}`, error);
      }
    }
  );

  // Update themes
  server.tool(
    'mainwp_updates_themes',
    'Update themes on a WordPress site',
    {
      site: applyUpdatesSchema.shape.site,
      themes: applyUpdatesSchema.shape.items,
      dry_run: applyUpdatesSchema.shape.dry_run,
    },
    async ({ site, themes, dry_run }) => {
      try {
        const themeList = themes ? themes.split(',').map(s => s.trim()).filter(Boolean) : undefined;
        const target = themeList ? themeList.join(', ') : 'all themes';

        if (dry_run) {
          const updates = await client.getSiteUpdates(site);
          return createDryRunResult(
            `Update ${target} on ${site}`,
            [site],
            {
              themes: themeList || 'all',
              current_updates: updates,
            }
          );
        }

        const result = await client.updateThemes(site, themeList);
        return createSuccessResult({
          message: `Successfully updated ${target} on ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to update themes on ${site}`, error);
      }
    }
  );
}
