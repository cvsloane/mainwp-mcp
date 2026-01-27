# MainWP MCP API Reference

This document provides comprehensive details about the MainWP MCP Server's available tools and their usage.

## Authentication

All tools require a valid MainWP Dashboard REST API key with appropriate permissions.

**Required Environment Variables:**
- `MAINWP_DASHBOARD_URL`: Full URL of your MainWP Dashboard
- `MAINWP_API_KEY`: API key in `consumer_key==consumer_secret` format

## Safety Features

- **Dry-Run Mode**: Most destructive operations default to simulation
- **Bulk Operation Confirmation**: Multi-site actions require explicit consent
- **Rate Limiting**: Prevents overwhelming your MainWP Dashboard

## Tool Categories

### Site Management Tools

#### `mainwp_sites_list`
- **Description**: List all connected WordPress sites
- **Parameters**:
  - `status` (optional): Filter sites by connection status
- **Example**:
  ```bash
  # List all connected sites
  mainwp_sites_list

  # List only disconnected sites
  mainwp_sites_list status=disconnected
  ```

#### `mainwp_sites_sync`
- **Description**: Force synchronization of site data
- **Parameters**:
  - `site_id`: ID of the site to sync

### Update Management Tools

#### `mainwp_updates_list`
- **Description**: List pending updates across sites
- **Parameters**:
  - `site_id` (optional): Filter updates for a specific site
  - `type` (optional): Filter update types (`wp`, `plugins`, `themes`)

#### `mainwp_updates_apply`
- **Description**: Apply pending updates for a site
- **Parameters**:
  - `site_id`: Site to update
  - `dry_run` (optional): Simulate updates without applying

### Plugin Management Tools

#### `mainwp_plugins_list`
- **Description**: List plugins installed on a site
- **Parameters**:
  - `site_id`: Target site
  - `status` (optional): Filter by plugin status

#### `mainwp_plugins_activate`
- **Description**: Activate a plugin on a site
- **Parameters**:
  - `site_id`: Target site
  - `plugin`: Plugin slug to activate

## Contributing to API Development

1. Add new tools in `src/tools/`
2. Define schemas in `src/schemas/tool-schemas.ts`
3. Implement API methods in `src/clients/mainwp-api-client.ts`

## Troubleshooting

- Verify API key permissions
- Check MainWP Dashboard connectivity
- Use `dry_run: true` for safe exploration

## Pro Features

Some advanced tools require MainWP Pro extensions, such as:
- Client management
- Cost tracking
- Advanced reporting