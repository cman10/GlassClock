import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { advancedAnalyticsService } from '../services/advancedAnalyticsService';
import {
  AdvancedAnalytics,
  AnalyticsInsight,
  PredictiveInsight,
  BehaviorPattern,
  PerformanceMetrics,
  SmartRecommendation
} from '../types';

const DashboardContainer = styled.div<{ theme: any }>`
  width: 100%;
  height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 10px;
`;

const TimeRangeButton = styled(motion.button)<{ theme: any; active: boolean }>`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? props.theme.accentColor : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.active ? props.theme.accentColor : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.textColor};
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
`;

const MetricTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  opacity: 0.9;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MetricChange = styled.div<{ direction: 'up' | 'down' | 'stable' }>`
  font-size: 0.9rem;
  color: ${props => 
    props.direction === 'up' ? '#4CAF50' : 
    props.direction === 'down' ? '#F44336' : '#FFC107'
  };
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '${props => 
      props.direction === 'up' ? '↗' : 
      props.direction === 'down' ? '↘' : '→'
    }';
  }
`;

const SectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const InsightCard = styled(motion.div)<{ theme: any; impact: 'high' | 'medium' | 'low' }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => 
    props.impact === 'high' ? '#4CAF50' : 
    props.impact === 'medium' ? '#FFC107' : '#2196F3'
  };
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => 
      props.impact === 'high' ? '#4CAF50' : 
      props.impact === 'medium' ? '#FFC107' : '#2196F3'
    };
    border-radius: 4px 0 0 4px;
  }
`;

const InsightTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: ${props => props.color || 'inherit'};
`;

const InsightDescription = styled.p`
  font-size: 0.9rem;
  margin: 0 0 12px 0;
  opacity: 0.8;
  line-height: 1.4;
`;

const ConfidenceBar = styled.div<{ confidence: number; theme: any }>`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;

  &::after {
    content: '';
    display: block;
    width: ${props => props.confidence}%;
    height: 100%;
    background: linear-gradient(90deg, #4CAF50, #2196F3);
    transition: width 0.3s ease;
  }
`;

const ConfidenceText = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
`;

const PredictionCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(103, 126, 234, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  position: relative;

  &::before {
    content: '🔮';
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.2rem;
  }
`;

const PredictionText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 12px;
  color: #667eea;
`;

const FactorsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const Factor = styled.span<{ impact: 'positive' | 'negative' | 'neutral' }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  background: ${props => 
    props.impact === 'positive' ? 'rgba(76, 175, 80, 0.2)' : 
    props.impact === 'negative' ? 'rgba(244, 67, 54, 0.2)' : 
    'rgba(255, 193, 7, 0.2)'
  };
  color: ${props => 
    props.impact === 'positive' ? '#4CAF50' : 
    props.impact === 'negative' ? '#F44336' : '#FFC107'
  };
`;

const PatternCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(118, 75, 162, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const PatternStrength = styled.div<{ strength: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const StrengthBar = styled.div<{ strength: number }>`
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.strength}%;
    height: 100%;
    background: linear-gradient(90deg, #764ba2, #667eea);
    transition: width 0.3s ease;
  }
`;

const RecommendationCard = styled(motion.div)<{ theme: any; urgency: 'low' | 'medium' | 'high' | 'critical' }>`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => 
    props.urgency === 'critical' ? '#F44336' : 
    props.urgency === 'high' ? '#FF9800' : 
    props.urgency === 'medium' ? '#FFC107' : '#4CAF50'
  };
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

const UrgencyBadge = styled.span<{ urgency: 'low' | 'medium' | 'high' | 'critical' }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => 
    props.urgency === 'critical' ? '#F44336' : 
    props.urgency === 'high' ? '#FF9800' : 
    props.urgency === 'medium' ? '#FFC107' : '#4CAF50'
  };
  color: white;
  text-transform: uppercase;
`;

const ActionButton = styled(motion.button)<{ theme: any }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.accentColor};
  background: transparent;
  color: ${props => props.theme.accentColor};
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.accentColor};
    color: white;
  }
`;

const LoadingSpinner = styled(motion.div)<{ theme: any }>`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid ${props => props.theme.accentColor};
  border-radius: 50%;
  margin: 40px auto;
