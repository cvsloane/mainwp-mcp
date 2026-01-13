/**
 * Plugin management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listPluginsSchema,
  activatePluginSchema,
  deactivatePluginSchema,
  installPluginSchema,
  deletePluginSchema,
} from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';
import { createDryRunResult } from '../utils/safety.js';

export function registerPluginTools(server: McpServer): void {
  const client = getMainWPClient();

  // List plugins on a site
  server.tool(
    'mainwp_plugins_list',
    'List all plugins installed on a WordPress site',
    listPluginsSchema.shape,
    async ({ site }) => {
      try {
        const result = await client.listPlugins(site);
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult(`Failed to list plugins on ${site}`, error);
      }
    }
  );

  // Activate plugins
  server.tool(
    'mainwp_plugins_activate',
    'Activate one or more plugins on a WordPress site',
    activatePluginSchema.shape,
    async ({ site, plugins, dry_run }) => {
      try {
        const pluginList = plugins.split(',').map(s => s.trim()).filter(Boolean);

        if (pluginList.length === 0) {
          return createErrorResult('At least one plugin slug is required');
        }

        if (dry_run) {
          return createDryRunResult(
            `Activate plugins on ${site}`,
            pluginList,
            { site, action: 'activate' }
          );
        }

        const result = await client.activatePlugins(site, pluginList);
        return createSuccessResult({
          message: `Successfully activated ${pluginList.length} plugin(s) on ${site}`,
          plugins: pluginList,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to activate plugins on ${site}`, error);
      }
    }
  );

  // Deactivate plugins
  server.tool(
    'mainwp_plugins_deactivate',
    'Deactivate one or more plugins on a WordPress site',
    deactivatePluginSchema.shape,
    async ({ site, plugins, dry_run }) => {
      try {
        const pluginList = plugins.split(',').map(s => s.trim()).filter(Boolean);

        if (pluginList.length === 0) {
          return createErrorResult('At least one plugin slug is required');
        }

        if (dry_run) {
          return createDryRunResult(
            `Deactivate plugins on ${site}`,
            pluginList,
            { site, action: 'deactivate' }
          );
        }

        const result = await client.deactivatePlugins(site, pluginList);
        return createSuccessResult({
          message: `Successfully deactivated ${pluginList.length} plugin(s) on ${site}`,
          plugins: pluginList,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to deactivate plugins on ${site}`, error);
      }
    }
  );

  // Install plugin
  server.tool(
    'mainwp_plugins_install',
    'Install a plugin from WordPress.org on a site',
    installPluginSchema.shape,
    async ({ site, slug, dry_run }) => {
      try {
        if (!slug || slug.trim() === '') {
          return createErrorResult('Plugin slug is required');
        }

        if (dry_run) {
          return createDryRunResult(
            `Install plugin "${slug}" on ${site}`,
            [site],
            { plugin: slug, action: 'install' }
          );
        }

        const result = await client.installPlugin(site, slug);
        return createSuccessResult({
          message: `Successfully installed plugin "${slug}" on ${site}`,
          plugin: slug,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to install plugin "${slug}" on ${site}`, error);
      }
    }
  );

  // Delete plugin
  server.tool(
    'mainwp_plugins_delete',
    'Delete a plugin from a WordPress site (must be deactivated first)',
    deletePluginSchema.shape,
    async ({ site, slug, dry_run }) => {
      try {
        if (!slug || slug.trim() === '') {
          return createErrorResult('Plugin slug is required');
        }

        if (dry_run) {
          return createDryRunResult(
            `Delete plugin "${slug}" from ${site}`,
            [site],
            { plugin: slug, action: 'delete' }
          );
        }

        const result = await client.deletePlugin(site, slug);
        return createSuccessResult({
          message: `Successfully deleted plugin "${slug}" from ${site}`,
          plugin: slug,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to delete plugin "${slug}" from ${site}`, error);
      }
    }
  );
}
