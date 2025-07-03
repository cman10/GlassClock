import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const StatsContainer = styled(motion.div)<{ theme: any }>`
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
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
`;

const BackButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  color: ${props => props.theme.textColor};
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 5px;
  border-radius: 4px;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div<{ theme: any }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.theme.accentColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

const StatValue = styled.div<{ theme: any }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.accentColor};
  margin-bottom: 5px;
  line-height: 1;
`;

const StatLabel = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
  margin-bottom: 10px;
`;

const StatDescription = styled.div<{ theme: any }>`
  font-size: 0.8rem;
  color: ${props => props.theme.textColor};
  opacity: 0.6;
  line-height: 1.4;
`;

const ProgressSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h3<{ theme: any }>`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: center;
  gap: 10px;

  &::before {
    content: '';
    width: 4px;
    height: 20px;
    background: ${props => props.theme.accentColor};
    border-radius: 2px;
  }
`;

const ProgressCard = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const ProgressLabel = styled.div<{ theme: any }>`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.theme.textColor};
`;

const ProgressValue = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.accentColor};
  font-weight: 600;
`;

const ProgressBar = styled.div<{ theme: any }>`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)<{ theme: any; percentage: number }>`
  height: 100%;
  background: ${props => props.theme.accentColor};
  border-radius: 4px;
  width: ${props => props.percentage}%;
`;

const AchievementSection = styled.div`
  margin-bottom: 30px;
`;

const AchievementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

const Achievement = styled(motion.div)<{ theme: any; unlocked: boolean }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
  opacity: ${props => props.unlocked ? 1 : 0.5};
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`;

const AchievementIcon = styled.div<{ unlocked: boolean }>`
  font-size: 2rem;
  margin-bottom: 10px;
  filter: ${props => props.unlocked ? 'none' : 'grayscale(100%)'};
`;

const AchievementTitle = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.textColor};
  margin-bottom: 5px;
`;

const AchievementDesc = styled.div<{ theme: any }>`
  font-size: 0.75rem;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
`;

const ChartSection = styled.div`
  margin-bottom: 30px;
`;

const SimpleChart = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  height: 200px;
  display: flex;
  align-items: end;
  justify-content: space-around;
  gap: 5px;
`;

const ChartBar = styled(motion.div)<{ theme: any; height: number }>`
  flex: 1;
  background: ${props => props.theme.accentColor};
  border-radius: 4px 4px 0 0;
  height: ${props => props.height}%;
  min-height: 2px;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

const ChartLabels = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  padding: 0 20px;
`;

const ChartLabel = styled.div<{ theme: any }>`
  font-size: 0.8rem;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
  text-align: center;
  flex: 1;
