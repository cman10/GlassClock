import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { HabitIntelligence as HabitType, HabitEntry } from '../types';

const HabitContainer = styled(motion.div)<{ theme: any }>`
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

const AddHabitButton = styled(motion.button)<{ theme: any }>`
  background: ${props => props.theme.accentColor};
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HabitsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const HabitCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
`;

const HabitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const HabitTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const HabitCategory = styled.span<{ category: string }>`
  background: ${props => 
    props.category === 'productivity' ? '#2196f3' :
    props.category === 'wellness' ? '#4caf50' :
    props.category === 'learning' ? '#9c27b0' : '#ff9800'
  }20;
  color: ${props => 
    props.category === 'productivity' ? '#2196f3' :
    props.category === 'wellness' ? '#4caf50' :
    props.category === 'learning' ? '#9c27b0' : '#ff9800'
  };
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
`;

const StreakDisplay = styled.div<{ theme: any }>`
  background: ${props => props.theme.accentColor}20;
  border: 2px solid ${props => props.theme.accentColor};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  margin-bottom: 16px;
`;

const StreakNumber = styled.div<{ theme: any }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.accentColor};
  margin-bottom: 4px;
`;

const StreakLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ProgressBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  height: 8px;
  margin-bottom: 16px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ percentage: number; theme: any }>`
  background: linear-gradient(90deg, ${props => props.theme.accentColor}, ${props => props.theme.gradientEnd || props.theme.accentColor});
  height: 100%;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const HabitStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div<{ theme: any }>`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.accentColor};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const AICoachingSection = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  border-left: 3px solid ${props => props.theme.accentColor};
`;

const CoachingTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CoachingText = styled.p`
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  opacity: 0.9;
`;

const HabitActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)<{ variant?: string; theme: any }>`
  background: ${props => 
    props.variant === 'primary' ? props.theme.accentColor :
    props.variant === 'success' ? '#4caf50' :
    'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => 
    props.variant === 'primary' || props.variant === 'success' ? 'white' : props.theme.textColor
  };
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  flex: 1;
`;

const PatternInsights = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const InsightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.85rem;
`;

const InsightIcon = styled.span`
  font-size: 1rem;
`;

const AddHabitModal = styled(motion.div)<{ theme: any }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled(motion.div)<{ theme: any }>`
  background: ${props => props.theme.background};
  border-radius: 16px;
  padding: 32px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin: 0 0 24px 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Input = styled.input<{ theme: any }>`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
  }
