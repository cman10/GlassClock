import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import spotifyService from '../services/spotifyService';
import type { SpotifyTrack, SpotifyPlaybackState, SpotifyPlaylist, SpotifyDevice } from '../services/spotifyService';
import { useAppContext } from '../context/AppContext';

// Spotify brand colors
const SPOTIFY_GREEN = '#1DB954';
const SPOTIFY_BLACK = '#191414';

// Animations
const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(29, 185, 84, 0.6);
  }
`;

const waveAnimation = keyframes`
  0%, 100% {
    transform: scaleY(0.3);
  }
  25% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.7);
  }
  75% {
    transform: scaleY(0.9);
  }
`;

const albumRotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Main container with liquid glass effect
const SpotifyContainer = styled(motion.div)`
  /* Liquid Glass Foundation */
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.03) 25%,
      rgba(255, 255, 255, 0.06) 50%,
      rgba(255, 255, 255, 0.02) 75%,
      rgba(255, 255, 255, 0.05) 100%
    );
  backdrop-filter: blur(25px) saturate(180%) brightness(110%) contrast(120%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 24px;
  padding: 30px;
  margin: 20px;
  position: relative;
  overflow: hidden;
  
  /* Advanced shadows for liquid glass depth */
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 8px 16px -4px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  
  /* Light refraction layer */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%,
      transparent 30%,
      transparent 70%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 24px;
    pointer-events: none;
    z-index: 1;
  }
  
  /* Dynamic light concentration */
  &::after {
    content: '';
    position: absolute;
    top: 12px;
    left: 12px;
    width: 40%;
    height: 30%;
    background: 
      radial-gradient(ellipse at 50% 50%, 
        rgba(255, 255, 255, 0.15) 0%, 
        rgba(255, 255, 255, 0.05) 50%,
        transparent 100%
      );
    border-radius: 20px;
    pointer-events: none;
    filter: blur(2px);
    opacity: 0.8;
    z-index: 1;
  }

  /* Mobile optimization */
  @media (max-width: 768px) {
    margin: 15px;
    padding: 20px;
    border-radius: 20px;
    
    backdrop-filter: blur(20px) saturate(160%) brightness(108%) contrast(110%);
    
    box-shadow: 
      0 15px 30px -8px rgba(0, 0, 0, 0.2),
      0 5px 12px -3px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    
    &::before {
      border-radius: 20px;
    }
    
    &::after {
      top: 8px;
      left: 8px;
      filter: blur(1px);
    }
  }
`;

// Authentication section
const AuthSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 10;
  
  h2 {
    font-size: 2rem;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.95);
    margin: 0;
    text-align: center;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.7);
    text-align: center;
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }
`;

const SpotifyButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? 
    `linear-gradient(135deg, ${SPOTIFY_GREEN} 0%, #1ed760 100%)` :
    'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)'
  };
  backdrop-filter: blur(15px) saturate(150%);
  border: 1px solid ${props => props.variant === 'primary' ? 
    'rgba(29, 185, 84, 0.5)' : 'rgba(255, 255, 255, 0.15)'
  };
  border-radius: 16px;
  padding: 12px 24px;
  color: ${props => props.variant === 'primary' ? '#000' : 'rgba(255, 255, 255, 0.9)'};
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 120px;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.variant === 'primary' ? 
      `linear-gradient(135deg, #1ed760 0%, #1db954 100%)` :
      'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)'
    };
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 3px 10px rgba(0, 0, 0, 0.1),
      ${props => props.variant === 'primary' ? 
        '0 0 20px rgba(29, 185, 84, 0.4)' : 
        '0 0 15px rgba(255, 255, 255, 0.1)'
      };
  }
  
  &:active {
    transform: translateY(0);
  }
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 1rem;
    min-height: 48px;
    min-width: 100px;
  }
`;

// Player section
const PlayerSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 25px;
  position: relative;
  z-index: 10;
  
  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const NowPlaying = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
`;

const AlbumArt = styled(motion.div)<{ isPlaying: boolean }>`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
  
  /* Glass frame */
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: ${props => props.isPlaying ? albumRotate : 'none'} 10s linear infinite;
  }
  
  /* Vinyl effect when playing */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    opacity: ${props => props.isPlaying ? 1 : 0};
    transition: opacity 0.3s ease;
  }
  
  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

const TrackInfo = styled.div`
  flex: 1;
  min-width: 0;
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.95);
    margin: 0 0 5px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      font-size: 1.1rem;
      white-space: normal;
      text-overflow: unset;
      overflow: visible;
    }
  }
  
  p {
    font-size: 0.95rem;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
      white-space: normal;
      text-overflow: unset;
      overflow: visible;
    }
  }
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MainControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    gap: 15px;
  }
