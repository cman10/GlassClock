import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { AppProvider, useAppContext } from './context/AppContext';
import { Clock } from './components/Clock';
import { Timer } from './components/Timer';
import { BreathingGuide } from './components/BreathingGuide';
import { AlarmManager } from './components/AlarmManager';
import { AlarmScreen } from './components/AlarmScreen';
import { Controls } from './components/Controls';
import { SettingsPanel } from './components/SettingsPanel';
import { AudioManager } from './components/AudioManager';
import { ThemeGallery } from './components/ThemeGallery';
import { ThemeCreator } from './components/ThemeCreator';
import { StatsPanel } from './components/StatsPanel';
import { GestureHandler, useGestureShortcuts } from './components/GestureHandler';
import { AdvancedTimer } from './components/AdvancedTimer';
import { PremiumPanel } from './components/PremiumPanel';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { IntegrationsPanel } from './components/IntegrationsPanel';
import { NotificationSystem } from './components/NotificationSystem';
import SmartCoachPanel from './components/SmartCoachPanel';
import MoodTracker from './components/MoodTracker';
import SmartScheduler from './components/SmartScheduler';
import FocusAssistant from './components/FocusAssistant';
import HabitIntelligence from './components/HabitIntelligence';
import AdvancedAnalyticsDashboard from './components/AdvancedAnalyticsDashboard';
import MLModelManager from './components/MLModelManager';
import CrossDeviceSyncManager from './components/CrossDeviceSyncManager';
import { motion } from 'framer-motion';

const GlobalStyle = createGlobalStyle<{ theme: any }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => 
      props.theme.gradientStart ? 
      `linear-gradient(135deg, ${props.theme.gradientStart} 0%, ${props.theme.gradientEnd} 100%)` : 
      props.theme.background
    };
    color: ${props => props.theme.textColor};
    transition: background 0.5s ease, color 0.3s ease;
    overflow: hidden;
    
    /* Liquid glass overlay */
    &::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(119, 198, 255, 0.08) 0%, transparent 50%);
      pointer-events: none;
      z-index: -1;
      animation: liquidFlow 20s ease-in-out infinite;
    }
  }

  #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  /* Liquid glass animations */
  @keyframes liquidFlow {
    0%, 100% {
      transform: scale(1) rotate(0deg);
      opacity: 0.5;
    }
    33% {
      transform: scale(1.1) rotate(1deg);
      opacity: 0.7;
    }
    66% {
      transform: scale(0.9) rotate(-1deg);
      opacity: 0.4;
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes glassShimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: 200px 0;
    }
  }

  @keyframes liquidHover {
    0% {
      transform: scale(1);
      filter: blur(0px);
    }
    50% {
      transform: scale(1.05);
      filter: blur(0.5px);
    }
    100% {
      transform: scale(1.02);
      filter: blur(0px);
    }
  }

  @keyframes pulseGlow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
    }
    50% {
      box-shadow: 0 0 30px rgba(255, 255, 255, 0.2);
    }
  }

  /* Enhanced scrollbar with glass effect */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    backdrop-filter: blur(10px);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, ${props => props.theme.accentColor}80, ${props => props.theme.accentColor}40);
    border-radius: 6px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(45deg, ${props => props.theme.accentColor}CC, ${props => props.theme.accentColor}80);
    transform: scale(1.1);
  }

  /* Glass morphism utility classes */
  .glass-panel {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-panel:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .liquid-button {
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(15px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }

  .liquid-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  .liquid-button:hover::before {
    left: 100%;
  }

  .liquid-button:hover {
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
    border-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.05) translateY(-2px);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.3),
      0 0 20px rgba(255, 255, 255, 0.1);
  }

  .floating-element {
    animation: float 6s ease-in-out infinite;
  }

  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid ${props => props.theme.accentColor};
    outline-offset: 2px;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

const AppContainer = styled.div<{ theme: any; isFullscreen: boolean }>`
  width: 100vw;
  height: 100vh;
  background: ${props => 
    props.theme.gradientStart ? 
    `linear-gradient(135deg, ${props.theme.gradientStart} 0%, ${props.theme.gradientEnd} 100%)` : 
    props.theme.background
  };
  color: ${props => props.theme.textColor};
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  cursor: ${props => props.isFullscreen ? 'none' : 'default'};
  transition: background 0.5s ease-in-out;
  
  &:fullscreen {
    cursor: none;
  }
`;

