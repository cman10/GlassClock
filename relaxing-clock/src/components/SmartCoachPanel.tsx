import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { AIInsight, AIAction } from '../types';

const CoachContainer = styled(motion.div)<{ theme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  overflow-y: auto;
  z-index: 1000;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BackButton = styled(motion.button)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: ${props => props.theme.textColor};
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const CoachAvatar = styled.div<{ theme: any }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.accentColor}, ${props => props.theme.gradientEnd || props.theme.accentColor});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
`;

const CoachGreeting = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  border-left: 4px solid #4CAF50;
`;

const GreetingText = styled.p`
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  line-height: 1.5;
`;

const PersonalityBadge = styled.span<{ theme: any }>`
  background: ${props => props.theme.accentColor}20;
  color: ${props => props.theme.accentColor};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const InsightsSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InsightCard = styled(motion.div)<{ priority: string; theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid ${props => 
    props.priority === 'urgent' ? '#f44336' :
    props.priority === 'high' ? '#ff9800' :
    props.priority === 'medium' ? '#2196f3' : '#4caf50'
  };
  position: relative;
  overflow: hidden;
`;

const InsightHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

const InsightTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  flex: 1;
`;

const PriorityBadge = styled.span<{ priority: string }>`
  background: ${props => 
    props.priority === 'urgent' ? '#f44336' :
    props.priority === 'high' ? '#ff9800' :
    props.priority === 'medium' ? '#2196f3' : '#4caf50'
  };
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const ConfidenceBadge = styled.span<{ theme: any }>`
  background: ${props => props.theme.accentColor}20;
  color: ${props => props.theme.accentColor};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  margin-left: 8px;
`;

const InsightDescription = styled.p`
  margin: 0 0 12px 0;
  opacity: 0.9;
  line-height: 1.5;
`;

const InsightRecommendation = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-style: italic;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)<{ primary?: boolean; theme: any }>`
  background: ${props => props.primary ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.primary ? 'white' : props.theme.textColor};
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const DismissButton = styled(motion.button)`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const QuickActionsSection = styled.div`
  margin-bottom: 40px;
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const QuickActionCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${props => props.theme.accentColor};
    background: rgba(255, 255, 255, 0.08);
  }
`;

const QuickActionIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const QuickActionTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
`;

const QuickActionDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const PersonalitySection = styled.div`
  margin-bottom: 40px;
`;

const PersonalityCard = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const PersonalityInfo = styled.div`
  flex: 1;
`;

const PersonalityName = styled.h3`
  margin: 0 0 8px 0;
  font-size: 1.2rem;
`;

const PersonalityDescription = styled.p`
  margin: 0;
  opacity: 0.8;
`;

const PersonalitySettings = styled(motion.button)<{ theme: any }>`
  background: ${props => props.theme.accentColor};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
