import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { SubscriptionPlan } from '../types';

const PremiumContainer = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1<{ theme: any }>`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 10px;
  background: linear-gradient(135deg, ${props => props.theme.accentColor}, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p<{ theme: any }>`
  font-size: 1.1rem;
  opacity: 0.8;
  color: ${props => props.theme.textColor};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const BackButton = styled.button<{ theme: any }>`
  position: absolute;
  top: 20px;
  left: 20px;
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

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const PlanCard = styled(motion.div)<{ theme: any; isPopular: boolean; isSelected: boolean }>`
  background: ${props => props.isPopular 
    ? `linear-gradient(135deg, ${props.theme.accentColor}20, ${props.theme.accentColor}10)`
    : 'rgba(255, 255, 255, 0.05)'
  };
  border: 2px solid ${props => 
    props.isSelected ? props.theme.accentColor :
    props.isPopular ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'
  };
  border-radius: 20px;
  padding: 30px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
`;

const PopularBadge = styled.div<{ theme: any }>`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.theme.accentColor};
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PlanName = styled.h3<{ theme: any }>`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.theme.textColor};
`;

const PlanPrice = styled.div<{ theme: any }>`
  margin-bottom: 20px;
`;

const Price = styled.span<{ theme: any }>`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme.accentColor};
`;

const Currency = styled.span<{ theme: any }>`
  font-size: 1.2rem;
  font-weight: 500;
  color: ${props => props.theme.textColor};
  opacity: 0.8;
`;

const Interval = styled.span<{ theme: any }>`
  font-size: 1rem;
  color: ${props => props.theme.textColor};
  opacity: 0.6;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 30px 0;
`;

const Feature = styled.li<{ theme: any }>`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: ${props => props.theme.textColor};
  opacity: 0.9;

  &::before {
    content: '✓';
    color: ${props => props.theme.accentColor};
    font-weight: bold;
    margin-right: 12px;
    font-size: 1.1rem;
  }
`;

const SelectButton = styled(motion.button)<{ theme: any; isSelected: boolean }>`
  width: 100%;
  background: ${props => props.isSelected ? props.theme.accentColor : 'transparent'};
  color: ${props => props.isSelected ? 'white' : props.theme.accentColor};
  border: 2px solid ${props => props.theme.accentColor};
  padding: 15px 30px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.accentColor};
    color: white;
  }
`;

const TrialBanner = styled.div<{ theme: any }>`
  background: linear-gradient(135deg, ${props => props.theme.accentColor}, #ff6b6b);
  color: white;
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const TrialText = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const TrialSubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const FeaturesSection = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2<{ theme: any }>`
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
  color: ${props => props.theme.textColor};
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
`;

const FeatureCard = styled.div<{ theme: any }>`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 25px;
  text-align: center;
`;

const FeatureIcon = styled.div<{ theme: any }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.theme.accentColor}20;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 15px;
  font-size: 1.8rem;
`;

const FeatureTitle = styled.h4<{ theme: any }>`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: ${props => props.theme.textColor};
`;

const FeatureDescription = styled.p<{ theme: any }>`
  font-size: 0.9rem;
  opacity: 0.8;
  color: ${props => props.theme.textColor};
  line-height: 1.5;
`;

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Basic Pomodoro Timer',
      '5 Ambient Sounds',
      '3 Themes',
      'Basic Statistics',
      'Local Data Storage'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 4.99,
    currency: 'USD',
    interval: 'monthly',
    popular: true,
    features: [
      'All Timer Modes (Flowtime, Timeboxing)',
      '50+ Premium Ambient Sounds',
      'Unlimited Custom Themes',
      'Advanced Analytics & Insights',
      'Weather Integration',
      'Calendar Sync',
      'Cloud Backup & Sync',
      'Priority Support',
      'Ad-Free Experience'
    ]
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    price: 49.99,
    currency: 'USD',
    interval: 'yearly',
    features: [
      'Everything in Premium',
      'Lifetime Access',
      'Future Feature Updates',
      'Premium Support',
      'Export/Import Data',
      'Widget Support',
      'API Access',
      'Early Beta Features'
    ]
  }
];

