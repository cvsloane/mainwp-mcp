import { Client } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js';
import { StdioClientTransport } from '../node_modules/@modelcontextprotocol/sdk/dist/esm/client/stdio.js';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverCwd = resolve(__dirname, '..');

const transport = new StdioClientTransport({
  command: 'node',
  args: ['dist/index.js'],
  cwd: serverCwd,
  stderr: 'pipe',
  env: {
    ...process.env,
    MAINWP_TEST_MODE: 'true',
    MAINWP_ENABLE_DRY_RUN_BY_DEFAULT: 'true',
  },
});

const client = new Client({ name: 'mainwp-mcp-smoke-test', version: '1.0.0' });

function parseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function callTool(name, args = {}) {
  const started = Date.now();
  try {
    const result = await client.callTool({ name, arguments: args });
    const text = result?.content?.[0]?.text ?? '';
    const parsed = parseJson(text);
    return {
      name,
      ok: !result.isError,
      isError: !!result.isError,
      durationMs: Date.now() - started,
      textBytes: text.length,
      parsed,
      textSnippet: text.slice(0, 500),
    };
  } catch (error) {
    return {
      name,
      ok: false,
      isError: true,
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function run() {
  await client.connect(transport);

  const toolsResult = await client.listTools();
  const toolNames = toolsResult.tools.map(t => t.name).sort();

  const results = {
    toolCount: toolNames.length,
    toolNames,
    calls: [],
  };

  // Determine a site id for tests
  const sitesListBasic = await callTool('mainwp_sites_list', { format: 'basic' });
  const sites = sitesListBasic.parsed?.data ?? [];
  const siteId = sites[0]?.id ?? '1';

  // Determine a tag id/name for tests
  const tagsList = await callTool('mainwp_tags_list');
  let tagIdentifier = '1';
  if (tagsList.parsed?.data && Array.isArray(tagsList.parsed.data) && tagsList.parsed.data.length > 0) {
    const firstTag = tagsList.parsed.data[0];
    tagIdentifier = String(firstTag.id ?? firstTag.tag_id ?? firstTag.tagId ?? firstTag.name ?? '1');
  }

  const calls = [];

  // Site tools
  calls.push(sitesListBasic);
  calls.push(await callTool('mainwp_sites_list', { format: 'full' }));
  calls.push(await callTool('mainwp_sites_count'));
  calls.push(await callTool('mainwp_sites_get', { site: siteId }));
  calls.push(await callTool('mainwp_sites_check', { site: siteId }));
  calls.push(await callTool('mainwp_sites_changes', { site: siteId }));
  calls.push(await callTool('mainwp_sites_sync', { site: siteId }));
  calls.push(await callTool('mainwp_sites_sync', { confirmed: true }));
  calls.push(await callTool('mainwp_sites_add', { url: 'https://example.com', name: 'Example Site', admin: 'admin', ssl_verify: true }));
  calls.push(await callTool('mainwp_sites_reconnect', { site: siteId }));
  calls.push(await callTool('mainwp_sites_disconnect', { site: siteId }));
  calls.push(await callTool('mainwp_sites_edit', { site: siteId, name: 'Example Rename' }));
  calls.push(await callTool('mainwp_sites_suspend', { site: siteId }));
  calls.push(await callTool('mainwp_sites_unsuspend', { site: siteId }));
  calls.push(await callTool('mainwp_sites_remove', { site: siteId, confirmed: true }));

  // Update tools
  calls.push(await callTool('mainwp_updates_list'));
  calls.push(await callTool('mainwp_updates_list', { site: siteId }));
  calls.push(await callTool('mainwp_updates_apply', { site: siteId, type: 'plugins' }));
  calls.push(await callTool('mainwp_updates_wp', { site: siteId }));
  calls.push(await callTool('mainwp_updates_plugins', { site: siteId }));
  calls.push(await callTool('mainwp_updates_themes', { site: siteId }));
  calls.push(await callTool('mainwp_updates_translations', { site: siteId }));
  calls.push(await callTool('mainwp_updates_ignore', { type: 'plugin', slug: 'hello-dolly' }));
  calls.push(await callTool('mainwp_updates_unignore', { type: 'plugin', slug: 'hello-dolly' }));
  calls.push(await callTool('mainwp_updates_ignored', { site: siteId }));

  // Plugin tools
  calls.push(await callTool('mainwp_plugins_list', { site: siteId }));
  calls.push(await callTool('mainwp_plugins_activate', { site: siteId, plugins: 'hello-dolly' }));
  calls.push(await callTool('mainwp_plugins_deactivate', { site: siteId, plugins: 'hello-dolly' }));
  calls.push(await callTool('mainwp_plugins_install', { site: siteId, slug: 'akismet' }));
  calls.push(await callTool('mainwp_plugins_delete', { site: siteId, slug: 'akismet/akismet.php' }));

  // Theme tools
  calls.push(await callTool('mainwp_themes_list', { site: siteId }));
  calls.push(await callTool('mainwp_themes_activate', { site: siteId, theme: 'twentytwentyfour' }));
  calls.push(await callTool('mainwp_themes_install', { site: siteId, slug: 'twentytwentyfour' }));
  calls.push(await callTool('mainwp_themes_delete', { site: siteId, slug: 'twentytwentyfour' }));

  // Tag tools
  calls.push(tagsList);
  calls.push(await callTool('mainwp_tags_sites', { tag: tagIdentifier }));

  // Client tools (Pro)
  calls.push(await callTool('mainwp_clients_list'));
  calls.push(await callTool('mainwp_clients_get', { client: '1' }));
  calls.push(await callTool('mainwp_clients_add', { name: 'Test Client', email: 'test@example.com' }));
  calls.push(await callTool('mainwp_clients_edit', { client: '1', name: 'Updated Client' }));
  calls.push(await callTool('mainwp_clients_delete', { client: '1', confirmed: true }));

  // Cost tools (Pro)
  calls.push(await callTool('mainwp_costs_list'));
  calls.push(await callTool('mainwp_costs_get', { cost: '1' }));
  calls.push(await callTool('mainwp_costs_add', { name: 'Test Cost', type: 'single', product_type: 'service', price: 10, currency: 'USD' }));
  calls.push(await callTool('mainwp_costs_edit', { cost: '1', name: 'Updated Cost' }));
  calls.push(await callTool('mainwp_costs_delete', { cost: '1', confirmed: true }));

  results.calls = calls;

  await client.close();

  console.log(JSON.stringify(results, null, 2));
}

run().catch((error) => {
  console.error('Smoke test error:', error);
  process.exitCode = 1;
});
