/**
 * Update management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listUpdatesSchema,
  applyUpdatesSchema,
  updateTranslationsSchema,
  ignoreUpdateSchema,
  unignoreUpdateSchema,
  listIgnoredUpdatesSchema,
} from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';
import { createDryRunResult, createTestModeResult, isTestMode, resolveDryRun } from '../utils/safety.js';

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
        const testMode = isTestMode();
        const effectiveDryRun = testMode ? true : resolveDryRun(dry_run);
        // Parse items if provided
        const itemList = items ? items.split(',').map(s => s.trim()).filter(Boolean) : undefined;

        // Determine what updates will be applied
        const updateDescription = itemList
          ? `${type} updates for: ${itemList.join(', ')}`
          : `all ${type} updates`;

        // Handle dry-run mode
        if (effectiveDryRun) {
          // Fetch current updates to show what would be applied
          const updates = await client.getSiteUpdates(site);

          const details = {
            type,
            items: itemList || 'all',
            current_updates: updates,
          };

          return testMode
            ? createTestModeResult(`Apply ${updateDescription} on ${site}`, [site], details)
            : createDryRunResult(`Apply ${updateDescription} on ${site}`, [site], details);
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
        const testMode = isTestMode();
        const effectiveDryRun = testMode ? true : resolveDryRun(dry_run);

        if (effectiveDryRun) {
          const updates = await client.getSiteUpdates(site);
          const details = { current_updates: updates };
          return testMode
            ? createTestModeResult(`Update WordPress core on ${site}`, [site], details)
            : createDryRunResult(`Update WordPress core on ${site}`, [site], details);
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
        const testMode = isTestMode();
        const effectiveDryRun = testMode ? true : resolveDryRun(dry_run);

        if (effectiveDryRun) {
          const updates = await client.getSiteUpdates(site);
          const details = {
            plugins: pluginList || 'all',
            current_updates: updates,
          };
          return testMode
            ? createTestModeResult(`Update ${target} on ${site}`, [site], details)
            : createDryRunResult(`Update ${target} on ${site}`, [site], details);
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
        const testMode = isTestMode();
        const effectiveDryRun = testMode ? true : resolveDryRun(dry_run);

        if (effectiveDryRun) {
          const updates = await client.getSiteUpdates(site);
          const details = {
            themes: themeList || 'all',
            current_updates: updates,
          };
          return testMode
            ? createTestModeResult(`Update ${target} on ${site}`, [site], details)
            : createDryRunResult(`Update ${target} on ${site}`, [site], details);
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

  // Update translations
  server.tool(
    'mainwp_updates_translations',
    'Update translations on a WordPress site',
    updateTranslationsSchema.shape,
    async ({ site, dry_run }) => {
      try {
        const testMode = isTestMode();
        const effectiveDryRun = testMode ? true : resolveDryRun(dry_run);

        if (effectiveDryRun) {
          const updates = await client.getSiteUpdates(site);
          const details = { current_updates: updates };
          return testMode
            ? createTestModeResult(`Update translations on ${site}`, [site], details)
            : createDryRunResult(`Update translations on ${site}`, [site], details);
        }

        const result = await client.updateTranslations(site);
        return createSuccessResult({
          message: `Successfully updated translations on ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to update translations on ${site}`, error);
      }
    }
  );

  // Ignore an update
  server.tool(
    'mainwp_updates_ignore',
    'Ignore a plugin or theme update (globally or for a specific site)',
    ignoreUpdateSchema.shape,
    async ({ type, slug, site }) => {
      try {
        if (!slug || slug.trim() === '') {
          return createErrorResult(`${type} slug is required`);
        }

        if (isTestMode()) {
          return createTestModeResult(
            `Ignore ${type} "${slug}" updates`,
            site ? [site] : ['global'],
            { type, slug, site }
          );
        }

        const result = await client.ignoreUpdate({ type, slug, site });
        const scope = site ? `on ${site}` : 'globally';
        return createSuccessResult({
          message: `Successfully ignored ${type} "${slug}" updates ${scope}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to ignore ${type} "${slug}" update`, error);
      }
    }
  );

  // Unignore an update
  server.tool(
    'mainwp_updates_unignore',
    'Stop ignoring a plugin or theme update',
    unignoreUpdateSchema.shape,
    async ({ type, slug, site }) => {
      try {
        if (!slug || slug.trim() === '') {
          return createErrorResult(`${type} slug is required`);
        }

        if (isTestMode()) {
          return createTestModeResult(
            `Unignore ${type} "${slug}" updates`,
            site ? [site] : ['global'],
            { type, slug, site }
          );
        }

        const result = await client.unignoreUpdate({ type, slug, site });
        const scope = site ? `on ${site}` : 'globally';
        return createSuccessResult({
          message: `Successfully unignored ${type} "${slug}" updates ${scope}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to unignore ${type} "${slug}" update`, error);
      }
    }
  );

  // List ignored updates
  server.tool(
    'mainwp_updates_ignored',
    'List all ignored plugin and theme updates',
    listIgnoredUpdatesSchema.shape,
    async ({ site }) => {
      try {
        const result = await client.listIgnoredUpdates(site ? { site } : undefined);
        return createSuccessResult({
          filter: site ? { site } : 'all',
          ...result,
        });
      } catch (error) {
        return createErrorResult('Failed to list ignored updates', error);
      }
    }
  );
}
