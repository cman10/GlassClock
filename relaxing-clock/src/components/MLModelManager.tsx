import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const ManagerContainer = styled.div<{ theme: any }>`
  width: 100%;
  height: 100vh;
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

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ModelCard = styled(motion.div)<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
`;

const ModelName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #667eea;
`;

const ModelDescription = styled.p`
  font-size: 0.9rem;
  margin: 0 0 16px 0;
  opacity: 0.8;
  line-height: 1.4;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 16px 0;
`;

const MetricItem = styled.div`
  text-align: center;
`;

const MetricLabel = styled.div`
  font-size: 0.8rem;
  opacity: 0.7;
  margin-bottom: 4px;
`;

const MetricValue = styled.div<{ value: number }>`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => 
    props.value >= 90 ? '#4CAF50' :
    props.value >= 70 ? '#FFC107' :
    '#F44336'
  };
`;

const ActionButton = styled(motion.button)<{ theme: any }>`
  padding: 8px 16px;
  border: 1px solid ${props => props.theme.accentColor};
  background: ${props => props.theme.accentColor};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  margin-right: 8px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const MLModelManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [models] = useState([
    {
      id: '1',
      name: 'Productivity Predictor',
      description: 'Predicts optimal productivity windows based on historical data',
      accuracy: 87,
      precision: 84,
      recall: 89,
      f1Score: 86
    },
    {
      id: '2',
      name: 'Focus Quality Analyzer',
      description: 'Classifies focus session quality and identifies improvements',
      accuracy: 91,
      precision: 88,
      recall: 93,
      f1Score: 90
    }
  ]);

  const handleTrainModel = (modelId: string) => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notification-${Date.now()}`,
        type: 'success',
        title: 'Model Training Started',
        message: 'Model training has been initiated',
        timestamp: Date.now(),
        read: false
      }
    });
  };

  return (
    <ManagerContainer theme={state.currentTheme}>
      <Header>
        <Title>🤖 ML Model Manager</Title>
      </Header>

      {models.map((model, index) => (
        <ModelCard
          key={model.id}
          theme={state.currentTheme}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <ModelName>{model.name}</ModelName>
          <ModelDescription>{model.description}</ModelDescription>

          <MetricsGrid>
            <MetricItem>
              <MetricLabel>Accuracy</MetricLabel>
              <MetricValue value={model.accuracy}>
                {model.accuracy}%
              </MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Precision</MetricLabel>
              <MetricValue value={model.precision}>
                {model.precision}%
              </MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>Recall</MetricLabel>
              <MetricValue value={model.recall}>
                {model.recall}%
              </MetricValue>
            </MetricItem>
            <MetricItem>
              <MetricLabel>F1 Score</MetricLabel>
              <MetricValue value={model.f1Score}>
                {model.f1Score}%
              </MetricValue>
            </MetricItem>
          </MetricsGrid>

          <ActionButton
            theme={state.currentTheme}
            onClick={() => handleTrainModel(model.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retrain Model
          </ActionButton>
        </ModelCard>
      ))}
    </ManagerContainer>
  );
};

export default MLModelManager; 