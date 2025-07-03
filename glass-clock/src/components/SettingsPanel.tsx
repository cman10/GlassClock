import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { themes } from '../themes';
import { SoundPanel } from './SoundPanel';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const Panel = styled(motion.div)<{ theme: any }>`
  position: fixed;
  right: 0;
  top: 0;
  width: min(450px, 90vw);
  height: 100vh;
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(30px) saturate(180%);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  color: ${props => props.theme.textColor};
  padding: 25px 20px;
  box-shadow: 
    -8px 0 40px rgba(0, 0, 0, 0.4),
    inset 1px 0 0 rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  z-index: 1001;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  @media (max-width: 768px) {
    width: 100vw;
    padding: 20px 15px;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
`;

const CloseButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  color: ${props => props.theme.textColor};
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const Section = styled.div`
  margin-bottom: 35px;
  
  &:last-child {
    margin-bottom: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 18px;
  opacity: 0.9;
  background: linear-gradient(45deg, 
    rgba(255, 255, 255, 0.9) 0%, 
    rgba(255, 255, 255, 0.7) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
`;

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 25px;
  margin-left: -20px;
  margin-right: -20px;
  padding-left: 20px;
  padding-right: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: 0;
  width: calc(100% + 40px);
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 20px;
    margin-left: -15px;
    margin-right: -15px;
    padding-left: 15px;
    padding-right: 15px;
    width: calc(100% + 30px);
  }
`;

const Tab = styled.button<{ theme: any; isActive: boolean }>`
  background: ${props => props.isActive ? 
    'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))' : 
    'none'
  };
  backdrop-filter: ${props => props.isActive ? 'blur(15px)' : 'none'};
  border: ${props => props.isActive ? '1px solid rgba(255, 255, 255, 0.15)' : 'none'};
  border-bottom: 2px solid ${props => props.isActive ? props.theme.accentColor : 'transparent'};
  border-radius: 0;
  color: ${props => props.theme.textColor};
  font-size: 0.9rem;
  padding: 12px 18px;
  cursor: pointer;
  opacity: ${props => props.isActive ? 1 : 0.6};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  flex-shrink: 0;
  flex-grow: 0;
  position: relative;
  overflow: hidden;
  display: inline-block;
  min-width: fit-content;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    opacity: 1;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
    backdrop-filter: blur(10px);
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.85rem;
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 40px;
  padding: 0;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const ThemeButton = styled.button<{ theme: any; isActive: boolean }>`
  width: 100%;
  aspect-ratio: 3/2;
  border-radius: 12px;
  border: ${props => props.isActive ? `2px solid ${props.theme.accentColor}` : '2px solid rgba(255, 255, 255, 0.1)'};
  background: ${props => 
    props.theme.gradientStart ? 
    `linear-gradient(135deg, ${props.theme.gradientStart} 0%, ${props.theme.gradientEnd} 100%)` : 
    props.theme.background
  };
  backdrop-filter: blur(15px) saturate(150%);
  cursor: pointer;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 0;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;

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
    transform: scale(1.05) translateY(-2px);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.3),
      ${props => props.isActive ? `0 0 20px ${props.theme.accentColor}40` : ''},
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  &::after {
    content: '${props => props.theme.name}';
    position: absolute;
    bottom: 4px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.7rem;
    color: ${props => props.theme.textColor};
    opacity: 0.8;
    white-space: nowrap;
    max-width: calc(100% - 8px);
    overflow: hidden;
    text-overflow: ellipsis;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 8px 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Label = styled.label`
  font-size: 0.95rem;
  opacity: 0.9;
  font-weight: 400;
  flex: 1;
  min-width: 120px;
`;

const Select = styled.select<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px) saturate(150%);
  color: ${props => props.theme.textColor};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.9rem;
  min-width: 140px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px ${props => props.theme.accentColor}40;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const Input = styled.input<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px) saturate(150%);
  color: ${props => props.theme.textColor};
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.9rem;
  min-width: 100px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 20px ${props => props.theme.accentColor}40;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.25);
  }
`;

const Toggle = styled.button<{ theme: any; isActive: boolean }>`
  width: 54px;
  height: 30px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: ${props => props.isActive ? 
    `linear-gradient(45deg, ${props.theme.accentColor}, ${props.theme.accentColor}CC)` : 
    'rgba(255, 255, 255, 0.1)'
  };
  backdrop-filter: blur(15px);
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${props => props.isActive ? 
      `linear-gradient(45deg, ${props.theme.accentColor}DD, ${props.theme.accentColor}AA)` : 
      'rgba(255, 255, 255, 0.15)'
    };
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.isActive ? '27px' : '3px'};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const ModeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
  margin-bottom: 25px;
`;