`;

const AdvancedAnalyticsDashboard: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'year'>('week');
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [timeRange]);

  const generateAnalytics = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const analyticsData = advancedAnalyticsService.generateAdvancedAnalytics(
        timeRange,
        {
          userId: 'user-1',
          focusHistory: state.focusHistory,
          moodEntries: state.moodEntries,
          habitIntelligence: state.habitIntelligence,
          timerState: state.timerState,
          breathingState: state.breathingState
        }
      );
      
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to generate analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyRecommendation = (recommendation: SmartRecommendation) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notification-${Date.now()}`,
        type: 'success',
        title: 'Recommendation Applied',
        message: `Started implementing: ${recommendation.title}`,
        timestamp: Date.now(),
        read: false
      }
    });
  };

  if (loading) {
    return (
      <DashboardContainer theme={state.currentTheme}>
        <Header>
          <Title>Advanced Analytics</Title>
        </Header>
        <LoadingSpinner
          theme={state.currentTheme}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </DashboardContainer>
    );
  }

  if (!analytics) {
    return (
      <DashboardContainer theme={state.currentTheme}>
        <Header>
          <Title>Advanced Analytics</Title>
        </Header>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p>Failed to load analytics data. Please try again.</p>
          <ActionButton
            theme={state.currentTheme}
            onClick={generateAnalytics}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Retry
          </ActionButton>
        </div>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer theme={state.currentTheme}>
      <Header>
        <Title>Advanced Analytics</Title>
        <TimeRangeSelector>
          {(['day', 'week', 'month', 'quarter', 'year'] as const).map((range) => (
            <TimeRangeButton
              key={range}
              theme={state.currentTheme}
              active={timeRange === range}
              onClick={() => setTimeRange(range)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </TimeRangeButton>
          ))}
        </TimeRangeSelector>
      </Header>

      {/* Performance Metrics Overview */}
      <MetricsGrid>
        <MetricCard
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricTitle>Overall Performance</MetricTitle>
          <MetricValue>{analytics.performance.overall}</MetricValue>
        </MetricCard>

        <MetricCard
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricTitle>Productivity Score</MetricTitle>
          <MetricValue>{analytics.performance.productivity.score}</MetricValue>
        </MetricCard>

        <MetricCard
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricTitle>Wellness Score</MetricTitle>
          <MetricValue>{analytics.performance.wellness.score}</MetricValue>
        </MetricCard>

        <MetricCard
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricTitle>Focus Time</MetricTitle>
          <MetricValue>{analytics.performance.productivity.focusTime}m</MetricValue>
        </MetricCard>
      </MetricsGrid>

      <SectionContainer>
        {/* Insights Section */}
        <Section
          theme={state.currentTheme}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SectionTitle>
            🔍 Analytics Insights
          </SectionTitle>
          <AnimatePresence>
            {analytics.insights.map((insight, index) => (
              <InsightCard
                key={insight.id}
                theme={state.currentTheme}
                impact={insight.impact}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <InsightTitle>{insight.title}</InsightTitle>
                <InsightDescription>{insight.description}</InsightDescription>
                <ConfidenceBar confidence={insight.confidence} theme={state.currentTheme} />
                <ConfidenceText>Confidence: {insight.confidence}%</ConfidenceText>
                {insight.actionable && (
                  <ActionButton
                    theme={state.currentTheme}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View Actions
                  </ActionButton>
                )}
              </InsightCard>
            ))}
          </AnimatePresence>
        </Section>

        {/* Predictions Section */}
        <Section
          theme={state.currentTheme}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SectionTitle>
            🔮 Predictive Insights
          </SectionTitle>
          <AnimatePresence>
            {analytics.predictions.map((prediction, index) => (
              <PredictionCard
                key={prediction.id}
                theme={state.currentTheme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <PredictionText>{prediction.prediction}</PredictionText>
                <ConfidenceBar confidence={prediction.confidence} theme={state.currentTheme} />
                <ConfidenceText>
                  Confidence: {prediction.confidence}% | Accuracy: {prediction.accuracy}%
                </ConfidenceText>
                <FactorsList>
                  {prediction.factors.slice(0, 3).map((factor) => (
                    <Factor key={factor.name} impact={factor.impact}>
                      {factor.name}
                    </Factor>
                  ))}
                </FactorsList>
              </PredictionCard>
            ))}
          </AnimatePresence>
        </Section>
      </SectionContainer>

      <SectionContainer>
        {/* Behavior Patterns */}
        <Section
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <SectionTitle>
            📊 Behavior Patterns
          </SectionTitle>
          <AnimatePresence>
            {analytics.patterns.map((pattern, index) => (
              <PatternCard
                key={pattern.id}
                theme={state.currentTheme}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <InsightTitle>{pattern.name}</InsightTitle>
                <InsightDescription>{pattern.description}</InsightDescription>
                <PatternStrength strength={pattern.strength}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>Strength:</span>
                  <StrengthBar strength={pattern.strength} />
                  <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>{pattern.strength}%</span>
                </PatternStrength>
              </PatternCard>
            ))}
          </AnimatePresence>
        </Section>

        {/* Smart Recommendations */}
        <Section
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <SectionTitle>
            💡 Smart Recommendations
          </SectionTitle>
          <AnimatePresence>
            {analytics.recommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.id}
                theme={state.currentTheme}
                urgency={recommendation.urgency}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <InsightTitle>{recommendation.title}</InsightTitle>
                  <UrgencyBadge urgency={recommendation.urgency}>
                    {recommendation.urgency}
                  </UrgencyBadge>
                </div>
                <InsightDescription>{recommendation.description}</InsightDescription>
                <ConfidenceBar confidence={recommendation.confidence} theme={state.currentTheme} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ConfidenceText>Confidence: {recommendation.confidence}%</ConfidenceText>
                  <ActionButton
                    theme={state.currentTheme}
                    onClick={() => handleApplyRecommendation(recommendation)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply
                  </ActionButton>
                </div>
              </RecommendationCard>
            ))}
          </AnimatePresence>
        </Section>
      </SectionContainer>
    </DashboardContainer>
  );
};

export default AdvancedAnalyticsDashboard; 