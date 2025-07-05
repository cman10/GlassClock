import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const TimerContainer = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: ${props => 
    props.theme.gradientStart ? 
    `linear-gradient(135deg, ${props.theme.gradientStart} 0%, ${props.theme.gradientEnd} 100%)` : 
    props.theme.background
  };
  color: ${props => props.theme.textColor};
  padding: 20px;
  user-select: none;
  position: relative;
  overflow: hidden;
`;

const SessionInfo = styled(motion.div)`
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 20;
`;

const SessionType = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 400;
  margin-bottom: 12px;
  text-transform: capitalize;
  
  /* Crystal clear text optimized for liquid glass */
  color: rgba(255, 255, 255, 0.95);
  
  /* Advanced text rendering for clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  /* Adaptive shadow system for content separation */
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.6),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 3px 9px rgba(0, 0, 0, 0.25),
    1px 1px 2px rgba(0, 0, 0, 0.7),
    -1px -1px 2px rgba(0, 0, 0, 0.7),
    0 0 15px rgba(255, 255, 255, 0.15);
`;

const SessionCounter = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  opacity: 0.9;
  margin-bottom: 15px;
  letter-spacing: 0.05em;
  
  /* Crystal clear text optimized for liquid glass */
  color: rgba(255, 255, 255, 0.9);
  
  /* Advanced text rendering for clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  /* Adaptive shadow system for content separation */
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.3),
    0 3px 6px rgba(0, 0, 0, 0.2),
    1px 1px 1px rgba(0, 0, 0, 0.6),
    -1px -1px 1px rgba(0, 0, 0, 0.6),
    0 0 10px rgba(255, 255, 255, 0.1);
