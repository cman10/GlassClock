import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { aiService } from '../services/aiService';
import { SmartSchedule, TimeSlot, EnergyLevel, FocusWindow } from '../types';

const SchedulerContainer = styled(motion.div)<{ theme: any }>`
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

const ScheduleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const DateSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const DateInput = styled.input<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const GenerateButton = styled(motion.button)<{ theme: any }>`
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

const OptimizationScore = styled.div<{ theme: any }>`
  background: ${props => props.theme.accentColor}20;
  color: ${props => props.theme.accentColor};
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const ScheduleContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainSchedule = styled.div``;

const Sidebar = styled.div``;

const TimelineContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 20px;
  min-height: 600px;
`;

const TimeSlotItem = styled(motion.div)<{ 
  priority: string; 
  theme: any;
  aiSuggested: boolean;
}>`
  background: ${props => 
    props.aiSuggested 
      ? `linear-gradient(135deg, ${props.theme.accentColor}20, ${props.theme.accentColor}10)`
      : 'rgba(255, 255, 255, 0.05)'
  };
  border-left: 4px solid ${props => 
    props.priority === 'high' ? '#f44336' :
    props.priority === 'medium' ? '#ff9800' : '#4caf50'
  };
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background: ${props => 
      props.aiSuggested 
        ? `linear-gradient(135deg, ${props.theme.accentColor}30, ${props.theme.accentColor}15)`
        : 'rgba(255, 255, 255, 0.08)'
    };
  }
`;

const TimeSlotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const TimeSlotTime = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const TimeSlotTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 4px;
`;

const TimeSlotType = styled.span<{ type: string }>`
  background: ${props => 
    props.type === 'work' ? '#2196f3' :
    props.type === 'creative' ? '#9c27b0' :
    props.type === 'break' ? '#4caf50' :
    props.type === 'meeting' ? '#ff9800' : '#607d8b'
  };
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const FocusIndicator = styled.div<{ focus: number; theme: any }>`
  position: absolute;
  right: 12px;
  top: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => 
    props.focus >= 8 ? '#4caf50' :
    props.focus >= 6 ? '#ff9800' : '#f44336'
  }20;
  border: 2px solid ${props => 
    props.focus >= 8 ? '#4caf50' :
    props.focus >= 6 ? '#ff9800' : '#f44336'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
`;

const AIBadge = styled.div<{ theme: any }>`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${props => props.theme.accentColor};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
`;

const SidebarSection = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SidebarTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const EnergyChart = styled.div`
  height: 150px;
  display: flex;
  align-items: end;
  gap: 2px;
  margin-bottom: 16px;
`;

const EnergyBar = styled.div<{ height: number; theme: any }>`
  flex: 1;
  background: linear-gradient(to top, 
    ${props => props.theme.accentColor}40, 
    ${props => props.theme.accentColor}80
  );
  height: ${props => props.height}%;
  border-radius: 2px 2px 0 0;
  position: relative;
  cursor: pointer;
`;

const EnergyLabel = styled.div`
  font-size: 0.7rem;
  text-align: center;
  margin-top: 4px;
  opacity: 0.7;
`;

const FocusWindowItem = styled.div<{ quality: string; theme: any }>`
  background: ${props => 
    props.quality === 'peak' ? '#4caf50' :
    props.quality === 'good' ? '#ff9800' :
    props.quality === 'moderate' ? '#2196f3' : '#607d8b'
  }20;
  border: 1px solid ${props => 
    props.quality === 'peak' ? '#4caf50' :
    props.quality === 'good' ? '#ff9800' :
    props.quality === 'moderate' ? '#2196f3' : '#607d8b'
  };
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
`;

const FocusWindowTime = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
`;

const FocusWindowType = styled.div`
  font-size: 0.8rem;
  opacity: 0.8;
  text-transform: capitalize;
`;

const RecommendationItem = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  border-left: 3px solid ${props => props.theme.accentColor};
`;

