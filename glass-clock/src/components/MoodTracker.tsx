import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { MoodEntry } from '../types';

const MoodContainer = styled(motion.div)<{ theme: any }>`
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

const MoodEntrySection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MoodSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
`;

const MoodOption = styled(motion.button)<{ selected: boolean; theme: any }>`
  background: ${props => props.selected 
    ? props.theme.accentColor 
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => props.selected 
    ? props.theme.accentColor 
    : 'transparent'
  };
  color: ${props => props.selected ? 'white' : props.theme.textColor};
  padding: 20px 16px;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.selected 
      ? props.theme.accentColor 
      : 'rgba(255, 255, 255, 0.08)'
    };
  }
`;

const MoodEmoji = styled.div`
  font-size: 2rem;
  margin-bottom: 8px;
`;

const MoodLabel = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const SliderSection = styled.div`
  margin-bottom: 30px;
`;

const SliderContainer = styled.div`
  margin-bottom: 20px;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SliderValue = styled.span<{ theme: any }>`
  background: ${props => props.theme.accentColor}20;
  color: ${props => props.theme.accentColor};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Slider = styled.input<{ theme: any }>`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
  outline: none;
  appearance: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.accentColor};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.accentColor};
    cursor: pointer;
    border: none;
  }
`;

const ContextSection = styled.div`
  margin-bottom: 30px;
`;

const ContextGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const ContextSelect = styled.select<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  width: 100%;
`;

const NotesSection = styled.div`
  margin-bottom: 30px;
`;

const NotesTextarea = styled.textarea<{ theme: any }>`
  width: 100%;
  min-height: 100px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  padding: 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  resize: vertical;
  font-family: inherit;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const TriggersSection = styled.div`
  margin-bottom: 30px;
`;

const TriggerTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const TriggerTag = styled(motion.button)<{ selected: boolean; theme: any }>`
  background: ${props => props.selected 
    ? props.theme.accentColor 
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 1px solid ${props => props.selected 
    ? props.theme.accentColor 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.selected ? 'white' : props.theme.textColor};
  padding: 6px 12px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
`;

const SubmitButton = styled(motion.button)<{ theme: any }>`
  background: ${props => props.theme.accentColor};
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  margin-bottom: 30px;
`;

const RecommendationsSection = styled.div`
  margin-bottom: 40px;
`;

const RecommendationCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  border-left: 4px solid ${props => props.theme.accentColor};
`;

const RecommendationTitle = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
`;

const RecommendationText = styled.p`
  margin: 0 0 12px 0;
  opacity: 0.9;
  line-height: 1.5;
`;

const RecommendationAction = styled(motion.button)<{ theme: any }>`
  background: ${props => props.theme.accentColor};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
`;

const HistorySection = styled.div`
  margin-bottom: 40px;
`;

