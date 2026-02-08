# MainWP MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

A Model Context Protocol (MCP) server that brings AI-powered WordPress management to your fingertips. Connect Claude Code to your [MainWP Dashboard](https://mainwp.com/) and manage all your WordPress sites through natural conversation.

## Table of Contents

- [Why MainWP MCP?](#why-mainwp-mcp)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [MainWP Dashboard Setup](#mainwp-dashboard-setup)
- [Configuration](#configuration)
- [Claude Code Integration](#claude-code-integration)
- [Available Tools](#available-tools)
- [Usage Examples](#usage-examples)
- [Safety Features](#safety-features)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

---

## Why MainWP MCP?

Managing multiple WordPress sites is time-consuming. You log into each dashboard, check for updates, review security scans, and perform routine maintenance—repeatedly across dozens or hundreds of sites.

**MainWP MCP Server changes the game.**

Instead of clicking through dashboards, you simply *ask*:

> "Which of my sites need updates?"
> "Update all plugins across my e-commerce sites"
> "Show me sites running outdated PHP versions"
> "Deactivate the contact form plugin on all staging sites"

Claude handles the rest, using the full power of MainWP's REST API—all through natural conversation.

### Perfect For

- **Agencies** managing 50+ client sites
- **Freelancers** juggling multiple WordPress projects
- **DevOps teams** automating maintenance workflows
- **Site owners** who prefer conversational interfaces

---

## Features

**43 powerful tools** organized by function:

### Site Management (14 tools)
| Capability | Tools |
|------------|-------|
| Discovery | List sites, view details, count totals |
| Health | Run checks, track non-MainWP changes |
| Sync | Force synchronization, refresh data |
| Lifecycle | Add, reconnect, disconnect, suspend, remove |
| Organization | Edit settings, manage group assignments |

### Update Management (9 tools)
- **Overview**: See pending updates across your entire network
- **WordPress Core**: Update to latest versions
- **Plugins & Themes**: Update individually or in bulk
- **Translations**: Keep language packs current
- **Ignore Management**: Skip problematic updates
- **Dry-Run Mode**: Preview changes before applying

### Plugin Management (5 tools)
- Inventory all installed plugins
- Activate/deactivate remotely
- Install from WordPress.org
- Delete unused plugins

### Theme Management (4 tools)
- List installed themes
- Switch active themes
- Install new themes
- Remove unused themes

### Client Management (5 tools) — *Pro*
Requires MainWP Pro with Client Reports extension:
- Full CRM functionality (add, edit, delete clients)
- Site-to-client assignments
- Contact and company management

### Cost Tracking (5 tools) — *Pro*
Requires MainWP Pro with Cost Tracker extension:
- Track plugin, theme, hosting, and domain costs
- Monitor renewal dates
- Calculate total cost of ownership

### Tag Management (2 tools)
- Organize sites with tags/groups
- Filter sites by category

---

## Architecture

```
┌─────────────────┐     stdio      ┌─────────────────┐
│   Claude Code   │◄──────────────►│  MainWP MCP     │
│   (AI Client)   │                │    Server       │
└─────────────────┘                └────────┬────────┘
                                            │
                                            │ HTTPS REST API
                                            ▼
                                   ┌─────────────────┐
                                   │ MainWP Dashboard│
                                   │   (WordPress)   │
                                   └────────┬────────┘
                                            │
                              ┌─────────────┼─────────────┐
                              │             │             │
                              ▼             ▼             ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │  Site 1  │ │  Site 2  │ │  Site N  │
                        │(WP+Child)│ │(WP+Child)│ │(WP+Child)│
                        └──────────┘ └──────────┘ └──────────┘
```

**Communication Flow:**
1. You ask Claude a question in natural language
2. Claude selects the appropriate MCP tool(s)
3. The MCP server translates this to MainWP REST API calls
4. Your MainWP Dashboard executes actions on child sites
5. Results flow back to you as conversational responses

---

## Quick Start

Get up and running in 5 minutes:

```bash
# 1. Clone and install
git clone https://github.com/cvsloane/mainwp-mcp.git
cd mainwp-mcp
npm install && npm run build

# 2. Configure
cp .env.example .env.local
# Edit .env.local with your MainWP credentials

# 3. Add to Claude Code
# See [Claude Code Integration](#claude-code-integration) below

# 4. Start managing
# Ask Claude: "List all my WordPress sites"
```

---

## Prerequisites

### Software Requirements

| Software | Minimum | Recommended |
|----------|---------|-------------|
| Node.js | 18.0.0 | 20.x LTS |
| npm | 8.0.0 | 10.x |
| Git | Any | Latest |

### Infrastructure Requirements

1. **MainWP Dashboard** — A WordPress installation with the [MainWP Dashboard plugin](https://wordpress.org/plugins/mainwp/) installed and activated

2. **Connected Child Sites** — Each WordPress site you want to manage must have the [MainWP Child plugin](https://wordpress.org/plugins/mainwp-child/) installed and connected

3. **REST API Access** — MainWP Dashboard must have the REST API enabled (built into MainWP 4.0+)

### Performance Recommendations

- **HTTPS**: Required for secure API communication
- **PHP 8.1+**: On your MainWP Dashboard for optimal performance
- **Memory**: 512MB PHP memory minimum (1GB+ for 50+ sites)
- **Rate Limiting**: Consider your Dashboard's capacity when setting `MAINWP_RATE_LIMIT_PER_MINUTE`

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/cvsloane/mainwp-mcp.git
cd mainwp-mcp
```

### Step 2: Install Dependencies

```bash
npm install
```

**What's installed:**
- `@modelcontextprotocol/sdk` — MCP protocol implementation
- `axios` — HTTP client for API requests
- `zod` — Runtime type validation
- `dotenv` — Environment variable management

### Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Step 4: Verify Installation

```bash
npm start
```

Expected output:
```
mainwp-mcp v1.0.0 started
```

Press `Ctrl+C` to stop.

---

## MainWP Dashboard Setup

Before the MCP server can manage your sites, configure your MainWP Dashboard:

### Step 1: Install MainWP Dashboard

If you haven't already:

1. Log into your WordPress admin panel
2. Navigate to **Plugins → Add New**
3. Search for "MainWP Dashboard"
4. Click **Install Now**, then **Activate**
5. Complete the MainWP setup wizard

### Step 2: Connect Child Sites

For each WordPress site you want to manage:

1. Install and activate the **MainWP Child** plugin on the child site
2. In your MainWP Dashboard, go to **MainWP → Sites → Add New**
3. Enter the site URL and administrator credentials
4. Click **Add Site**

### Step 3: Enable REST API

1. Go to **MainWP → Settings → REST API**
2. Ensure the REST API is **Enabled**
3. Click **Add API Key**
4. Configure the key:
   - **Description**: `Claude Code MCP Server` (or any descriptive name)
   - **Permissions**: Select based on your needs
     - **Read**: Sites, plugins, themes, updates *(recommended minimum)*
     - **Write**: Updates, plugin activation *(required for management)*
5. Click **Generate API Key**
6. **⚠️ Important**: Copy both the **Consumer Key** and **Consumer Secret** immediately—the secret is shown only once

### Step 4: Gather Your Credentials

You'll need three pieces of information:

| Credential | Example | Where to Find |
|------------|---------|---------------|
| Dashboard URL | `https://dashboard.example.com` | Your MainWP Dashboard address |
| Consumer Key | `abc123...xyz` | REST API settings |
| Consumer Secret | `def456...uvw` | REST API settings (shown once) |

**API Key Format:** The MCP server expects credentials in this format:
```
consumer_key==consumer_secret
```
(Note the double equals sign between key and secret)

---

## Configuration

### Environment Variables

Create your configuration file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```bash
# Required: Your MainWP Dashboard URL
MAINWP_DASHBOARD_URL=https://your-mainwp-dashboard.com

# Required: API credentials (key==secret format)
MAINWP_API_KEY=abc123def456...==xyz789uvw...

# Optional: Safety settings (recommended values shown)
MAINWP_ENABLE_DRY_RUN_BY_DEFAULT=true
MAINWP_REQUIRE_CONFIRMATION_BULK=true

# Optional: Development settings
MAINWP_TEST_MODE=false
MAINWP_RATE_LIMIT_PER_MINUTE=60
```

### Configuration Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAINWP_DASHBOARD_URL` | ✅ | — | Full URL to your MainWP Dashboard |
| `MAINWP_API_KEY` | ✅ | — | Credentials in `key==secret` format |
| `MAINWP_ENABLE_DRY_RUN_BY_DEFAULT` | ❌ | `true` | Simulate operations by default |
| `MAINWP_REQUIRE_CONFIRMATION_BULK` | ❌ | `true` | Confirm multi-site operations |
| `MAINWP_TEST_MODE` | ❌ | `false` | Simulate without API calls |
| `MAINWP_RATE_LIMIT_PER_MINUTE` | ❌ | `60` | Max requests per minute |

---

## Claude Code Integration

### Option 1: Global Configuration (Recommended)

Add to your Claude Code MCP configuration:

**Linux/macOS:** `~/.config/claude-code/mcp.json`
**Windows:** `%APPDATA%\claude-code\mcp.json`

```json
{
  "mcpServers": {
    "mainwp": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/mainwp-mcp/dist/index.js"],
      "env": {
        "MAINWP_DASHBOARD_URL": "https://your-mainwp-dashboard.com",
        "MAINWP_API_KEY": "your_consumer_key==your_consumer_secret",
        "MAINWP_ENABLE_DRY_RUN_BY_DEFAULT": "true",
        "MAINWP_REQUIRE_CONFIRMATION_BULK": "true",
        "MAINWP_TEST_MODE": "false",
        "MAINWP_RATE_LIMIT_PER_MINUTE": "60"
      }
    }
  }
}
```

**Tip:** Use absolute paths to avoid issues with Claude Code's working directory.

### Option 2: Project-Specific Configuration

Create `.mcp.json` in your project directory:

```json
{
  "mcpServers": {
    "mainwp": {
      "type": "stdio",
      "command": "node",
      "args": ["./node_modules/mainwp-mcp/dist/index.js"],
      "env": {
        "MAINWP_DASHBOARD_URL": "https://your-mainwp-dashboard.com",
        "MAINWP_API_KEY": "your_consumer_key==your_consumer_secret"
      }
    }
  }
}
```

### Verifying Integration

1. **Restart Claude Code** — MCP changes require a full restart
2. **Check available tools:**
   ```
   You: What MCP tools are available?
   ```
   You should see `mainwp_*` tools listed.

3. **Test connectivity:**
   ```
   You: List all my MainWP sites
   ```

---

## Available Tools

### Site Management

#### `mainwp_sites_list`
List all connected WordPress sites.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | string | No | Filter: `connected`, `disconnected`, `all` |

**Example Response:**
```json
{
  "sites": [
    {
      "id": "1",
      "name": "Client Blog",
      "url": "https://clientblog.com",
      "status": "connected",
      "wp_version": "6.4.2",
      "php_version": "8.2",
      "last_sync": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1
}
```

#### `mainwp_sites_get`
Get detailed information for a specific site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID from MainWP |

**Returns:** Comprehensive site data including plugins, themes, health score, database size.

#### `mainwp_sites_sync`
Force synchronization of site data.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID to sync |

#### `mainwp_sites_add`
Add a new site to MainWP Dashboard.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | string | ✅ | Site URL |
| `admin_username` | string | ✅ | WordPress admin username |
| `name` | string | No | Display name |

### Update Management

#### `mainwp_updates_list`
List all pending updates across sites.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | No | Filter to specific site |
| `type` | string | No | Filter: `wp`, `plugins`, `themes`, `all` |

**Example Response:**
```json
{
  "updates": [
    {
      "site_id": "1",
      "site_name": "Client Blog",
      "site_url": "https://clientblog.com",
      "wp_upgrades": {
        "current": "6.4.1",
        "new": "6.4.2"
      },
      "plugin_upgrades": {
        "akismet": {
          "name": "Akismet",
          "version": "5.0",
          "new_version": "5.1"
        }
      }
    }
  ]
}
```

#### `mainwp_updates_apply`
Apply all pending updates for a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID |
| `dry_run` | boolean | No | Simulate first (default: `true`) |

#### `mainwp_updates_plugins`
Update plugins on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID |
| `plugins` | string[] | No | Specific slugs (omit for all) |
| `dry_run` | boolean | No | Simulate first (default: `true`) |

### Plugin Management

#### `mainwp_plugins_list`
List all plugins on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID |
| `status` | string | No | Filter: `active`, `inactive`, `all` |

#### `mainwp_plugins_activate` / `mainwp_plugins_deactivate`
Toggle plugin status.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID |
| `plugin` | string | ✅ | Plugin slug |

### Theme Management

#### `mainwp_themes_list`
List all themes on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID |

#### `mainwp_themes_activate`
Change the active theme.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | ✅ | Site ID |
| `theme` | string | ✅ | Theme slug |

### Extended Tools

For complete documentation of all 43 tools, including Client Management, Cost Tracking, and Tag Management, see the inline documentation or use Claude's tool discovery:

```
You: What MainWP tools are available for managing clients?
```

---

## Usage Examples

### Daily Workflow Examples

#### Morning Site Check
```
You: Check the health of all my sites

Claude: I'll run health checks on all your connected sites...

✅ All Systems Operational (8 sites)
   All sites are healthy and up to date

⚠️  Needs Attention (2 sites)
   - client-site.com: 3 pending plugin updates
   - blog-example.com: PHP version approaching EOL (7.4)
```

#### Update Management
```
You: What updates are available?

Claude: I found updates across 5 sites:

Site: client-store.com
├── WordPress: 6.4.1 → 6.4.2
├── WooCommerce: 8.3.0 → 8.4.0
└── Yoast SEO: 21.5 → 21.6

Site: blog-example.com
└── Akismet: 5.0 → 5.1

Would you like me to apply these? I can do them all at once or site by site.
```

#### Bulk Operations with Safety
```
You: Update all plugins on all sites

Claude: This will update plugins on 12 sites:
- client-store.com (3 plugins)
- blog-example.com (1 plugin)
- ...and 10 more

⚠️ This is a bulk operation. Please confirm:
1. Review the list above
2. Reply "confirm bulk update" to proceed
3. Or specify specific sites to update

You: confirm bulk update

Claude: ✅ Updates completed successfully:
- 12 sites processed
- 23 plugins updated
- 0 errors
```

#### Security Audit
```
You: Which sites are running outdated PHP?

Claude: Analyzing PHP versions across your network...

🔴 Critical (EOL - No security updates)
├── legacy-site.com: PHP 7.4 (EOL Nov 2022)
└── old-client.com: PHP 7.3 (EOL Dec 2021)

🟡 Warning (Security fixes only)
└── staging-site.com: PHP 8.0 (ends Nov 2023)

💡 Recommendation: Upgrade to PHP 8.2 or 8.3 for active support and performance improvements.
```

#### Plugin Management
```
You: Deactivate the contact form plugin on all staging sites

Claude: I'll deactivate "contact-form-7" on sites tagged as staging...

✅ Deactivated on 3 staging sites:
- staging-client1.com
- staging-client2.com
- staging-internal.com

⚠️ Skipped 5 production sites (safety filter active)
```

---

## Safety Features

### Dry-Run Mode (Default: Enabled)

All destructive operations simulate first. You'll see exactly what would happen before any changes are made.

**Example:**
```
You: Update WordPress on site 5

Claude: 🔍 Dry run results for site 5 (client-blog.com):

Planned Changes:
├── WordPress Core: 6.4.1 → 6.4.2
├── Database updates: Yes (2 schema changes)
└── Estimated downtime: ~30 seconds

To apply these changes, say "apply the update" or set dry_run to false.
```

**To disable** (not recommended for production):
```bash
MAINWP_ENABLE_DRY_RUN_BY_DEFAULT=false
```

### Bulk Operation Confirmation

Operations affecting multiple sites require explicit confirmation:

```
You: Update all themes everywhere

Claude: ⚠️ Bulk Operation Warning

This will affect 15 sites and update 23 themes.

Type "confirm bulk themes update" to proceed, or specify sites:
- "update themes on sites 1, 3, 5"
- "update themes on e-commerce sites only"
```

**To disable** (not recommended):
```bash
MAINWP_REQUIRE_CONFIRMATION_BULK=false
```

### Test Mode

For demonstrations or development, enable test mode to simulate all operations without making API calls:

```bash
MAINWP_TEST_MODE=true
```

In test mode, mutating tools return realistic responses without side effects.

### Rate Limiting

Protect your MainWP Dashboard from being overwhelmed:

```bash
# Conservative (for shared hosting)
MAINWP_RATE_LIMIT_PER_MINUTE=30

# Aggressive (for dedicated servers)
MAINWP_RATE_LIMIT_PER_MINUTE=120
```

When rate limited, the server returns an error with a suggested retry delay.

---

## Troubleshooting

### Server Won't Start

#### "Missing required environment variables"

**Cause:** `MAINWP_DASHBOARD_URL` or `MAINWP_API_KEY` not set.

**Solution:**
```bash
# Check if .env.local exists
ls -la .env.local

# Verify variables are set
grep "MAINWP_" .env.local

# If using MCP config, verify the env block in mcp.json
```

#### "Cannot find module"

**Cause:** TypeScript not compiled.

**Solution:**
```bash
npm run build
```

### API Connection Issues

#### "401 Unauthorized"

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Wrong API key format | Ensure `key==secret` with double equals |
| Key revoked | Generate new API key in MainWP Dashboard |
| Insufficient permissions | Enable read+write permissions for the API key |
| URL mismatch | Verify `MAINWP_DASHBOARD_URL` matches exactly |

#### "Connection refused" or timeout

**Checklist:**
- [ ] MainWP Dashboard is accessible in browser
- [ ] No firewall blocking the connection
- [ ] HTTPS certificate is valid (not expired)
- [ ] WordPress is not in maintenance mode

**Test connectivity:**
```bash
curl -H "Authorization: Bearer YOUR_KEY==YOUR_SECRET" \
  https://your-dashboard.com/wp-json/mainwp/v2/sites
```

### Claude Code Integration Issues

#### Tools not appearing

**Diagnostic steps:**
1. Verify `mcp.json` is valid JSON: `cat ~/.config/claude-code/mcp.json | python -m json.tool`
2. Check path to `dist/index.js` is absolute: `realpath /your/path/dist/index.js`
3. Restart Claude Code completely (not just the conversation)
4. Check Claude Code logs: `~/.config/claude-code/logs/`

#### Permission errors

**Symptom:** "You don't have permission to..."

**Solution:**
1. Go to MainWP Dashboard → Settings → REST API
2. Find your API key
3. Click "Edit" and enable required permissions
4. Regenerate key if needed

### MainWP Dashboard Issues

#### Sites showing as disconnected

**Resolution steps:**
1. Check child site is accessible: `curl -I https://child-site.com`
2. Verify MainWP Child plugin is active
3. Try manual sync in MainWP Dashboard
4. Check for SSL certificate issues
5. Review MainWP Dashboard error logs

#### Updates not appearing

**Common causes:**
- Site hasn't synced recently (force sync with `mainwp_sites_sync`)
- Child plugin version incompatible (update to latest)
- WordPress cron not running (check `wp-cron.php`)

---

## Development

### Project Structure

```
mainwp-mcp/
├── src/
│   ├── index.ts                 # Entry point
│   ├── server.ts                # MCP server setup
│   ├── clients/
│   │   └── mainwp-api-client.ts # REST API HTTP client
│   ├── tools/
│   │   ├── index.ts             # Tool registration
│   │   ├── site-tools.ts        # Site management
│   │   ├── update-tools.ts      # Update management
│   │   ├── plugin-tools.ts      # Plugin management
│   │   ├── theme-tools.ts       # Theme management
│   │   ├── client-tools.ts      # Client CRM (Pro)
│   │   ├── cost-tools.ts        # Cost tracking (Pro)
│   │   └── tag-tools.ts         # Tag management
│   ├── types/
│   │   └── mainwp-types.ts      # TypeScript interfaces
│   ├── schemas/
│   │   └── tool-schemas.ts      # Zod validation
│   └── utils/
│       ├── safety.ts            # Dry-run & confirmation
│       └── error-handling.ts    # Error utilities
├── dist/                        # Compiled JavaScript
├── scripts/
│   └── mcp-smoke-test.mjs       # Integration tests
├── .env.example                 # Configuration template
├── .env.local                   # Your config (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

### Development Commands

```bash
# Install dependencies
npm install

# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean build artifacts
npm run clean

# Run smoke tests
npm run smoke-test
```

### Adding New Tools

1. **Define schema** in `src/schemas/tool-schemas.ts`
2. **Implement handler** in appropriate `src/tools/*.ts` file
3. **Register tool** in `src/tools/index.ts`
4. **Add API method** in `src/clients/mainwp-api-client.ts`
5. **Rebuild** with `npm run build`
6. **Test** with Claude Code

### Testing

```bash
# Manual API test
curl -H "Authorization: Bearer KEY==SECRET" \
  https://dashboard.com/wp-json/mainwp/v2/sites

# Smoke test (safe, no side effects)
MAINWP_TEST_MODE=true npm run smoke-test

# Test with Claude Code
npm start
# Then in Claude Code: "List all sites"
```

---

## API Reference

This server uses the [MainWP REST API v2](https://mainwp.com/kb/mainwp-rest-api/).

### Authentication

Bearer token authentication:
```
Authorization: Bearer {consumer_key}=={consumer_secret}
```

### Base URL

```
https://your-dashboard.com/wp-json/mainwp/v2/
```

### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/sites` | GET | List all sites |
| `/sites/{id}` | GET | Get site details |
| `/sites/{id}/sync` | POST | Sync site data |
| `/updates` | GET | List pending updates |
| `/sites/{id}/plugins` | GET | List plugins |
| `/sites/{id}/themes` | GET | List themes |

For complete API documentation, see the [MainWP REST API Documentation](https://mainwp.com/kb/mainwp-rest-api/).

---

## Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create a branch:** `git checkout -b feature/your-feature`
3. **Make changes** with clear, focused commits
4. **Build and test:** `npm run build && npm run smoke-test`
5. **Submit a Pull Request** with a clear description

### Contribution Guidelines

- Follow existing TypeScript style
- Add types for all new code
- Update documentation for new features
- Test with a real MainWP Dashboard before submitting
- Keep commits focused and atomic

### Reporting Issues

When reporting bugs, please include:
- Node.js version: `node --version`
- MainWP Dashboard version
- Error message and stack trace
- Steps to reproduce

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [MainWP](https://mainwp.com/) for the excellent WordPress management platform
- [Anthropic](https://anthropic.com/) for Claude and the MCP protocol
- The TypeScript community for outstanding developer tooling

---

## Development Status

See [project_status.md](./project_status.md) for recent development activity.

---

<p align="center">
  <sub>Built with ❤️ by <a href="https://github.com/cvsloane">Heaviside Group</a></sub>
</p>