`;

// Liquid Glass Timer Container
const LiquidGlassTimerContainer = styled(motion.div)<{ theme: any; isLowTransparency?: boolean }>`
  position: relative;
  padding: 60px 80px;
  z-index: 10;
  transform-style: preserve-3d;
  cursor: pointer;
  margin: 40px 0;
  
  /* True Liquid Glass Material */
  background: ${props => props.isLowTransparency ? 
    'rgba(255, 255, 255, 0.15)' : 
    'rgba(255, 255, 255, 0.08)'
  };
  
  /* Advanced backdrop filtering for light manipulation */
  backdrop-filter: 
    blur(${props => props.isLowTransparency ? '20px' : '30px'})
    saturate(180%)
    brightness(110%)
    contrast(120%);
  
  /* Dynamic border radius for liquid feel */
  border-radius: 48px;
  overflow: visible;
  
  /* Liquid Glass Border - Light refraction effect */
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Multi-layered shadow system for depth and lensing */
  box-shadow: 
    /* Primary depth shadow */
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    /* Secondary ambient shadow */
    0 8px 16px -4px rgba(0, 0, 0, 0.12),
    /* Light interaction shadow */
    0 0 0 1px rgba(255, 255, 255, 0.05),
    /* Adaptive content separation shadow */
    0 1px 4px rgba(0, 0, 0, 0.1),
    /* Inner glow for light concentration */
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  
  /* Light bending and lensing effects */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%,
      transparent 25%,
      transparent 75%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 48px;
    pointer-events: none;
    z-index: -1;
  }
  
  /* Dynamic light concentration layer */
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 40%;
    height: 30%;
    background: 
      radial-gradient(ellipse at 50% 50%, 
        rgba(255, 255, 255, 0.15) 0%, 
        rgba(255, 255, 255, 0.05) 50%,
        transparent 100%
      );
    border-radius: 24px;
    pointer-events: none;
    filter: blur(1px);
    opacity: 0.8;
  }
  
  /* Responsive interaction states */
  &:hover {
    /* Light energization on hover */
    backdrop-filter: 
      blur(${props => props.isLowTransparency ? '22px' : '32px'})
      saturate(200%)
      brightness(115%)
      contrast(125%);
    
    box-shadow: 
      0 32px 64px -12px rgba(0, 0, 0, 0.3),
      0 12px 24px -4px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.12),
      inset 0 2px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 0 rgba(255, 255, 255, 0.08),
      /* Inner illumination on interaction */
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    
    /* Light bending intensification */
    &::before {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.15) 0%,
        transparent 20%,
        transparent 80%,
        rgba(255, 255, 255, 0.15) 100%
      );
    }
    
    &::after {
      opacity: 1;
      background: 
        radial-gradient(ellipse at 50% 50%, 
          rgba(255, 255, 255, 0.2) 0%, 
          rgba(255, 255, 255, 0.08) 50%,
          transparent 100%
        );
    }
  }
  
  /* Active state - gel-like compression */
  &:active {
    transform: scale(0.998);
    backdrop-filter: 
      blur(${props => props.isLowTransparency ? '18px' : '28px'})
      saturate(160%)
      brightness(108%)
      contrast(115%);
  }
  
  @media (max-width: 768px) {
    padding: 40px 60px;
    border-radius: 36px;
    
    &::before {
      border-radius: 36px;
    }
    
    &::after {
      border-radius: 18px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 30px 40px;
    border-radius: 24px;
    
    &::before {
      border-radius: 24px;
    }
    
    &::after {
      border-radius: 12px;
    }
  }
`;

const TimerDisplay = styled(motion.div)<{ fontSize: string }>`
  font-size: ${props => {
    switch (props.fontSize) {
      case 'small': return 'clamp(4rem, 12vw, 8rem)';
      case 'medium': return 'clamp(5rem, 15vw, 10rem)';
      case 'large': return 'clamp(6rem, 18vw, 12rem)';
      case 'xl': return 'clamp(7rem, 20vw, 14rem)';
      default: return 'clamp(6rem, 18vw, 12rem)';
    }
  }};
  
  /* Liquid Glass Typography - Ultra-clear and readable */
  font-weight: 400;
  letter-spacing: -0.015em;
  text-align: center;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  position: relative;
  z-index: 20;
  
  /* Crystal clear text optimized for liquid glass material */
  color: rgba(255, 255, 255, 0.98);
  
  /* Advanced text rendering for clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  -webkit-text-size-adjust: 100%;
  
  /* Adaptive shadow system for content separation */
  text-shadow: 
    /* Primary contrast shadow */
    0 2px 4px rgba(0, 0, 0, 0.6),
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.25),
    /* Edge definition */
    1px 1px 2px rgba(0, 0, 0, 0.7),
    -1px -1px 2px rgba(0, 0, 0, 0.7),
    /* Legibility glow */
    0 0 15px rgba(255, 255, 255, 0.15);
  
  /* Accessibility and contrast optimization */
  @media (prefers-contrast: high) {
    color: white;
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.9),
      0 4px 8px rgba(0, 0, 0, 0.8),
      0 6px 12px rgba(0, 0, 0, 0.6),
      2px 2px 4px rgba(0, 0, 0, 0.9),
      -2px -2px 4px rgba(0, 0, 0, 0.9),
      0 0 20px rgba(255, 255, 255, 0.3);
  }
`;

const ProgressRing = styled.div<{ theme: any; progress: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  z-index: 5;
  
  /* Liquid glass circular progress background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
  }
  
  /* Progress indicator with liquid glass effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: ${props => props.theme.accentColor}AA;
    border-right-color: ${props => props.theme.accentColor}55;
    transform: rotate(${props => (props.progress * 360) - 90}deg);
    transition: transform 0.3s ease;
    filter: drop-shadow(0 0 6px ${props => props.theme.accentColor}30);
  }
`;

const TimerInner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Controls = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
  position: relative;
  z-index: 20;
