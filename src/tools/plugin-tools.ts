/**
 * Plugin management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listPluginsSchema,
  activatePluginSchema,
  deactivatePluginSchema,
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
}
