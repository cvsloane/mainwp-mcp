/**
 * Client management tools for MainWP MCP Server (Pro feature)
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../clients/mainwp-api-client.js';
import {
  listClientsSchema,
  getClientSchema,
  addClientSchema,
  editClientSchema,
  deleteClientSchema,
} from '../schemas/tool-schemas.js';
import { createSuccessResult, createErrorResult } from '../utils/error-handling.js';
import { createDryRunResult, createTestModeResult, isTestMode, resolveDryRun } from '../utils/safety.js';

export function registerClientTools(server: McpServer): void {
  const client = getMainWPClient();

  // List all clients
  server.tool(
    'mainwp_clients_list',
    'List all clients in MainWP (Pro feature - requires Client Reports extension)',
    listClientsSchema.shape,
    async ({ search, page, per_page }) => {
      try {
        const result = await client.listClients({ search, page, per_page });
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult('Failed to list clients. This feature requires MainWP Pro with Client Reports extension.', error);
      }
    }
  );

  // Get single client
  server.tool(
    'mainwp_clients_get',
    'Get detailed information about a specific client (Pro feature)',
    getClientSchema.shape,
    async ({ client: clientId }) => {
      try {
        if (isTestMode()) {
          return createTestModeResult(`Get client ${clientId}`, [clientId], { action: 'get' });
        }

        const result = await client.getClient(clientId);
        return createSuccessResult(result);
      } catch (error) {
        return createErrorResult(`Failed to get client ${clientId}. This feature requires MainWP Pro with Client Reports extension.`, error);
      }
    }
  );

  // Add new client
  server.tool(
    'mainwp_clients_add',
    'Add a new client to MainWP (Pro feature)',
    addClientSchema.shape,
    async ({ name, email, company, phone, address, city, state, zip, country, note, selected_sites }) => {
      try {
        if (isTestMode()) {
          return createTestModeResult(
            `Add client ${name}`,
            [email],
            { name, email, company, phone, address, city, state, zip, country, note, selected_sites }
          );
        }

        const result = await client.addClient({
          name,
          email,
          company,
          phone,
          address,
          city,
          state,
          zip,
          country,
          note,
          selected_sites,
        });
        return createSuccessResult({
          message: `Successfully added client: ${name}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to add client ${name}. This feature requires MainWP Pro with Client Reports extension.`, error);
      }
    }
  );

  // Edit client
  server.tool(
    'mainwp_clients_edit',
    'Edit an existing client in MainWP (Pro feature)',
    editClientSchema.shape,
    async ({ client: clientId, dry_run, ...updateData }) => {
      try {
        const testMode = isTestMode();
        const effectiveDryRun = testMode ? true : resolveDryRun(dry_run);

        if (effectiveDryRun) {
          return testMode
            ? createTestModeResult(`Edit client ${clientId}`, [clientId], { updates: updateData })
            : createDryRunResult(`Edit client ${clientId}`, [clientId], { updates: updateData });
        }

        const result = await client.editClient(clientId, updateData);
        return createSuccessResult({
          message: `Successfully updated client: ${clientId}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to edit client ${clientId}. This feature requires MainWP Pro with Client Reports extension.`, error);
      }
    }
  );

  // Delete client
  server.tool(
    'mainwp_clients_delete',
    'Delete a client from MainWP (Pro feature - requires confirmation)',
    deleteClientSchema.shape,
    async ({ client: clientId, confirmed }) => {
      try {
        if (!confirmed) {
          return createErrorResult(
            `Deleting client ${clientId} requires confirmation. Set confirmed=true to proceed. This action cannot be undone.`
          );
        }

        if (isTestMode()) {
          return createTestModeResult(`Delete client ${clientId}`, [clientId], { action: 'delete' });
        }

        const result = await client.deleteClient(clientId);
        return createSuccessResult({
          message: `Successfully deleted client: ${clientId}`,
          result,
        });
      } catch (error) {
        return createErrorResult(`Failed to delete client ${clientId}. This feature requires MainWP Pro with Client Reports extension.`, error);
      }
    }
  );
}
