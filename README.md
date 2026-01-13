# MainWP MCP Server

A Model Context Protocol (MCP) server that enables AI assistants like Claude to manage WordPress sites through the [MainWP Dashboard](https://mainwp.com/) REST API.

## Features

- **Site Management**: List, sync, and monitor all connected WordPress sites
- **Update Management**: View and apply WordPress core, plugin, and theme updates
- **Plugin Management**: List, activate, and deactivate plugins across sites
- **Theme Management**: List and activate themes
- **Safety Features**: Dry-run mode, bulk operation confirmations, and rate limiting

## Prerequisites

- Node.js 18+
- [MainWP Dashboard](https://mainwp.com/) installed on a WordPress site
- MainWP REST API enabled with an API key
- MainWP Child plugin installed on sites you want to manage

## Installation

```bash
git clone https://github.com/yourusername/mainwp-mcp.git
cd mainwp-mcp
npm install
npm run build
```

## Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your MainWP credentials:
   ```bash
   MAINWP_DASHBOARD_URL=https://your-mainwp-dashboard.com
   MAINWP_API_KEY=your_consumer_key==your_consumer_secret
   ```

3. Generate an API key in MainWP:
   - Go to MainWP Dashboard > Settings > REST API
   - Click "Add API Key"
   - Copy both the Consumer Key and Consumer Secret
   - Format as: `consumer_key==consumer_secret`

## Claude Code Integration

Add to your Claude Code MCP configuration (`~/.config/claude-code/mcp.json`):

```json
{
  "mcpServers": {
    "mainwp": {
      "type": "stdio",
      "command": "node",
      "args": ["/path/to/mainwp-mcp/dist/index.js"],
      "env": {
        "MAINWP_DASHBOARD_URL": "https://your-mainwp-dashboard.com",
        "MAINWP_API_KEY": "your_consumer_key==your_consumer_secret"
      }
    }
  }
}
```

Then restart Claude Code to load the MCP server.

## Available Tools

### Site Management

| Tool | Description |
|------|-------------|
| `mainwp_sites_list` | List all connected sites with details |
| `mainwp_sites_get` | Get detailed information for a specific site |
| `mainwp_sites_count` | Get total count of connected sites |
| `mainwp_sites_sync` | Force sync data for a site |
| `mainwp_sites_check` | Run health check on a site |
| `mainwp_sites_add` | Add a new site to MainWP |
| `mainwp_sites_reconnect` | Reconnect a disconnected site |
| `mainwp_sites_disconnect` | Disconnect a site from MainWP |

### Update Management

| Tool | Description |
|------|-------------|
| `mainwp_updates_list` | List all pending updates across sites |
| `mainwp_updates_apply` | Apply all pending updates for a site |
| `mainwp_updates_wp` | Update WordPress core |
| `mainwp_updates_plugins` | Update specific plugins |
| `mainwp_updates_themes` | Update specific themes |

### Plugin Management

| Tool | Description |
|------|-------------|
| `mainwp_plugins_list` | List plugins on a site |
| `mainwp_plugins_activate` | Activate a plugin |
| `mainwp_plugins_deactivate` | Deactivate a plugin |

### Theme Management

| Tool | Description |
|------|-------------|
| `mainwp_themes_list` | List themes on a site |
| `mainwp_themes_activate` | Activate a theme |

## Safety Features

The server includes several safety features to prevent accidental damage:

- **Dry-Run Mode**: Enabled by default (`MAINWP_ENABLE_DRY_RUN_BY_DEFAULT=true`). Operations simulate changes without applying them.
- **Bulk Confirmation**: Bulk operations require explicit confirmation (`MAINWP_REQUIRE_CONFIRMATION_BULK=true`).
- **Rate Limiting**: Configurable rate limit prevents overwhelming servers (`MAINWP_RATE_LIMIT_PER_MINUTE=60`).

## Usage Examples

Once integrated with Claude Code, you can use natural language:

```
"List all my WordPress sites"
"Check the health of example.com"
"What plugins need updates?"
"Update all plugins on staging.example.com (dry run)"
"Deactivate the hello-dolly plugin on all sites"
```

## Development

```bash
# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start
```

## API Reference

This server uses the [MainWP REST API v2](https://mainwp.com/kb/mainwp-rest-api/). Refer to the official documentation for detailed endpoint information.

## License

MIT