`;

const Select = styled.select<{ theme: any }>`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  opacity: 0.7;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const HabitIntelligence: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitCategory, setNewHabitCategory] = useState<'productivity' | 'wellness' | 'learning' | 'health'>('productivity');
  const [newHabitFrequency, setNewHabitFrequency] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const habits = state.habitIntelligence || [];

  const handleCompleteHabit = (habitId: string, quality?: number) => {
    const today = new Date().toISOString().split('T')[0];
    dispatch({ 
      type: 'COMPLETE_HABIT', 
      payload: { id: habitId, date: today, quality }
    });

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `habit-completed-${Date.now()}`,
        type: 'success',
        title: 'Habit Completed!',
        message: 'Great job maintaining your streak!',
        timestamp: Date.now(),
        read: false
      }
    });
  };

  const handleAddHabit = () => {
    if (!newHabitName.trim()) return;

    const newHabit: HabitType = {
      id: `habit-${Date.now()}`,
      name: newHabitName,
      category: newHabitCategory,
      targetFrequency: newHabitFrequency,
      currentStreak: 0,
      longestStreak: 0,
      completionRate: 0,
      aiCoaching: {
        enabled: true,
        lastSuggestion: 'Start small and be consistent. Focus on building the habit first, then improving quality.',
        nextMilestone: 'Complete 7 days in a row',
        difficulty: 'easy',
        adaptations: []
      },
      pattern: {
        bestTimes: [],
        bestDays: [],
        triggerEvents: [],
        barriers: []
      },
      entries: []
    };

    dispatch({ type: 'ADD_HABIT', payload: newHabit });
    
    setShowAddModal(false);
    setNewHabitName('');
    setNewHabitCategory('productivity');
    setNewHabitFrequency('daily');

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `habit-added-${Date.now()}`,
        type: 'success',
        title: 'Habit Added!',
        message: `${newHabitName} has been added to your habit tracker.`,
        timestamp: Date.now(),
        read: false
      }
    });
  };

  const getHabitInsights = (habit: HabitType) => {
    return aiService.analyzeHabitPatterns(habit);
  };

  const getTodayEntry = (habit: HabitType): HabitEntry | undefined => {
    const today = new Date().toISOString().split('T')[0];
    return habit.entries.find(entry => entry.date === today);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'hard': return '#f44336';
      default: return '#2196f3';
    }
  };

  const formatFrequency = (frequency: string) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  if (habits.length === 0) {
    return (
      <HabitContainer
        theme={state.currentTheme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Header>
          <Title>✅ Habit Intelligence</Title>
          <BackButton
            theme={state.currentTheme}
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'coach' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </BackButton>
        </Header>

        <EmptyState>
          <EmptyIcon>🌱</EmptyIcon>
          <h3>Start Building Better Habits</h3>
          <p>Track your habits and get AI-powered insights to improve your consistency and success rate.</p>
          <AddHabitButton
            theme={state.currentTheme}
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ margin: '20px auto', display: 'inline-flex' }}
          >
            + Add Your First Habit
          </AddHabitButton>
        </EmptyState>

        <AnimatePresence>
          {showAddModal && (
            <AddHabitModal
              theme={state.currentTheme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
            >
              <ModalContent
                theme={state.currentTheme}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <ModalTitle>Add New Habit</ModalTitle>
                
                <FormGroup>
                  <Label>Habit Name</Label>
                  <Input
                    type="text"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                    placeholder="e.g., Drink 8 glasses of water"
                    theme={state.currentTheme}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    value={newHabitCategory}
                    onChange={(e) => setNewHabitCategory(e.target.value as any)}
                    theme={state.currentTheme}
                  >
                    <option value="productivity">Productivity</option>
                    <option value="wellness">Wellness</option>
                    <option value="learning">Learning</option>
                    <option value="health">Health</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Frequency</Label>
                  <Select
                    value={newHabitFrequency}
                    onChange={(e) => setNewHabitFrequency(e.target.value as any)}
                    theme={state.currentTheme}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormGroup>

                <ModalActions>
                  <ActionButton
                    theme={state.currentTheme}
                    onClick={() => setShowAddModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    variant="primary"
                    theme={state.currentTheme}
                    onClick={handleAddHabit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Habit
                  </ActionButton>
                </ModalActions>
              </ModalContent>
            </AddHabitModal>
          )}
        </AnimatePresence>
      </HabitContainer>
    );
  }

  return (
    <HabitContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>✅ Habit Intelligence</Title>
        <div style={{ display: 'flex', gap: '12px' }}>
          <AddHabitButton
            theme={state.currentTheme}
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Habit
          </AddHabitButton>
          <BackButton
            theme={state.currentTheme}
            onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'coach' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Back
          </BackButton>
        </div>
      </Header>

      <HabitsGrid>
        {habits.map((habit, index) => {
          const todayEntry = getTodayEntry(habit);
          const insights = getHabitInsights(habit);
          
          return (
            <HabitCard
              key={habit.id}
              theme={state.currentTheme}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <HabitHeader>
                <HabitTitle>{habit.name}</HabitTitle>
                <HabitCategory category={habit.category}>
                  {habit.category}
                </HabitCategory>
              </HabitHeader>

              <StreakDisplay theme={state.currentTheme}>
                <StreakNumber theme={state.currentTheme}>
                  {habit.currentStreak}
                </StreakNumber>
                <StreakLabel>
                  {formatFrequency(habit.targetFrequency)} streak
                </StreakLabel>
              </StreakDisplay>

              <ProgressBar>
                <ProgressFill 
                  percentage={habit.completionRate} 
                  theme={state.currentTheme}
                />
              </ProgressBar>

              <HabitStats>
                <StatItem>
                  <StatValue theme={state.currentTheme}>
                    {habit.completionRate}%
                  </StatValue>
                  <StatLabel>Success Rate</StatLabel>
                </StatItem>
                <StatItem>
                  <StatValue theme={state.currentTheme}>
                    {habit.longestStreak}
                  </StatValue>
                  <StatLabel>Best Streak</StatLabel>
                </StatItem>
              </HabitStats>

              {habit.aiCoaching.enabled && (
                <AICoachingSection theme={state.currentTheme}>
                  <CoachingTitle>
                    🤖 AI Coach
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: getDifficultyColor(habit.aiCoaching.difficulty) + '20',
                      color: getDifficultyColor(habit.aiCoaching.difficulty),
                      padding: '2px 6px',
                      borderRadius: '8px',
                      textTransform: 'uppercase'
                    }}>
                      {habit.aiCoaching.difficulty}
                    </span>
                  </CoachingTitle>
                  <CoachingText>{habit.aiCoaching.lastSuggestion}</CoachingText>
                </AICoachingSection>
              )}

              <HabitActions>
                {todayEntry?.completed ? (
                  <ActionButton
                    variant="success"
                    theme={state.currentTheme}
                    disabled
                  >
                    ✅ Completed Today
                  </ActionButton>
                ) : (
                  <ActionButton
                    variant="primary"
                    theme={state.currentTheme}
                    onClick={() => handleCompleteHabit(habit.id, 8)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Complete Today
                  </ActionButton>
                )}
                
                <ActionButton
                  theme={state.currentTheme}
                  onClick={() => {
                    // Open habit details/edit
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Details
                </ActionButton>
              </HabitActions>

              <PatternInsights>
                {insights.suggestions.slice(0, 2).map((suggestion: string, i: number) => (
                  <InsightItem key={i}>
                    <InsightIcon>💡</InsightIcon>
                    <span>{suggestion}</span>
                  </InsightItem>
                ))}
              </PatternInsights>
            </HabitCard>
          );
        })}
      </HabitsGrid>

      <AnimatePresence>
        {showAddModal && (
          <AddHabitModal
            theme={state.currentTheme}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
          >
            <ModalContent
              theme={state.currentTheme}
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <ModalTitle>Add New Habit</ModalTitle>
              
              <FormGroup>
                <Label>Habit Name</Label>
                <Input
                  type="text"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  placeholder="e.g., Drink 8 glasses of water"
                  theme={state.currentTheme}
                />
              </FormGroup>

              <FormGroup>
                <Label>Category</Label>
                <Select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value as any)}
                  theme={state.currentTheme}
                >
                  <option value="productivity">Productivity</option>
                  <option value="wellness">Wellness</option>
                  <option value="learning">Learning</option>
                  <option value="health">Health</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Frequency</Label>
                <Select
                  value={newHabitFrequency}
                  onChange={(e) => setNewHabitFrequency(e.target.value as any)}
                  theme={state.currentTheme}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </Select>
              </FormGroup>

              <ModalActions>
                <ActionButton
                  theme={state.currentTheme}
                  onClick={() => setShowAddModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  variant="primary"
                  theme={state.currentTheme}
                  onClick={handleAddHabit}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Habit
                </ActionButton>
              </ModalActions>
            </ModalContent>
          </AddHabitModal>
        )}
      </AnimatePresence>
    </HabitContainer>
  );
};

export default HabitIntelligence; 