import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { AdvancedTimerMode } from '../types';

const TimerContainer = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h2<{ theme: any }>`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: ${props => props.theme.textColor};
`;

const ModeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const ModeButton = styled(motion.button)<{ theme: any; active: boolean; isPremium: boolean; hasAccess: boolean }>`
  background: ${props => props.active ? props.theme.accentColor : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.textColor};
  border: 2px solid ${props => props.active ? props.theme.accentColor : 'rgba(255, 255, 255, 0.2)'};
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: ${props => props.isPremium && !props.hasAccess ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;
  position: relative;
  opacity: ${props => props.isPremium && !props.hasAccess ? 0.6 : 1};

  &:hover {
    border-color: ${props => props.theme.accentColor};
    ${props => !props.isPremium || props.hasAccess ? `
      background: ${props.theme.accentColor}20;
    ` : ''}
  }
`;

const PremiumIcon = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #fbbf24;
  color: #1f2937;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
`;

const TimerDisplay = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  margin: 40px 0;
`;

const TimeText = styled.div<{ theme: any }>`
  font-size: 4rem;
  font-weight: 300;
  color: ${props => props.theme.accentColor};
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
  text-align: center;
  letter-spacing: 2px;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const SessionInfo = styled.div<{ theme: any }>`
  text-align: center;
  margin-bottom: 30px;
`;

const SessionType = styled.div<{ theme: any }>`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textColor};
  margin-bottom: 10px;
  text-transform: capitalize;
`;

const SessionProgress = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
`;

const ProgressBar = styled.div<{ theme: any }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin: 20px 0;
`;

const ProgressFill = styled(motion.div)<{ theme: any }>`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.accentColor}, ${props => props.theme.accentColor}80);
  border-radius: 4px;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const ControlButton = styled(motion.button)<{ theme: any; variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? props.theme.accentColor : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.accentColor};
  border: 2px solid ${props => props.theme.accentColor};
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  &:hover {
    background: ${props => props.theme.accentColor};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ConfigPanel = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 20px;
`;

const ConfigTitle = styled.h3<{ theme: any }>`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.textColor};
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const ConfigItem = styled.div``;

const ConfigLabel = styled.label<{ theme: any }>`
  display: block;
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
  margin-bottom: 8px;
`;

const ConfigInput = styled.input<{ theme: any }>`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: ${props => props.theme.textColor};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
  }
`;

const IntervalsList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  margin-top: 15px;
`;

const IntervalItem = styled.div<{ theme: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const IntervalInfo = styled.div<{ theme: any }>`
  color: ${props => props.theme.textColor};
`;

const IntervalName = styled.div`
  font-weight: 600;
`;

const IntervalDuration = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const RemoveButton = styled.button<{ theme: any }>`
  background: #f87171;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.8rem;
  cursor: pointer;
`;

const FlowTimeBadge = styled.div<{ theme: any }>`
  background: ${props => props.theme.accentColor}20;
  color: ${props => props.theme.accentColor};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-top: 15px;
