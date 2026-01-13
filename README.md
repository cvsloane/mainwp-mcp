# MainWP MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude to manage WordPress sites through the [MainWP Dashboard](https://mainwp.com/) REST API.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
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

## Overview

MainWP MCP Server bridges the gap between AI assistants and WordPress site management. It allows Claude (via Claude Code) to:

- Monitor the health and status of all your WordPress sites
- Check for and apply updates to WordPress core, plugins, and themes
- Manage plugins and themes across single or multiple sites
- Add, sync, and manage sites in your MainWP Dashboard

This is particularly useful for agencies, freelancers, or anyone managing multiple WordPress sites who wants to leverage AI assistance for routine maintenance tasks.

---

## Features

### Site Management
- **List Sites**: View all connected WordPress sites with detailed information
- **Site Details**: Get comprehensive data including WordPress version, PHP version, plugins, themes, and health status
- **Health Checks**: Run health checks to identify issues
- **Sync**: Force synchronization to get the latest site data
- **Add/Remove**: Add new sites or disconnect existing ones

### Update Management
- **Update Overview**: See all pending updates across your entire network
- **WordPress Core**: Update WordPress to the latest version
- **Plugins**: Update individual or all plugins
- **Themes**: Update individual or all themes
- **Dry-Run Mode**: Preview what updates would be applied without making changes

### Plugin & Theme Management
- **Inventory**: List all plugins/themes installed on any site
- **Activation**: Activate or deactivate plugins
- **Theme Switching**: Change the active theme on any site

### Safety & Security
- **Dry-Run by Default**: All destructive operations simulate first
- **Bulk Confirmation**: Multi-site operations require explicit confirmation
- **Rate Limiting**: Prevents overwhelming your servers
- **Audit Trail**: All operations are logged

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

---

## Prerequisites

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.0.0+ | Runtime environment |
| npm | 8.0.0+ | Package management |
| Git | Any | Cloning the repository |

### Required Infrastructure

