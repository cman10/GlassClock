import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const rotateSecond = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const AnalogContainer = styled(motion.div)<{ theme: any; size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  
  /* Liquid glass clock face */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    rgba(255, 255, 255, 0.1) 70%,
    rgba(255, 255, 255, 0.12) 100%
  );
  backdrop-filter: blur(30px) saturate(120%);
  border: 2px solid rgba(255, 255, 255, 0.25);
  
  /* Glass shadows and depth */
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.2),
    0 15px 30px rgba(0, 0, 0, 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(255, 255, 255, 0.1),
    0 0 40px rgba(255, 255, 255, 0.08);
  
  /* Glass highlight */
  &::before {
    content: '';
    position: absolute;
    top: 10%;
    left: 15%;
    width: 35%;
    height: 35%;
    background: radial-gradient(ellipse at 30% 30%, 
      rgba(255, 255, 255, 0.4) 0%, 
      rgba(255, 255, 255, 0.15) 50%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(2px);
    z-index: 10;
  }
`;

const ClockFace = styled.div<{ style: string; theme: any }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  z-index: 5;
`;

const HourMarker = styled.div<{ 
  angle: number; 
  isMain: boolean; 
  style: string; 
  theme: any;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${props => props.isMain ? '4px' : '2px'};
  height: ${props => props.isMain ? '20px' : '12px'};
  margin-top: ${props => props.isMain ? '-10px' : '-6px'};
  margin-left: ${props => props.isMain ? '-2px' : '-1px'};
  transform-origin: center ${props => props.isMain ? '40px' : '44px'};
  transform: rotate(${props => props.angle}deg);
  
  background: ${props => {
    if (props.style === 'dots') return 'transparent';
    return `linear-gradient(180deg, 
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.6) 100%
    )`;
  }};
  
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  
  ${props => props.style === 'dots' && `
    width: ${props.isMain ? '8px' : '4px'};
    height: ${props.isMain ? '8px' : '4px'};
    border-radius: 50%;
    background: radial-gradient(circle, 
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.4) 100%
    );
    margin-top: ${props.isMain ? '-4px' : '-2px'};
    margin-left: ${props.isMain ? '-4px' : '-2px'};
    transform-origin: center ${props.isMain ? '42px' : '46px'};
  `}
  
  ${props => props.style === 'roman' && props.isMain && `
    width: auto;
    height: auto;
    background: transparent;
    color: rgba(255, 255, 255, 0.9);
    font-size: 14px;
    font-weight: 300;
    text-align: center;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: -8px;
    margin-left: -8px;
    width: 16px;
    height: 16px;
    transform-origin: center 42px;
  `}
`;

const ClockHand = styled(motion.div)<{ 
  type: 'hour' | 'minute' | 'second'; 
  angle: number;
  theme: any;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center bottom;
  transform: translate(-50%, -100%) rotate(${props => props.angle}deg);
  z-index: ${props => props.type === 'second' ? 15 : 10};
  
  ${props => props.type === 'hour' && `
    width: 6px;
    height: 60px;
    background: linear-gradient(180deg, 
      rgba(255, 255, 255, 0.9) 0%,
      rgba(255, 255, 255, 0.7) 100%
    );
    border-radius: 3px;
    box-shadow: 
      0 0 15px rgba(255, 255, 255, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.3);
  `}
  
  ${props => props.type === 'minute' && `
    width: 4px;
    height: 80px;
    background: linear-gradient(180deg, 
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.8) 100%
    );
    border-radius: 2px;
    box-shadow: 
      0 0 12px rgba(255, 255, 255, 0.3),
      0 2px 6px rgba(0, 0, 0, 0.2);
  `}
  
  ${props => props.type === 'second' && `
    width: 2px;
    height: 90px;
    background: linear-gradient(180deg, 
      rgba(255, 100, 100, 0.9) 0%,
      rgba(255, 150, 150, 0.7) 100%
    );
    border-radius: 1px;
    box-shadow: 
      0 0 8px rgba(255, 100, 100, 0.5),
      0 1px 4px rgba(0, 0, 0, 0.2);
  `}
`;

const CenterDot = styled.div<{ theme: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  margin-left: -8px;
  border-radius: 50%;
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
  border: 2px solid rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 0 15px rgba(255, 255, 255, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 20;
`;

const NumberLabel = styled.div<{ angle: number; number: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center 42px;
  transform: rotate(${props => props.angle}deg) translate(-50%, -100%);
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 300;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  z-index: 8;
  
  span {
    display: inline-block;
    transform: rotate(-${props => props.angle}deg);
  }
`;

interface AnalogClockProps {
  time: Date;
  style?: 'classic' | 'modern' | 'minimal' | 'roman' | 'dots';
  size?: number;
  theme: any;
  showSeconds?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  time,
  style = 'modern',
  size = 200,
  theme,
  showSeconds = true
}) => {
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // Calculate angles
  const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + minute adjustment
  const minuteAngle = minutes * 6; // 6 degrees per minute
  const secondAngle = seconds * 6; // 6 degrees per second
  
  // Roman numerals
  const romanNumerals = ['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
  
  // Generate hour markers
  const hourMarkers = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const isMain = true;
    
    return (
      <HourMarker
        key={`hour-${i}`}
        angle={angle}
        isMain={isMain}
        style={style}
        theme={theme}
      >
        {style === 'roman' && (
          <span>{romanNumerals[i]}</span>
        )}
      </HourMarker>
    );
  });
  
  // Generate minute markers (for detailed styles)
  const minuteMarkers = style !== 'minimal' ? Array.from({ length: 60 }, (_, i) => {
    if (i % 5 === 0) return null; // Skip hour positions
    const angle = i * 6;
    
    return (
      <HourMarker
        key={`minute-${i}`}
        angle={angle}
        isMain={false}
        style={style}
        theme={theme}
      />
    );
  }).filter(Boolean) : [];

  return (
    <AnalogContainer
      theme={theme}
      size={size}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        duration: 1, 
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
    >
      <ClockFace style={style} theme={theme}>
        {/* Hour markers */}
        {hourMarkers}
        
        {/* Minute markers */}
        {minuteMarkers}
        
        {/* Clock hands */}
        <ClockHand
          type="hour"
          angle={hourAngle}
          theme={theme}
          initial={{ rotate: hourAngle - 90 }}
          animate={{ rotate: hourAngle }}
          transition={{ 
            duration: 1, 
            type: "spring",
            stiffness: 80,
            damping: 20
          }}
        />
        
        <ClockHand
          type="minute"
          angle={minuteAngle}
          theme={theme}
          initial={{ rotate: minuteAngle - 30 }}
          animate={{ rotate: minuteAngle }}
          transition={{ 
            duration: 0.8, 
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        />
        
        {showSeconds && (
          <ClockHand
            type="second"
            angle={secondAngle}
            theme={theme}
            animate={{ rotate: secondAngle }}
            transition={{ 
              duration: 0.1,
              ease: "easeOut"
            }}
          />
        )}
        
        {/* Center dot */}
        <CenterDot theme={theme} />
      </ClockFace>
    </AnalogContainer>
  );
}; 