`;

const timerModes: AdvancedTimerMode[] = [
  {
    id: 'pomodoro',
    name: 'Pomodoro',
    description: 'Classic 25-minute work sessions with 5-minute breaks',
    icon: '🍅',
    isPremium: false,
    config: {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      sessionsUntilLongBreak: 4
    }
  },
  {
    id: 'flowtime',
    name: 'Flowtime',
    description: 'Work until you naturally want to break, then take a proportional break',
    icon: '🌊',
    isPremium: true,
    config: {
      flowMode: true
    }
  },
  {
    id: 'timeboxing',
    name: 'Timeboxing',
    description: 'Allocate specific time slots for different tasks and priorities',
    icon: '📦',
    isPremium: true,
    config: {
      timeboxing: true
    }
  },
  {
    id: 'intervals',
    name: 'Custom Intervals',
    description: 'Create your own sequence of work, break, and rest periods',
    icon: '⚡',
    isPremium: true,
    config: {
      intervals: [
        { name: 'Warm-up', duration: 10, type: 'work' },
        { name: 'Deep Work', duration: 45, type: 'work' },
        { name: 'Break', duration: 15, type: 'break' },
        { name: 'Review', duration: 20, type: 'work' }
      ]
    }
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Focused mindfulness and meditation sessions',
    icon: '🧘',
    isPremium: false,
    config: {
      workDuration: 15
    }
  }
];

export const AdvancedTimer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedMode, setSelectedMode] = useState('pomodoro');
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [customIntervals, setCustomIntervals] = useState<Array<{ name: string; duration: number; type: 'work' | 'break' }>>([
    { name: 'Focus', duration: 25, type: 'work' }
  ]);
  const [newInterval, setNewInterval] = useState<{ name: string; duration: string; type: 'work' | 'break' }>({ name: '', duration: '', type: 'work' });

  const currentMode = timerModes.find(mode => mode.id === selectedMode);
  const isPremiumUser = state.subscription?.status === 'active' || state.subscription?.status === 'trial';
  
  const { timerState, timerSettings } = state;
  const progress = timerState.totalTime > 0 ? (timerState.totalTime - timerState.timeRemaining) / timerState.totalTime : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleModeSelect = (modeId: string) => {
    const mode = timerModes.find(m => m.id === modeId);
    if (!mode) return;

    if (mode.isPremium && !isPremiumUser) {
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: `premium-timer-${Date.now()}`,
        type: 'premium',
        title: 'Premium Timer Mode',
        message: `${mode.name} is a premium feature. Upgrade to unlock advanced timer modes.`,
        timestamp: Date.now(),
        read: false,
        action: {
          label: 'Upgrade',
          type: 'navigate',
          payload: 'premium'
        }
      }});
      return;
    }

    setSelectedMode(modeId);
    dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: { mode: modeId as any } });
  };

  const startTimer = () => {
    if (selectedMode === 'flowtime') {
      dispatch({ type: 'UPDATE_TIMER_STATE', payload: { flowStartTime: Date.now() } });
    }
    dispatch({ type: 'START_TIMER' });
  };

  const addCustomInterval = () => {
    if (newInterval.name && newInterval.duration) {
      setCustomIntervals(prev => [...prev, {
        name: newInterval.name,
        duration: parseInt(newInterval.duration),
        type: newInterval.type
      }]);
      setNewInterval({ name: '', duration: '', type: 'work' });
    }
  };

  const removeInterval = (index: number) => {
    setCustomIntervals(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentSessionInfo = () => {
    if (selectedMode === 'flowtime') {
      const flowTime = timerState.flowStartTime ? Math.floor((Date.now() - timerState.flowStartTime) / 60000) : 0;
      return {
        type: 'Flow Session',
        info: `${flowTime} minutes in flow`
      };
    }

    if (selectedMode === 'intervals' && timerState.currentInterval !== undefined) {
      const interval = customIntervals[timerState.currentInterval];
      return {
        type: interval?.name || 'Custom Interval',
        info: `Interval ${(timerState.currentInterval || 0) + 1} of ${customIntervals.length}`
      };
    }

    return {
      type: timerState.sessionType,
      info: `Session ${timerState.currentSession} • ${timerState.completedSessions} completed today`
    };
  };

  const sessionInfo = getCurrentSessionInfo();

  return (
    <TimerContainer
      theme={state.currentTheme}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title theme={state.currentTheme}>Advanced Timer</Title>
        <motion.button
          onClick={() => setIsConfiguring(!isConfiguring)}
          style={{
            background: 'none',
            border: 'none',
            color: state.currentTheme.textColor,
            fontSize: '1.2rem',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px'
          }}
          whileHover={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          ⚙️
        </motion.button>
      </Header>

      <ModeSelector>
        {timerModes.map((mode) => (
          <ModeButton
            key={mode.id}
            theme={state.currentTheme}
            active={selectedMode === mode.id}
            isPremium={mode.isPremium}
            hasAccess={isPremiumUser}
            onClick={() => handleModeSelect(mode.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {mode.icon} {mode.name}
            {mode.isPremium && <PremiumIcon>⭐</PremiumIcon>}
          </ModeButton>
        ))}
      </ModeSelector>

      <AnimatePresence>
        {isConfiguring && currentMode && (
          <ConfigPanel
            theme={state.currentTheme}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ConfigTitle theme={state.currentTheme}>
              {currentMode.name} Settings
            </ConfigTitle>

            {selectedMode === 'pomodoro' && (
              <ConfigGrid>
                <ConfigItem>
                  <ConfigLabel theme={state.currentTheme}>Work Duration (minutes)</ConfigLabel>
                  <ConfigInput
                    theme={state.currentTheme}
                    type="number"
                    value={timerSettings.pomodoroWorkDuration}
                    onChange={(e) => dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: { pomodoroWorkDuration: parseInt(e.target.value) || 25 } })}
                  />
                </ConfigItem>
                <ConfigItem>
                  <ConfigLabel theme={state.currentTheme}>Break Duration (minutes)</ConfigLabel>
                  <ConfigInput
                    theme={state.currentTheme}
                    type="number"
                    value={timerSettings.pomodoroBreakDuration}
                    onChange={(e) => dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: { pomodoroBreakDuration: parseInt(e.target.value) || 5 } })}
                  />
                </ConfigItem>
                <ConfigItem>
                  <ConfigLabel theme={state.currentTheme}>Long Break Duration (minutes)</ConfigLabel>
                  <ConfigInput
                    theme={state.currentTheme}
                    type="number"
                    value={timerSettings.pomodoroLongBreakDuration}
                    onChange={(e) => dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: { pomodoroLongBreakDuration: parseInt(e.target.value) || 15 } })}
                  />
                </ConfigItem>
                <ConfigItem>
                  <ConfigLabel theme={state.currentTheme}>Sessions Until Long Break</ConfigLabel>
                  <ConfigInput
                    theme={state.currentTheme}
                    type="number"
                    value={timerSettings.pomodoroSessionsUntilLongBreak}
                    onChange={(e) => dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: { pomodoroSessionsUntilLongBreak: parseInt(e.target.value) || 4 } })}
                  />
                </ConfigItem>
              </ConfigGrid>
            )}

            {selectedMode === 'flowtime' && (
              <div>
                <ConfigGrid>
                  <ConfigItem>
                    <ConfigLabel theme={state.currentTheme}>Minimum Session (minutes)</ConfigLabel>
                    <ConfigInput
                      theme={state.currentTheme}
                      type="number"
                      value={timerSettings.flowtimeMinSession || 15}
                      onChange={(e) => dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: { flowtimeMinSession: parseInt(e.target.value) || 15 } })}
                    />
                  </ConfigItem>
                  <ConfigItem>
                    <ConfigLabel theme={state.currentTheme}>Break Ratio (minutes break per hour)</ConfigLabel>
                    <ConfigInput
                      theme={state.currentTheme}
                      type="number"
                      value={timerSettings.flowtimeBreakRatio || 15}
                      onChange={(e) => dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: { flowtimeBreakRatio: parseInt(e.target.value) || 15 } })}
                    />
                  </ConfigItem>
                </ConfigGrid>
                <FlowTimeBadge theme={state.currentTheme}>
                  Flowtime adapts to your natural rhythm - work until you feel ready for a break!
                </FlowTimeBadge>
              </div>
            )}

            {selectedMode === 'intervals' && (
              <div>
                <ConfigGrid>
                  <ConfigItem>
                    <ConfigLabel theme={state.currentTheme}>Interval Name</ConfigLabel>
                    <ConfigInput
                      theme={state.currentTheme}
                      type="text"
                      placeholder="e.g., Deep Work"
                      value={newInterval.name}
                      onChange={(e) => setNewInterval(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </ConfigItem>
                  <ConfigItem>
                    <ConfigLabel theme={state.currentTheme}>Duration (minutes)</ConfigLabel>
                    <ConfigInput
                      theme={state.currentTheme}
                      type="number"
                      placeholder="25"
                      value={newInterval.duration}
                      onChange={(e) => setNewInterval(prev => ({ ...prev, duration: e.target.value }))}
                    />
                  </ConfigItem>
                  <ConfigItem>
                    <ConfigLabel theme={state.currentTheme}>Type</ConfigLabel>
                    <select
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: state.currentTheme.textColor,
                        fontSize: '0.9rem'
                      }}
                      value={newInterval.type}
                      onChange={(e) => setNewInterval(prev => ({ ...prev, type: e.target.value as 'work' | 'break' }))}
                    >
                      <option value="work">Work</option>
                      <option value="break">Break</option>
                    </select>
                  </ConfigItem>
                  <ConfigItem>
                    <motion.button
                      style={{
                        background: state.currentTheme.accentColor,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginTop: '24px'
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={addCustomInterval}
                    >
                      Add Interval
                    </motion.button>
                  </ConfigItem>
                </ConfigGrid>

                <IntervalsList>
                  {customIntervals.map((interval, index) => (
                    <IntervalItem key={index} theme={state.currentTheme}>
                      <IntervalInfo theme={state.currentTheme}>
                        <IntervalName>{interval.name}</IntervalName>
                        <IntervalDuration>{interval.duration}m • {interval.type}</IntervalDuration>
                      </IntervalInfo>
                      <RemoveButton theme={state.currentTheme} onClick={() => removeInterval(index)}>
                        Remove
                      </RemoveButton>
                    </IntervalItem>
                  ))}
                </IntervalsList>
              </div>
            )}
          </ConfigPanel>
        )}
      </AnimatePresence>

      <TimerDisplay theme={state.currentTheme}>
        <TimeText theme={state.currentTheme}>
          {formatTime(timerState.timeRemaining)}
        </TimeText>

        <SessionInfo theme={state.currentTheme}>
          <SessionType theme={state.currentTheme}>
            {sessionInfo.type}
          </SessionType>
          <SessionProgress theme={state.currentTheme}>
            {sessionInfo.info}
          </SessionProgress>
        </SessionInfo>

        <ProgressBar theme={state.currentTheme}>
          <ProgressFill
            theme={state.currentTheme}
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </ProgressBar>
      </TimerDisplay>

      <Controls>
        <ControlButton
          theme={state.currentTheme}
          variant="primary"
          onClick={timerState.isActive ? () => dispatch({ type: 'PAUSE_TIMER' }) : startTimer}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {timerState.isActive ? 'Pause' : 'Start'}
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          variant="secondary"
          onClick={() => dispatch({ type: 'RESET_TIMER' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </ControlButton>
      </Controls>

      {selectedMode === 'flowtime' && timerState.isActive && (
        <FlowTimeBadge theme={state.currentTheme}>
          Take a break when you feel ready • Suggested break: {Math.floor((Date.now() - (timerState.flowStartTime || Date.now())) / 60000 * 0.2)} minutes
        </FlowTimeBadge>
      )}
    </TimerContainer>
  );
}; 