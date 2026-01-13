/**
 * MainWP MCP Server
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  registerSiteTools,
  registerUpdateTools,
  registerPluginTools,
  registerThemeTools,
  registerClientTools,
  registerCostTools,
  registerTagTools,
} from './tools/index.js';

const SERVER_NAME = 'mainwp-mcp';
const SERVER_VERSION = '1.0.0';

export async function createServer(): Promise<McpServer> {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Register all tools
  registerSiteTools(server);
  registerUpdateTools(server);
  registerPluginTools(server);
  registerThemeTools(server);
  registerClientTools(server);
  registerCostTools(server);
  registerTagTools(server);

  return server;
}

export async function startServer(): Promise<void> {
  const server = await createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  console.error(`${SERVER_NAME} v${SERVER_VERSION} started`);
}
