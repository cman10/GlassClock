# Glass Clock PWA

A calming, customizable Progressive Web Application (PWA) designed for mindfulness and relaxation. Built with React, TypeScript, and modern web technologies.

## ✨ Features

### 🎯 Phase 1 (MVP) Features
- **Digital Clock Display** - Large, easily readable time with customizable formats
- **Beautiful Themes** - 6 carefully crafted themes (Midnight, Ocean, Forest, Sunset, Light, Minimal)
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **PWA Functionality** - Installable, works offline, native app-like experience
- **Keyboard Shortcuts** - Quick access to all features
- **Settings Panel** - Comprehensive customization options
- **Auto-hide Controls** - Clean, distraction-free experience

### ⚙️ Customization Options
- **Time Formats**: 12-hour or 24-hour display
- **Date Display**: Toggle with multiple format options (short, long, numeric)
- **Seconds Display**: Show or hide seconds
- **Font Sizes**: 4 different size options (small, medium, large, xl)
- **Themes**: 6 built-in themes with gradient backgrounds
- **Fullscreen Mode**: Immersive clock experience

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd relaxing-clock
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory, ready for deployment.

## 📱 PWA Features

### Installation
- **Desktop**: Click the install button in your browser's address bar
- **Mobile**: Add to Home Screen from the browser menu
- **Chrome**: Look for the "Install" prompt

### Offline Support
The app works completely offline once installed, thanks to service worker caching.

### Native App Experience
- Standalone window (no browser UI)
- Custom splash screen
- App icon on home screen/desktop

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `C` | Clock Mode |
| `T` | Timer Mode |
| `B` | Breathing Mode |
| `L` | Alarm Mode |
| `A` | AI Coach |
| `M` | Mood Tracker |
| `P` | Spotify Music Control |
| `S` | Open/close Settings |
| `F` | Toggle Fullscreen |
| `I` | Show/hide Info panel |
| `Space` | Start/Pause (Timer/Breathing) |
| `ESC` | Close panels or exit fullscreen |

## 🎨 Themes

### Available Themes
1. **Midnight** - Deep blue gradient with soft purple accents
2. **Ocean** - Blue oceanic theme with wave-like gradients
3. **Forest** - Green nature theme with earthy tones
4. **Sunset** - Warm orange and red sunset colors
5. **Light** - Clean light theme for bright environments
6. **Minimal** - Pure white minimal design

### Theme Customization
Each theme includes:
- Background gradient
- Text colors optimized for readability
- Accent colors for UI elements
- Responsive design considerations

## 🛠️ Technology Stack

### Frontend
- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Styled Components** - CSS-in-JS styling with theme support
- **Framer Motion** - Smooth animations and transitions

### PWA
- **Service Worker** - Offline caching and background sync
- **Web App Manifest** - Installation and app metadata
- **Responsive Design** - Mobile-first approach

### Performance
- **Code Splitting** - Optimized bundle loading
- **Lazy Loading** - Components loaded on demand
- **Caching Strategy** - Efficient resource caching
- **Bundle Size** - Optimized for fast loading

## 📊 Performance Metrics

Target performance metrics:
- **Lighthouse Score**: 90+ on all metrics
- **First Load**: < 3 seconds on 3G
- **Bundle Size**: < 1MB initial bundle
- **Memory Usage**: < 50MB average

## 🎵 Spotify Integration

### Setup Instructions

1. **Create Spotify App**
   - Visit [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Click "Create App" and choose "Web App"
   - Fill in app details (name, description, etc.)

2. **Configure Redirect URIs**
   Add these redirect URIs in your Spotify app settings:
   - Development: `http://localhost:3000/callback`
   - Production: `https://yourdomain.com/callback`

3. **Set Environment Variable**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_SPOTIFY_CLIENT_ID=your_client_id_here
   ```

4. **Security Note**
   - We use PKCE (Proof Key for Code Exchange) authentication flow
   - No client secret needed (secure for client-side apps)
   - All authentication happens in the browser

### Features
- **Music Control** - Play, pause, skip tracks directly from the app
- **Volume Control** - Adjust playback volume with a smooth slider
- **Current Track Display** - See what's playing with album art and artist info
- **Playlist Access** - Browse and play your Spotify playlists
- **Device Management** - Control playback across your Spotify devices
- **Visual Feedback** - Beautiful liquid glass design with audio visualizations

### Usage
1. Click the 🎵 button in the controls or press `P`
2. Click "Connect Spotify" to authenticate
3. Grant necessary permissions for music control
4. Enjoy seamless music integration with your relaxing clock!

## 🔧 Development

### Project Structure
```
src/
├── components/          # React components
│   ├── Clock.tsx       # Main clock display
│   ├── Controls.tsx    # Floating action buttons
│   └── SettingsPanel.tsx # Settings configuration
├── context/            # React context for state management
│   └── AppContext.tsx  # Global app state
├── themes/             # Theme definitions
│   └── index.ts        # Theme configurations
├── types/              # TypeScript type definitions
│   └── index.ts        # App-wide types
└── App.tsx             # Main app component
```

### Adding New Themes
1. Add theme definition to `src/themes/index.ts`
2. Include all required properties (background, textColor, accentColor, etc.)
3. Theme will automatically appear in settings panel

### State Management
The app uses React Context with useReducer for state management:
- **Theme switching**
- **Clock settings**
- **UI state (fullscreen, settings panel)**
- **Persistent preferences** (localStorage)

## 🔮 Future Enhancements

### Phase 2 Features (Planned)
- **Ambient Sounds** - Nature sounds, white noise, pink noise
- **Pomodoro Timer** - 25-minute focus sessions
- **Custom Timers** - User-defined countdown timers
- **Meditation Timer** - Guided meditation sessions
- **Breathing Guide** - Visual breathing exercises

### Phase 3 Features (Planned)
- **Weather Integration** - Current weather display
- **Calendar Integration** - Upcoming events
- **Multiple Clocks** - World clock functionality
- **Social Features** - Share themes and presets

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by minimalist clock designs and mindfulness practices
- Built with modern web technologies and PWA best practices
- Designed for accessibility and inclusive user experience

---

**Enjoy your peaceful time with Glass Clock! 🕐✨**
