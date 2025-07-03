import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const BreathingContainer = styled(motion.div)<{ theme: any }>`
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

const GuideTitle = styled(motion.h1)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  margin-bottom: 30px;
  text-align: center;
  opacity: 0.9;
`;

const BreathingCircle = styled(motion.div)<{ theme: any; size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: radial-gradient(circle, 
    ${props => props.theme.accentColor}20, 
    ${props => props.theme.accentColor}10, 
    transparent
  );
  border: 3px solid ${props => props.theme.accentColor};
  position: relative;
  margin-bottom: 40px;
  box-shadow: 0 0 30px ${props => props.theme.accentColor}30;
`;

const InnerCircle = styled(motion.div)<{ theme: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border-radius: 50%;
  background: ${props => props.theme.accentColor}40;
  border: 2px solid ${props => props.theme.accentColor};
`;

const PhaseIndicator = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 500;
  text-align: center;
  z-index: 2;
`;

const Instructions = styled(motion.div)`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  text-align: center;
  margin-bottom: 30px;
  opacity: 0.8;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
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
`;

const BreathingStats = styled.div`
  display: flex;
  gap: 30px;
  text-align: center;
  opacity: 0.8;
  margin-bottom: 20px;
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

const ProgressDots = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const ProgressDot = styled(motion.div)<{ theme: any; isActive: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.isActive ? props.theme.accentColor : 'rgba(255, 255, 255, 0.3)'};
  transition: all 0.3s ease;
`;

export const BreathingGuide: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { breathingState, timerSettings } = state;
  const phaseTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing phase durations
  const phaseDurations = {
    inhale: timerSettings.breathingInDuration,
    hold: timerSettings.breathingHoldDuration,
    exhale: timerSettings.breathingOutDuration,
    pause: 1, // Brief pause between cycles
  };

  // Breathing cycle logic
  useEffect(() => {
    if (!breathingState.isActive) return;

    const currentPhaseDuration = phaseDurations[breathingState.currentPhase];
    const progressIncrement = 1 / (currentPhaseDuration * 10); // Update 10 times per second

    const updateProgress = () => {
      dispatch({
        type: 'UPDATE_BREATHING_STATE',
        payload: {
          cycleProgress: Math.min(1, breathingState.cycleProgress + progressIncrement),
        },
      });
    };

    const progressInterval = setInterval(updateProgress, 100);

    // Handle phase completion
    if (breathingState.cycleProgress >= 1) {
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'pause'> = ['inhale', 'hold', 'exhale', 'pause'];
      const currentIndex = phases.indexOf(breathingState.currentPhase);
      const nextPhase = phases[(currentIndex + 1) % phases.length];

      // If completing a full cycle (pause -> inhale)
      if (breathingState.currentPhase === 'pause') {
        const newCycle = breathingState.currentCycle + 1;
        
        if (newCycle >= breathingState.totalCycles) {
          // Breathing session complete
          dispatch({ type: 'STOP_BREATHING' });
          return;
        }

        dispatch({
          type: 'UPDATE_BREATHING_STATE',
          payload: {
            currentPhase: nextPhase,
            cycleProgress: 0,
            currentCycle: newCycle,
          },
        });
      } else {
        dispatch({
          type: 'UPDATE_BREATHING_STATE',
          payload: {
            currentPhase: nextPhase,
            cycleProgress: 0,
          },
        });
      }
    }

    return () => {
      clearInterval(progressInterval);
    };
  }, [breathingState, timerSettings, dispatch]);

  const handleStart = () => {
    dispatch({ type: 'START_BREATHING' });
  };

  const handleStop = () => {
    dispatch({ type: 'STOP_BREATHING' });
  };

  const getPhaseInstruction = (phase: string): string => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'pause': return 'Pause';
      default: return '';
    }
  };

  const getPhaseDescription = (phase: string): string => {
    switch (phase) {
      case 'inhale': return 'Slowly fill your lungs with air';
      case 'hold': return 'Hold your breath gently';
      case 'exhale': return 'Slowly release the air';
      case 'pause': return 'Rest before the next breath';
      default: return '';
    }
  };

  // Circle size animation based on breathing phase
  const getCircleScale = () => {
    const progress = breathingState.cycleProgress;
    
    switch (breathingState.currentPhase) {
      case 'inhale':
        return 0.7 + (progress * 0.6); // Scale from 70% to 130%
      case 'hold':
        return 1.3; // Stay at maximum
      case 'exhale':
        return 1.3 - (progress * 0.6); // Scale from 130% to 70%
      case 'pause':
        return 0.7; // Stay at minimum
      default:
        return 1;
    }
  };

  const circleBaseSize = 200;

  return (
    <BreathingContainer
      theme={state.currentTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GuideTitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.9 }}
        transition={{ duration: 0.5 }}
      >
        Breathing Guide
      </GuideTitle>

      <BreathingStats>
        <StatItem>
          <StatValue>{breathingState.currentCycle + 1}</StatValue>
          <StatLabel>Current Cycle</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{breathingState.totalCycles}</StatValue>
          <StatLabel>Total Cycles</StatLabel>
        </StatItem>
      </BreathingStats>

      <Instructions
        key={breathingState.currentPhase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {breathingState.isActive ? getPhaseDescription(breathingState.currentPhase) : 'Get ready to start breathing'}
      </Instructions>

      <BreathingCircle
        theme={state.currentTheme}
        size={circleBaseSize}
        animate={{
          scale: getCircleScale(),
        }}
        transition={{
          duration: breathingState.isActive ? 0.1 : 0.5,
          ease: "easeInOut",
        }}
      >
        <InnerCircle
          theme={state.currentTheme}
          animate={{
            scale: getCircleScale(),
            opacity: 0.6 + (breathingState.cycleProgress * 0.4),
          }}
          transition={{
            duration: 0.1,
            ease: "easeInOut",
          }}
        />
        
        <PhaseIndicator
          key={breathingState.currentPhase}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {breathingState.isActive ? getPhaseInstruction(breathingState.currentPhase) : '🫁'}
        </PhaseIndicator>
      </BreathingCircle>

      <Controls>
        <ControlButton
          theme={state.currentTheme}
          variant="primary"
          onClick={breathingState.isActive ? handleStop : handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={breathingState.isActive ? 'Stop' : 'Start'}
        >
          {breathingState.isActive ? '⏹️' : '▶️'}
        </ControlButton>
      </Controls>

      <ProgressDots>
        {Array.from({ length: breathingState.totalCycles }, (_, index) => (
          <ProgressDot
            key={index}
            theme={state.currentTheme}
            isActive={index <= breathingState.currentCycle}
            animate={{
              scale: index === breathingState.currentCycle ? 1.2 : 1,
            }}
          />
        ))}
      </ProgressDots>
    </BreathingContainer>
  );
}; 