#!/usr/bin/env node
/**
 * MainWP MCP Server - Entry Point
 *
 * MCP server for managing WordPress sites via MainWP Dashboard REST API.
 */

import { config } from 'dotenv';
import { startServer } from './server.js';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Validate required environment variables
const requiredEnvVars = ['MAINWP_DASHBOARD_URL', 'MAINWP_API_KEY'];
const missingVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  console.error('Please set these in .env.local or as environment variables.');
  process.exit(1);
}

// Start the MCP server
startServer().catch((error) => {
  console.error('Failed to start MainWP MCP server:', error);
  process.exit(1);
});
