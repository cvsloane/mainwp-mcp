/**
 * MainWP API Types
 */

// Site types
export interface MainWPSite {
  id: string;
  name: string;
  url: string;
  tags: Record<string, string>;
  note: string;
  ip: string;
  client_id: string;
  is_staging: string;
  wp_version: string;
  php_version: string;
  child_version: string;
  mysql_version: string;
  memory_limit: string;
  database_size: string;
  active_theme: string;
  status: 'connected' | 'disconnected' | 'suspended';
  sync_errors: string;
  http_status: string;
  health_status: string;
  health_score: string;
  icon: string;
  last_sync: string;
  plugins: string; // JSON string
  themes: string; // JSON string
}

export interface MainWPSiteBasic {
  id: string;
  name: string;
  url: string;
  status: string;
}

export interface MainWPSitesResponse {
  success: number;
  total: number;
  data: MainWPSite[];
}

// Plugin types
export interface MainWPPlugin {
  mainwp: string;
  name: string;
  slug: string;
  description: string;
  version: string;
  active: number;
  update?: {
    new_version: string;
  };
}

export interface MainWPPluginsResponse {
  success: number;
  data: MainWPPlugin[];
}

// Theme types
export interface MainWPTheme {
  name: string;
  slug: string;
  version: string;
  active: boolean;
  update?: {
    new_version: string;
  };
}

export interface MainWPThemesResponse {
  success: number;
  data: MainWPTheme[];
}

// Update types
export interface MainWPUpdate {
  site_id: string;
  site_name: string;
  site_url: string;
  wp_upgrades?: {
    current: string;
    new: string;
  };
  plugin_upgrades?: Record<string, {
    name: string;
    version: string;
    new_version: string;
  }>;
  theme_upgrades?: Record<string, {
    name: string;
    version: string;
    new_version: string;
  }>;
  translation_upgrades?: unknown[];
}

export interface MainWPUpdatesResponse {
  success: number;
  data: MainWPUpdate[];
}

// API response wrapper
export interface MainWPApiResponse<T> {
  success: number;
  data?: T;
  error?: string;
  message?: string;
}

// API client config
export interface MainWPClientConfig {
  dashboardUrl: string;
  apiKey: string;
  rateLimitPerMinute?: number;
}

// Tool result types - compatible with MCP SDK
export interface ToolResult {
  [key: string]: unknown;
  content: Array<{
    type: 'text';
    text: string;
  }>;
  isError?: boolean;
}