`;

const ControlButton = styled(motion.button)<{ theme: any; variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  position: relative;
  z-index: 20;
  
  /* Liquid glass button styling */
  background: ${props => 
    props.variant === 'primary' ? 
    'rgba(255, 255, 255, 0.12)' : 
    'rgba(255, 255, 255, 0.08)'
  };
  
  /* Advanced backdrop filtering for light manipulation */
  backdrop-filter: blur(20px) saturate(150%) brightness(110%);
  
  /* Liquid Glass Border - Light refraction effect */
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Multi-layered shadow system */
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1);
  
  color: ${props => 
    props.variant === 'primary' ? 
    'rgba(255, 255, 255, 0.95)' : 
    'rgba(255, 255, 255, 0.9)'
  };
  
  /* Advanced text rendering for clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Light bending effects */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%,
      transparent 25%,
      transparent 75%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 50%;
    pointer-events: none;
    z-index: -1;
  }
  
  /* Responsive interaction states */
  &:hover {
    background: ${props => 
      props.variant === 'primary' ? 
      'rgba(255, 255, 255, 0.18)' : 
      'rgba(255, 255, 255, 0.12)'
    };
    
    backdrop-filter: blur(25px) saturate(180%) brightness(115%);
    
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.2),
      0 6px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.25),
      inset 0 -1px 0 rgba(255, 255, 255, 0.15);
    
    transform: translateY(-2px);
    
    &::before {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.15) 0%,
        transparent 20%,
        transparent 80%,
        rgba(255, 255, 255, 0.15) 100%
      );
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    backdrop-filter: blur(15px) saturate(130%) brightness(105%);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      background: ${props => 
        props.variant === 'primary' ? 
        'rgba(255, 255, 255, 0.12)' : 
        'rgba(255, 255, 255, 0.08)'
      };
      backdrop-filter: blur(20px) saturate(150%) brightness(110%);
    }
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 30px;
  text-align: center;
  opacity: 0.9;
  position: relative;
  z-index: 20;
  margin-top: 20px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
  
  /* Crystal clear text optimized for liquid glass */
  color: rgba(255, 255, 255, 0.95);
  
  /* Advanced text rendering for clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  /* Adaptive shadow system for content separation */
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.6),
    0 2px 6px rgba(0, 0, 0, 0.4),
    0 3px 9px rgba(0, 0, 0, 0.25),
    1px 1px 2px rgba(0, 0, 0, 0.7),
    -1px -1px 2px rgba(0, 0, 0, 0.7),
    0 0 12px rgba(255, 255, 255, 0.12);
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  
  /* Crystal clear text optimized for liquid glass */
  color: rgba(255, 255, 255, 0.85);
  
  /* Advanced text rendering for clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  
  /* Adaptive shadow system for content separation */
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.4),
    0 2px 4px rgba(0, 0, 0, 0.2),
    1px 1px 1px rgba(0, 0, 0, 0.5),
    -1px -1px 1px rgba(0, 0, 0, 0.5);
`;

// Animation for floating orbs
const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
    opacity: 0.6; 
  }
  25% { 
    transform: translateY(-20px) rotate(90deg); 
    opacity: 0.8; 
  }
  50% { 
    transform: translateY(0px) rotate(180deg); 
    opacity: 0.6; 
  }
  75% { 
    transform: translateY(-10px) rotate(270deg); 
    opacity: 0.7; 
  }
`;

// Floating orbs for ambient effects
const FloatingOrb = styled(motion.div)<{ delay: number; size: number }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  z-index: 2;
  
  /* Translucent glass orb */
  background: 
    radial-gradient(circle at 35% 35%, 
      rgba(255, 255, 255, 0.25) 0%, 
      rgba(255, 255, 255, 0.12) 40%,
      rgba(255, 255, 255, 0.08) 70%,
      rgba(255, 255, 255, 0.03) 100%
    );
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Orb shadows and glow */
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 255, 255, 0.1);
  
  animation: ${floatAnimation} ${(props) => 8 + props.delay * 2}s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  
  /* Orb highlight */
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 25%;
    width: 40%;
    height: 40%;
    background: radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.6) 0%, 
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(2px);
  }
`;

