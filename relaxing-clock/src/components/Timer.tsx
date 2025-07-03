import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
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
`;

const SessionInfo = styled(motion.div)`
  text-align: center;
  margin-bottom: 20px;
`;

const SessionType = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: capitalize;
`;

const SessionCounter = styled.div`
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  opacity: 0.8;
  margin-bottom: 10px;
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
  font-weight: 300;
  letter-spacing: -0.02em;
  text-align: center;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  margin-bottom: 30px;
`;

const ProgressRing = styled.div<{ theme: any; progress: number }>`
  position: relative;
  width: 200px;
  height: 200px;
  margin-bottom: 30px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid rgba(255, 255, 255, 0.1);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: ${props => props.theme.accentColor};
    transform: rotate(${props => (props.progress * 360) - 90}deg);
    transition: transform 0.3s ease;
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
  margin-bottom: 20px;
`;

const ControlButton = styled(motion.button)<{ theme: any; variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: ${props => 
    props.variant === 'primary' ? 
    props.theme.accentColor : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => 
    props.variant === 'primary' ? 
    'white' : 
    props.theme.textColor
  };
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.2s;

  &:hover {
    transform: scale(1.05);
    background: ${props => 
      props.variant === 'primary' ? 
      props.theme.accentColor : 
      'rgba(255, 255, 255, 0.2)'
    };
  }

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Stats = styled.div`
  display: flex;
  gap: 30px;
  text-align: center;
  opacity: 0.8;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
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

  return (
    <TimerContainer
      theme={state.currentTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
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

      <ProgressRing theme={state.currentTheme} progress={progress}>
        <TimerInner>
          <TimerDisplay
            fontSize={clockSettings.fontSize}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {formatTime(timerState.timeRemaining)}
          </TimerDisplay>
        </TimerInner>
      </ProgressRing>

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