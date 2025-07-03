import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Integration } from '../types';

const IntegrationsContainer = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1<{ theme: any }>`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  color: ${props => props.theme.textColor};
`;

const BackButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  color: ${props => props.theme.textColor};
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const IntegrationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
`;

const IntegrationCard = styled(motion.div)<{ theme: any; enabled: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.enabled ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  padding: 25px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.accentColor};
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const IntegrationHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const IntegrationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IntegrationIcon = styled.div<{ theme: any }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.theme.accentColor}20;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

const IntegrationDetails = styled.div``;

const IntegrationName = styled.h3<{ theme: any }>`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  color: ${props => props.theme.textColor};
`;

const IntegrationType = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ToggleSwitch = styled.div<{ enabled: boolean; theme: any }>`
  width: 50px;
  height: 28px;
  border-radius: 14px;
  background: ${props => props.enabled ? props.theme.accentColor : 'rgba(255, 255, 255, 0.2)'};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    background: white;
    top: 2px;
    left: ${props => props.enabled ? '24px' : '2px'};
    transition: all 0.3s ease;
  }
`;

const IntegrationDescription = styled.p<{ theme: any }>`
  color: ${props => props.theme.textColor};
  opacity: 0.8;
  line-height: 1.5;
  margin-bottom: 20px;
  font-size: 0.95rem;
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
`;

const Feature = styled.li<{ theme: any }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.9;

  &::before {
    content: '✓';
    color: ${props => props.theme.accentColor};
    font-weight: bold;
    margin-right: 10px;
    font-size: 1rem;
  }
`;

const PremiumBadge = styled.div<{ theme: any }>`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${props => props.theme.accentColor};
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ConfigSection = styled.div<{ theme: any }>`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ConfigTitle = styled.h4<{ theme: any }>`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: ${props => props.theme.textColor};
`;

const ConfigItem = styled.div`
  margin-bottom: 15px;
`;

const ConfigLabel = styled.label<{ theme: any }>`
  display: block;
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
  margin-bottom: 5px;
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

  &::placeholder {
    color: ${props => props.theme.textColor};
    opacity: 0.5;
  }
`;

const ConfigSelect = styled.select<{ theme: any }>`
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

  option {
    background: ${props => props.theme.background};
    color: ${props => props.theme.textColor};
  }
`;

const ActionButton = styled(motion.button)<{ theme: any; variant?: 'primary' | 'secondary' }>`
  background: ${props => props.variant === 'primary' ? props.theme.accentColor : 'transparent'};
  color: ${props => props.variant === 'primary' ? 'white' : props.theme.accentColor};
  border: 2px solid ${props => props.theme.accentColor};
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 10px;

  &:hover {
    background: ${props => props.theme.accentColor};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusIndicator = styled.div<{ status: 'connected' | 'disconnected' | 'error'; theme: any }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  margin-top: 10px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => 
      props.status === 'connected' ? '#4ade80' :
      props.status === 'error' ? '#f87171' :
      '#6b7280'
    };
  }
`;

const availableIntegrations: Integration[] = [
  {
    id: 'weather',
    name: 'Weather',
    type: 'weather',
    enabled: false,
    isPremium: false,
    settings: {
      location: '',
      units: 'metric',
      showInClock: true
    }
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    type: 'calendar',
    enabled: false,
    isPremium: true,
    settings: {
      calendarId: '',
      syncEnabled: true,
      showUpcoming: true,
      reminderMinutes: 15
    }
  },
  {
    id: 'spotify',
    name: 'Spotify',
    type: 'music',
    enabled: false,
    isPremium: true,
    settings: {
      autoPlay: false,
      focusPlaylists: [],
      volume: 70
    }
  },
  {
    id: 'push-notifications',
    name: 'Smart Notifications',
    type: 'notifications',
    enabled: false,
    isPremium: false,
    settings: {
      breakReminders: true,
      motivationalMessages: true,
      weeklyReports: true,
      quietHours: { start: '22:00', end: '08:00' }
    }
  },
  {
    id: 'apple-health',
    name: 'Apple Health',
    type: 'wellness',
    enabled: false,
    isPremium: true,
    settings: {
      trackMindfulness: true,
      heartRateMonitoring: false,
      sleepData: true
    }
  },
  {
    id: 'slack',
    name: 'Slack Status',
    type: 'notifications',
    enabled: false,
    isPremium: true,
    settings: {
      autoStatus: true,
      focusMessage: '🎯 In focus mode',
      breakMessage: '☕ Taking a break'
    }
  }
];

