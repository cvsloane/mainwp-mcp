import test, { after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getMainWPClient } from '../src/clients/mainwp-api-client.js';
import { registerPluginTools } from '../src/tools/plugin-tools.js';
import { registerSiteTools } from '../src/tools/site-tools.js';
import { registerThemeTools } from '../src/tools/theme-tools.js';
import {
  checkBulkOperation,
  isDryRunDefault,
  requiresBulkConfirmation,
  resolveDryRun,
} from '../src/utils/safety.js';

type ToolHandler = (args: Record<string, unknown>) => Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}>;

const originalEnv = {
  MAINWP_DASHBOARD_URL: process.env.MAINWP_DASHBOARD_URL,
  MAINWP_API_KEY: process.env.MAINWP_API_KEY,
  MAINWP_ENABLE_DRY_RUN_BY_DEFAULT: process.env.MAINWP_ENABLE_DRY_RUN_BY_DEFAULT,
  MAINWP_REQUIRE_CONFIRMATION_BULK: process.env.MAINWP_REQUIRE_CONFIRMATION_BULK,
  MAINWP_TEST_MODE: process.env.MAINWP_TEST_MODE,
};

function resetEnv() {
  process.env.MAINWP_DASHBOARD_URL = 'https://mainwp.test';
  process.env.MAINWP_API_KEY = 'test-api-key';
  delete process.env.MAINWP_ENABLE_DRY_RUN_BY_DEFAULT;
  delete process.env.MAINWP_REQUIRE_CONFIRMATION_BULK;
  delete process.env.MAINWP_TEST_MODE;
}

function restoreEnv() {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

function createToolRegistry() {
  const handlers = new Map<string, ToolHandler>();
  const server = {
    tool: (
      name: string,
      _description: string,
      _schema: unknown,
      handler: ToolHandler
    ) => {
      handlers.set(name, handler);
    },
  } as unknown as McpServer;

  return {
    server,
    handler(name: string): ToolHandler {
      const handler = handlers.get(name);
      assert.ok(handler, `Expected ${name} to be registered`);
      return handler;
    },
  };
}

function resultText(result: Awaited<ReturnType<ToolHandler>>): string {
  return result.content.map(item => item.text).join('\n');
}

function stubClientMethod(methodName: string) {
  const client = getMainWPClient() as unknown as Record<string, unknown>;
  const original = client[methodName];
  const calls: unknown[][] = [];

  client[methodName] = async (...args: unknown[]) => {
    calls.push(args);
    return { success: true, method: methodName, args };
  };

  return {
    calls,
    restore: () => {
      client[methodName] = original;
    },
  };
}

beforeEach(resetEnv);
after(restoreEnv);

test('dry-run and bulk confirmation default to safe when env vars are absent', () => {
  assert.equal(isDryRunDefault(), true);
  assert.equal(resolveDryRun(undefined), true);
  assert.equal(resolveDryRun(false), false);
  assert.equal(requiresBulkConfirmation(), true);

  const bulkCheck = checkBulkOperation(3, false);
  assert.equal(bulkCheck.allowed, false);
  assert.match(bulkCheck.message ?? '', /confirmed=true/);
});

test('env vars can explicitly disable dry-run and bulk confirmation defaults', () => {
  process.env.MAINWP_ENABLE_DRY_RUN_BY_DEFAULT = 'false';
  process.env.MAINWP_REQUIRE_CONFIRMATION_BULK = 'false';

  assert.equal(isDryRunDefault(), false);
  assert.equal(resolveDryRun(undefined), false);
  assert.equal(requiresBulkConfirmation(), false);
  assert.deepEqual(checkBulkOperation(3, false), { allowed: true });
});

test('plugin delete defaults to dry-run and does not call the MainWP client', async () => {
  const deletePlugin = stubClientMethod('deletePlugin');
  const registry = createToolRegistry();
  registerPluginTools(registry.server);

  const result = await registry.handler('mainwp_plugins_delete')({
    site: 'site-1',
    slug: 'akismet/akismet.php',
  });

  assert.equal(deletePlugin.calls.length, 0);
  assert.match(resultText(result), /DRY RUN - Delete plugin "akismet\/akismet.php" from site-1/);
  deletePlugin.restore();
});

test('plugin delete only calls the client after explicit dry_run=false', async () => {
  const deletePlugin = stubClientMethod('deletePlugin');
  const registry = createToolRegistry();
  registerPluginTools(registry.server);

  const result = await registry.handler('mainwp_plugins_delete')({
    site: 'site-1',
    slug: 'akismet/akismet.php',
    dry_run: false,
  });

  assert.deepEqual(deletePlugin.calls, [['site-1', 'akismet/akismet.php']]);
  assert.match(resultText(result), /Successfully deleted plugin/);
  deletePlugin.restore();
});

test('test mode blocks plugin deletion even when dry_run=false', async () => {
  process.env.MAINWP_TEST_MODE = 'true';
  const deletePlugin = stubClientMethod('deletePlugin');
  const registry = createToolRegistry();
  registerPluginTools(registry.server);

  const result = await registry.handler('mainwp_plugins_delete')({
    site: 'site-1',
    slug: 'akismet/akismet.php',
    dry_run: false,
  });

  assert.equal(deletePlugin.calls.length, 0);
  assert.match(resultText(result), /TEST MODE - Delete plugin/);
  deletePlugin.restore();
});

test('theme delete defaults to dry-run and does not call the MainWP client', async () => {
  const deleteTheme = stubClientMethod('deleteTheme');
  const registry = createToolRegistry();
  registerThemeTools(registry.server);

  const result = await registry.handler('mainwp_themes_delete')({
    site: 'site-1',
    slug: 'twentytwentyfive',
  });

  assert.equal(deleteTheme.calls.length, 0);
  assert.match(resultText(result), /DRY RUN - Delete theme "twentytwentyfive" from site-1/);
  deleteTheme.restore();
});

test('site removal requires confirmation before any client call', async () => {
  const removeSite = stubClientMethod('removeSite');
  const registry = createToolRegistry();
  registerSiteTools(registry.server);

  const result = await registry.handler('mainwp_sites_remove')({
    site: 'example.com',
  });

  assert.equal(removeSite.calls.length, 0);
  assert.equal(result.isError, true);
  assert.match(resultText(result), /requires confirmation/);
  removeSite.restore();
});

test('test mode blocks confirmed site removal from calling the MainWP client', async () => {
  process.env.MAINWP_TEST_MODE = 'true';
  const removeSite = stubClientMethod('removeSite');
  const registry = createToolRegistry();
  registerSiteTools(registry.server);

  const result = await registry.handler('mainwp_sites_remove')({
    site: 'example.com',
    confirmed: true,
  });

  assert.equal(removeSite.calls.length, 0);
  assert.match(resultText(result), /TEST MODE - Remove site example.com/);
  removeSite.restore();
});
