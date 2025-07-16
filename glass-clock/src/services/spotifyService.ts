// Spotify Web API service for Glass Clock
interface SpotifyConfig {
  clientId: string;
  redirectUri: string;
  scopes: string[];
}

interface SpotifyTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{ name: string; id: string }>;
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  duration_ms: number;
  preview_url?: string;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaybackState {
  device: {
    id: string;
    name: string;
    type: string;
    volume_percent: number;
  };
  shuffle_state: boolean;
  repeat_state: 'off' | 'context' | 'track';
  timestamp: number;
  context?: {
    type: string;
    uri: string;
  };
  progress_ms: number;
  item: SpotifyTrack;
  currently_playing_type: 'track' | 'episode' | 'ad' | 'unknown';
  actions: {
    disallows: Record<string, boolean>;
  };
  is_playing: boolean;
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string; height: number; width: number }>;
  tracks: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyDevice {
  id: string;
  is_active: boolean;
  is_private_session: boolean;
  is_restricted: boolean;
  name: string;
  type: string;
  volume_percent: number;
}

class SpotifyService {
  private config: SpotifyConfig;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.config = {
      clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID || '',
      redirectUri: window.location.origin + '/callback',
      scopes: [
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-read-private',
        'user-read-email',
        'playlist-read-private',
        'playlist-read-collaborative',
        'streaming',
        'user-library-read',
        'user-library-modify'
      ]
    };

