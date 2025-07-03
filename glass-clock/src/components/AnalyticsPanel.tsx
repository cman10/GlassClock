import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const AnalyticsContainer = styled(motion.div)<{ theme: any }>`
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

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
`;

const TimeRangeButton = styled.button<{ theme: any; active: boolean }>`
  background: ${props => props.active ? props.theme.accentColor : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.textColor};
  border: 2px solid ${props => props.theme.accentColor};
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.theme.accentColor};
    color: white;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const Card = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 25px;
`;

const CardTitle = styled.h3<{ theme: any }>`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: ${props => props.theme.textColor};
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
`;

const MetricValue = styled.div<{ theme: any }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.accentColor};
  margin-bottom: 5px;
`;

const MetricLabel = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
`;

const MetricChange = styled.div<{ positive: boolean; theme: any }>`
  font-size: 0.8rem;
  color: ${props => props.positive ? '#4ade80' : '#f87171'};
  margin-top: 5px;
`;

const ChartContainer = styled.div<{ theme: any }>`
  height: 200px;
  position: relative;
  margin-top: 20px;
`;

const BarChart = styled.div`
  display: flex;
  align-items: end;
  height: 100%;
  gap: 8px;
  padding: 10px 0;
`;

const Bar = styled(motion.div)<{ height: number; theme: any }>`
  flex: 1;
  background: linear-gradient(to top, ${props => props.theme.accentColor}, ${props => props.theme.accentColor}80);
  border-radius: 4px 4px 0 0;
  height: ${props => props.height}%;
  min-height: 2px;
  position: relative;
  cursor: pointer;

  &:hover::after {
    content: '${props => Math.round(props.height)}%';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    white-space: nowrap;
  }
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(24, 1fr);
  gap: 2px;
  margin-top: 20px;
`;

const HeatmapCell = styled.div<{ intensity: number; theme: any }>`
  aspect-ratio: 1;
  border-radius: 2px;
  background: ${props => 
    props.intensity === 0 ? 'rgba(255, 255, 255, 0.1)' :
    `${props.theme.accentColor}${Math.round(props.intensity * 255).toString(16).padStart(2, '0')}`
  };
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const InsightsList = styled.div`
  margin-top: 20px;
`;

const Insight = styled.div<{ theme: any }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const InsightIcon = styled.div<{ type: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => 
    props.type === 'positive' ? '#4ade80' :
    props.type === 'negative' ? '#f87171' :
    '#fbbf24'
  };
`;

const InsightText = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.9;
`;

const ProductivityScore = styled.div<{ theme: any }>`
  text-align: center;
  margin-bottom: 20px;
`;

const ScoreCircle = styled.div<{ score: number; theme: any }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: conic-gradient(
    ${props => props.theme.accentColor} ${props => props.score * 3.6}deg,
    rgba(255, 255, 255, 0.1) 0deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background: ${props => props.theme.background};
  }
`;

const ScoreValue = styled.div<{ theme: any }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.accentColor};
  z-index: 1;
`;

const ScoreLabel = styled.div<{ theme: any }>`
  font-size: 0.9rem;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
