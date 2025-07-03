import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const breathe = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
`;

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const AlarmOverlay = styled(motion.div)<{ theme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${props => 
    props.theme.gradientStart ? 
    `linear-gradient(135deg, ${props.theme.gradientStart} 0%, ${props.theme.gradientEnd} 100%)` : 
    props.theme.background
  };
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: ${props => props.theme.textColor};
  overflow: hidden;
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: ${pulse} 4s ease-in-out infinite;
`;

const AlarmContent = styled(motion.div)`
  text-align: center;
  z-index: 1;
  max-width: 600px;
  padding: 40px;
`;

const AlarmIcon = styled(motion.div)`
  font-size: 6rem;
  margin-bottom: 30px;
  animation: ${breathe} 2s ease-in-out infinite;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 120px;
    border: 2px solid currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${ripple} 2s ease-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 120px;
    border: 2px solid currentColor;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: ${ripple} 2s ease-out infinite 1s;
  }
`;

const CurrentTime = styled(motion.div)`
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 200;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
`;

const AlarmLabel = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 300;
  margin-bottom: 15px;
  opacity: 0.9;
`;

const AlarmMessage = styled(motion.p)`
  font-size: 1.3rem;
  opacity: 0.8;
  margin-bottom: 40px;
  line-height: 1.4;
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const AlarmButton = styled(motion.button)<{ theme: any; variant: 'snooze' | 'dismiss' }>`
  background: ${props => 
    props.variant === 'dismiss' ? props.theme.accentColor : 
    'rgba(255, 255, 255, 0.2)'
  };
  color: ${props => props.theme.textColor};
  border: 2px solid ${props => 
    props.variant === 'dismiss' ? props.theme.accentColor : 
    'rgba(255, 255, 255, 0.3)'
  };
  border-radius: 50px;
  padding: 18px 35px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  min-width: 140px;
  
  &:hover {
    background: ${props => 
      props.variant === 'dismiss' ? props.theme.accentColor + 'DD' : 
      'rgba(255, 255, 255, 0.3)'
    };
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const SnoozeInfo = styled(motion.div)`
  margin-top: 30px;
  font-size: 0.95rem;
  opacity: 0.7;
  text-align: center;
`;

const KeyboardHint = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.9rem;
  opacity: 0.6;
  text-align: center;
`;

const WakeUpAnimation = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
`;

const AnimatedCircle = styled(motion.div)<{ delay: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ${ripple} 4s ease-out infinite;
  animation-delay: ${props => props.delay}s;
`;

export const AlarmScreen: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.alarmState.isAlarmScreenVisible) {
      setIsVisible(true);
      
      // Request wake lock to keep screen on
      if ('wakeLock' in navigator) {
        (navigator as any).wakeLock.request('screen').catch(console.error);
      }
      
      // Play alarm sound
      if (state.alarmState.activeAlarm?.alarm.sound) {
        audioRef.current = new Audio(state.alarmState.activeAlarm.alarm.sound.url);
        audioRef.current.loop = true;
        audioRef.current.volume = (state.alarmState.activeAlarm.alarm.volume || 80) / 100;
        audioRef.current.play().catch(console.error);
      }
    } else {
      setIsVisible(false);
      
      // Stop alarm sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [state.alarmState.isAlarmScreenVisible, state.alarmState.activeAlarm]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!state.alarmState.isAlarmScreenVisible) return;
      
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleDismiss();
      } else if (e.code === 'KeyS') {
        e.preventDefault();
        handleSnooze();
      } else if (e.code === 'Escape') {
        e.preventDefault();
        handleDismiss();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [state.alarmState.isAlarmScreenVisible]);

  const handleSnooze = () => {
    dispatch({ type: 'SNOOZE_ALARM' });
    
    // Show notification for snooze
    if ('Notification' in window && Notification.permission === 'granted') {
      const snoozeMinutes = state.alarmState.activeAlarm?.alarm.snoozeDuration || 5;
      new Notification('Alarm Snoozed', {
        body: `Alarm will ring again in ${snoozeMinutes} minutes`,
        icon: '/logo192.png'
      });
    }
  };

  const handleDismiss = () => {
    dispatch({ type: 'DISMISS_ALARM' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: state.clockSettings.format === '12'
    });
  };

  const activeAlarm = state.alarmState.activeAlarm;
  if (!activeAlarm || !isVisible) return null;

  const snoozeCount = state.alarmState.snoozeCount;
  const snoozeDuration = activeAlarm.alarm.snoozeDuration;

  return (
    <AnimatePresence>
      {isVisible && (
        <AlarmOverlay
          theme={state.currentTheme}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackgroundPattern />
          
          <WakeUpAnimation>
            {[0, 1, 2, 3, 4].map((i) => (
              <AnimatedCircle key={i} delay={i * 0.8} />
            ))}
          </WakeUpAnimation>

          <AlarmContent
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <AlarmIcon
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              ⏰
            </AlarmIcon>

            <CurrentTime
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {formatTime(currentTime)}
            </CurrentTime>

            <AlarmLabel
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {activeAlarm.alarm.label || 'Wake Up!'}
            </AlarmLabel>

            <AlarmMessage
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              Good morning! Time to start your day with beautiful energy.
            </AlarmMessage>

            <ButtonContainer
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {activeAlarm.alarm.snoozeEnabled && (
                <AlarmButton
                  theme={state.currentTheme}
                  variant="snooze"
                  onClick={handleSnooze}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Snooze {snoozeDuration}m
                </AlarmButton>
              )}
              
              <AlarmButton
                theme={state.currentTheme}
                variant="dismiss"
                onClick={handleDismiss}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dismiss
              </AlarmButton>
            </ButtonContainer>

            {snoozeCount > 0 && (
              <SnoozeInfo
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                Snoozed {snoozeCount} time{snoozeCount > 1 ? 's' : ''}
              </SnoozeInfo>
            )}
          </AlarmContent>

          <KeyboardHint
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            Press Space/Enter to dismiss • Press S to snooze • Press Esc to dismiss
          </KeyboardHint>
        </AlarmOverlay>
      )}
    </AnimatePresence>
  );
}; 