`;

export const StatsPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsageHours = Math.floor(state.totalUsageTime / 3600);
    const totalSessions = state.timerState.totalSessionsToday + state.timerState.completedSessions;
    const currentStreak = state.timerState.streak;
    const focusTime = Math.floor(state.timerState.totalFocusTime / 60); // in minutes
    
    return {
      totalUsageHours,
      totalSessions,
      currentStreak,
      focusTime,
      customThemes: state.customThemes.length,
      featureUsage: state.featureUsage,
    };
  }, [state]);

  // Mock weekly data for chart
  const weeklyData = [
    { day: 'Mon', value: 45 },
    { day: 'Tue', value: 32 },
    { day: 'Wed', value: 78 },
    { day: 'Thu', value: 62 },
    { day: 'Fri', value: 91 },
    { day: 'Sat', value: 38 },
    { day: 'Sun', value: 55 },
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  // Achievements system
  const achievements = [
    {
      id: 'first_session',
      title: 'Getting Started',
      description: 'Complete your first timer session',
      icon: '🎯',
      unlocked: stats.totalSessions > 0,
    },
    {
      id: 'streak_3',
      title: 'Consistent',
      description: 'Maintain a 3-day streak',
      icon: '🔥',
      unlocked: stats.currentStreak >= 3,
    },
    {
      id: 'focus_master',
      title: 'Focus Master',
      description: 'Accumulate 10 hours of focus time',
      icon: '🧠',
      unlocked: stats.focusTime >= 600, // 10 hours in minutes
    },
    {
      id: 'theme_creator',
      title: 'Theme Creator',
      description: 'Create your first custom theme',
      icon: '🎨',
      unlocked: stats.customThemes > 0,
    },
    {
      id: 'power_user',
      title: 'Power User',
      description: 'Use the app for 50+ hours',
      icon: '⚡',
      unlocked: stats.totalUsageHours >= 50,
    },
    {
      id: 'zen_master',
      title: 'Zen Master',
      description: 'Complete 100 meditation sessions',
      icon: '🧘',
      unlocked: (state.featureUsage.meditation || 0) >= 100,
    },
  ];

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
  };

  return (
    <StatsContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <BackButton theme={state.currentTheme} onClick={handleBack}>
            ←
          </BackButton>
          <Title>Usage Statistics</Title>
        </div>
      </Header>

      <StatsGrid>
        <StatCard
          theme={state.currentTheme}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon theme={state.currentTheme}>⏱️</StatIcon>
          <StatValue theme={state.currentTheme}>{stats.totalUsageHours}</StatValue>
          <StatLabel theme={state.currentTheme}>Total Hours</StatLabel>
          <StatDescription theme={state.currentTheme}>
            Time spent using the relaxing clock
          </StatDescription>
        </StatCard>

        <StatCard
          theme={state.currentTheme}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon theme={state.currentTheme}>🎯</StatIcon>
          <StatValue theme={state.currentTheme}>{stats.totalSessions}</StatValue>
          <StatLabel theme={state.currentTheme}>Total Sessions</StatLabel>
          <StatDescription theme={state.currentTheme}>
            Timer and meditation sessions completed
          </StatDescription>
        </StatCard>

        <StatCard
          theme={state.currentTheme}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon theme={state.currentTheme}>🔥</StatIcon>
          <StatValue theme={state.currentTheme}>{stats.currentStreak}</StatValue>
          <StatLabel theme={state.currentTheme}>Current Streak</StatLabel>
          <StatDescription theme={state.currentTheme}>
            Consecutive days with completed sessions
          </StatDescription>
        </StatCard>

        <StatCard
          theme={state.currentTheme}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <StatIcon theme={state.currentTheme}>🧠</StatIcon>
          <StatValue theme={state.currentTheme}>{stats.focusTime}</StatValue>
          <StatLabel theme={state.currentTheme}>Focus Minutes</StatLabel>
          <StatDescription theme={state.currentTheme}>
            Total time spent in focused work sessions
          </StatDescription>
        </StatCard>
      </StatsGrid>

      <ProgressSection>
        <SectionTitle theme={state.currentTheme}>Daily Goals</SectionTitle>
        
        <ProgressCard theme={state.currentTheme}>
          <ProgressHeader>
            <ProgressLabel theme={state.currentTheme}>Daily Focus Goal</ProgressLabel>
            <ProgressValue theme={state.currentTheme}>
              {Math.min(stats.focusTime % 480, 480)}/480 min
            </ProgressValue>
          </ProgressHeader>
          <ProgressBar theme={state.currentTheme}>
            <ProgressFill
              theme={state.currentTheme}
              percentage={Math.min((stats.focusTime % 480) / 480 * 100, 100)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((stats.focusTime % 480) / 480 * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </ProgressBar>
        </ProgressCard>

        <ProgressCard theme={state.currentTheme}>
          <ProgressHeader>
            <ProgressLabel theme={state.currentTheme}>Session Goal</ProgressLabel>
            <ProgressValue theme={state.currentTheme}>
              {Math.min(state.timerState.totalSessionsToday, 8)}/8 sessions
            </ProgressValue>
          </ProgressHeader>
          <ProgressBar theme={state.currentTheme}>
            <ProgressFill
              theme={state.currentTheme}
              percentage={Math.min(state.timerState.totalSessionsToday / 8 * 100, 100)}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(state.timerState.totalSessionsToday / 8 * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </ProgressBar>
        </ProgressCard>
      </ProgressSection>

      <ChartSection>
        <SectionTitle theme={state.currentTheme}>Weekly Activity</SectionTitle>
        <SimpleChart theme={state.currentTheme}>
          {weeklyData.map((data, index) => (
            <ChartBar
              key={data.day}
              theme={state.currentTheme}
              height={(data.value / maxValue) * 100}
              initial={{ height: 0 }}
              animate={{ height: `${(data.value / maxValue) * 100}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          ))}
        </SimpleChart>
        <ChartLabels>
          {weeklyData.map((data) => (
            <ChartLabel key={data.day} theme={state.currentTheme}>
              {data.day}
            </ChartLabel>
          ))}
        </ChartLabels>
      </ChartSection>

      <AchievementSection>
        <SectionTitle theme={state.currentTheme}>Achievements</SectionTitle>
        <AchievementGrid>
          {achievements.map((achievement) => (
            <Achievement
              key={achievement.id}
              theme={state.currentTheme}
              unlocked={achievement.unlocked}
              whileHover={{ scale: achievement.unlocked ? 1.05 : 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <AchievementIcon unlocked={achievement.unlocked}>
                {achievement.icon}
              </AchievementIcon>
              <AchievementTitle theme={state.currentTheme}>
                {achievement.title}
              </AchievementTitle>
              <AchievementDesc theme={state.currentTheme}>
                {achievement.description}
              </AchievementDesc>
            </Achievement>
          ))}
        </AchievementGrid>
      </AchievementSection>
    </StatsContainer>
  );
}; 