`;

const SmartCoachPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, []);

  const generateInsights = async () => {
    setIsLoading(true);
    try {
      const newInsights = aiService.generateProductivityInsights(
        state.focusHistory || [],
        state.moodEntries || [],
        state.habitIntelligence || []
      );
      setInsights(newInsights);
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = (action: AIAction) => {
    switch (action.type) {
      case 'setting':
        if (action.parameters.timerMode) {
          dispatch({ 
            type: 'UPDATE_TIMER_SETTINGS', 
            payload: { mode: action.parameters.timerMode }
          });
        }
        break;
      case 'focus':
        if (action.parameters.mode === 'breathing') {
          dispatch({ type: 'SET_ACTIVE_MODE', payload: 'breathing' });
          dispatch({ type: 'START_BREATHING' });
        }
        break;
      case 'schedule':
        if (action.parameters.type === 'ai_optimized') {
          handleGenerateSchedule();
        }
        break;
    }
    
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: {
        id: `action-executed-${Date.now()}`,
        type: 'success',
        title: 'Action Applied',
        message: `${action.label} has been applied successfully.`,
        timestamp: Date.now(),
        read: false
      }
    });
  };

  const handleDismissInsight = (insightId: string) => {
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
    dispatch({ type: 'DISMISS_AI_INSIGHT', payload: insightId });
  };

  const handleGenerateSchedule = () => {
    const today = new Date().toISOString().split('T')[0];
    const schedule = aiService.generateSmartSchedule(today, state.userPreferences);
    dispatch({ type: 'GENERATE_SMART_SCHEDULE', payload: schedule });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'focus-session':
        dispatch({ type: 'SET_ACTIVE_MODE', payload: 'timer' });
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
        break;
      case 'breathing':
        dispatch({ type: 'SET_ACTIVE_MODE', payload: 'breathing' });
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
        break;
      case 'mood-check':
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'mood' });
        break;
      case 'schedule':
        handleGenerateSchedule();
        break;
      case 'habits':
        dispatch({ type: 'SET_CURRENT_VIEW', payload: 'habits' });
        break;
      case 'insights':
        generateInsights();
        break;
    }
  };

  const getGreetingMessage = () => {
    const hour = new Date().getHours();
    const name = state.aiPersonality?.name || 'AI Coach';
    
    if (hour < 12) {
      return `Good morning! I'm ${name}, your AI productivity coach. Ready to make today amazing?`;
    } else if (hour < 18) {
      return `Good afternoon! I'm ${name}. Let's optimize your productivity for the rest of the day.`;
    } else {
      return `Good evening! I'm ${name}. Let's review your progress and plan for tomorrow.`;
    }
  };

  const quickActions = [
    {
      id: 'focus-session',
      icon: '🎯',
      title: 'Start Focus Session',
      description: 'Begin an AI-optimized work session'
    },
    {
      id: 'breathing',
      icon: '🧘',
      title: 'Breathing Exercise',
      description: 'Quick stress relief and clarity'
    },
    {
      id: 'mood-check',
      icon: '😊',
      title: 'Mood Check-in',
      description: 'Track your current state'
    },
    {
      id: 'schedule',
      icon: '📅',
      title: 'Generate Schedule',
      description: 'AI-powered time optimization'
    },
    {
      id: 'habits',
      icon: '✅',
      title: 'Habit Tracker',
      description: 'Review and update habits'
    },
    {
      id: 'insights',
      icon: '💡',
      title: 'Refresh Insights',
      description: 'Get new recommendations'
    }
  ];

  return (
    <CoachContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>
          🤖 Smart Coach
        </Title>
        <BackButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </BackButton>
      </Header>

      <CoachAvatar theme={state.currentTheme}>
        🤖
      </CoachAvatar>

      <CoachGreeting
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GreetingText>{getGreetingMessage()}</GreetingText>
        <PersonalityBadge theme={state.currentTheme}>
          {state.aiPersonality?.style || 'Friendly'} • {state.aiPersonality?.tone || 'Encouraging'}
        </PersonalityBadge>
      </CoachGreeting>

      <QuickActionsSection>
        <SectionTitle>🚀 Quick Actions</SectionTitle>
        <QuickActionsGrid>
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.id}
              theme={state.currentTheme}
              onClick={() => handleQuickAction(action.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <QuickActionIcon>{action.icon}</QuickActionIcon>
              <QuickActionTitle>{action.title}</QuickActionTitle>
              <QuickActionDescription>{action.description}</QuickActionDescription>
            </QuickActionCard>
          ))}
        </QuickActionsGrid>
      </QuickActionsSection>

      <InsightsSection>
        <SectionTitle>💡 AI Insights & Recommendations</SectionTitle>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>🔄</div>
            <p>Analyzing your patterns...</p>
          </div>
        ) : insights.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>✨</div>
            <p>Keep using the app to receive personalized insights!</p>
          </div>
        ) : (
          <AnimatePresence>
            {insights.map((insight, index) => (
              <InsightCard
                key={insight.id}
                priority={insight.priority}
                theme={state.currentTheme}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: 0.1 * index }}
              >
                <DismissButton
                  onClick={() => handleDismissInsight(insight.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </DismissButton>
                
                <InsightHeader>
                  <InsightTitle>{insight.title}</InsightTitle>
                  <div>
                    <PriorityBadge priority={insight.priority}>
                      {insight.priority}
                    </PriorityBadge>
                    <ConfidenceBadge theme={state.currentTheme}>
                      {insight.confidence}% confident
                    </ConfidenceBadge>
                  </div>
                </InsightHeader>
                
                <InsightDescription>{insight.description}</InsightDescription>
                
                <InsightRecommendation>
                  💡 {insight.recommendation}
                </InsightRecommendation>
                
                {insight.actions && insight.actions.length > 0 && (
                  <ActionsContainer>
                    {insight.actions.map((action, actionIndex) => (
                      <ActionButton
                        key={action.id}
                        primary={actionIndex === 0}
                        theme={state.currentTheme}
                        onClick={() => handleExecuteAction(action)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {action.label}
                      </ActionButton>
                    ))}
                  </ActionsContainer>
                )}
              </InsightCard>
            ))}
          </AnimatePresence>
        )}
      </InsightsSection>

      <PersonalitySection>
        <SectionTitle>🎭 AI Personality</SectionTitle>
        <PersonalityCard theme={state.currentTheme}>
          <CoachAvatar theme={state.currentTheme}>
            🤖
          </CoachAvatar>
          <PersonalityInfo>
            <PersonalityName>
              {state.aiPersonality?.name || 'Smart Coach'}
            </PersonalityName>
            <PersonalityDescription>
              {state.aiPersonality?.style || 'Friendly'} coaching style with {state.aiPersonality?.tone || 'encouraging'} tone.
              Specialized in productivity, wellness, and habit formation.
            </PersonalityDescription>
          </PersonalityInfo>
          <PersonalitySettings
            theme={state.currentTheme}
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'ai-settings' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Customize
          </PersonalitySettings>
        </PersonalityCard>
      </PersonalitySection>
    </CoachContainer>
  );
};

export default SmartCoachPanel; 