const ModeButton = styled.button<{ theme: any; isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 8px;
  border: 2px solid ${props => props.isActive ? props.theme.accentColor : 'transparent'};
  background: ${props => props.isActive ? 
    `${props.theme.accentColor}20` : 
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s;
  min-height: 70px;

  &:hover {
    background: ${props => props.isActive ? 
      `${props.theme.accentColor}30` : 
      'rgba(255, 255, 255, 0.1)'
    };
  }
`;

const ModeIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 5px;
`;

const ModeName = styled.div`
  font-size: 0.75rem;
  text-align: center;
  font-weight: 500;
  margin-top: 2px;
`;

export const SettingsPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = React.useState<'display' | 'timer' | 'breathing' | 'sounds'>('display');

  const handleThemeChange = (theme: any) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const handleClockSettingChange = (setting: string, value: any) => {
    dispatch({ 
      type: 'UPDATE_CLOCK_SETTINGS', 
      payload: { [setting]: value } 
    });
  };

  const handleTimerSettingChange = (setting: string, value: any) => {
    dispatch({ 
      type: 'UPDATE_TIMER_SETTINGS', 
      payload: { [setting]: value } 
    });
  };

  const handleModeChange = (mode: string) => {
    dispatch({ type: 'SET_ACTIVE_MODE', payload: mode as any });
  };

  const handleClose = () => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  };

  return (
    <AnimatePresence>
      {state.isSettingsOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <Panel
            theme={state.currentTheme}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <PanelHeader>
              <Title>Settings</Title>
              <CloseButton theme={state.currentTheme} onClick={handleClose}>
                ✕
              </CloseButton>
            </PanelHeader>

            <TabContainer>
              <Tab 
                theme={state.currentTheme} 
                isActive={activeTab === 'display'}
                onClick={() => setActiveTab('display')}
              >
                Display
              </Tab>
              <Tab 
                theme={state.currentTheme} 
                isActive={activeTab === 'timer'}
                onClick={() => setActiveTab('timer')}
              >
                Timer
              </Tab>
              <Tab 
                theme={state.currentTheme} 
                isActive={activeTab === 'breathing'}
                onClick={() => setActiveTab('breathing')}
              >
                Breathing
              </Tab>
              <Tab 
                theme={state.currentTheme} 
                isActive={activeTab === 'sounds'}
                onClick={() => setActiveTab('sounds')}
              >
                Sounds
              </Tab>
            </TabContainer>

            {activeTab === 'display' && (
              <>
                <Section>
                  <SectionTitle>Themes</SectionTitle>
                  <ThemeGrid>
                    {themes.map((theme) => (
                      <ThemeButton
                        key={theme.name}
                        theme={theme}
                        isActive={state.currentTheme.name === theme.name}
                        onClick={() => handleThemeChange(theme)}
                      />
                    ))}
                  </ThemeGrid>
                </Section>

                <Section>
                  <SectionTitle>Clock Style</SectionTitle>
                  <ControlGroup>
                    <ControlRow>
                      <Label>Display Style</Label>
                      <Select
                        theme={state.currentTheme}
                        value={state.clockSettings.clockStyle}
                        onChange={(e) => handleClockSettingChange('clockStyle', e.target.value)}
                      >
                        <option value="digital">Digital</option>
                        <option value="analog">Analog</option>
                        <option value="minimal">Minimal</option>
                        <option value="concentric">Concentric</option>
                        <option value="neon">Neon</option>
                        <option value="word">Word Clock</option>
                        <option value="matrix">Matrix</option>
                        <option value="binary">Binary</option>
                      </Select>
                    </ControlRow>

                    {state.clockSettings.clockStyle === 'analog' && (
                      <ControlRow>
                        <Label>Analog Style</Label>
                        <Select
                          theme={state.currentTheme}
                          value={state.clockSettings.analogStyle || 'modern'}
                          onChange={(e) => handleClockSettingChange('analogStyle', e.target.value)}
                        >
                          <option value="classic">Classic</option>
                          <option value="modern">Modern</option>
                          <option value="minimal">Minimal</option>
                          <option value="roman">Roman</option>
                          <option value="dots">Dots</option>
                        </Select>
                      </ControlRow>
                    )}

                    {state.clockSettings.clockStyle === 'concentric' && (
                      <ControlRow>
                        <Label>Number of Rings</Label>
                        <Select
                          theme={state.currentTheme}
                          value={state.clockSettings.concentricRings || 4}
                          onChange={(e) => handleClockSettingChange('concentricRings', parseInt(e.target.value))}
                        >
                          <option value="3">3 Rings</option>
                          <option value="4">4 Rings</option>
                          <option value="5">5 Rings</option>
                        </Select>
                      </ControlRow>
                    )}

                    {state.clockSettings.clockStyle === 'neon' && (
                      <ControlRow>
                        <Label>Neon Glow</Label>
                        <Toggle
                          theme={state.currentTheme}
                          isActive={state.clockSettings.neonGlow !== false}
                          onClick={() => handleClockSettingChange('neonGlow', !state.clockSettings.neonGlow)}
                        />
                      </ControlRow>
                    )}

                    {state.clockSettings.clockStyle === 'word' && (
                      <ControlRow>
                        <Label>Language</Label>
                        <Select
                          theme={state.currentTheme}
                          value={state.clockSettings.wordLanguage || 'english'}
                          onChange={(e) => handleClockSettingChange('wordLanguage', e.target.value)}
                        >
                          <option value="english">English</option>
                          <option value="spanish">Spanish</option>
                          <option value="french">French</option>
                          <option value="german">German</option>
                        </Select>
                      </ControlRow>
                    )}

                    {state.clockSettings.clockStyle === 'matrix' && (
                      <ControlRow>
                        <Label>Animation Speed</Label>
                        <Select
                          theme={state.currentTheme}
                          value={state.clockSettings.matrixSpeed || 'medium'}
                          onChange={(e) => handleClockSettingChange('matrixSpeed', e.target.value)}
                        >
                          <option value="slow">Slow</option>
                          <option value="medium">Medium</option>
                          <option value="fast">Fast</option>
                        </Select>
                      </ControlRow>
                    )}
                  </ControlGroup>
                </Section>

                <Section>
                  <SectionTitle>Clock Format</SectionTitle>
                  <ControlGroup>
                    <ControlRow>
                      <Label>Time Format</Label>
                      <Select
                        theme={state.currentTheme}
                        value={state.clockSettings.format}
                        onChange={(e) => handleClockSettingChange('format', e.target.value)}
                      >
                        <option value="12">12 Hour</option>
                        <option value="24">24 Hour</option>
                      </Select>
                    </ControlRow>

                    <ControlRow>
                      <Label>Show Seconds</Label>
                      <Toggle
                        theme={state.currentTheme}
                        isActive={state.clockSettings.showSeconds}
                        onClick={() => handleClockSettingChange('showSeconds', !state.clockSettings.showSeconds)}
                      />
                    </ControlRow>

                    <ControlRow>
                      <Label>Show Date</Label>
                      <Toggle
                        theme={state.currentTheme}
                        isActive={state.clockSettings.showDate}
                        onClick={() => handleClockSettingChange('showDate', !state.clockSettings.showDate)}
                      />
                    </ControlRow>

                    {state.clockSettings.showDate && (
                      <ControlRow>
                        <Label>Date Format</Label>
                        <Select
                          theme={state.currentTheme}
                          value={state.clockSettings.dateFormat}
                          onChange={(e) => handleClockSettingChange('dateFormat', e.target.value)}
                        >
                          <option value="short">Short</option>
                          <option value="long">Long</option>
                          <option value="numeric">Numeric</option>
                        </Select>
                      </ControlRow>
                    )}

                    <ControlRow>
                      <Label>Font Size</Label>
                      <Select
                        theme={state.currentTheme}
                        value={state.clockSettings.fontSize}
                        onChange={(e) => handleClockSettingChange('fontSize', e.target.value)}
                      >
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="xl">Extra Large</option>
                      </Select>
                    </ControlRow>
                  </ControlGroup>
                </Section>
              </>
            )}

            {activeTab === 'timer' && (
              <>
                <Section>
                  <SectionTitle>Timer Mode</SectionTitle>
                  <ModeSelector>
                    <ModeButton
                      theme={state.currentTheme}
                      isActive={state.timerSettings.mode === 'pomodoro'}
                      onClick={() => handleTimerSettingChange('mode', 'pomodoro')}
                    >
                      <ModeIcon>🍅</ModeIcon>
                      <ModeName>Pomodoro</ModeName>
                    </ModeButton>
                    <ModeButton
                      theme={state.currentTheme}
                      isActive={state.timerSettings.mode === 'custom'}
                      onClick={() => handleTimerSettingChange('mode', 'custom')}
                    >
                      <ModeIcon>⏱️</ModeIcon>
                      <ModeName>Custom</ModeName>
                    </ModeButton>
                    <ModeButton
                      theme={state.currentTheme}
                      isActive={state.timerSettings.mode === 'meditation'}
                      onClick={() => handleTimerSettingChange('mode', 'meditation')}
                    >
                      <ModeIcon>🧘</ModeIcon>
                      <ModeName>Meditation</ModeName>
                    </ModeButton>
                  </ModeSelector>
                </Section>

                {state.timerSettings.mode === 'pomodoro' && (
                  <Section>
                    <SectionTitle>Pomodoro Settings</SectionTitle>
                    <ControlGroup>
                      <ControlRow>
                        <Label>Work Duration (min)</Label>
                        <Input
                          theme={state.currentTheme}
                          type="number"
                          min="1"
                          max="60"
                          value={state.timerSettings.pomodoroWorkDuration}
                          onChange={(e) => handleTimerSettingChange('pomodoroWorkDuration', parseInt(e.target.value))}
                        />
                      </ControlRow>
                      <ControlRow>
                        <Label>Break Duration (min)</Label>
                        <Input
                          theme={state.currentTheme}
                          type="number"
                          min="1"
                          max="30"
                          value={state.timerSettings.pomodoroBreakDuration}
                          onChange={(e) => handleTimerSettingChange('pomodoroBreakDuration', parseInt(e.target.value))}
                        />
                      </ControlRow>
                      <ControlRow>
                        <Label>Long Break (min)</Label>
                        <Input
                          theme={state.currentTheme}
                          type="number"
                          min="1"
                          max="60"
                          value={state.timerSettings.pomodoroLongBreakDuration}
                          onChange={(e) => handleTimerSettingChange('pomodoroLongBreakDuration', parseInt(e.target.value))}
                        />
                      </ControlRow>
                      <ControlRow>
                        <Label>Sessions Until Long Break</Label>
                        <Input
                          theme={state.currentTheme}
                          type="number"
                          min="2"
                          max="10"
                          value={state.timerSettings.pomodoroSessionsUntilLongBreak}
                          onChange={(e) => handleTimerSettingChange('pomodoroSessionsUntilLongBreak', parseInt(e.target.value))}
                        />
                      </ControlRow>
                    </ControlGroup>
                  </Section>
                )}

                {state.timerSettings.mode === 'custom' && (
                  <Section>
                    <SectionTitle>Custom Timer</SectionTitle>
                    <ControlGroup>
                      <ControlRow>
                        <Label>Duration (minutes)</Label>
                        <Input
                          theme={state.currentTheme}
                          type="number"
                          min="1"
                          max="300"
                          value={state.timerSettings.customDuration}
                          onChange={(e) => handleTimerSettingChange('customDuration', parseInt(e.target.value))}
                        />
                      </ControlRow>
                    </ControlGroup>
                  </Section>
                )}

                {state.timerSettings.mode === 'meditation' && (
                  <Section>
                    <SectionTitle>Meditation Timer</SectionTitle>
                    <ControlGroup>
                      <ControlRow>
                        <Label>Duration (minutes)</Label>
                        <Input
                          theme={state.currentTheme}
                          type="number"
                          min="1"
                          max="120"
                          value={state.timerSettings.meditationDuration}
                          onChange={(e) => handleTimerSettingChange('meditationDuration', parseInt(e.target.value))}
                        />
                      </ControlRow>
                    </ControlGroup>
                  </Section>
                )}
              </>
            )}

            {activeTab === 'breathing' && (
              <Section>
                <SectionTitle>Breathing Settings</SectionTitle>
                <ControlGroup>
                  <ControlRow>
                    <Label>Inhale Duration (seconds)</Label>
                    <Input
                      theme={state.currentTheme}
                      type="number"
                      min="2"
                      max="10"
                      value={state.timerSettings.breathingInDuration}
                      onChange={(e) => handleTimerSettingChange('breathingInDuration', parseInt(e.target.value))}
                    />
                  </ControlRow>
                  <ControlRow>
                    <Label>Hold Duration (seconds)</Label>
                    <Input
                      theme={state.currentTheme}
                      type="number"
                      min="0"
                      max="10"
                      value={state.timerSettings.breathingHoldDuration}
                      onChange={(e) => handleTimerSettingChange('breathingHoldDuration', parseInt(e.target.value))}
                    />
                  </ControlRow>
                  <ControlRow>
                    <Label>Exhale Duration (seconds)</Label>
                    <Input
                      theme={state.currentTheme}
                      type="number"
                      min="2"
                      max="10"
                      value={state.timerSettings.breathingOutDuration}
                      onChange={(e) => handleTimerSettingChange('breathingOutDuration', parseInt(e.target.value))}
                    />
                  </ControlRow>
                  <ControlRow>
                    <Label>Total Cycles</Label>
                    <Input
                      theme={state.currentTheme}
                      type="number"
                      min="5"
                      max="50"
                      value={state.breathingState.totalCycles}
                      onChange={(e) => dispatch({ 
                        type: 'UPDATE_BREATHING_STATE', 
                        payload: { totalCycles: parseInt(e.target.value) } 
                      })}
                    />
                  </ControlRow>
                </ControlGroup>
              </Section>
            )}

            {activeTab === 'sounds' && (
              <SoundPanel />
            )}
          </Panel>
        </>
      )}
    </AnimatePresence>
  );
}; 