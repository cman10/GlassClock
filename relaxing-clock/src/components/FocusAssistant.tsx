import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { FocusSession, Distraction, CoachingIntervention } from '../types';

const AssistantOverlay = styled(motion.div)<{ visible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 2000;
  pointer-events: ${props => props.visible ? 'auto' : 'none'};
  opacity: ${props => props.visible ? 1 : 0};
  transform: translateX(${props => props.visible ? 0 : 100}%);
  transition: all 0.3s ease;
`;

const AssistantHeader = styled.div<{ theme: any }>`
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AssistantTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
`;

const ToggleButton = styled(motion.button)<{ theme: any }>`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AssistantContent = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const SessionInfo = styled.div`
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SessionStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: white;
`;

const StatValue = styled.span<{ theme: any; type?: string }>`
  font-weight: 600;
  color: ${props => 
    props.type === 'good' ? '#4caf50' :
    props.type === 'warning' ? '#ff9800' :
    props.type === 'danger' ? '#f44336' :
    props.theme.accentColor
  };
`;

const CoachingSection = styled.div`
  padding: 16px;
`;

const CoachingMessage = styled(motion.div)<{ type: string; theme: any }>`
  background: ${props => 
    props.type === 'break_reminder' ? '#ff980020' :
    props.type === 'focus_tip' ? '#2196f320' :
    props.type === 'motivation' ? '#4caf5020' : 'rgba(255, 255, 255, 0.05)'
  };
  border-left: 4px solid ${props => 
    props.type === 'break_reminder' ? '#ff9800' :
    props.type === 'focus_tip' ? '#2196f3' :
    props.type === 'motivation' ? '#4caf50' : props.theme.accentColor
  };
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  color: white;
`;

const MessageText = styled.p`
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MessageActions = styled.div`
  display: flex;
  gap: 8px;
`;

const MessageAction = styled(motion.button)<{ theme: any }>`
  background: ${props => props.theme.accentColor};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
`;

const FeedbackButton = styled(motion.button)<{ positive?: boolean }>`
  background: none;
  border: none;
  color: ${props => props.positive ? '#4caf50' : '#f44336'};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  font-size: 0.8rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DistractionTracker = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const DistractionButton = styled(motion.button)<{ theme: any }>`
  background: ${props => props.theme.accentColor}20;
  border: 1px solid ${props => props.theme.accentColor};
  color: ${props => props.theme.accentColor};
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  width: 100%;
  margin-bottom: 12px;
`;

const DistractionList = styled.div`
  max-height: 120px;
  overflow-y: auto;
`;

const DistractionItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 6px;
  font-size: 0.8rem;
  color: white;
`;

const DistractionTime = styled.span`
  opacity: 0.7;
  font-size: 0.7rem;
`;

const QuickActions = styled.div`
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 8px;
`;

const QuickAction = styled(motion.button)<{ theme: any }>`
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: center;
`;

const MinimizedAssistant = styled(motion.div)<{ theme: any }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: ${props => props.theme.accentColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const NotificationDot = styled.div<{ theme: any }>`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: #f44336;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: white;
`;

const FocusAssistant: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSession, setCurrentSession] = useState<FocusSession | null>(null);
  const [sessionStart, setSessionStart] = useState<number | null>(null);
  const [distractions, setDistractions] = useState<Distraction[]>([]);
  const [interventions, setInterventions] = useState<CoachingIntervention[]>([]);
  const [unreadInterventions, setUnreadInterventions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const isActiveSession = state.timerState.isActive || state.breathingState.isActive;

  useEffect(() => {
    if (isActiveSession && !currentSession) {
      startFocusSession();
    } else if (!isActiveSession && currentSession) {
      endFocusSession();
    }
  }, [isActiveSession]);

  useEffect(() => {
    if (currentSession && intervalRef.current === null) {
      intervalRef.current = setInterval(() => {
        checkForInterventions();
      }, 30000); // Check every 30 seconds
    } else if (!currentSession && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentSession]);

  const startFocusSession = () => {
    const now = Date.now();
    setSessionStart(now);
    
    const newSession: FocusSession = {
      id: `session-${now}`,
      startTime: now,
      duration: 0,
      type: state.activeMode === 'timer' ? 'deep' : 'learning',
      quality: 7, // Default starting quality
      distractions: [],
      aiCoaching: {
        enabled: state.aiSettings?.features.focusAssistant || false,
        interventions: [],
        adaptiveBreaks: true,
        personalizedTips: [],
        currentStrategy: 'pomodoro',
        effectiveness: 75
      },
      mood: {
        start: 'neutral'
      },
      environment: {
        sound: state.audioSettings.currentSound?.name || 'none',
        lighting: 'normal',
        interruptions: 0
      }
    };

    setCurrentSession(newSession);
    setDistractions([]);
    setInterventions([]);
    
    dispatch({ type: 'START_FOCUS_SESSION', payload: newSession });
  };

  const endFocusSession = () => {
    if (currentSession && sessionStart) {
      const endTime = Date.now();
      const duration = Math.floor((endTime - sessionStart) / 1000);
      
      dispatch({ 
        type: 'END_FOCUS_SESSION', 
        payload: { 
          id: currentSession.id, 
          endTime, 
          quality: calculateSessionQuality() 
        }
      });

      setCurrentSession(null);
      setSessionStart(null);
      setDistractions([]);
      setInterventions([]);
      setUnreadInterventions(0);
    }
  };

  const calculateSessionQuality = (): number => {
    if (!currentSession || !sessionStart) return 7;
    
    const duration = (Date.now() - sessionStart) / 1000 / 60; // minutes
    const distractionPenalty = Math.min(distractions.length * 0.5, 3);
    const durationBonus = Math.min(duration / 25, 1); // Bonus for longer sessions
    
    return Math.max(1, Math.min(10, 8 - distractionPenalty + durationBonus));
  };

  const checkForInterventions = () => {
    if (!currentSession || !sessionStart) return;

    const newInterventions = aiService.generateFocusCoaching(currentSession);
    
    if (newInterventions.length > 0) {
      setInterventions(prev => [...prev, ...newInterventions]);
      setUnreadInterventions(prev => prev + newInterventions.length);
      
      newInterventions.forEach(intervention => {
        dispatch({ 
          type: 'ADD_COACHING_INTERVENTION', 
          payload: { sessionId: currentSession.id, intervention }
        });
      });
    }
  };

  const handleDistraction = (type: string, description: string) => {
    if (!currentSession) return;

    const distraction: Distraction = {
      timestamp: Date.now(),
      type: type as any,
      description,
      severity: 5,
      resolved: false
    };

    setDistractions(prev => [...prev, distraction]);
    
    dispatch({ 
      type: 'ADD_DISTRACTION', 
      payload: { sessionId: currentSession.id, distraction }
    });

    // Trigger immediate intervention for frequent distractions
    if (distractions.length >= 2) {
      const intervention: CoachingIntervention = {
        timestamp: Date.now(),
        type: 'distraction_help',
        message: "I notice you're getting distracted frequently. Try the '2-minute rule' or take a short break.",
        action: 'show_focus_techniques'
      };
      
      setInterventions(prev => [...prev, intervention]);
      setUnreadInterventions(prev => prev + 1);
    }
  };

  const handleInterventionFeedback = (interventionIndex: number, feedback: 'helpful' | 'not_helpful') => {
    setInterventions(prev => 
      prev.map((intervention, index) => 
        index === interventionIndex 
          ? { ...intervention, userResponse: feedback }
          : intervention
      )
    );
    
    dispatch({
      type: 'PROCESS_AI_FEEDBACK',
      payload: { type: 'coaching_intervention', feedback: { interventionIndex, feedback } }
    });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'break':
        dispatch({ type: 'PAUSE_TIMER' });
        break;
      case 'extend':
        dispatch({ 
          type: 'UPDATE_TIMER_STATE', 
          payload: { timeRemaining: state.timerState.timeRemaining + 300 } // Add 5 minutes
        });
        break;
      case 'focus_mode':
        // Switch to a more focused ambient sound
        // This would trigger adaptive audio
        break;
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSessionDuration = (): number => {
    if (!sessionStart) return 0;
    return Math.floor((Date.now() - sessionStart) / 1000);
  };

  if (!state.aiSettings?.features.focusAssistant) {
    return null;
  }

  if (!isVisible && currentSession) {
    return (
      <MinimizedAssistant
        theme={state.currentTheme}
        onClick={() => {
          setIsVisible(true);
          setUnreadInterventions(0);
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      >
        🤖
        {unreadInterventions > 0 && (
          <NotificationDot theme={state.currentTheme}>
            {unreadInterventions}
          </NotificationDot>
        )}
      </MinimizedAssistant>
    );
  }

  if (!currentSession) {
    return null;
  }

  return (
    <AssistantOverlay visible={isVisible}>
      <AssistantHeader theme={state.currentTheme}>
        <AssistantTitle>
          🤖 Focus Assistant
        </AssistantTitle>
        <ToggleButton
          theme={state.currentTheme}
          onClick={() => setIsVisible(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ✕
        </ToggleButton>
      </AssistantHeader>

      <AssistantContent>
        <SessionInfo>
          <SessionStat>
            <span>Session Duration</span>
            <StatValue theme={state.currentTheme}>
              {formatDuration(getSessionDuration())}
            </StatValue>
          </SessionStat>
          
          <SessionStat>
            <span>Focus Quality</span>
            <StatValue 
              theme={state.currentTheme}
              type={calculateSessionQuality() >= 8 ? 'good' : calculateSessionQuality() >= 6 ? 'warning' : 'danger'}
            >
              {calculateSessionQuality().toFixed(1)}/10
            </StatValue>
          </SessionStat>
          
          <SessionStat>
            <span>Distractions</span>
            <StatValue 
              theme={state.currentTheme}
              type={distractions.length === 0 ? 'good' : distractions.length <= 2 ? 'warning' : 'danger'}
            >
              {distractions.length}
            </StatValue>
          </SessionStat>
        </SessionInfo>

        {interventions.length > 0 && (
          <CoachingSection>
            <AnimatePresence>
              {interventions.slice(-2).map((intervention, index) => (
                <CoachingMessage
                  key={`${intervention.timestamp}-${index}`}
                  type={intervention.type}
                  theme={state.currentTheme}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <MessageText>{intervention.message}</MessageText>
                  
                  {intervention.action && (
                    <MessageActions>
                      <MessageAction
                        theme={state.currentTheme}
                        onClick={() => handleQuickAction(intervention.action!)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Apply
                      </MessageAction>
                    </MessageActions>
                  )}
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <FeedbackButton
                      positive
                      onClick={() => handleInterventionFeedback(index, 'helpful')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      👍 Helpful
                    </FeedbackButton>
                    <FeedbackButton
                      onClick={() => handleInterventionFeedback(index, 'not_helpful')}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      👎 Not helpful
                    </FeedbackButton>
                  </div>
                </CoachingMessage>
              ))}
            </AnimatePresence>
          </CoachingSection>
        )}

        <DistractionTracker>
          <DistractionButton
            theme={state.currentTheme}
            onClick={() => handleDistraction('internal', 'Mind wandering')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            + Log Distraction
          </DistractionButton>
          
          {distractions.length > 0 && (
            <DistractionList>
              {distractions.slice(-3).map((distraction, index) => (
                <DistractionItem key={`${distraction.timestamp}-${index}`}>
                  <div>{distraction.description}</div>
                  <DistractionTime>
                    {new Date(distraction.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </DistractionTime>
                </DistractionItem>
              ))}
            </DistractionList>
          )}
        </DistractionTracker>

        <QuickActions>
          <QuickAction
            theme={state.currentTheme}
            onClick={() => handleQuickAction('break')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⏸️ Break
          </QuickAction>
          
          <QuickAction
            theme={state.currentTheme}
            onClick={() => handleQuickAction('extend')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⏰ +5min
          </QuickAction>
          
          <QuickAction
            theme={state.currentTheme}
            onClick={() => handleQuickAction('focus_mode')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎵 Focus
          </QuickAction>
        </QuickActions>
      </AssistantContent>
    </AssistantOverlay>
  );
};

export default FocusAssistant; 