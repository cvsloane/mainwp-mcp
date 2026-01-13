/**
 * MainWP REST API Client
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type { MainWPClientConfig, MainWPApiResponse } from '../types/mainwp-types.js';

export class MainWPApiClient {
  private client: AxiosInstance;
  private requestTimestamps: number[] = [];
  private rateLimitPerMinute: number;

  constructor(config: MainWPClientConfig) {
    this.rateLimitPerMinute = config.rateLimitPerMinute ?? 60;

    this.client = axios.create({
      baseURL: `${config.dashboardUrl}/wp-json/mainwp/v2`,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  /**
   * Check and enforce rate limiting
   */
  private async checkRateLimit(): Promise<void> {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window

    // Remove timestamps outside the window
    this.requestTimestamps = this.requestTimestamps.filter(t => t > windowStart);

    if (this.requestTimestamps.length >= this.rateLimitPerMinute) {
      const oldestInWindow = this.requestTimestamps[0];
      const waitTime = oldestInWindow + 60000 - now;
      if (waitTime > 0) {
        throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
      }
    }

    this.requestTimestamps.push(now);
  }

  /**
   * Handle API errors with meaningful messages
   */
  private handleApiError(error: AxiosError): Error {
    if (error.response) {
      const data = error.response.data as { error?: string; message?: string };
      const message = data?.error || data?.message || error.message;
      return new Error(`MainWP API Error (${error.response.status}): ${message}`);
    } else if (error.request) {
      return new Error(`MainWP API Error: No response received - ${error.message}`);
    } else {
      return new Error(`MainWP API Error: ${error.message}`);
    }
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    await this.checkRateLimit();
    const response = await this.client.get<T>(endpoint, { params });
    return response.data;
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    await this.checkRateLimit();
    const response = await this.client.post<T>(endpoint, data);
    return response.data;
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    await this.checkRateLimit();
    const response = await this.client.delete<T>(endpoint);
    return response.data;
  }

  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: Record<string, unknown>): Promise<T> {
    await this.checkRateLimit();
    const response = await this.client.put<T>(endpoint, data);
    return response.data;
  }

  // ============ Sites API ============

  /**
   * List all connected sites
   */
  async listSites(): Promise<MainWPApiResponse<unknown>> {
    return this.get('/sites');
  }

  /**
   * Get basic site info (lightweight)
   */
  async listSitesBasic(): Promise<MainWPApiResponse<unknown>> {
    return this.get('/sites/basic');
  }

  /**
   * Get site count
   */
  async getSitesCount(): Promise<MainWPApiResponse<unknown>> {
    return this.get('/sites/count');
  }

  /**
   * Get single site by ID or domain
   */
  async getSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/sites/${encodeURIComponent(idOrDomain)}`);
  }

  /**
   * Sync a site
   */
  async syncSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/sync`);
  }

  /**
   * Sync all sites
   */
  async syncAllSites(): Promise<MainWPApiResponse<unknown>> {
    return this.post('/sites/sync');
  }

  /**
   * Check site health
   */
  async checkSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/check`);
  }

  /**
   * Add a new site
   */
  async addSite(data: {
    url: string;
    name?: string;
    admin?: string;
    uniqueId?: string;
    ssl_verify?: number;
    groupids?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.post('/sites/add', data);
  }

  /**
   * Reconnect to a site
   */
  async reconnectSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/reconnect`);
  }

  /**
   * Disconnect from a site
   */
  async disconnectSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/disconnect`);
  }

  /**
   * Edit site settings
   */
  async editSite(idOrDomain: string, data: {
    name?: string;
    groupids?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.put(`/sites/${encodeURIComponent(idOrDomain)}/edit`, data);
  }

  /**
   * Suspend a site
   */
  async suspendSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/suspend`);
  }

  /**
   * Unsuspend a site
   */
  async unsuspendSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/unsuspend`);
  }

  /**
   * Get non-MainWP changes for a site
   */
  async getNonMainWPChanges(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/sites/${encodeURIComponent(idOrDomain)}/non-mainwp-changes`);
  }

  /**
   * Remove a site from MainWP (deletes site data)
   */
  async removeSite(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.delete(`/sites/${encodeURIComponent(idOrDomain)}`);
  }

  // ============ Plugins API ============

  /**
   * List plugins on a site
   */
  async listPlugins(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/sites/${encodeURIComponent(idOrDomain)}/plugins`);
  }

  /**
   * Activate plugins on a site
   */
  async activatePlugins(idOrDomain: string, plugins: string[]): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/plugins/activate`, {
      plugins: plugins.join(','),
    });
  }

  /**
   * Deactivate plugins on a site
   */
  async deactivatePlugins(idOrDomain: string, plugins: string[]): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/plugins/deactivate`, {
      plugins: plugins.join(','),
    });
  }

  /**
   * Install a plugin on a site
   */
  async installPlugin(idOrDomain: string, slug: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/plugins/install`, {
      slug,
    });
  }

  /**
   * Delete a plugin from a site
   */
  async deletePlugin(idOrDomain: string, slug: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/plugins/delete`, {
      slug,
    });
  }

  // ============ Themes API ============

  /**
   * List themes on a site
   */
  async listThemes(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/sites/${encodeURIComponent(idOrDomain)}/themes`);
  }

  /**
   * Activate a theme on a site
   */
  async activateTheme(idOrDomain: string, theme: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/themes/activate`, {
      theme,
    });
  }

  /**
   * Install a theme on a site
   */
  async installTheme(idOrDomain: string, slug: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/themes/install`, {
      slug,
    });
  }

  /**
   * Delete a theme from a site
   */
  async deleteTheme(idOrDomain: string, slug: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/sites/${encodeURIComponent(idOrDomain)}/themes/delete`, {
      slug,
    });
  }

  // ============ Updates API ============

  /**
   * List all pending updates
   */
  async listUpdates(): Promise<MainWPApiResponse<unknown>> {
    return this.get('/updates');
  }

  /**
   * Get updates for a specific site
   */
  async getSiteUpdates(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/updates/${encodeURIComponent(idOrDomain)}`);
  }

  /**
   * Update WordPress core
   */
  async updateWordPress(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/updates/${encodeURIComponent(idOrDomain)}/update/wp`);
  }

  /**
   * Update plugins
   */
  async updatePlugins(idOrDomain: string, plugins?: string[]): Promise<MainWPApiResponse<unknown>> {
    const data = plugins ? { plugins: plugins.join(',') } : {};
    return this.post(`/updates/${encodeURIComponent(idOrDomain)}/update/plugins`, data);
  }

  /**
   * Update themes
   */
  async updateThemes(idOrDomain: string, themes?: string[]): Promise<MainWPApiResponse<unknown>> {
    const data = themes ? { themes: themes.join(',') } : {};
    return this.post(`/updates/${encodeURIComponent(idOrDomain)}/update/themes`, data);
  }

  /**
   * Update translations
   */
  async updateTranslations(idOrDomain: string): Promise<MainWPApiResponse<unknown>> {
    return this.post(`/updates/${encodeURIComponent(idOrDomain)}/update/translations`);
  }

  /**
   * Ignore an update
   */
  async ignoreUpdate(data: {
    type: 'plugin' | 'theme';
    slug: string;
    site?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.post('/updates/ignore', data);
  }

  /**
   * Unignore an update
   */
  async unignoreUpdate(data: {
    type: 'plugin' | 'theme';
    slug: string;
    site?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.post('/updates/unignore', data);
  }

  /**
   * List ignored updates
   */
  async listIgnoredUpdates(): Promise<MainWPApiResponse<unknown>> {
    return this.get('/updates/ignored');
  }

  // ============ Clients API (Pro) ============

  /**
   * List all clients
   */
  async listClients(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.get('/clients', params);
  }

  /**
   * Get a single client by ID or email
   */
  async getClient(idOrEmail: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/clients/${encodeURIComponent(idOrEmail)}`);
  }

  /**
   * Add a new client
   */
  async addClient(data: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    note?: string;
    selected_sites?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.post('/clients/add', data);
  }

  /**
   * Edit a client
   */
  async editClient(idOrEmail: string, data: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    note?: string;
    selected_sites?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.put(`/clients/${encodeURIComponent(idOrEmail)}/edit`, data);
  }

  /**
   * Delete a client
   */
  async deleteClient(idOrEmail: string): Promise<MainWPApiResponse<unknown>> {
    return this.delete(`/clients/${encodeURIComponent(idOrEmail)}`);
  }

  // ============ Costs API (Pro) ============

  /**
   * List all costs
   */
  async listCosts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    category?: string;
    type?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.get('/costs', params);
  }

  /**
   * Get a single cost by ID
   */
  async getCost(id: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/costs/${encodeURIComponent(id)}`);
  }

  /**
   * Add a new cost
   */
  async addCost(data: {
    name: string;
    type?: 'single' | 'recurring';
    product_type?: 'plugin' | 'theme' | 'hosting' | 'domain' | 'service' | 'other';
    price?: number;
    currency?: string;
    renewal_frequency?: 'monthly' | 'yearly' | 'lifetime';
    last_renewal?: string;
    next_renewal?: string;
    sites?: string;
    note?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.put('/costs/add', data);
  }

  /**
   * Edit a cost
   */
  async editCost(id: string, data: {
    name?: string;
    type?: 'single' | 'recurring';
    product_type?: 'plugin' | 'theme' | 'hosting' | 'domain' | 'service' | 'other';
    price?: number;
    currency?: string;
    renewal_frequency?: 'monthly' | 'yearly' | 'lifetime';
    last_renewal?: string;
    next_renewal?: string;
    sites?: string;
    note?: string;
  }): Promise<MainWPApiResponse<unknown>> {
    return this.put(`/costs/${encodeURIComponent(id)}/edit`, data);
  }

  /**
   * Delete a cost
   */
  async deleteCost(id: string): Promise<MainWPApiResponse<unknown>> {
    return this.delete(`/costs/${encodeURIComponent(id)}`);
  }

  // ============ Tags API ============

  /**
   * List all tags
   */
  async listTags(): Promise<MainWPApiResponse<unknown>> {
    return this.get('/tags');
  }

  /**
   * Get sites with a specific tag
   */
  async getTagSites(tagId: string): Promise<MainWPApiResponse<unknown>> {
    return this.get(`/tags/${tagId}/sites`);
  }
}

// Create singleton instance
let clientInstance: MainWPApiClient | null = null;

export function getMainWPClient(): MainWPApiClient {
  if (!clientInstance) {
    const dashboardUrl = process.env.MAINWP_DASHBOARD_URL;
    const apiKey = process.env.MAINWP_API_KEY;

    if (!dashboardUrl || !apiKey) {
      throw new Error('MAINWP_DASHBOARD_URL and MAINWP_API_KEY environment variables are required');
    }

    clientInstance = new MainWPApiClient({
      dashboardUrl,
      apiKey,
      rateLimitPerMinute: parseInt(process.env.MAINWP_RATE_LIMIT_PER_MINUTE ?? '60', 10),
    });
  }

  return clientInstance;
}