const integrationFeatures = {
  weather: [
    'Current weather display in clock',
    'Location-based forecasts',
    'Temperature and conditions',
    'UV index and air quality'
  ],
  'google-calendar': [
    'Sync upcoming events',
    'Smart break scheduling',
    'Meeting reminders',
    'Focus time blocking'
  ],
  spotify: [
    'Focus playlist integration',
    'Ambient music suggestions',
    'Automatic volume control',
    'Session-based recommendations'
  ],
  'push-notifications': [
    'Break reminders',
    'Motivational messages',
    'Weekly progress reports',
    'Smart quiet hours'
  ],
  'apple-health': [
    'Mindfulness session tracking',
    'Heart rate monitoring',
    'Sleep quality correlation',
    'Wellness insights'
  ],
  slack: [
    'Automatic status updates',
    'Focus mode indicators',
    'Break announcements',
    'Do not disturb sync'
  ]
};

export const IntegrationsPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [integrations, setIntegrations] = useState(availableIntegrations);

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
  };

  const toggleIntegration = (integrationId: string) => {
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    // Check if premium feature
    if (integration.isPremium && !state.subscription?.status) {
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: `premium-required-${Date.now()}`,
        type: 'premium',
        title: 'Premium Feature',
        message: `${integration.name} integration requires a premium subscription.`,
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

    setIntegrations(prev => prev.map(i => 
      i.id === integrationId ? { ...i, enabled: !i.enabled } : i
    ));

    // Mock connection process
    setTimeout(() => {
      if (integrationId === 'weather') {
        // Mock weather data
        dispatch({ type: 'UPDATE_WEATHER', payload: {
          location: 'San Francisco, CA',
          temperature: 22,
          condition: 'Partly Cloudy',
          icon: '⛅',
          humidity: 65,
          windSpeed: 12,
          uvIndex: 4,
          timestamp: Date.now()
        }});
      }

      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: `integration-${integrationId}-${Date.now()}`,
        type: 'success',
        title: 'Integration Connected',
        message: `${integration.name} has been successfully connected.`,
        timestamp: Date.now(),
        read: false
      }});
    }, 2000);
  };

  const updateIntegrationSetting = (integrationId: string, key: string, value: any) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integrationId 
        ? { ...i, settings: { ...i.settings, [key]: value } }
        : i
    ));
  };

  const isPremiumUser = state.subscription?.status === 'active' || state.subscription?.status === 'trial';

  return (
    <IntegrationsContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title theme={state.currentTheme}>Integrations</Title>
        <BackButton theme={state.currentTheme} onClick={handleBack}>
          ←
        </BackButton>
      </Header>

      <IntegrationsGrid>
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            theme={state.currentTheme}
            enabled={integration.enabled}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            {integration.isPremium && (
              <PremiumBadge theme={state.currentTheme}>
                Premium
              </PremiumBadge>
            )}

            <IntegrationHeader>
              <IntegrationInfo>
                <IntegrationIcon theme={state.currentTheme}>
                  {integration.type === 'weather' && '🌤️'}
                  {integration.type === 'calendar' && '📅'}
                  {integration.type === 'music' && '🎵'}
                  {integration.type === 'notifications' && '🔔'}
                  {integration.type === 'wellness' && '💚'}
                </IntegrationIcon>
                <IntegrationDetails>
                  <IntegrationName theme={state.currentTheme}>
                    {integration.name}
                  </IntegrationName>
                  <IntegrationType theme={state.currentTheme}>
                    {integration.type}
                  </IntegrationType>
                </IntegrationDetails>
              </IntegrationInfo>
              
              <ToggleSwitch
                enabled={integration.enabled}
                theme={state.currentTheme}
                onClick={() => toggleIntegration(integration.id)}
              />
            </IntegrationHeader>

            <IntegrationDescription theme={state.currentTheme}>
              {integration.type === 'weather' && 'Get real-time weather information displayed alongside your clock and receive weather-based ambient sound suggestions.'}
              {integration.type === 'calendar' && 'Sync your calendar events to automatically schedule focus sessions and smart breaks around your meetings.'}
              {integration.type === 'music' && 'Connect your music streaming service for curated focus playlists and automatic ambient sound mixing.'}
              {integration.type === 'notifications' && 'Receive intelligent notifications about your productivity patterns, break reminders, and motivational messages.'}
              {integration.type === 'wellness' && 'Track your meditation sessions and mindfulness data to correlate with productivity and wellness metrics.'}
            </IntegrationDescription>

            <FeaturesList>
              {integrationFeatures[integration.id as keyof typeof integrationFeatures]?.map((feature, index) => (
                <Feature key={index} theme={state.currentTheme}>
                  {feature}
                </Feature>
              ))}
            </FeaturesList>

            {integration.enabled && (
              <ConfigSection theme={state.currentTheme}>
                <ConfigTitle theme={state.currentTheme}>Configuration</ConfigTitle>
                
                {integration.type === 'weather' && (
                  <>
                    <ConfigItem>
                      <ConfigLabel theme={state.currentTheme}>Location</ConfigLabel>
                      <ConfigInput
                        theme={state.currentTheme}
                        type="text"
                        placeholder="Enter your location"
                        value={integration.settings.location || ''}
                        onChange={(e) => updateIntegrationSetting(integration.id, 'location', e.target.value)}
                      />
                    </ConfigItem>
                    <ConfigItem>
                      <ConfigLabel theme={state.currentTheme}>Units</ConfigLabel>
                      <ConfigSelect
                        theme={state.currentTheme}
                        value={integration.settings.units || 'metric'}
                        onChange={(e) => updateIntegrationSetting(integration.id, 'units', e.target.value)}
                      >
                        <option value="metric">Celsius</option>
                        <option value="imperial">Fahrenheit</option>
                      </ConfigSelect>
                    </ConfigItem>
                  </>
                )}

                {integration.type === 'calendar' && (
                  <>
                    <ConfigItem>
                      <ConfigLabel theme={state.currentTheme}>Calendar ID</ConfigLabel>
                      <ConfigInput
                        theme={state.currentTheme}
                        type="text"
                        placeholder="your-calendar@gmail.com"
                        value={integration.settings.calendarId || ''}
                        onChange={(e) => updateIntegrationSetting(integration.id, 'calendarId', e.target.value)}
                      />
                    </ConfigItem>
                    <ConfigItem>
                      <ConfigLabel theme={state.currentTheme}>Reminder (minutes before)</ConfigLabel>
                      <ConfigSelect
                        theme={state.currentTheme}
                        value={integration.settings.reminderMinutes || 15}
                        onChange={(e) => updateIntegrationSetting(integration.id, 'reminderMinutes', parseInt(e.target.value))}
                      >
                        <option value={5}>5 minutes</option>
                        <option value={10}>10 minutes</option>
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                      </ConfigSelect>
                    </ConfigItem>
                  </>
                )}

                {integration.type === 'notifications' && (
                  <>
                    <ConfigItem>
                      <ConfigLabel theme={state.currentTheme}>Quiet Hours Start</ConfigLabel>
                      <ConfigInput
                        theme={state.currentTheme}
                        type="time"
                        value={integration.settings.quietHours?.start || '22:00'}
                        onChange={(e) => updateIntegrationSetting(integration.id, 'quietHours', {
                          ...integration.settings.quietHours,
                          start: e.target.value
                        })}
                      />
                    </ConfigItem>
                    <ConfigItem>
                      <ConfigLabel theme={state.currentTheme}>Quiet Hours End</ConfigLabel>
                      <ConfigInput
                        theme={state.currentTheme}
                        type="time"
                        value={integration.settings.quietHours?.end || '08:00'}
                        onChange={(e) => updateIntegrationSetting(integration.id, 'quietHours', {
                          ...integration.settings.quietHours,
                          end: e.target.value
                        })}
                      />
                    </ConfigItem>
                  </>
                )}

                <div style={{ marginTop: '20px' }}>
                  <ActionButton
                    theme={state.currentTheme}
                    variant="primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Test Connection
                  </ActionButton>
                  <ActionButton
                    theme={state.currentTheme}
                    variant="secondary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </ActionButton>
                </div>

                <StatusIndicator status="connected" theme={state.currentTheme}>
                  Connected and syncing
                </StatusIndicator>
              </ConfigSection>
            )}

            {!integration.enabled && integration.isPremium && !isPremiumUser && (
              <div style={{ marginTop: '20px' }}>
                <ActionButton
                  theme={state.currentTheme}
                  variant="primary"
                  onClick={() => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'premium' })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Upgrade to Premium
                </ActionButton>
              </div>
            )}
          </IntegrationCard>
        ))}
      </IntegrationsGrid>
    </IntegrationsContainer>
  );
}; 