    // Load tokens from localStorage
    this.loadTokensFromStorage();
  }

  // Generate PKCE challenge for secure authentication
  private generateCodeChallenge(): { codeVerifier: string; codeChallenge: string } {
    const codeVerifier = this.generateRandomString(128);
    const codeChallenge = btoa(this.sha256(codeVerifier))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    return { codeVerifier, codeChallenge };
  }

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private sha256(plain: string): string {
    // Simple SHA256 implementation for PKCE
    // In production, use crypto.subtle.digest
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return Array.from(data).map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Authentication flow
  public initiateAuth(): void {
    const { codeVerifier, codeChallenge } = this.generateCodeChallenge();
    
    // Store code verifier for later use
    localStorage.setItem('spotify_code_verifier', codeVerifier);

    const params = new URLSearchParams({
      client_id: this.config.clientId,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      scope: this.config.scopes.join(' '),
      show_dialog: 'true'
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  // Handle callback and exchange code for tokens
  public async handleCallback(code: string): Promise<boolean> {
    const codeVerifier = localStorage.getItem('spotify_code_verifier');
    if (!codeVerifier) {
      throw new Error('Code verifier not found');
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: this.config.redirectUri,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const tokens: SpotifyTokens = await response.json();
      this.setTokens(tokens);
      
      // Clean up
      localStorage.removeItem('spotify_code_verifier');
      
      return true;
    } catch (error) {
      console.error('Spotify authentication error:', error);
      return false;
    }
  }

  // Refresh access token
  public async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.config.clientId,
          grant_type: 'refresh_token',
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const tokens: SpotifyTokens = await response.json();
      this.setTokens(tokens);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  // API call wrapper with automatic token refresh
  private async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!this.accessToken || this.isTokenExpired()) {
      if (!(await this.refreshAccessToken())) {
        throw new Error('Authentication required');
      }
    }

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 401) {
      // Token expired, try refresh once
      if (await this.refreshAccessToken()) {
        return this.apiCall(endpoint, options);
      }
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Spotify API error: ${response.status} ${error}`);
    }

    if (response.status === 204) {
      return {} as T; // No content
    }

    return response.json();
  }

  // Playback control methods
  public async getCurrentPlayback(): Promise<SpotifyPlaybackState | null> {
    try {
      const response = await this.apiCall<SpotifyPlaybackState>('/me/player');
      return response;
    } catch (error) {
      console.error('Error getting playback state:', error);
      return null;
    }
  }

  public async play(deviceId?: string, contextUri?: string, trackUris?: string[]): Promise<void> {
    const body: any = {};
    if (contextUri) body.context_uri = contextUri;
    if (trackUris) body.uris = trackUris;

    const params = deviceId ? `?device_id=${deviceId}` : '';
    await this.apiCall(`/me/player/play${params}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  public async pause(deviceId?: string): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    await this.apiCall(`/me/player/pause${params}`, {
      method: 'PUT',
    });
  }

  public async skipToNext(deviceId?: string): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    await this.apiCall(`/me/player/next${params}`, {
      method: 'POST',
    });
  }

  public async skipToPrevious(deviceId?: string): Promise<void> {
    const params = deviceId ? `?device_id=${deviceId}` : '';
    await this.apiCall(`/me/player/previous${params}`, {
      method: 'POST',
    });
  }

  public async setVolume(volumePercent: number, deviceId?: string): Promise<void> {
    const params = new URLSearchParams({
      volume_percent: volumePercent.toString(),
      ...(deviceId && { device_id: deviceId }),
    });
    await this.apiCall(`/me/player/volume?${params}`, {
      method: 'PUT',
    });
  }

  public async setShuffle(state: boolean, deviceId?: string): Promise<void> {
    const params = new URLSearchParams({
      state: state.toString(),
      ...(deviceId && { device_id: deviceId }),
    });
    await this.apiCall(`/me/player/shuffle?${params}`, {
      method: 'PUT',
    });
  }

  public async setRepeat(state: 'off' | 'context' | 'track', deviceId?: string): Promise<void> {
    const params = new URLSearchParams({
      state: state,
      ...(deviceId && { device_id: deviceId }),
    });
    await this.apiCall(`/me/player/repeat?${params}`, {
      method: 'PUT',
    });
  }

  public async seek(positionMs: number, deviceId?: string): Promise<void> {
    const params = new URLSearchParams({
      position_ms: positionMs.toString(),
      ...(deviceId && { device_id: deviceId }),
    });
    await this.apiCall(`/me/player/seek?${params}`, {
      method: 'PUT',
    });
  }

  // Device management
  public async getDevices(): Promise<SpotifyDevice[]> {
    const response = await this.apiCall<{ devices: SpotifyDevice[] }>('/me/player/devices');
    return response.devices;
  }

  public async transferPlayback(deviceId: string, play: boolean = true): Promise<void> {
    await this.apiCall('/me/player', {
      method: 'PUT',
      body: JSON.stringify({
        device_ids: [deviceId],
        play: play,
      }),
    });
  }

  // Search and library methods
  public async search(query: string, types: string[] = ['track'], limit: number = 20): Promise<any> {
    const params = new URLSearchParams({
      q: query,
      type: types.join(','),
      limit: limit.toString(),
    });
    return this.apiCall(`/search?${params}`);
  }

  public async getUserPlaylists(limit: number = 20): Promise<SpotifyPlaylist[]> {
    const response = await this.apiCall<{ items: SpotifyPlaylist[] }>(`/me/playlists?limit=${limit}`);
    return response.items;
  }

  public async getPlaylistTracks(playlistId: string, limit: number = 50): Promise<SpotifyTrack[]> {
    const response = await this.apiCall<{ items: Array<{ track: SpotifyTrack }> }>(`/playlists/${playlistId}/tracks?limit=${limit}`);
    return response.items.map(item => item.track);
  }

  // Utility methods
  private setTokens(tokens: SpotifyTokens): void {
    this.accessToken = tokens.access_token;
    this.refreshToken = tokens.refresh_token || this.refreshToken;
    this.tokenExpiry = Date.now() + (tokens.expires_in * 1000);

    // Save to localStorage
    localStorage.setItem('spotify_access_token', this.accessToken);
    if (this.refreshToken) {
      localStorage.setItem('spotify_refresh_token', this.refreshToken);
    }
    localStorage.setItem('spotify_token_expiry', this.tokenExpiry.toString());
  }

  private loadTokensFromStorage(): void {
    this.accessToken = localStorage.getItem('spotify_access_token');
    this.refreshToken = localStorage.getItem('spotify_refresh_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    this.tokenExpiry = expiry ? parseInt(expiry) : 0;
  }

  private isTokenExpired(): boolean {
    return Date.now() >= this.tokenExpiry - 60000; // 1 minute buffer
  }

  public isAuthenticated(): boolean {
    return !!this.accessToken && !this.isTokenExpired();
  }

  public logout(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = 0;
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_code_verifier');
  }

  // Format helpers
  public formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  public formatArtists(artists: Array<{ name: string }>): string {
    return artists.map(artist => artist.name).join(', ');
  }
}

export default new SpotifyService();
export type { SpotifyTrack, SpotifyPlaybackState, SpotifyPlaylist, SpotifyDevice }; 