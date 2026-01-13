/**
 * Site management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listSitesSchema,
  getSiteSchema,
  syncSiteSchema,
  checkSiteSchema,
  addSiteSchema,
} from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';
import { checkBulkOperation } from '../utils/safety.js';

export function registerSiteTools(server: McpServer): void {
  const client = getMainWPClient();

  // List all sites
  server.tool(
    'mainwp_sites_list',
    'List all WordPress sites connected to MainWP Dashboard',
    listSitesSchema.shape,
    async ({ format }) => {
      try {
        const result = format === 'basic'
          ? await client.listSitesBasic()
          : await client.listSites();
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult('Failed to list sites', error);
      }
    }
  );

  // Get single site
  server.tool(
    'mainwp_sites_get',
    'Get detailed information about a specific WordPress site',
    getSiteSchema.shape,
    async ({ site }) => {
      try {
        const result = await client.getSite(site);
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult(`Failed to get site ${site}`, error);
      }
    }
  );

  // Sync site(s)
  server.tool(
    'mainwp_sites_sync',
    'Sync data from WordPress site(s) to MainWP Dashboard',
    syncSiteSchema.shape,
    async ({ site, confirmed }) => {
      try {
        if (site) {
          // Sync single site
          const result = await client.syncSite(site);
          return createSuccessResult({
            message: `Successfully synced site: ${site}`,
            result,
          });
        } else {
          // Sync all sites - requires confirmation
          const bulkCheck = checkBulkOperation(999, confirmed);
          if (!bulkCheck.allowed) {
            return createErrorResult(bulkCheck.message ?? 'Bulk operation not allowed');
          }

          const result = await client.syncAllSites();
          return createSuccessResult({
            message: 'Successfully initiated sync for all sites',
            result,
          });
        }
      } catch (error) {
        return createErrorResult('Failed to sync site(s)', error);
      }
    }
  );

  // Check site health
  server.tool(
    'mainwp_sites_check',
    'Check the health and connectivity status of a WordPress site',
    checkSiteSchema.shape,
    async ({ site }) => {
      try {
        const result = await client.checkSite(site);
        return createSuccessResult({
          message: `Health check completed for: ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to check site ${site}`, error);
      }
    }
  );

  // Get site count
  server.tool(
    'mainwp_sites_count',
    'Get the total count of connected WordPress sites',
    {},
    async () => {
      try {
        const result = await client.getSitesCount();
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult('Failed to get site count', error);
      }
    }
  );

  // Add new site
  server.tool(
    'mainwp_sites_add',
    'Add a new WordPress site to MainWP Dashboard',
    addSiteSchema.shape,
    async ({ url, name, admin, uniqueId, ssl_verify, groupids }) => {
      try {
        const result = await client.addSite({
          url,
          name,
          admin,
          uniqueId,
          ssl_verify: ssl_verify ? 1 : 0,
          groupids,
        });
        return createSuccessResult({
          message: `Successfully added site: ${url}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to add site ${url}`, error);
      }
    }
  );

  // Reconnect site
  server.tool(
    'mainwp_sites_reconnect',
    'Reconnect to a WordPress site that has lost connection',
    getSiteSchema.shape,
    async ({ site }) => {
      try {
        const result = await client.reconnectSite(site);
        return createSuccessResult({
          message: `Successfully reconnected to site: ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to reconnect to site ${site}`, error);
      }
    }
  );

  // Disconnect site
  server.tool(
    'mainwp_sites_disconnect',
    'Disconnect a WordPress site from MainWP Dashboard (keeps site data)',
    getSiteSchema.shape,
    async ({ site }) => {
      try {
        const result = await client.disconnectSite(site);
        return createSuccessResult({
          message: `Successfully disconnected site: ${site}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to disconnect site ${site}`, error);
      }
    }
  );
}