const MainContent = styled.div<{ isSettingsOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  transform: ${props => props.isSettingsOpen ? 'translateX(-320px)' : 'translateX(0)'};
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    transform: none;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ModeContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const InstallPrompt = styled.div<{ theme: any }>`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.accentColor};
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  
  &:hover {
    transform: translateX(-50%) translateY(-2px);
  }
`;

const LoadingScreen = styled.div<{ theme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.theme.background};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const LoadingSpinner = styled.div<{ theme: any }>`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid ${props => props.theme.accentColor};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div<{ theme: any }>`
  color: ${props => props.theme.textColor};
  font-size: 1.2rem;
  font-weight: 500;
`;

const WeatherWidget = styled.div<{ theme: any }>`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  z-index: 100;
`;

const PremiumBadge = styled.div<{ theme: any }>`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ec4899, #f59e0b);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 100;

  &:hover {
    transform: translateY(-2px);
  }
`;

// Add floating orbs component
const FloatingOrbs = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
`;

const GlassOrb = styled(motion.div)<{ size: number; delay: number }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, 
    rgba(255, 255, 255, 0.15), 
    rgba(255, 255, 255, 0.05),
    transparent
  );
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: 
    float ${(props) => 8 + props.delay}s ease-in-out infinite,
    drift ${(props) => 15 + props.delay * 2}s linear infinite;
  animation-delay: ${(props) => props.delay}s;

  @keyframes drift {
    0% {
      transform: translateX(-20px);
    }
    50% {
      transform: translateX(20px);
    }
    100% {
      transform: translateX(-20px);
    }
  }
