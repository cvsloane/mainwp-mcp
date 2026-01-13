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
        return createErrorResult('Failed to list tags', error);
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
        return createErrorResult(`Failed to get sites for tag ${tag}`, error);
      }
    }
  );
}
