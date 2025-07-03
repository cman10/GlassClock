import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Alarm, AlarmRepeatDay, AmbientSound } from '../types';
import { ambientSounds } from '../data/ambientSounds';
import { alarmService } from '../services/alarmService';

const AlarmContainer = styled(motion.div)<{ theme: any }>`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  color: ${props => props.theme.textColor};
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
`;

const Title = styled.h1`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 200;
  margin-bottom: 10px;
  opacity: 0.9;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 1) 0%, 
    rgba(255, 255, 255, 0.7) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.7;
  margin-bottom: 20px;
  font-weight: 300;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
  justify-content: center;
`;

const ActionButton = styled(motion.button)<{ theme: any; variant?: 'primary' | 'secondary' | 'test' }>`
  background: ${props => 
    props.variant === 'test' ? 
      'linear-gradient(45deg, rgba(255, 107, 53, 0.2), rgba(255, 107, 53, 0.1))' :
    props.variant === 'secondary' ? 
      'linear-gradient(45deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03))' :
      `linear-gradient(45deg, ${props.theme.accentColor}40, ${props.theme.accentColor}20)`
  };
  backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid ${props => 
    props.variant === 'test' ? 
      'rgba(255, 107, 53, 0.3)' :
    props.variant === 'secondary' ? 
      'rgba(255, 255, 255, 0.15)' :
      `${props.theme.accentColor}60`
  };
  color: white;
  border-radius: 50px;
  padding: 15px 30px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
  
  &:hover {
    transform: scale(1.05) translateY(-3px);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      0 0 20px ${props => 
        props.variant === 'test' ? 
          'rgba(255, 107, 53, 0.3)' :
        props.variant === 'secondary' ? 
          'rgba(255, 255, 255, 0.1)' :
          `${props.theme.accentColor}40`
      };
  }
`;

const AlarmsList = styled.div`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AlarmCard = styled(motion.div)<{ theme: any; enabled: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => props.enabled ? 1 : 0.6};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const AlarmInfo = styled.div`
  flex: 1;
`;

const AlarmTime = styled.div`
  font-size: 2rem;
  font-weight: 300;
  margin-bottom: 5px;
`;

const AlarmLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 8px;
`;

const AlarmRepeat = styled.div`
  font-size: 0.9rem;
  opacity: 0.6;
`;

const NextAlarmInfo = styled.div`
  font-size: 0.8rem;
  opacity: 0.5;
  margin-top: 5px;
`;

const AlarmControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ToggleSwitch = styled.button<{ theme: any; enabled: boolean }>`
  width: 60px;
  height: 32px;
  border-radius: 16px;
  border: none;
  background: ${props => props.enabled ? props.theme.accentColor : 'rgba(255, 255, 255, 0.2)'};
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.enabled ? '30px' : '2px'};
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: white;
    transition: left 0.3s ease;
  }
`;

const ControlButton = styled.button<{ theme: any; variant?: 'edit' | 'delete' }>`
  background: ${props => 
    props.variant === 'delete' ? '#ff4444' : 
    props.variant === 'edit' ? props.theme.accentColor : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  opacity: 0.6;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const EmptySubtext = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
`;

// Modal Components with enhanced glass design
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  padding: 35px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  color: ${props => props.theme.textColor};
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 300;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  opacity: 0.9;
`;

const Input = styled.input<{ theme: any }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.textColor};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
  }
`;

const TimePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TimeInput = styled.input<{ theme: any }>`
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.textColor};
  font-size: 1.2rem;
  text-align: center;
  width: 80px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
  }
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
`;

