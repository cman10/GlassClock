import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const ControlsContainer = styled(motion.div)<{ isVisible: boolean }>`
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 100;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
    gap: 12px;
  }
`;

const ModeToggle = styled(motion.div)<{ isVisible: boolean }>`
  position: fixed;
  bottom: 30px;
  left: 30px;
  display: flex;
  gap: 10px;
  z-index: 100;
  opacity: ${props => props.isVisible ? 1 : 0};
  pointer-events: ${props => props.isVisible ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
  
  /* Glass panel background */
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 25px;
  padding: 8px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    bottom: 20px;
    left: 20px;
    gap: 8px;
    padding: 6px;
  }
`;

const ControlButton = styled(motion.button)<{ theme: any; isActive?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(15px) saturate(150%);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
    border-color: rgba(255, 255, 255, 0.25);
    transform: scale(1.1) translateY(-3px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 0 20px rgba(255, 255, 255, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &:active {
    transform: scale(1.05) translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1rem;
  }
`;

const ModeButton = styled(motion.button)<{ theme: any; isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid ${props => props.isActive ? props.theme.accentColor : 'rgba(255, 255, 255, 0.15)'};
  background: ${props => props.isActive ? 
    `linear-gradient(45deg, ${props.theme.accentColor}80, ${props.theme.accentColor}40)` : 
    'linear-gradient(45deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))'
  };
  backdrop-filter: blur(15px) saturate(150%);
  color: ${props => props.isActive ? 'white' : props.theme.textColor};
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.isActive ? 
    `0 0 20px ${props.theme.accentColor}40` : 
    '0 4px 16px rgba(0, 0, 0, 0.2)'
  };

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: scale(1.1) translateY(-2px);
    background: ${props => props.isActive ? 
      `linear-gradient(45deg, ${props.theme.accentColor}90, ${props.theme.accentColor}60)` : 
      'linear-gradient(45deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.06))'
    };
    box-shadow: ${props => props.isActive ? 
      `0 0 30px ${props.theme.accentColor}60` : 
      '0 8px 24px rgba(0, 0, 0, 0.3)'
    };
  }

  &:active {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 0.9rem;
  }
`;

const InfoPanel = styled(motion.div)<{ theme: any }>`
  position: fixed;
  bottom: 100px;
  right: 30px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  padding: 25px;
  border-radius: 20px;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-width: 280px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  @media (max-width: 768px) {
    right: 20px;
    min-width: 240px;
    padding: 20px;
  }
`;

const InfoTitle = styled.h3`
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(45deg, #fff, rgba(255, 255, 255, 0.7));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const InfoText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
  line-height: 1.6;
`;

const KeyboardShortcut = styled.span`
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(10px);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: inline-block;
  margin: 2px;
`;

const StatusIndicator = styled(motion.div)<{ theme: any }>`
  position: fixed;
  top: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  border-radius: 25px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  z-index: 100;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    padding: 10px 15px;
    font-size: 0.8rem;
  }
`;

const StatusIcon = styled.div`
  font-size: 1.1rem;
  animation: float 3s ease-in-out infinite;
`;

export const Controls: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isVisible, setIsVisible] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Auto-hide controls after inactivity
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsVisible(true);
    };

    const checkActivity = setInterval(() => {
      if (Date.now() - lastActivity > 8000) { // 8 seconds
        setIsVisible(false);
        setShowInfo(false);
      }
    }, 1000);

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearInterval(checkActivity);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [lastActivity]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'TOGGLE_SETTINGS' });
      }
      if (event.key === 'f' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        toggleFullscreen();
      }
      if (event.key === 'i' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        setShowInfo(!showInfo);
      }
      if (event.key === 't' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'SET_ACTIVE_MODE', payload: 'timer' });
      }
      if (event.key === 'b' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'SET_ACTIVE_MODE', payload: 'breathing' });
      }
      if (event.key === 'c' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'SET_ACTIVE_MODE', payload: 'clock' });
      }
      if (event.key === 'l' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'SET_ACTIVE_MODE', payload: 'alarm' });
      }
      if (event.key === 'a' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'coach' });
      }
      if (event.key === 'm' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'mood' });
      }
      if (event.key === 'p' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'spotify' });
      }
      if (event.key === 'Escape') {
        if (state.isFullscreen) {
          exitFullscreen();
        }
        if (state.isSettingsOpen) {
          dispatch({ type: 'TOGGLE_SETTINGS' });
        }
        if (showInfo) {
          setShowInfo(false);
        }
        if (state.activeMode !== 'clock') {
          dispatch({ type: 'SET_ACTIVE_MODE', payload: 'clock' });
        }
      }
      if (event.key === ' ' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        if (state.activeMode === 'timer') {
          if (state.timerState.isActive) {
            dispatch({ type: 'PAUSE_TIMER' });
          } else {
            dispatch({ type: 'START_TIMER' });
          }
        } else if (state.activeMode === 'breathing') {
          if (state.breathingState.isActive) {
            dispatch({ type: 'STOP_BREATHING' });
          } else {
            dispatch({ type: 'START_BREATHING' });
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.isFullscreen, state.isSettingsOpen, state.activeMode, state.timerState.isActive, state.breathingState.isActive, showInfo, dispatch]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        dispatch({ type: 'SET_FULLSCREEN', payload: true });
      } else {
        await document.exitFullscreen();
        dispatch({ type: 'SET_FULLSCREEN', payload: false });
      }
    } catch (error) {
      console.warn('Fullscreen API not supported or failed:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        dispatch({ type: 'SET_FULLSCREEN', payload: false });
      }
    } catch (error) {
      console.warn('Exit fullscreen failed:', error);
    }
  };

  const handleSettingsClick = () => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };

  const handleInfoClick = () => {
    setShowInfo(!showInfo);
  };

  const handleModeChange = (mode: 'clock' | 'timer' | 'breathing' | 'alarm') => {
    dispatch({ type: 'SET_ACTIVE_MODE', payload: mode });
  };

  const getStatusText = () => {
    switch (state.activeMode) {
      case 'timer':
        if (state.timerState.isActive) {
          return state.timerState.isPaused ? 'Timer Paused' : 'Timer Running';
        }
        return 'Timer Ready';
      case 'breathing':
        return state.breathingState.isActive ? 'Breathing Active' : 'Breathing Ready';
      case 'alarm':
        const alarmCount = state.alarmState.alarms.filter(a => a.enabled).length;
        return `${alarmCount} Alarm${alarmCount !== 1 ? 's' : ''} Set`;
      default:
        return 'Clock Mode';
    }
  };

  const getStatusIcon = () => {
    switch (state.activeMode) {
      case 'timer':
        return state.timerState.isActive ? (state.timerState.isPaused ? '⏸️' : '⏱️') : '⏲️';
      case 'breathing':
        return state.breathingState.isActive ? '🫁' : '🧘';
      case 'alarm':
        return '⏰';
      default:
        return '🕐';
    }
  };

  const shouldShowControls = isVisible && !state.isFullscreen;
  const shouldShowModeToggle = isVisible && !state.isFullscreen;

  return (
    <>
      {/* Status Indicator */}
      {!state.isFullscreen && (state.activeMode !== 'clock' || state.audioSettings.isPlaying) && (
        <StatusIndicator
          theme={state.currentTheme}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <StatusIcon>{getStatusIcon()}</StatusIcon>
          <span>{getStatusText()}</span>
          {state.audioSettings.isPlaying && state.audioSettings.currentSound && (
            <>
              <span>•</span>
              <span>{state.audioSettings.currentSound.icon} {state.audioSettings.currentSound.name}</span>
            </>
          )}
        </StatusIndicator>
      )}

      {/* Mode Toggle */}
      <ModeToggle isVisible={shouldShowModeToggle}>
        <ModeButton
          theme={state.currentTheme}
          isActive={state.activeMode === 'clock'}
          onClick={() => handleModeChange('clock')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Clock Mode (C)"
        >
          🕐
        </ModeButton>

        <ModeButton
          theme={state.currentTheme}
          isActive={state.activeMode === 'timer'}
          onClick={() => handleModeChange('timer')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Timer Mode (T)"
        >
          ⏱️
        </ModeButton>

        <ModeButton
          theme={state.currentTheme}
          isActive={state.activeMode === 'breathing'}
          onClick={() => handleModeChange('breathing')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Breathing Mode (B)"
        >
          🫁
        </ModeButton>

        <ModeButton
          theme={state.currentTheme}
          isActive={state.activeMode === 'alarm'}
          onClick={() => handleModeChange('alarm')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Alarm Mode (L)"
        >
          ⏰
        </ModeButton>

        {/* AI Coach Button */}
        <ModeButton
          theme={state.currentTheme}
          isActive={state.currentView === 'coach'}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'coach' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="AI Coach (A)"
        >
          🤖
        </ModeButton>
      </ModeToggle>

      {/* Main Controls */}
      <ControlsContainer isVisible={shouldShowControls}>
        {/* AI Feature Buttons */}
        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'mood' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Mood Tracker (M)"
        >
          😊
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'schedule' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Smart Schedule"
        >
          📅
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'habits' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Habit Tracker"
        >
          ✅
        </ControlButton>

        {/* Spotify Music Control */}
        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'spotify' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Spotify Music Control"
        >
          🎵
        </ControlButton>

        {/* Phase 6: Advanced Analytics & ML */}
        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'advanced-analytics' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Advanced Analytics"
        >
          📊
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'ml-models' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="ML Models"
        >
          🧠
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'device-sync' })}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Device Sync"
        >
          🔄
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={handleInfoClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Info (I)"
        >
          ℹ️
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={toggleFullscreen}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Fullscreen (F)"
        >
          ⛶
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={handleSettingsClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Settings (S)"
        >
          ⚙️
        </ControlButton>
      </ControlsContainer>

      {/* Info Panel */}
      {showInfo && (
        <InfoPanel
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <InfoTitle>Keyboard Shortcuts</InfoTitle>
          <InfoText>
            <KeyboardShortcut>C</KeyboardShortcut> - Clock Mode<br/>
            <KeyboardShortcut>T</KeyboardShortcut> - Timer Mode<br/>
            <KeyboardShortcut>B</KeyboardShortcut> - Breathing Mode<br/>
            <KeyboardShortcut>L</KeyboardShortcut> - Alarm Mode<br/>
            <KeyboardShortcut>A</KeyboardShortcut> - AI Coach<br/>
            <KeyboardShortcut>M</KeyboardShortcut> - Mood Tracker<br/>
            <KeyboardShortcut>P</KeyboardShortcut> - Spotify Music<br/>
            <KeyboardShortcut>Space</KeyboardShortcut> - Start/Pause<br/>
            <KeyboardShortcut>S</KeyboardShortcut> - Settings<br/>
            <KeyboardShortcut>F</KeyboardShortcut> - Fullscreen<br/>
            <KeyboardShortcut>I</KeyboardShortcut> - Info<br/>
            <KeyboardShortcut>ESC</KeyboardShortcut> - Close/Exit
          </InfoText>
        </InfoPanel>
      )}
    </>
  );
}; 