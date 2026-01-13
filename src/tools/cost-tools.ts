/**
 * Cost tracking tools for MainWP MCP Server (Pro feature)
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listCostsSchema,
  getCostSchema,
  addCostSchema,
  editCostSchema,
  deleteCostSchema,
} from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';
import { createDryRunResult } from '../utils/safety.js';

export function registerCostTools(server: McpServer): void {
  const client = getMainWPClient();

  // List all costs
  server.tool(
    'mainwp_costs_list',
    'List all tracked costs in MainWP (Pro feature - requires Cost Tracker extension)',
    listCostsSchema.shape,
    async ({ search, type, product_type, page, per_page }) => {
      try {
        const result = await client.listCosts({ search, type, category: product_type, page, per_page });
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult('Failed to list costs. This feature requires MainWP Pro with Cost Tracker extension.', error);
      }
    }
  );

  // Get single cost
  server.tool(
    'mainwp_costs_get',
    'Get detailed information about a specific cost entry (Pro feature)',
    getCostSchema.shape,
    async ({ cost }) => {
      try {
        const result = await client.getCost(cost);
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult(`Failed to get cost ${cost}. This feature requires MainWP Pro with Cost Tracker extension.`, error);
      }
    }
  );

  // Add new cost
  server.tool(
    'mainwp_costs_add',
    'Add a new cost entry to MainWP (Pro feature)',
    addCostSchema.shape,
    async ({ name, type, product_type, price, currency, renewal_frequency, last_renewal, next_renewal, sites, note }) => {
      try {
        const result = await client.addCost({
          name,
          type,
          product_type,
          price,
          currency,
          renewal_frequency,
          last_renewal,
          next_renewal,
          sites,
          note,
        });
        return createSuccessResult({
          message: `Successfully added cost: ${name}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to add cost ${name}. This feature requires MainWP Pro with Cost Tracker extension.`, error);
      }
    }
  );

  // Edit cost
  server.tool(
    'mainwp_costs_edit',
    'Edit an existing cost entry in MainWP (Pro feature)',
    editCostSchema.shape,
    async ({ cost, dry_run, ...updateData }) => {
      try {
        if (dry_run) {
          return createDryRunResult(
            `Edit cost ${cost}`,
            [cost],
            { updates: updateData }
          );
        }

        const result = await client.editCost(cost, updateData);
        return createSuccessResult({
          message: `Successfully updated cost: ${cost}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to edit cost ${cost}. This feature requires MainWP Pro with Cost Tracker extension.`, error);
      }
    }
  );

  // Delete cost
  server.tool(
    'mainwp_costs_delete',
    'Delete a cost entry from MainWP (Pro feature - requires confirmation)',
    deleteCostSchema.shape,
    async ({ cost, confirmed }) => {
      try {
        if (!confirmed) {
          return createErrorResult(
            `Deleting cost ${cost} requires confirmation. Set confirmed=true to proceed. This action cannot be undone.`
          );
        }

        const result = await client.deleteCost(cost);
        return createSuccessResult({
          message: `Successfully deleted cost: ${cost}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to delete cost ${cost}. This feature requires MainWP Pro with Cost Tracker extension.`, error);
      }
    }
  );
}