`;

const AppContent: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const shortcuts = useGestureShortcuts();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Global keyboard shortcuts
      if (e.key === 'Escape') {
        if (state.isSettingsOpen) {
          dispatch({ type: 'TOGGLE_SETTINGS' });
        }
        if (state.isFullscreen) {
          document.exitFullscreen();
        }
      }
      
      // Mode switching shortcuts
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'c':
            dispatch({ type: 'SET_ACTIVE_MODE', payload: 'clock' });
            break;
          case 't':
            dispatch({ type: 'SET_ACTIVE_MODE', payload: 'timer' });
            break;
          case 'b':
            dispatch({ type: 'SET_ACTIVE_MODE', payload: 'breathing' });
            break;
          case 'm':
            dispatch({ type: 'SET_ACTIVE_MODE', payload: 'meditation' });
            break;
        }
      }
      
      // Settings shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        dispatch({ type: 'TOGGLE_SETTINGS' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [dispatch, state.isSettingsOpen, state.isFullscreen]);

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      dispatch({ type: 'SET_FULLSCREEN', payload: !!document.fullscreenElement });
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [dispatch]);

  // PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleSwipeLeft = () => {
    if (state.currentView === 'main') {
      dispatch({ type: 'TOGGLE_SETTINGS' });
    }
  };

  const handleSwipeRight = () => {
    if (state.isSettingsOpen) {
      dispatch({ type: 'TOGGLE_SETTINGS' });
    } else if (state.currentView !== 'main') {
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
    }
  };

  const handleSwipeUp = () => {
    if (state.activeMode === 'clock') {
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'themes' });
    }
  };

  const handleSwipeDown = () => {
    if (state.currentView !== 'main') {
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
    } else if (state.activeMode === 'timer' || state.activeMode === 'breathing') {
      shortcuts.switchToClock();
    }
  };

  const handleDoubleTap = () => {
    if (state.activeMode === 'timer') {
      dispatch({ type: 'PAUSE_TIMER' });
    } else if (state.activeMode === 'breathing') {
      if (state.breathingState.isActive) {
        dispatch({ type: 'STOP_BREATHING' });
      } else {
        dispatch({ type: 'START_BREATHING' });
      }
    }
  };

  const handleLongPress = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'stats' });
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        dispatch({ type: 'ADD_NOTIFICATION', payload: {
          id: `install-success-${Date.now()}`,
          type: 'success',
          title: 'App Installed!',
          message: 'Relaxing Clock has been installed on your device.',
          timestamp: Date.now(),
          read: false
        }});
      }
      setDeferredPrompt(null);
    }
  };

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'themes':
        return <ThemeGallery />;
      case 'customize':
        return <ThemeCreator />;
      case 'stats':
        return <StatsPanel />;
      case 'premium':
        return <PremiumPanel />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'integrations':
        return <IntegrationsPanel />;
      case 'about':
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>About Relaxing Clock</h2>
            <p>Version 2.0.0 - Phase 5 AI Features</p>
          </div>
        );
      case 'coach':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button 
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' })}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                padding: '10px 15px',
                backgroundColor: state.currentTheme.accentColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Clock
            </button>
            <SmartCoachPanel />
          </div>
        );
      case 'mood':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button 
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' })}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                padding: '10px 15px',
                backgroundColor: state.currentTheme.accentColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Clock
            </button>
            <MoodTracker />
          </div>
        );
      case 'schedule':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button 
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' })}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                padding: '10px 15px',
                backgroundColor: state.currentTheme.accentColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Clock
            </button>
            <SmartScheduler />
          </div>
        );
      case 'habits':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button 
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' })}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                padding: '10px 15px',
                backgroundColor: state.currentTheme.accentColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Clock
            </button>
            <HabitIntelligence />
          </div>
        );
      case 'focus':
        return (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <button 
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' })}
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                zIndex: 1000,
                padding: '10px 15px',
                backgroundColor: state.currentTheme.accentColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Back to Clock
            </button>
            <FocusAssistant />
          </div>
        );
      case 'ai-settings':
        return (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h2>AI Settings</h2>
            <p>Configure your AI assistant preferences</p>
            <button 
              onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'coach' })}
              style={{ 
                margin: '20px', 
                padding: '10px 20px', 
                backgroundColor: state.currentTheme.accentColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Back to AI Coach
            </button>
          </div>
        );
      case 'advanced-analytics':
        return <AdvancedAnalyticsDashboard />;
      case 'ml-models':
        return <MLModelManager />;
      case 'device-sync':
        return <CrossDeviceSyncManager />;
      default:
        return (
          <ModeContainer>
            <AnimatePresence mode="wait">
              {state.activeMode === 'clock' && <Clock key="clock" />}
              {state.activeMode === 'timer' && state.timerSettings.mode === 'pomodoro' && <Timer key="timer" />}
              {(state.activeMode === 'timer' && ['flowtime', 'timeboxing', 'intervals'].includes(state.timerSettings.mode)) && <AdvancedTimer />}
              {(state.activeMode === 'breathing' || state.activeMode === 'meditation') && (
                <BreathingGuide key="breathing" />
              )}
              {state.activeMode === 'alarm' && <AlarmManager key="alarm" />}
            </AnimatePresence>
          </ModeContainer>
        );
    }
  };

  if (isLoading) {
    return (
      <LoadingScreen theme={state.currentTheme}>
        <LoadingSpinner theme={state.currentTheme} />
        <LoadingText theme={state.currentTheme}>
          Loading Relaxing Clock...
        </LoadingText>
      </LoadingScreen>
    );
  }

  const isPremiumUser = state.subscription?.status === 'active' || state.subscription?.status === 'trial';

  return (
    <GestureHandler
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      onSwipeUp={handleSwipeUp}
      onSwipeDown={handleSwipeDown}
      onDoubleTap={handleDoubleTap}
      onLongPress={handleLongPress}
    >
      <AppContainer theme={state.currentTheme} isFullscreen={state.isFullscreen}>
        {/* Floating Glass Orbs Background */}
        <FloatingOrbs>
          <GlassOrb 
            size={80} 
            delay={0}
            style={{ top: '10%', left: '5%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
          <GlassOrb 
            size={120} 
            delay={2}
            style={{ top: '60%', right: '8%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 2, delay: 2 }}
          />
          <GlassOrb 
            size={60} 
            delay={4}
            style={{ bottom: '15%', left: '12%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 2, delay: 3 }}
          />
          <GlassOrb 
            size={90} 
            delay={1}
            style={{ top: '30%', left: '70%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ duration: 2, delay: 1.5 }}
          />
          <GlassOrb 
            size={40} 
            delay={3}
            style={{ top: '80%', right: '40%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.7, scale: 1 }}
            transition={{ duration: 2, delay: 2.5 }}
          />
        </FloatingOrbs>

        <MainContent isSettingsOpen={state.isSettingsOpen}>
          <ContentArea>
            {renderCurrentView()}
          </ContentArea>
          {state.currentView === 'main' && <Controls />}
        </MainContent>
        
        <SettingsPanel />
        <AudioManager />
        
        {showInstallPrompt && (
          <InstallPrompt 
            theme={state.currentTheme}
            className="install-prompt"
            onClick={() => setShowInstallPrompt(false)}
          >
            📱 Install Relaxing Clock for the best experience
          </InstallPrompt>
        )}

        {/* Weather Widget */}
        {state.weatherData && state.clockSettings.showWeather && (
          <WeatherWidget theme={state.currentTheme}>
            <span>{state.weatherData.icon}</span>
            <span>{state.weatherData.temperature}°</span>
            <span>{state.weatherData.location}</span>
          </WeatherWidget>
        )}

        {/* Premium Badge */}
        {!isPremiumUser && (
          <PremiumBadge 
            theme={state.currentTheme}
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'premium' })}
          >
            ⭐ Upgrade to Premium
          </PremiumBadge>
        )}

        {/* Focus Assistant Overlay */}
        {state.currentFocusSession && state.currentView === 'main' && (
          <FocusAssistant />
        )}

        {/* Notification System */}
        <NotificationSystem />
        
        {/* Active Alarm Screen */}
        {state.alarmState.activeAlarm && <AlarmScreen />}
      </AppContainer>
    </GestureHandler>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <GlobalStyleWrapper />
    </AppProvider>
  );
};

const GlobalStyleWrapper: React.FC = () => {
  const { state } = useAppContext();
  
  useEffect(() => {
    // Register service worker for PWA functionality
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <>
      <GlobalStyle theme={state.currentTheme} />
      <AppContent />
    </>
  );
};

export default App;