`;

const timeRanges = [
  { key: 'today', label: 'Today' },
  { key: '7days', label: '7 Days' },
  { key: '30days', label: '30 Days' },
  { key: '90days', label: '90 Days' }
];

export const AnalyticsPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedRange, setSelectedRange] = useState('7days');

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
  };

  // Mock analytics data (in a real app, this would come from actual usage data)
  const analytics = useMemo(() => {
    const now = Date.now();
    const days = selectedRange === 'today' ? 1 : 
                 selectedRange === '7days' ? 7 :
                 selectedRange === '30days' ? 30 : 90;

    const dailyStats = Array.from({ length: days }, (_, i) => {
      const date = new Date(now - (days - 1 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toISOString().split('T')[0],
        totalFocusTime: Math.floor(Math.random() * 480) + 60, // 1-8 hours
        sessionsCompleted: Math.floor(Math.random() * 12) + 1,
        averageSessionDuration: Math.floor(Math.random() * 20) + 25, // 25-45 min
        mostProductiveHour: Math.floor(Math.random() * 8) + 9, // 9am-5pm
        distractionCount: Math.floor(Math.random() * 5),
        mood: ['great', 'good', 'okay', 'poor'][Math.floor(Math.random() * 4)] as any
      };
    });

    const totalFocusTime = dailyStats.reduce((sum, day) => sum + day.totalFocusTime, 0);
    const totalSessions = dailyStats.reduce((sum, day) => sum + day.sessionsCompleted, 0);
    const avgSessionDuration = totalSessions > 0 ? totalFocusTime / totalSessions : 0;

    const productivityScore = Math.min(100, Math.round(
      (totalFocusTime / (days * 240)) * 40 + // 40% for focus time (4hrs/day target)
      (totalSessions / (days * 6)) * 30 + // 30% for sessions (6/day target)
      ((avgSessionDuration - 25) / 20) * 30 // 30% for session quality
    ));

    const focusPatterns = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      averageFocus: Math.floor(Math.random() * 60) + 20,
      sessionCount: Math.floor(Math.random() * days * 2),
      productivity: Math.floor(Math.random() * 100)
    }));

    const insights = [
      {
        type: 'positive',
        text: `Your best focus time is ${focusPatterns.reduce((best, current) => 
          current.productivity > best.productivity ? current : best
        ).hour}:00 - ${focusPatterns.reduce((best, current) => 
          current.productivity > best.productivity ? current : best
        ).hour + 1}:00`
      },
      {
        type: selectedRange === 'today' ? 'neutral' : 
              totalFocusTime > (days * 180) ? 'positive' : 'negative',
        text: `You've completed ${Math.round(totalFocusTime / 60)} hours of focused work this ${
          selectedRange === 'today' ? 'day' : 'period'
        }`
      },
      {
        type: avgSessionDuration > 35 ? 'positive' : 'neutral',
        text: `Average session duration: ${Math.round(avgSessionDuration)} minutes`
      },
      {
        type: 'neutral',
        text: `Most productive on ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][
          Math.floor(Math.random() * 5)
        ]}s`
      }
    ];

    return {
      dailyStats,
      totalFocusTime,
      totalSessions,
      avgSessionDuration,
      productivityScore,
      focusPatterns,
      insights,
      streakData: {
        current: Math.floor(Math.random() * 15) + 1,
        longest: Math.floor(Math.random() * 30) + 10,
        weekly: Math.floor(Math.random() * 4) + 1,
        monthly: Math.floor(Math.random() * 20) + 5
      }
    };
  }, [selectedRange]);

  const chartData = analytics.dailyStats.map(day => ({
    label: new Date(day.date).getDate().toString(),
    value: Math.round((day.totalFocusTime / 480) * 100) // Percentage of 8-hour target
  }));

  return (
    <AnalyticsContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <Title theme={state.currentTheme}>Analytics</Title>
        <BackButton theme={state.currentTheme} onClick={handleBack}>
          ←
        </BackButton>
      </Header>

      <TimeRangeSelector>
        {timeRanges.map((range) => (
          <TimeRangeButton
            key={range.key}
            theme={state.currentTheme}
            active={selectedRange === range.key}
            onClick={() => setSelectedRange(range.key)}
          >
            {range.label}
          </TimeRangeButton>
        ))}
      </TimeRangeSelector>

      <MetricGrid>
        <MetricCard theme={state.currentTheme}>
          <MetricValue theme={state.currentTheme}>
            {Math.round(analytics.totalFocusTime / 60)}h
          </MetricValue>
          <MetricLabel theme={state.currentTheme}>Total Focus Time</MetricLabel>
          <MetricChange positive={true} theme={state.currentTheme}>
            +12% from last period
          </MetricChange>
        </MetricCard>

        <MetricCard theme={state.currentTheme}>
          <MetricValue theme={state.currentTheme}>
            {analytics.totalSessions}
          </MetricValue>
          <MetricLabel theme={state.currentTheme}>Sessions Completed</MetricLabel>
          <MetricChange positive={true} theme={state.currentTheme}>
            +8% from last period
          </MetricChange>
        </MetricCard>

        <MetricCard theme={state.currentTheme}>
          <MetricValue theme={state.currentTheme}>
            {Math.round(analytics.avgSessionDuration)}m
          </MetricValue>
          <MetricLabel theme={state.currentTheme}>Avg Session Length</MetricLabel>
          <MetricChange positive={false} theme={state.currentTheme}>
            -3% from last period
          </MetricChange>
        </MetricCard>

        <MetricCard theme={state.currentTheme}>
          <MetricValue theme={state.currentTheme}>
            {analytics.streakData.current}
          </MetricValue>
          <MetricLabel theme={state.currentTheme}>Current Streak</MetricLabel>
          <MetricChange positive={true} theme={state.currentTheme}>
            Longest: {analytics.streakData.longest} days
          </MetricChange>
        </MetricCard>
      </MetricGrid>

      <Grid>
        <Card theme={state.currentTheme}>
          <CardTitle theme={state.currentTheme}>
            🎯 Productivity Score
          </CardTitle>
          <ProductivityScore theme={state.currentTheme}>
            <ScoreCircle score={analytics.productivityScore} theme={state.currentTheme}>
              <ScoreValue theme={state.currentTheme}>
                {analytics.productivityScore}
              </ScoreValue>
            </ScoreCircle>
            <ScoreLabel theme={state.currentTheme}>
              {analytics.productivityScore >= 80 ? 'Excellent' :
               analytics.productivityScore >= 60 ? 'Good' :
               analytics.productivityScore >= 40 ? 'Average' : 'Needs Improvement'}
            </ScoreLabel>
          </ProductivityScore>
        </Card>

        <Card theme={state.currentTheme}>
          <CardTitle theme={state.currentTheme}>
            📊 Daily Progress
          </CardTitle>
          <ChartContainer theme={state.currentTheme}>
            <BarChart>
              {chartData.map((data, index) => (
                <Bar
                  key={index}
                  height={data.value}
                  theme={state.currentTheme}
                  initial={{ height: 0 }}
                  animate={{ height: data.value }}
                  transition={{ delay: index * 0.1 }}
                />
              ))}
            </BarChart>
          </ChartContainer>
        </Card>

        <Card theme={state.currentTheme}>
          <CardTitle theme={state.currentTheme}>
            🔥 Focus Heatmap
          </CardTitle>
          <HeatmapGrid>
            {analytics.focusPatterns.map((pattern, index) => (
              <HeatmapCell
                key={index}
                intensity={pattern.productivity / 100}
                theme={state.currentTheme}
                title={`${pattern.hour}:00 - ${pattern.productivity}% productivity`}
              />
            ))}
          </HeatmapGrid>
        </Card>

        <Card theme={state.currentTheme}>
          <CardTitle theme={state.currentTheme}>
            💡 Insights
          </CardTitle>
          <InsightsList>
            {analytics.insights.map((insight, index) => (
              <Insight key={index} theme={state.currentTheme}>
                <InsightIcon type={insight.type} />
                <InsightText theme={state.currentTheme}>
                  {insight.text}
                </InsightText>
              </Insight>
            ))}
          </InsightsList>
        </Card>
      </Grid>
    </AnalyticsContainer>
  );
}; 