const RecommendationText = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const RecommendationConfidence = styled.div<{ theme: any }>`
  font-size: 0.7rem;
  color: ${props => props.theme.accentColor};
  font-weight: 600;
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

const SmartScheduler: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [schedule, setSchedule] = useState<SmartSchedule | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (state.smartSchedule && state.smartSchedule.date === selectedDate) {
      setSchedule(state.smartSchedule);
    }
  }, [state.smartSchedule, selectedDate]);

  const handleGenerateSchedule = async () => {
    setIsGenerating(true);
    try {
      const newSchedule = aiService.generateSmartSchedule(selectedDate, state.userPreferences);
      setSchedule(newSchedule);
      dispatch({ type: 'GENERATE_SMART_SCHEDULE', payload: newSchedule });
      
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `schedule-generated-${Date.now()}`,
          type: 'success',
          title: 'Schedule Generated',
          message: 'Your AI-optimized schedule is ready!',
          timestamp: Date.now(),
          read: false
        }
      });
    } catch (error) {
      console.error('Error generating schedule:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.type === 'work' || slot.type === 'creative') {
      dispatch({ type: 'SET_ACTIVE_MODE', payload: 'timer' });
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <SchedulerContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title>🗓️ Smart Scheduler</Title>
        <BackButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'coach' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ← Back
        </BackButton>
      </Header>

      <ScheduleHeader>
        <DateSelector>
          <DateInput
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            theme={state.currentTheme}
          />
          <GenerateButton
            theme={state.currentTheme}
            onClick={handleGenerateSchedule}
            disabled={isGenerating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isGenerating ? '🔄' : '🤖'} 
            {isGenerating ? 'Generating...' : 'Generate AI Schedule'}
          </GenerateButton>
        </DateSelector>
        
        {schedule && (
          <OptimizationScore theme={state.currentTheme}>
            Optimization Score: {schedule.optimizationScore}%
          </OptimizationScore>
        )}
      </ScheduleHeader>

      {schedule ? (
        <ScheduleContent>
          <MainSchedule>
            <TimelineContainer>
              <AnimatePresence>
                {schedule.timeSlots.map((slot, index) => (
                  <TimeSlotItem
                    key={slot.id}
                    priority={slot.priority}
                    theme={state.currentTheme}
                    aiSuggested={slot.aiSuggested}
                    onClick={() => handleSlotClick(slot)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {slot.aiSuggested && (
                      <AIBadge theme={state.currentTheme}>🤖</AIBadge>
                    )}
                    
                    <TimeSlotHeader>
                      <div>
                        <TimeSlotTime>
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </TimeSlotTime>
                        <TimeSlotTitle>{slot.title}</TimeSlotTitle>
                      </div>
                      <TimeSlotType type={slot.type}>
                        {slot.type}
                      </TimeSlotType>
                    </TimeSlotHeader>
                    
                    <FocusIndicator focus={slot.estimatedFocus} theme={state.currentTheme}>
                      {slot.estimatedFocus}
                    </FocusIndicator>
                  </TimeSlotItem>
                ))}
              </AnimatePresence>
            </TimelineContainer>
          </MainSchedule>

          <Sidebar>
            <SidebarSection>
              <SidebarTitle>⚡ Energy Pattern</SidebarTitle>
              <EnergyChart>
                {schedule.energyPattern.slice(6, 22).map((energy, index) => (
                  <div key={energy.hour} style={{ flex: 1 }}>
                    <EnergyBar
                      height={(energy.predicted / 10) * 100}
                      theme={state.currentTheme}
                      title={`${energy.hour}:00 - Energy: ${energy.predicted.toFixed(1)}/10`}
                    />
                    <EnergyLabel>{energy.hour}</EnergyLabel>
                  </div>
                ))}
              </EnergyChart>
            </SidebarSection>

            <SidebarSection>
              <SidebarTitle>🎯 Focus Windows</SidebarTitle>
              {schedule.focusWindows.map((window, index) => (
                <FocusWindowItem
                  key={index}
                  quality={window.quality}
                  theme={state.currentTheme}
                >
                  <FocusWindowTime>
                    {window.startHour}:00 - {window.endHour}:00
                  </FocusWindowTime>
                  <FocusWindowType>
                    {window.quality} {window.type}
                  </FocusWindowType>
                </FocusWindowItem>
              ))}
            </SidebarSection>

            <SidebarSection>
              <SidebarTitle>💡 AI Recommendations</SidebarTitle>
              {schedule.aiRecommendations.map((rec, index) => (
                <RecommendationItem key={rec.id} theme={state.currentTheme}>
                  <RecommendationText>{rec.description}</RecommendationText>
                  <RecommendationConfidence theme={state.currentTheme}>
                    {rec.confidence}% confidence
                  </RecommendationConfidence>
                </RecommendationItem>
              ))}
            </SidebarSection>
          </Sidebar>
        </ScheduleContent>
      ) : (
        <EmptyState>
          <EmptyIcon>🗓️</EmptyIcon>
          <h3>No Schedule Generated</h3>
          <p>Click "Generate AI Schedule" to create an optimized schedule for {selectedDate}</p>
        </EmptyState>
      )}
    </SchedulerContainer>
  );
};

export default SmartScheduler; 