`;

const ControlButton = styled(motion.button)<{ size?: 'small' | 'large' }>`
  width: ${props => props.size === 'large' ? '60px' : '48px'};
  height: ${props => props.size === 'large' ? '60px' : '48px'};
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(15px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.size === 'large' ? '24px' : '18px'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 3px 10px rgba(0, 0, 0, 0.1),
      0 0 20px rgba(255, 255, 255, 0.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
    }
  }
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    width: ${props => props.size === 'large' ? '56px' : '44px'};
    height: ${props => props.size === 'large' ? '56px' : '44px'};
    font-size: ${props => props.size === 'large' ? '22px' : '16px'};
    min-width: 44px;
    min-height: 44px;
  }
`;

const ProgressSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ProgressBar = styled.div`
  position: relative;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  cursor: pointer;
  
  /* Glass effect */
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ProgressFill = styled(motion.div)<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${SPOTIFY_GREEN} 0%, #1ed760 100%);
  border-radius: 3px;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
  position: relative;
  
  /* Glow effect */
  box-shadow: 0 0 10px rgba(29, 185, 84, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 50%;
    width: 12px;
    height: 12px;
    background: #fff;
    border-radius: 50%;
    transform: translateY(-50%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const ProgressTimes = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
`;

const VolumeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 10px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const VolumeSlider = styled.input`
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  
  /* Webkit styling */
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.2s ease;
  }
  
  &::-webkit-slider-thumb:hover {
    transform: scale(1.2);
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.4);
  }
  
  /* Firefox styling */
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
    border-radius: 50%;
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
`;

const PlaylistSection = styled(motion.div)`
  margin-top: 20px;
  
  h4 {
    color: rgba(255, 255, 255, 0.9);
    margin: 0 0 15px 0;
    font-size: 1rem;
    font-weight: 500;
  }
`;

const PlaylistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
`;

const PlaylistCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  backdrop-filter: blur(15px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.15),
      0 3px 10px rgba(0, 0, 0, 0.1);
  }
  
  img {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 8px;
    margin-bottom: 8px;
    object-fit: cover;
  }
  
  h5 {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  p {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 4px 0 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const AudioVisualization = styled.div<{ isPlaying: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 10px;
  
  div {
    width: 3px;
    height: 16px;
    background: linear-gradient(0deg, ${SPOTIFY_GREEN}, #1ed760);
    border-radius: 2px;
    animation: ${props => props.isPlaying ? waveAnimation : 'none'} 1s ease-in-out infinite;
    
    &:nth-child(1) { animation-delay: 0s; }
    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.2s; }
    &:nth-child(4) { animation-delay: 0.3s; }
  }
`;

// Component
export const SpotifyController: React.FC = () => {
  const { state } = useAppContext();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyPlaybackState | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [devices, setDevices] = useState<SpotifyDevice[]>([]);
  const [volume, setVolume] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    setIsAuthenticated(spotifyService.isAuthenticated());
    
    // Handle callback if present
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleAuthCallback(code);
    }
  }, []);

  // Fetch current playback state
  const updatePlaybackState = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const playback = await spotifyService.getCurrentPlayback();
      setCurrentTrack(playback);
      if (playback?.device.volume_percent !== undefined) {
        setVolume(playback.device.volume_percent);
      }
    } catch (error) {
      console.error('Error updating playback state:', error);
    }
  }, [isAuthenticated]);

  // Fetch user playlists
  const loadPlaylists = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const userPlaylists = await spotifyService.getUserPlaylists(10);
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  }, [isAuthenticated]);

  // Fetch devices
  const loadDevices = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const userDevices = await spotifyService.getDevices();
      setDevices(userDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  }, [isAuthenticated]);

  // Auto-refresh playback state
  useEffect(() => {
    if (!isAuthenticated) return;
    
    updatePlaybackState();
    loadPlaylists();
    loadDevices();
    
    const interval = setInterval(updatePlaybackState, 3000);
    return () => clearInterval(interval);
  }, [isAuthenticated, updatePlaybackState, loadPlaylists, loadDevices]);

  // Authentication handlers
  const handleLogin = () => {
    setIsLoading(true);
    spotifyService.initiateAuth();
  };

  const handleAuthCallback = async (code: string) => {
    try {
      setIsLoading(true);
      const success = await spotifyService.handleCallback(code);
      if (success) {
        setIsAuthenticated(true);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        setError('Authentication failed');
      }
    } catch (error) {
      setError('Authentication error');
      console.error('Auth callback error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    spotifyService.logout();
    setIsAuthenticated(false);
    setCurrentTrack(null);
    setPlaylists([]);
    setDevices([]);
  };

  // Playback control handlers
  const handlePlayPause = async () => {
    if (!currentTrack) return;
    
    try {
      if (currentTrack.is_playing) {
        await spotifyService.pause();
      } else {
        await spotifyService.play();
      }
      await updatePlaybackState();
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleSkipNext = async () => {
    try {
      await spotifyService.skipToNext();
      setTimeout(updatePlaybackState, 500);
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const handleSkipPrevious = async () => {
    try {
      await spotifyService.skipToPrevious();
      setTimeout(updatePlaybackState, 500);
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  const handleVolumeChange = async (newVolume: number) => {
    setVolume(newVolume);
    try {
      await spotifyService.setVolume(newVolume);
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  const handleSeek = async (event: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack?.item.duration_ms) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newPosition = Math.floor(percentage * currentTrack.item.duration_ms);
    
    try {
      await spotifyService.seek(newPosition);
      await updatePlaybackState();
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  const handlePlayPlaylist = async (playlist: SpotifyPlaylist) => {
    try {
      await spotifyService.play(undefined, playlist.external_urls.spotify);
      setTimeout(updatePlaybackState, 1000);
    } catch (error) {
      console.error('Error playing playlist:', error);
    }
  };

  // Format helpers
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!currentTrack?.item.duration_ms || !currentTrack.progress_ms) return 0;
    return (currentTrack.progress_ms / currentTrack.item.duration_ms) * 100;
  };

  if (!isAuthenticated) {
    return (
      <SpotifyContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AuthSection>
          <h2>🎵 Spotify Integration</h2>
          <p>Connect your Spotify account to control music while using your relaxing clock timer and breathing exercises.</p>
          <SpotifyButton
            variant="primary"
            onClick={handleLogin}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? 'Connecting...' : 'Connect Spotify'}
          </SpotifyButton>
          {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
        </AuthSection>
      </SpotifyContainer>
    );
  }

  return (
    <SpotifyContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <PlayerSection>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: 'rgba(255, 255, 255, 0.95)', fontSize: '1.5rem', fontWeight: '300' }}>
            Spotify Player
          </h2>
          <SpotifyButton
            variant="secondary"
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Logout
          </SpotifyButton>
        </div>

        {/* Current track */}
        {currentTrack?.item && (
          <NowPlaying
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlbumArt isPlaying={currentTrack.is_playing}>
              <img 
                src={currentTrack.item.album.images[0]?.url || '/default-album.png'} 
                alt={currentTrack.item.album.name}
              />
            </AlbumArt>
            <TrackInfo>
              <h3>{currentTrack.item.name}</h3>
              <p>{spotifyService.formatArtists(currentTrack.item.artists)}</p>
            </TrackInfo>
            <AudioVisualization isPlaying={currentTrack.is_playing}>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </AudioVisualization>
          </NowPlaying>
        )}

        {/* Controls */}
        <ControlsSection>
          <MainControls>
            <ControlButton
              onClick={handleSkipPrevious}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ⏮️
            </ControlButton>
            <ControlButton
              size="large"
              onClick={handlePlayPause}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {currentTrack?.is_playing ? '⏸️' : '▶️'}
            </ControlButton>
            <ControlButton
              onClick={handleSkipNext}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ⏭️
            </ControlButton>
          </MainControls>

          {/* Progress */}
          {currentTrack?.item && (
            <ProgressSection>
              <ProgressBar onClick={handleSeek}>
                <ProgressFill 
                  progress={getProgressPercentage()}
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                />
              </ProgressBar>
              <ProgressTimes>
                <span>{formatTime(currentTrack.progress_ms || 0)}</span>
                <span>{formatTime(currentTrack.item.duration_ms)}</span>
              </ProgressTimes>
            </ProgressSection>
          )}

          {/* Volume */}
          <VolumeSection>
            <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>🔊</span>
            <VolumeSlider
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            />
            <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)', minWidth: '30px' }}>
              {volume}%
            </span>
          </VolumeSection>
        </ControlsSection>

        {/* Playlists */}
        {playlists.length > 0 && (
          <PlaylistSection>
            <h4>Your Playlists</h4>
            <PlaylistGrid>
              {playlists.slice(0, 6).map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  onClick={() => handlePlayPlaylist(playlist)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={playlist.images[0]?.url || '/default-playlist.png'} 
                    alt={playlist.name}
                  />
                  <h5>{playlist.name}</h5>
                  <p>{playlist.tracks.total} tracks</p>
                </PlaylistCard>
              ))}
            </PlaylistGrid>
          </PlaylistSection>
        )}
      </PlayerSection>
    </SpotifyContainer>
  );
};

export default SpotifyController; 