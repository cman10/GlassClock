# Spotify Integration Setup Guide

## Quick Setup

### 1. Create Spotify Application
1. Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the details:
   - App Name: "Glass Clock" (or any name you prefer)
   - App Description: "Music control for Glass Clock PWA"
   - Website: Your website URL (or just use `http://localhost:3000` for development)
   - Redirect URIs: 
     - **Development**: `http://localhost:3000/callback`
     - **Production**: `https://yourdomain.com/callback` (replace with your actual domain)
   - Which API/SDKs are you planning to use?: Select "Web API"
5. Agree to terms and create the app

### 2. Get Your Client ID
1. In your new Spotify app dashboard, find the "Client ID"
2. Copy this value (it looks like: `7c8a8b1f4b5e4c3d2e1f0a9b8c7d6e5f`)

### 3. Configure Environment
Create a `.env` file in the `glass-clock` directory:

```env
REACT_APP_SPOTIFY_CLIENT_ID=your_actual_client_id_here
```

Replace `your_actual_client_id_here` with the Client ID you copied from step 2.

### 4. Restart Development Server
After adding the environment variable:
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm start
```

## Security Notes

- **No Client Secret Required**: We use PKCE (Proof Key for Code Exchange) authentication
- **Secure Authentication**: All authentication happens client-side with secure token exchange
- **Limited Permissions**: Only requests necessary Spotify permissions for music control

## Required Spotify Permissions

The app requests these Spotify scopes:
- `user-read-playback-state` - See what's currently playing
- `user-modify-playback-state` - Control playback (play/pause/skip)
- `user-read-currently-playing` - Get current track info
- `playlist-read-private` - Access your playlists
- `streaming` - Play music through Spotify Web SDK
- `user-library-read` - Access your saved music

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Make sure you added the exact redirect URI in your Spotify app settings
   - For development: `http://localhost:3000/callback`
   - Check for trailing slashes or typos

2. **"Invalid client" error**
   - Verify your Client ID is correct in the `.env` file
   - Make sure there are no extra spaces or quotes

3. **Environment variable not loaded**
   - Restart the development server after adding the `.env` file
   - Make sure the file is named exactly `.env` (not `.env.txt`)
   - Check that the variable starts with `REACT_APP_`

4. **No playback devices found**
   - Open Spotify on another device (phone, desktop app, or web player)
   - Make sure you have an active Spotify Premium subscription
   - Try refreshing the Glass Clock page

### Testing the Integration

1. Start the development server: `npm start`
2. Navigate to `http://localhost:3000`
3. Click the 🎵 button or press `P`
4. Click "Connect Spotify"
5. You'll be redirected to Spotify for authorization
6. After authorizing, you'll return to Glass Clock with music controls

## Production Deployment

When deploying to production:

1. Add your production domain's callback URL to your Spotify app
2. Set the environment variable in your hosting platform
3. Make sure the redirect URI matches exactly (including `https://`)

Example for different platforms:
- **Vercel**: Add environment variable in project settings
- **Netlify**: Add in site settings under Environment variables
- **GitHub Pages**: Use GitHub Secrets for environment variables

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all setup steps are completed correctly
3. Make sure you have Spotify Premium (required for Web API control)
4. Try the integration with different browsers

Enjoy seamless music control with your Glass Clock! 🎵✨ 