const DayButton = styled.button<{ theme: any; active: boolean }>`
  padding: 10px;
  border: 1px solid ${props => props.active ? props.theme.accentColor : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  background: ${props => props.active ? props.theme.accentColor : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.active ? 'white' : props.theme.textColor};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SoundSelect = styled.select<{ theme: any }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.textColor};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
  }
  
  option {
    background: ${props => props.theme.background};
    color: ${props => props.theme.textColor};
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const DAYS: AlarmRepeatDay['day'][] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const DAY_LABELS = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun'
};

interface AlarmFormData {
  label: string;
  time: string;
  repeatDays: AlarmRepeatDay[];
  sound: AmbientSound | null;
  volume: number;
  snoozeEnabled: boolean;
  snoozeDuration: number;
  gradualWake: boolean;
  vibration: boolean;
}

export const AlarmManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [formData, setFormData] = useState<AlarmFormData>({
    label: '',
    time: '07:00',
    repeatDays: DAYS.map(day => ({ day, enabled: false })),
    sound: null,
    volume: 80,
    snoozeEnabled: true,
    snoozeDuration: 5,
    gradualWake: true,
    vibration: true
  });

  // Initialize alarm service
  useEffect(() => {
    alarmService.setAlarmTriggerCallback((alarm: Alarm) => {
      dispatch({ type: 'TRIGGER_ALARM', payload: alarm });
    });

    // Schedule existing alarms
    alarmService.scheduleAlarms(state.alarmState.alarms);

    return () => {
      alarmService.clearAllAlarms();
    };
  }, [dispatch, state.alarmState.alarms]);

  const handleAddAlarm = () => {
    setEditingAlarm(null);
    setFormData({
      label: '',
      time: '07:00',
      repeatDays: DAYS.map(day => ({ day, enabled: false })),
      sound: null,
      volume: 80,
      snoozeEnabled: true,
      snoozeDuration: 5,
      gradualWake: true,
      vibration: true
    });
    setShowModal(true);
  };

  const handleEditAlarm = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setFormData({
      label: alarm.label,
      time: alarm.time,
      repeatDays: alarm.repeatDays,
      sound: alarm.sound,
      volume: alarm.volume,
      snoozeEnabled: alarm.snoozeEnabled,
      snoozeDuration: alarm.snoozeDuration,
      gradualWake: alarm.gradualWake,
      vibration: alarm.vibration
    });
    setShowModal(true);
  };

  const handleTestAlarm = () => {
    const now = new Date();
    const testTime = new Date(now.getTime() + 30000); // 30 seconds from now
    const timeString = `${testTime.getHours().toString().padStart(2, '0')}:${testTime.getMinutes().toString().padStart(2, '0')}`;
    
    const testAlarm: Alarm = {
      id: `test_alarm_${Date.now()}`,
      label: '🧪 Test Alarm (30s)',
      time: timeString,
      enabled: true,
      repeatDays: DAYS.map(day => ({ day, enabled: false })),
      sound: ambientSounds[0], // Use first ambient sound
      volume: 80,
      snoozeEnabled: true,
      snoozeDuration: 5,
      gradualWake: false,
      vibration: true,
      createdAt: Date.now()
    };
    
    dispatch({ type: 'ADD_ALARM', payload: testAlarm });
  };

  const handleSaveAlarm = () => {
    const alarmData: Alarm = {
      id: editingAlarm?.id || `alarm_${Date.now()}`,
      label: formData.label || 'Alarm',
      time: formData.time,
      enabled: true,
      repeatDays: formData.repeatDays,
      sound: formData.sound,
      volume: formData.volume,
      snoozeEnabled: formData.snoozeEnabled,
      snoozeDuration: formData.snoozeDuration,
      gradualWake: formData.gradualWake,
      vibration: formData.vibration,
      createdAt: editingAlarm?.createdAt || Date.now()
    };

    if (editingAlarm) {
      dispatch({ 
        type: 'UPDATE_ALARM', 
        payload: { 
          id: editingAlarm.id, 
          updates: alarmData 
        } 
      });
    } else {
      dispatch({ type: 'ADD_ALARM', payload: alarmData });
    }

    setShowModal(false);
  };

  const handleToggleAlarm = (alarmId: string) => {
    dispatch({ type: 'TOGGLE_ALARM', payload: alarmId });
  };

  const handleDeleteAlarm = (alarmId: string) => {
    dispatch({ type: 'DELETE_ALARM', payload: alarmId });
  };

  const handleDayToggle = (dayIndex: number) => {
    const newRepeatDays = [...formData.repeatDays];
    newRepeatDays[dayIndex].enabled = !newRepeatDays[dayIndex].enabled;
    setFormData({ ...formData, repeatDays: newRepeatDays });
  };

  const formatRepeatDays = (repeatDays: AlarmRepeatDay[]) => {
    const enabledDays = repeatDays.filter(day => day.enabled);
    if (enabledDays.length === 0) return 'Never';
    if (enabledDays.length === 7) return 'Every day';
    if (enabledDays.length === 5 && 
        enabledDays.every(day => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day.day))) {
      return 'Weekdays';
    }
    if (enabledDays.length === 2 && 
        enabledDays.every(day => ['saturday', 'sunday'].includes(day.day))) {
      return 'Weekends';
    }
    return enabledDays.map(day => DAY_LABELS[day.day]).join(', ');
  };

  const getNextAlarmInfo = (alarm: Alarm) => {
    const nextTime = alarmService.getNextTriggerTime(alarm);
    if (!nextTime) return '';
    
    const timeUntil = nextTime - Date.now();
    const formatted = alarmService.formatTimeUntilAlarm(timeUntil);
    return `Next: ${formatted}`;
  };

  return (
    <>
      <AlarmContainer
        theme={state.currentTheme}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <Title>Alarms</Title>
          <Subtitle>Set beautiful alarms that wake you up gently</Subtitle>
          <ButtonGroup>
            <ActionButton
              theme={state.currentTheme}
              variant="primary"
              onClick={handleAddAlarm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>⏰</span>
              Add Alarm
            </ActionButton>
            <ActionButton
              theme={state.currentTheme}
              variant="test"
              onClick={handleTestAlarm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>🧪</span>
              Test Alarm (30s)
            </ActionButton>
          </ButtonGroup>
        </Header>

        <AlarmsList>
          {state.alarmState.alarms.length === 0 ? (
            <EmptyState>
              <EmptyIcon>⏰</EmptyIcon>
              <EmptyText>No alarms set</EmptyText>
              <EmptySubtext>Tap "Add Alarm" to create your first alarm or "Test Alarm" to try it out</EmptySubtext>
            </EmptyState>
          ) : (
            state.alarmState.alarms.map((alarm) => (
              <AlarmCard
                key={alarm.id}
                theme={state.currentTheme}
                enabled={alarm.enabled}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                layout
              >
                <AlarmInfo>
                  <AlarmTime>{alarm.time}</AlarmTime>
                  <AlarmLabel>{alarm.label || 'Alarm'}</AlarmLabel>
                  <AlarmRepeat>{formatRepeatDays(alarm.repeatDays)}</AlarmRepeat>
                  {alarm.enabled && (
                    <NextAlarmInfo>{getNextAlarmInfo(alarm)}</NextAlarmInfo>
                  )}
                </AlarmInfo>
                
                <AlarmControls>
                  <ToggleSwitch
                    theme={state.currentTheme}
                    enabled={alarm.enabled}
                    onClick={() => handleToggleAlarm(alarm.id)}
                  />
                  <ControlButton
                    theme={state.currentTheme}
                    variant="edit"
                    onClick={() => handleEditAlarm(alarm)}
                  >
                    Edit
                  </ControlButton>
                  <ControlButton
                    theme={state.currentTheme}
                    variant="delete"
                    onClick={() => handleDeleteAlarm(alarm.id)}
                  >
                    Delete
                  </ControlButton>
                </AlarmControls>
              </AlarmCard>
            ))
          )}
        </AlarmsList>
      </AlarmContainer>

      {/* Alarm Creation/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              theme={state.currentTheme}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>{editingAlarm ? 'Edit Alarm' : 'Create Alarm'}</ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Label</Label>
                <Input
                  theme={state.currentTheme}
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="Wake up!"
                />
              </FormGroup>

              <FormGroup>
                <Label>Time</Label>
                <TimePickerContainer>
                  <TimeInput
                    theme={state.currentTheme}
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </TimePickerContainer>
              </FormGroup>

              <FormGroup>
                <Label>Repeat Days</Label>
                <DaysGrid>
                  {DAYS.map((day, index) => (
                    <DayButton
                      key={day}
                      theme={state.currentTheme}
                      active={formData.repeatDays[index].enabled}
                      onClick={() => handleDayToggle(index)}
                    >
                      {DAY_LABELS[day]}
                    </DayButton>
                  ))}
                </DaysGrid>
              </FormGroup>

              <FormGroup>
                <Label>Alarm Sound</Label>
                <SoundSelect
                  theme={state.currentTheme}
                  value={formData.sound?.id || ''}
                  onChange={(e) => {
                    const sound = ambientSounds.find(s => s.id === e.target.value) || null;
                    setFormData({ ...formData, sound });
                  }}
                >
                  <option value="">Default Alarm</option>
                  {ambientSounds.map(sound => (
                    <option key={sound.id} value={sound.id}>
                      {sound.icon} {sound.name}
                    </option>
                  ))}
                </SoundSelect>
              </FormGroup>

              <ModalButtons>
                <ActionButton
                  theme={state.currentTheme}
                  variant="secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </ActionButton>
                <ActionButton
                  theme={state.currentTheme}
                  variant="primary"
                  onClick={handleSaveAlarm}
                >
                  {editingAlarm ? 'Update' : 'Create'} Alarm
                </ActionButton>
              </ModalButtons>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}; 