// Accent glows for thematic lighting
const AccentGlow = styled(motion.div)<{ 
  theme: any; 
  position: { x: 'left' | 'right'; y: 'top' | 'bottom' }; 
  size: number; 
  hue: number; 
}>`
  position: absolute;
  ${props => props.position.x}: -${props => props.size / 2}px;
  ${props => props.position.y}: -${props => props.size / 2}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => `hsl(${props.hue}, 70%, 60%)`};
  filter: blur(60px);
  opacity: 0.3;
  z-index: 1;
  pointer-events: none;
`;

export const Timer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { timerState, timerSettings, clockSettings } = state;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (timerState.isActive && !timerState.isPaused && timerState.timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        dispatch({
          type: 'UPDATE_TIMER_STATE',
          payload: {
            timeRemaining: Math.max(0, timerState.timeRemaining - 1),
          },
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState.isActive, timerState.isPaused, timerState.timeRemaining, dispatch]);

  // Handle timer completion
  useEffect(() => {
    if (timerState.isActive && timerState.timeRemaining === 0) {
      handleTimerComplete();
    }
  }, [timerState.timeRemaining, timerState.isActive]);

  const handleTimerComplete = () => {
    // Play notification sound (browser notification sound)
    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }

    // Show notification if permission granted
    if (Notification.permission === 'granted') {
      const sessionType = timerState.sessionType;
      const title = sessionType === 'work' ? 'Work Session Complete!' : 
                   sessionType === 'break' ? 'Break Complete!' : 
                   'Session Complete!';
      
      new Notification(title, {
        body: 'Time to switch activities!',
        icon: '/logo192.png',
      });
    }

    // Handle session transitions for Pomodoro
    if (timerSettings.mode === 'pomodoro') {
      handlePomodoroTransition();
    } else {
      // For other modes, just stop the timer
      dispatch({ type: 'RESET_TIMER' });
    }
  };

  const handlePomodoroTransition = () => {
    const { sessionType, currentSession, completedSessions } = timerState;
    const { pomodoroBreakDuration, pomodoroLongBreakDuration, pomodoroSessionsUntilLongBreak } = timerSettings;

    if (sessionType === 'work') {
      // Work session completed, start break
      const isLongBreak = currentSession % pomodoroSessionsUntilLongBreak === 0;
      const breakDuration = isLongBreak ? pomodoroLongBreakDuration : pomodoroBreakDuration;
      const newSessionType = isLongBreak ? 'longBreak' : 'break';

      dispatch({
        type: 'UPDATE_TIMER_STATE',
        payload: {
          sessionType: newSessionType,
          timeRemaining: breakDuration * 60,
          totalTime: breakDuration * 60,
          completedSessions: completedSessions + 1,
        },
      });
    } else {
      // Break completed, start new work session
      const workDuration = timerSettings.pomodoroWorkDuration;
      dispatch({
        type: 'UPDATE_TIMER_STATE',
        payload: {
          sessionType: 'work',
          timeRemaining: workDuration * 60,
          totalTime: workDuration * 60,
          currentSession: currentSession + 1,
        },
      });
    }
  };

  const handleStart = () => {
    if (timerState.timeRemaining === 0) {
      // Reset timer to initial state
      const duration = timerSettings.mode === 'pomodoro' ? 
        timerSettings.pomodoroWorkDuration : 
        timerSettings.mode === 'meditation' ? 
        timerSettings.meditationDuration :
        timerSettings.customDuration;

      dispatch({
        type: 'UPDATE_TIMER_STATE',
        payload: {
          timeRemaining: duration * 60,
          totalTime: duration * 60,
          sessionType: timerSettings.mode === 'pomodoro' ? 'work' : timerSettings.mode as any,
        },
      });
    }
    dispatch({ type: 'START_TIMER' });
  };

  const handlePause = () => {
    dispatch({ type: 'PAUSE_TIMER' });
  };

  const handleReset = () => {
    dispatch({ type: 'RESET_TIMER' });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionDisplayName = (sessionType: string): string => {
    switch (sessionType) {
      case 'work': return 'Work Session';
      case 'break': return 'Short Break';
      case 'longBreak': return 'Long Break';
      case 'meditation': return 'Meditation';
      case 'custom': return 'Custom Timer';
      default: return sessionType;
    }
  };

  const progress = timerState.totalTime > 0 ? 
    1 - (timerState.timeRemaining / timerState.totalTime) : 0;

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Helper function to get theme hue for accent glows
  const getThemeHue = (theme: any): number => {
    if (theme.gradientStart) {
      // Extract hue from HSL color
      const match = theme.gradientStart.match(/hsl\((\d+),/);
      if (match) return parseInt(match[1]);
    }
    // Default hues for different themes
    switch (theme.name) {
      case 'Ocean': return 200;
      case 'Sunset': return 20;
      case 'Forest': return 120;
      case 'Cosmic': return 280;
      case 'Rose': return 340;
      default: return 200;
    }
  };

  const themeHue = getThemeHue(state.currentTheme);

  return (
    <TimerContainer
      theme={state.currentTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Accent Glows */}
      <AccentGlow
        theme={state.currentTheme}
        position={{ x: 'left', y: 'top' }}
        size={300}
        hue={themeHue}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <AccentGlow
        theme={state.currentTheme}
        position={{ x: 'right', y: 'bottom' }}
        size={250}
        hue={themeHue + 120}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />
      <AccentGlow
        theme={state.currentTheme}
        position={{ x: 'left', y: 'bottom' }}
        size={200}
        hue={themeHue + 240}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      />

      {/* Floating Glass Orbs */}
      <FloatingOrb 
        delay={0} 
        size={25}
        style={{ top: '15%', left: '10%' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 1.5, delay: 2, type: "spring" }}
      />
      <FloatingOrb 
        delay={2} 
        size={18}
        style={{ top: '65%', right: '15%' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, delay: 2.5, type: "spring" }}
      />
      <FloatingOrb 
        delay={4} 
        size={30}
        style={{ bottom: '20%', left: '8%' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, delay: 3, type: "spring" }}
      />
      <FloatingOrb 
        delay={1} 
        size={22}
        style={{ top: '40%', right: '5%' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, delay: 3.5, type: "spring" }}
      />

      <SessionInfo
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SessionType>
          {getSessionDisplayName(timerState.sessionType)}
        </SessionType>
        {timerSettings.mode === 'pomodoro' && (
          <SessionCounter>
            Session {timerState.currentSession} • Completed: {timerState.completedSessions}
          </SessionCounter>
        )}
      </SessionInfo>

      <LiquidGlassTimerContainer
        theme={state.currentTheme}
        isLowTransparency={false}
        initial={{ 
          scale: 0.8, 
          opacity: 0, 
          y: 30
        }}
        animate={{ 
          scale: 1, 
          opacity: 1, 
          y: 0
        }}
        transition={{ 
          duration: 1.2, 
          delay: 0.5,
          type: "spring",
          stiffness: 80,
          damping: 20
        }}
        whileHover={{
          scale: 1.02,
          y: -3,
          transition: { 
            duration: 0.4, 
            type: "spring",
            stiffness: 200,
            damping: 25
          }
        }}
      >
        <TimerDisplay
          fontSize={clockSettings.fontSize}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          {formatTime(timerState.timeRemaining)}
        </TimerDisplay>

        {/* Progress Ring integrated into liquid glass */}
        <ProgressRing theme={state.currentTheme} progress={progress} />
      </LiquidGlassTimerContainer>

      <Controls>
        <ControlButton
          theme={state.currentTheme}
          variant="primary"
          onClick={timerState.isActive && !timerState.isPaused ? handlePause : handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={timerState.isActive && !timerState.isPaused ? 'Pause' : 'Start'}
        >
          {timerState.isActive && !timerState.isPaused ? '⏸️' : '▶️'}
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={handleReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Reset"
        >
          🔄
        </ControlButton>
      </Controls>

      {timerSettings.mode === 'pomodoro' && (
        <Stats>
          <StatItem>
            <StatValue>{timerState.currentSession}</StatValue>
            <StatLabel>Current</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{timerState.completedSessions}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatItem>
        </Stats>
      )}
    </TimerContainer>
  );
}; 