const premiumFeatures = [
  {
    icon: '⚡',
    title: 'Advanced Timers',
    description: 'Flowtime, timeboxing, custom intervals, and smart break suggestions'
  },
  {
    icon: '🎵',
    title: 'Premium Sounds',
    description: '50+ high-quality ambient sounds with spatial audio and smart mixing'
  },
  {
    icon: '📊',
    title: 'Deep Analytics',
    description: 'Comprehensive insights, productivity patterns, and detailed reports'
  },
  {
    icon: '🌤️',
    title: 'Smart Integrations',
    description: 'Weather updates, calendar sync, and intelligent notifications'
  },
  {
    icon: '☁️',
    title: 'Cloud Sync',
    description: 'Access your data everywhere with automatic cloud backup'
  },
  {
    icon: '🎨',
    title: 'Unlimited Customization',
    description: 'Unlimited themes, widgets, and complete personalization'
  }
];

export const PremiumPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
  };

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleUpgrade = () => {
    // In a real app, this would integrate with payment processing
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    if (plan && plan.id !== 'free') {
      const subscription = {
        planId: plan.id,
        status: 'trial' as const,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days trial
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true
      };
      
      dispatch({ type: 'SET_SUBSCRIPTION', payload: subscription });
      dispatch({ type: 'ADD_NOTIFICATION', payload: {
        id: `premium-trial-${Date.now()}`,
        type: 'success',
        title: 'Premium Trial Started!',
        message: 'You now have access to all premium features for 7 days.',
        timestamp: Date.now(),
        read: false
      }});
      
      dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
    }
  };

  const isTrialActive = state.subscription?.status === 'trial';
  const isPremiumActive = state.subscription?.status === 'active';

  return (
    <PremiumContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton theme={state.currentTheme} onClick={handleBack}>
        ←
      </BackButton>

      <Header>
        <Title theme={state.currentTheme}>
          Unlock Premium
        </Title>
        <Subtitle theme={state.currentTheme}>
          Supercharge your productivity with advanced features, premium content, and unlimited customization.
        </Subtitle>
      </Header>

      {!isPremiumActive && !isTrialActive && (
        <TrialBanner theme={state.currentTheme}>
          <TrialText>🎉 Start Your Free 7-Day Trial</TrialText>
          <TrialSubtext>No commitment • Cancel anytime • Full access</TrialSubtext>
        </TrialBanner>
      )}

      {isTrialActive && (
        <TrialBanner theme={state.currentTheme}>
          <TrialText>⭐ Trial Active</TrialText>
          <TrialSubtext>
            {Math.ceil((new Date(state.subscription!.trialEndsAt!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
          </TrialSubtext>
        </TrialBanner>
      )}

      <PlanGrid>
        {subscriptionPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            theme={state.currentTheme}
            isPopular={!!plan.popular}
            isSelected={selectedPlan === plan.id}
            onClick={() => handleSelectPlan(plan.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {plan.popular && (
              <PopularBadge theme={state.currentTheme}>
                Most Popular
              </PopularBadge>
            )}
            
            <PlanName theme={state.currentTheme}>{plan.name}</PlanName>
            
            <PlanPrice theme={state.currentTheme}>
              <Currency theme={state.currentTheme}>$</Currency>
              <Price theme={state.currentTheme}>{plan.price}</Price>
              {plan.interval === 'monthly' && plan.price > 0 && (
                <Interval theme={state.currentTheme}>/month</Interval>
              )}
              {plan.interval === 'yearly' && (
                <Interval theme={state.currentTheme}>/lifetime</Interval>
              )}
            </PlanPrice>

            <FeatureList>
              {plan.features.map((feature, index) => (
                <Feature key={index} theme={state.currentTheme}>
                  {feature}
                </Feature>
              ))}
            </FeatureList>

            <SelectButton
              theme={state.currentTheme}
              isSelected={selectedPlan === plan.id}
              onClick={(e) => {
                e.stopPropagation();
                if (plan.id === 'free') {
                  handleBack();
                } else {
                  handleUpgrade();
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {plan.id === 'free' ? 'Current Plan' : 
               isTrialActive || isPremiumActive ? 'Current Plan' : 
               'Start Free Trial'}
            </SelectButton>
          </PlanCard>
        ))}
      </PlanGrid>

      <FeaturesSection>
        <SectionTitle theme={state.currentTheme}>
          Premium Features
        </SectionTitle>
        
        <FeatureGrid>
          {premiumFeatures.map((feature, index) => (
            <FeatureCard key={index} theme={state.currentTheme}>
              <FeatureIcon theme={state.currentTheme}>
                {feature.icon}
              </FeatureIcon>
              <FeatureTitle theme={state.currentTheme}>
                {feature.title}
              </FeatureTitle>
              <FeatureDescription theme={state.currentTheme}>
                {feature.description}
              </FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </FeaturesSection>
    </PremiumContainer>
  );
}; 