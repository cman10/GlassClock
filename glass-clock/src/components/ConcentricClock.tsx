import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const pulseRing = keyframes`
  0%, 100% { 
    transform: scale(1);
    opacity: 0.6;
  }
  50% { 
    transform: scale(1.02);
    opacity: 0.8;
  }
`;

const ConcentricContainer = styled(motion.div)<{ theme: any; size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TimeRing = styled(motion.div)<{ 
  theme: any; 
  size: number; 
  progress: number; 
  ringIndex: number;
  maxValue: number;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  
  /* Liquid glass ring */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 50%,
    rgba(255, 255, 255, 0.06) 100%
  );
  backdrop-filter: blur(20px) saturate(110%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  
  /* Ring shadows */
  box-shadow: 
    0 ${props => 8 + props.ringIndex * 2}px ${props => 16 + props.ringIndex * 4}px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 ${props => 20 + props.ringIndex * 5}px rgba(255, 255, 255, 0.05);
  
  /* Progress indicator */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: calc(100% + 4px);
    height: calc(100% + 4px);
    border-radius: 50%;
    background: conic-gradient(
      from 270deg,
      rgba(255, 255, 255, 0.6) 0deg,
      rgba(255, 255, 255, 0.6) ${props => (props.progress / props.maxValue) * 360}deg,
      transparent ${props => (props.progress / props.maxValue) * 360}deg,
      transparent 360deg
    );
    z-index: -1;
    filter: blur(1px);
  }
  
  /* Animated pulse for active ring */
  ${props => props.progress > 0 && `
    animation: ${pulseRing} 2s ease-in-out infinite;
    animation-delay: ${props.ringIndex * 0.2}s;
  `}
`;

const RingLabel = styled(motion.div)<{ theme: any; ringIndex: number }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.9);
  font-size: ${props => 14 - props.ringIndex * 2}px;
  font-weight: 300;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  z-index: 10;
  
  .value {
    display: block;
    font-size: ${props => 18 - props.ringIndex * 2}px;
    font-weight: 400;
    margin-bottom: 2px;
    color: transparent;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.6) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .unit {
    font-size: ${props => 10 - props.ringIndex * 1}px;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const CenterDisplay = styled(motion.div)<{ theme: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 20;
  
  .main-time {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 200;
    color: transparent;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.7) 50%,
      rgba(255, 255, 255, 0.9) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 8px;
  }
  
  .date {
    font-size: clamp(0.8rem, 2vw, 1rem);
    font-weight: 300;
    color: rgba(255, 255, 255, 0.7);
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const ProgressDot = styled(motion.div)<{ 
  angle: number; 
  radius: number; 
  active: boolean;
  theme: any;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  margin-top: -2px;
  margin-left: -2px;
  border-radius: 50%;
  transform-origin: center;
  transform: rotate(${props => props.angle}deg) translate(${props => props.radius}px, 0);
  
  background: ${props => props.active 
    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)'
    : 'radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)'
  };
  
  box-shadow: ${props => props.active 
    ? '0 0 8px rgba(255, 255, 255, 0.6), 0 0 4px rgba(255, 255, 255, 0.4)'
    : '0 0 4px rgba(255, 255, 255, 0.2)'
  };
  
  z-index: 15;
`;

interface ConcentricClockProps {
  time: Date;
  rings?: number;
  size?: number;
  theme: any;
  showDate?: boolean;
}

export const ConcentricClock: React.FC<ConcentricClockProps> = ({
  time,
  rings = 4,
  size = 300,
  theme,
  showDate = true
}) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const milliseconds = time.getMilliseconds();
  
  // Time units for different rings
  const timeUnits = [
    { value: hours % 12, max: 12, label: 'Hours', unit: 'HR' },
    { value: minutes, max: 60, label: 'Minutes', unit: 'MIN' },
    { value: seconds, max: 60, label: 'Seconds', unit: 'SEC' },
    { value: Math.floor(milliseconds / 100), max: 10, label: 'Deciseconds', unit: 'DS' }
  ].slice(0, rings);
  
  // Calculate ring sizes
  const baseSize = size * 0.2;
  const ringSpacing = (size - baseSize) / (2 * rings);
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <ConcentricContainer
      theme={theme}
      size={size}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 1.2, 
        type: "spring",
        stiffness: 80,
        damping: 20
      }}
    >
      {/* Render concentric rings */}
      {timeUnits.map((unit, index) => {
        const ringSize = baseSize + (index * ringSpacing * 2);
        const progress = unit.value;
        const maxValue = unit.max;
        
        // Generate progress dots around the ring
        const dots = Array.from({ length: maxValue }, (_, i) => {
          const angle = (i / maxValue) * 360 - 90; // Start from top
          const radius = ringSize / 2 - 8;
          const active = i < progress;
          
          return (
            <ProgressDot
              key={`dot-${index}-${i}`}
              angle={angle}
              radius={radius}
              active={active}
              theme={theme}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + i * 0.02,
                type: "spring"
              }}
            />
          );
        });
        
        return (
          <React.Fragment key={`ring-${index}`}>
            <TimeRing
              theme={theme}
              size={ringSize}
              progress={progress}
              ringIndex={index}
              maxValue={maxValue}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              {/* Ring label */}
              <RingLabel
                theme={theme}
                ringIndex={index}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.2 + 0.5 
                }}
                style={{
                  top: '20%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <span className="value">{unit.value.toString().padStart(2, '0')}</span>
                <span className="unit">{unit.unit}</span>
              </RingLabel>
            </TimeRing>
            
            {/* Progress dots */}
            {dots}
          </React.Fragment>
        );
      })}
      
      {/* Center display */}
      <CenterDisplay
        theme={theme}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 1, 
          delay: 0.8,
          type: "spring",
          stiffness: 120,
          damping: 20
        }}
      >
        <div className="main-time">
          {formatTime(time)}
        </div>
        {showDate && (
          <div className="date">
            {formatDate(time)}
          </div>
        )}
      </CenterDisplay>
    </ConcentricContainer>
  );
}; 