const HistoryList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const HistoryItem = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HistoryMood = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HistoryDate = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const MoodTracker: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [energy, setEnergy] = useState(5);
  const [focus, setFocus] = useState(5);
  const [stress, setStress] = useState(5);
  const [activity, setActivity] = useState('');
  const [environment, setEnvironment] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const moodOptions = [
    { value: 'excellent', emoji: '😄', label: 'Excellent' },
    { value: 'good', emoji: '😊', label: 'Good' },
    { value: 'neutral', emoji: '😐', label: 'Neutral' },
    { value: 'low', emoji: '😔', label: 'Low' },
    { value: 'stressed', emoji: '😰', label: 'Stressed' }
  ];

  const triggerOptions = [
    'Work pressure', 'Lack of sleep', 'Exercise', 'Good news',
    'Social interaction', 'Weather', 'Music', 'Achievement',
    'Deadline stress', 'Healthy meal', 'Nature', 'Meditation'
  ];

  const activityOptions = [
    'Working', 'Studying', 'Exercising', 'Relaxing', 'Socializing',
    'Commuting', 'Eating', 'Sleeping', 'Entertainment', 'Household'
  ];

  const environmentOptions = [
    'Home', 'Office', 'Outdoors', 'Gym', 'Cafe', 'Transport',
    'Social setting', 'Quiet space', 'Busy area', 'Nature'
  ];

  useEffect(() => {
    if (selectedMood) {
      const mockEntry: MoodEntry = {
        id: 'temp',
        timestamp: Date.now(),
        mood: selectedMood as any,
        energy,
        focus,
        stress,
        context: {
          activity,
          environment,
          timeOfDay: getTimeOfDay()
        },
        triggers: selectedTriggers
      };
      
      const suggestions = aiService.analyzeMoodContext(mockEntry);
      setRecommendations(suggestions);
    }
  }, [selectedMood, energy, focus, stress, activity, environment, selectedTriggers]);

  const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' | 'night' => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 21) return 'evening';
    return 'night';
  };

  const handleTriggerToggle = (trigger: string) => {
    setSelectedTriggers(prev => 
      prev.includes(trigger)
        ? prev.filter(t => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleSubmit = () => {
    if (!selectedMood) return;

    const newEntry: MoodEntry = {
      id: `mood-${Date.now()}`,
      timestamp: Date.now(),
      mood: selectedMood as any,
      energy,
      focus,
      stress,
      notes: notes || undefined,
      context: {
        activity,
        environment,
        timeOfDay: getTimeOfDay()
      },
      triggers: selectedTriggers.length > 0 ? selectedTriggers : undefined
    };

    dispatch({ type: 'ADD_MOOD_ENTRY', payload: newEntry });
    
    // Reset form
    setSelectedMood('');
    setEnergy(5);
    setFocus(5);
    setStress(5);
    setActivity('');
    setEnvironment('');
    setNotes('');
    setSelectedTriggers([]);
    setRecommendations([]);

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `mood-saved-${Date.now()}`,
        type: 'success',
        title: 'Mood Logged',
        message: 'Your mood entry has been saved successfully.',
        timestamp: Date.now(),
        read: false
      }
    });
  };

  const handleRecommendationAction = (recommendation: string) => {
    if (recommendation.includes('breathing')) {
      dispatch({ type: 'SET_ACTIVE_MODE', payload: 'breathing' });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
    } else if (recommendation.includes('work session')) {
      dispatch({ type: 'SET_ACTIVE_MODE', payload: 'timer' });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
    } else if (recommendation.includes('sounds')) {
      // Open sound panel
      dispatch({ type: 'TOGGLE_SETTINGS' });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood: string) => {
    return moodOptions.find(m => m.value === mood)?.emoji || '😐';
  };

  const recentEntries = (state.moodEntries || []).slice(-5);

  return (
    <MoodContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>
          😊 Mood Tracker
        </Title>
        <BackButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'coach' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </BackButton>
      </Header>

      <MoodEntrySection>
        <SectionTitle>🎭 How are you feeling right now?</SectionTitle>
        <MoodSelector>
          {moodOptions.map((mood) => (
            <MoodOption
              key={mood.value}
              selected={selectedMood === mood.value}
              theme={state.currentTheme}
              onClick={() => setSelectedMood(mood.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MoodEmoji>{mood.emoji}</MoodEmoji>
              <MoodLabel>{mood.label}</MoodLabel>
            </MoodOption>
          ))}
        </MoodSelector>
      </MoodEntrySection>

      {selectedMood && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <SliderSection>
            <SectionTitle>📊 Rate Your Current State</SectionTitle>
            
            <SliderContainer>
              <SliderLabel>
                <span>Energy Level</span>
                <SliderValue theme={state.currentTheme}>{energy}/10</SliderValue>
              </SliderLabel>
              <Slider
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(parseInt(e.target.value))}
                theme={state.currentTheme}
              />
            </SliderContainer>

            <SliderContainer>
              <SliderLabel>
                <span>Focus Level</span>
                <SliderValue theme={state.currentTheme}>{focus}/10</SliderValue>
              </SliderLabel>
              <Slider
                type="range"
                min="1"
                max="10"
                value={focus}
                onChange={(e) => setFocus(parseInt(e.target.value))}
                theme={state.currentTheme}
              />
            </SliderContainer>

            <SliderContainer>
              <SliderLabel>
                <span>Stress Level</span>
                <SliderValue theme={state.currentTheme}>{stress}/10</SliderValue>
              </SliderLabel>
              <Slider
                type="range"
                min="1"
                max="10"
                value={stress}
                onChange={(e) => setStress(parseInt(e.target.value))}
                theme={state.currentTheme}
              />
            </SliderContainer>
          </SliderSection>

          <ContextSection>
            <SectionTitle>📍 Context</SectionTitle>
            <ContextGrid>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                  What are you doing?
                </label>
                <ContextSelect
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  theme={state.currentTheme}
                >
                  <option value="">Select activity...</option>
                  {activityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </ContextSelect>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>
                  Where are you?
                </label>
                <ContextSelect
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                  theme={state.currentTheme}
                >
                  <option value="">Select environment...</option>
                  {environmentOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </ContextSelect>
              </div>
            </ContextGrid>
          </ContextSection>

          <TriggersSection>
            <SectionTitle>⚡ What might have influenced your mood?</SectionTitle>
            <TriggerTags>
              {triggerOptions.map((trigger) => (
                <TriggerTag
                  key={trigger}
                  selected={selectedTriggers.includes(trigger)}
                  theme={state.currentTheme}
                  onClick={() => handleTriggerToggle(trigger)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {trigger}
                </TriggerTag>
              ))}
            </TriggerTags>
          </TriggersSection>

          <NotesSection>
            <SectionTitle>📝 Additional Notes (Optional)</SectionTitle>
            <NotesTextarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional thoughts or observations about your current state..."
              theme={state.currentTheme}
            />
          </NotesSection>

          {recommendations.length > 0 && (
            <RecommendationsSection>
              <SectionTitle>💡 AI Recommendations</SectionTitle>
              {recommendations.map((recommendation, index) => (
                <RecommendationCard
                  key={index}
                  theme={state.currentTheme}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <RecommendationText>{recommendation}</RecommendationText>
                  <RecommendationAction
                    theme={state.currentTheme}
                    onClick={() => handleRecommendationAction(recommendation)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try It
                  </RecommendationAction>
                </RecommendationCard>
              ))}
            </RecommendationsSection>
          )}

          <SubmitButton
            theme={state.currentTheme}
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Mood Entry
          </SubmitButton>
        </motion.div>
      )}

      {recentEntries.length > 0 && (
        <HistorySection>
          <SectionTitle>📈 Recent Entries</SectionTitle>
          <HistoryList>
            {recentEntries.map((entry) => (
              <HistoryItem
                key={entry.id}
                theme={state.currentTheme}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <HistoryMood>
                  <div style={{ fontSize: '1.5rem' }}>
                    {getMoodEmoji(entry.mood)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {entry.mood}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
                      Energy: {entry.energy}, Focus: {entry.focus}, Stress: {entry.stress}
                    </div>
                  </div>
                </HistoryMood>
                <HistoryDate>
                  {formatDate(entry.timestamp)}
                </HistoryDate>
              </HistoryItem>
            ))}
          </HistoryList>
        </HistorySection>
      )}
    </MoodContainer>
  );
};

export default MoodTracker; 