/**
 * Tag management tools for MainWP MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listTagsSchema,
  getTagSitesSchema,
} from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';

export function registerTagTools(server: McpServer): void {
  const client = getMainWPClient();

  // List all tags
  server.tool(
    'mainwp_tags_list',
    'List all tags/groups defined in MainWP Dashboard',
    listTagsSchema.shape,
    async ({ search }) => {
      try {
        const result = await client.listTags();

        // Filter by search if provided
        if (search && result.data) {
          const searchLower = search.toLowerCase();
          const filtered = (result.data as Array<{ name: string }>).filter(
            tag => tag.name.toLowerCase().includes(searchLower)
          );
          return createSuccessResult({ ...result, data: filtered });
        }

        return createSuccessResult(result);
      } catch (error) {
        // Fallback: derive tags from site list if tags endpoint fails
        try {
          const sitesResult = await client.listSites();
          const sites = (sitesResult as { data?: Array<{ tags?: Record<string, string> }> }).data ?? [];
          const tagMap = new Map<string, { id: string; name: string; site_count: number }>();

          for (const site of sites) {
            const tags = site.tags ?? {};
            for (const [id, name] of Object.entries(tags)) {
              const existing = tagMap.get(id);
              if (existing) {
                existing.site_count += 1;
              } else {
                tagMap.set(id, { id, name, site_count: 1 });
              }
            }
          }

          let data = Array.from(tagMap.values());
          if (search) {
            const searchLower = search.toLowerCase();
            data = data.filter(tag => tag.name.toLowerCase().includes(searchLower));
          }

          return createSuccessResult({
            success: 1,
            total: data.length,
            data,
            warning: 'Tags endpoint failed; tags derived from sites list.',
            source: 'sites_list',
          });
        } catch (fallbackError) {
          return createErrorResult('Failed to list tags', fallbackError);
        }
      }
    }
  );

  // Get sites for a specific tag
  server.tool(
    'mainwp_tags_sites',
    'Get all sites that have a specific tag/group assigned',
    getTagSitesSchema.shape,
    async ({ tag }) => {
      try {
        const result = await client.getTagSites(tag);
        return createSuccessResult({
          tag,
          ...result,
        });
      } catch (error) {
        // Fallback: derive from site list if tags endpoint fails
        try {
          const sitesResult = await client.listSites();
          const sites = (sitesResult as { data?: Array<{ id: string; name: string; url: string; tags?: Record<string, string> }> }).data ?? [];
          const tagLower = tag.toLowerCase();
          const matching = sites.filter(site => {
            const tags = site.tags ?? {};
            return Object.entries(tags).some(([id, name]) => id === tag || name.toLowerCase() === tagLower);
          });

          return createSuccessResult({
            tag,
            success: 1,
            total: matching.length,
            data: matching.map(site => ({
              id: site.id,
              name: site.name,
              url: site.url,
            })),
            warning: 'Tag sites endpoint failed; results derived from sites list.',
            source: 'sites_list',
          });
        } catch (fallbackError) {
          return createErrorResult(`Failed to get sites for tag ${tag}`, fallbackError);
        }
      }
    }
  );
}