1. **MainWP Dashboard** - A WordPress installation with the [MainWP Dashboard plugin](https://wordpress.org/plugins/mainwp/) installed and activated

2. **MainWP Child Sites** - Each WordPress site you want to manage must have the [MainWP Child plugin](https://wordpress.org/plugins/mainwp-child/) installed and connected to your Dashboard

3. **REST API Access** - MainWP Dashboard must have the REST API enabled (included in MainWP 4.0+)

### Recommended

- **HTTPS**: Your MainWP Dashboard should be served over HTTPS
- **PHP 8.1+**: On your MainWP Dashboard for best performance
- **Adequate Memory**: 512MB+ PHP memory limit on Dashboard (1GB for 50+ sites)

---

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/mainwp-mcp.git
cd mainwp-mcp
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `axios` - HTTP client for API requests
- `zod` - Runtime type validation
- `dotenv` - Environment variable management

### Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Step 4: Verify Installation

```bash
npm start
```

You should see:
```
mainwp-mcp v1.0.0 started
```

Press `Ctrl+C` to stop the server.

---

## MainWP Dashboard Setup

Before using this MCP server, you need to configure your MainWP Dashboard.

### Step 1: Install MainWP Dashboard

If you haven't already:

1. Log into your WordPress admin panel
2. Go to **Plugins → Add New**
3. Search for "MainWP Dashboard"
4. Click **Install Now**, then **Activate**
5. Complete the MainWP setup wizard

### Step 2: Connect Child Sites

For each WordPress site you want to manage:

1. On the child site, install and activate the **MainWP Child** plugin
2. In your MainWP Dashboard, go to **MainWP → Sites → Add New**
3. Enter the site URL and administrator credentials
4. Click **Add Site**

### Step 3: Enable REST API

1. In your MainWP Dashboard, go to **MainWP → Settings → REST API**
2. Ensure the REST API is **Enabled**
3. Click **Add API Key**
4. Fill in the details:
   - **Description**: `Claude Code MCP Server` (or any descriptive name)
   - **Permissions**: Select the permissions you want to grant
     - **Read**: Sites, plugins, themes, updates (recommended)
     - **Write**: Updates, plugin activation (optional)
5. Click **Generate API Key**
6. **Important**: Copy both the **Consumer Key** and **Consumer Secret** immediately - the secret won't be shown again

### Step 4: Note Your API Credentials

You'll need:
- **Dashboard URL**: e.g., `https://your-mainwp-dashboard.com`
- **Consumer Key**: A 40-character hex string
- **Consumer Secret**: A 40-character hex string

The API key format used by this server is: `consumer_key==consumer_secret`

---

## Configuration

### Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your settings:

```bash
# Required: MainWP Dashboard URL
# The full URL to your MainWP Dashboard WordPress installation
MAINWP_DASHBOARD_URL=https://your-mainwp-dashboard.com

# Required: API Key
# Format: consumer_key==consumer_secret (note the double equals sign)
MAINWP_API_KEY=abc123def456...==xyz789...

# Optional: Safety Settings
# Enable dry-run mode by default (recommended: true)
MAINWP_ENABLE_DRY_RUN_BY_DEFAULT=true

# Require explicit confirmation for bulk operations (recommended: true)
MAINWP_REQUIRE_CONFIRMATION_BULK=true

# Rate limit: maximum API requests per minute (default: 60)
MAINWP_RATE_LIMIT_PER_MINUTE=60
```

### Configuration Options Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAINWP_DASHBOARD_URL` | Yes | - | Full URL to your MainWP Dashboard |
| `MAINWP_API_KEY` | Yes | - | API credentials in `key==secret` format |
| `MAINWP_ENABLE_DRY_RUN_BY_DEFAULT` | No | `true` | Simulate operations by default |
| `MAINWP_REQUIRE_CONFIRMATION_BULK` | No | `true` | Require confirmation for multi-site ops |
| `MAINWP_RATE_LIMIT_PER_MINUTE` | No | `60` | Max API requests per minute |

---

## Claude Code Integration

### Option 1: Global Configuration (Recommended)

Add to your Claude Code MCP configuration file:

**Linux/macOS**: `~/.config/claude-code/mcp.json`
**Windows**: `%APPDATA%\claude-code\mcp.json`

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
        "MAINWP_RATE_LIMIT_PER_MINUTE": "60"
      }
    }
  }
}
```

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

### Verifying the Integration

1. Restart Claude Code after adding the configuration
2. Ask Claude: "What MCP tools are available?"
3. You should see the `mainwp_*` tools listed
4. Test with: "List all MainWP sites"

---

## Available Tools

### Site Management Tools

#### `mainwp_sites_list`
List all connected WordPress sites.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `status` | string | No | Filter by status: `connected`, `disconnected`, `all` |

**Example Response:**
```json
{
  "sites": [
    {
      "id": "1",
      "name": "My Blog",
      "url": "https://myblog.com",
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
| `site_id` | string | Yes | The site ID from MainWP |

**Returns:** Comprehensive site data including plugins, themes, health score, database size, etc.

#### `mainwp_sites_count`
Get the total count of connected sites.

**Parameters:** None

#### `mainwp_sites_sync`
Force synchronization of site data.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID to sync |

#### `mainwp_sites_check`
Run a health check on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID to check |

#### `mainwp_sites_add`
Add a new site to MainWP Dashboard.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `url` | string | Yes | The site URL |
| `admin_username` | string | Yes | WordPress admin username |
| `name` | string | No | Display name for the site |

#### `mainwp_sites_reconnect`
Reconnect a disconnected site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID to reconnect |

#### `mainwp_sites_disconnect`
Disconnect a site from MainWP (does not delete the site).

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID to disconnect |

---

### Update Management Tools

#### `mainwp_updates_list`
List all pending updates across all sites.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | No | Filter to specific site |
| `type` | string | No | Filter by type: `wp`, `plugins`, `themes`, `all` |

**Example Response:**
```json
{
  "updates": [
    {
      "site_id": "1",
      "site_name": "My Blog",
      "site_url": "https://myblog.com",
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
| `site_id` | string | Yes | The site ID to update |
| `dry_run` | boolean | No | Simulate without applying (default: true) |

#### `mainwp_updates_wp`
Update WordPress core on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |
| `dry_run` | boolean | No | Simulate without applying (default: true) |

#### `mainwp_updates_plugins`
Update plugins on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |
| `plugins` | string[] | No | Specific plugin slugs (omit for all) |
| `dry_run` | boolean | No | Simulate without applying (default: true) |

#### `mainwp_updates_themes`
Update themes on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |
| `themes` | string[] | No | Specific theme slugs (omit for all) |
| `dry_run` | boolean | No | Simulate without applying (default: true) |

---

### Plugin Management Tools

#### `mainwp_plugins_list`
List all plugins installed on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |
| `status` | string | No | Filter: `active`, `inactive`, `all` |

**Example Response:**
```json
{
  "plugins": [
    {
      "name": "Akismet Anti-spam",
      "slug": "akismet",
      "version": "5.1",
      "active": true,
      "update": null
    },
    {
      "name": "Hello Dolly",
      "slug": "hello-dolly",
      "version": "1.7.2",
      "active": false,
      "update": null
    }
  ]
}
```

#### `mainwp_plugins_activate`
Activate a plugin on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |
| `plugin` | string | Yes | Plugin slug to activate |

#### `mainwp_plugins_deactivate`
Deactivate a plugin on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |
| `plugin` | string | Yes | Plugin slug to deactivate |

---

### Theme Management Tools

#### `mainwp_themes_list`
List all themes installed on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |

#### `mainwp_themes_activate`
Activate a theme on a site.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `site_id` | string | Yes | The site ID |
| `theme` | string | Yes | Theme slug to activate |

---

## Usage Examples

Once integrated with Claude Code, you can interact using natural language.

### Checking Site Status

```
You: "List all my WordPress sites"
Claude: [Calls mainwp_sites_list]
"You have 5 connected sites:
1. My Blog (https://myblog.com) - WordPress 6.4.2, PHP 8.2
2. Client Site A (https://clienta.com) - WordPress 6.4.2, PHP 8.1
..."
```

### Checking for Updates

```
You: "What updates are available across all sites?"
Claude: [Calls mainwp_updates_list]
"I found updates available:

My Blog (https://myblog.com):
- WordPress: 6.4.1 → 6.4.2
- Akismet: 5.0 → 5.1
- Yoast SEO: 21.5 → 21.6

Client Site A (https://clienta.com):
- WordPress: 6.4.2 (up to date)
- WooCommerce: 8.3.0 → 8.4.0
..."
```

### Applying Updates (Dry Run)

```
You: "Update plugins on myblog.com"
Claude: [Calls mainwp_updates_plugins with dry_run=true]
"Dry run completed. If applied, these updates would be installed:
- Akismet: 5.0 → 5.1
- Yoast SEO: 21.5 → 21.6

Would you like me to apply these updates for real?"

You: "Yes, apply them"
Claude: [Calls mainwp_updates_plugins with dry_run=false]
"Updates applied successfully:
- Akismet updated to 5.1
- Yoast SEO updated to 21.6"
```

### Plugin Management

```
You: "What plugins are installed on site ID 3?"
Claude: [Calls mainwp_plugins_list]
"Site 3 has 12 plugins installed:

Active (8):
- Akismet Anti-spam (5.1)
- Yoast SEO (21.6)
- WooCommerce (8.4.0)
...

Inactive (4):
- Hello Dolly (1.7.2)
..."

You: "Deactivate Hello Dolly on that site"
Claude: [Calls mainwp_plugins_deactivate]
"Hello Dolly has been deactivated on site 3."
```

### Security Check

```
You: "Which of my sites have outdated PHP versions?"
Claude: [Calls mainwp_sites_list, analyzes results]
"2 sites are running outdated PHP:
- Old Client Site (https://oldclient.com) - PHP 7.4 (EOL)
- Legacy Site (https://legacy.com) - PHP 8.0 (security fixes only)

I recommend upgrading these to PHP 8.2 or 8.3."
```

---

## Safety Features

### Dry-Run Mode

By default, all operations that modify sites run in dry-run mode. This means:

- The operation is simulated but not executed
- You see what would happen without any risk
- You must explicitly set `dry_run: false` to apply changes

**To disable dry-run by default** (not recommended for production):
```bash
MAINWP_ENABLE_DRY_RUN_BY_DEFAULT=false
```

### Bulk Operation Confirmation

When operations would affect multiple sites, the server requires explicit confirmation:

```
You: "Update all plugins on all sites"
Claude: "This would update plugins on 15 sites. Please confirm you want to proceed."
```

**To disable this safeguard** (not recommended):
```bash
MAINWP_REQUIRE_CONFIRMATION_BULK=false
```

### Rate Limiting

The server enforces rate limiting to prevent overwhelming your MainWP Dashboard:

- Default: 60 requests per minute
- Requests exceeding the limit are queued
- Prevents accidental DoS of your own infrastructure

**To adjust the rate limit**:
```bash
MAINWP_RATE_LIMIT_PER_MINUTE=30  # More conservative
MAINWP_RATE_LIMIT_PER_MINUTE=120 # More aggressive
```

---

## Troubleshooting

### Server Won't Start

**Error: "Missing required environment variables"**

Ensure `MAINWP_DASHBOARD_URL` and `MAINWP_API_KEY` are set. Check:
- `.env.local` exists and has the correct values
- If using MCP config, the `env` block has both variables

**Error: "Cannot find module"**

Run `npm run build` to compile TypeScript.

### API Connection Issues

**Error: "401 Unauthorized"**

- Verify your API key is correct
- Check the format: `consumer_key==consumer_secret` (double equals)
- Ensure the API key hasn't been revoked in MainWP

**Error: "Connection refused" or timeout**

- Verify `MAINWP_DASHBOARD_URL` is correct and accessible
- Check your MainWP Dashboard is running
- Ensure your firewall allows the connection

### Claude Code Integration Issues

**Tools not appearing in Claude Code**

1. Verify `mcp.json` syntax is valid JSON
2. Check the path to `dist/index.js` is absolute and correct
3. Restart Claude Code completely after config changes
4. Check Claude Code logs for MCP connection errors

**Permission errors**

- Ensure the API key has the required permissions in MainWP
- Check that read/write permissions match what you're trying to do

### MainWP Dashboard Issues

**Sites showing as disconnected**

- Run a sync: Use `mainwp_sites_sync` tool
- Check the MainWP Child plugin is active on the child site
- Verify the child site is accessible from your Dashboard

**Updates not showing**

- Force a sync on the site
- Check that MainWP Dashboard has recent sync data
- Verify the MainWP Child plugin version is compatible

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
│   │   ├── site-tools.ts        # Site management tools
│   │   ├── update-tools.ts      # Update tools
│   │   ├── plugin-tools.ts      # Plugin tools
│   │   └── theme-tools.ts       # Theme tools
│   ├── types/
│   │   └── mainwp-types.ts      # TypeScript interfaces
│   ├── schemas/
│   │   └── tool-schemas.ts      # Zod validation schemas
│   └── utils/
│       ├── safety.ts            # Dry-run & confirmation logic
│       └── error-handling.ts    # Error utilities
├── dist/                        # Compiled JavaScript (git-ignored)
├── .env.example                 # Environment template
├── .env.local                   # Your config (git-ignored)
├── package.json
├── tsconfig.json
└── README.md
```

### Development Commands

```bash
# Install dependencies
npm install

# Run in development mode (with hot reload via tsx)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Clean build artifacts
npm run clean
```

### Adding New Tools

1. Create or edit a file in `src/tools/`
2. Define the tool schema in `src/schemas/tool-schemas.ts`
3. Register the tool in `src/tools/index.ts`
4. Add corresponding API method in `src/clients/mainwp-api-client.ts`
5. Rebuild: `npm run build`

### Testing

```bash
# Test API connection manually
curl -H "Authorization: Bearer YOUR_KEY==YOUR_SECRET" \
  https://your-dashboard.com/wp-json/mainwp/v2/sites

# Run the server and test with Claude Code
npm start
```

---

## API Reference

This server uses the [MainWP REST API v2](https://mainwp.com/kb/mainwp-rest-api/).

### Authentication

All requests use Bearer token authentication:
```
Authorization: Bearer {consumer_key}=={consumer_secret}
```

### Base URL

```
https://your-dashboard.com/wp-json/mainwp/v2/
```

### Key Endpoints Used

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

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run `npm run build` to ensure it compiles
5. Commit your changes: `git commit -m "Add my feature"`
6. Push to your fork: `git push origin feature/my-feature`
7. Open a Pull Request

### Guidelines

- Follow existing code style
- Add TypeScript types for new code
- Update documentation for new features
- Test with a real MainWP Dashboard before submitting

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [MainWP](https://mainwp.com/) for the excellent WordPress management platform
- [Anthropic](https://anthropic.com/) for Claude and the MCP protocol
- The open-source community for the excellent TypeScript tooling
