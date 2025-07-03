import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const neonFlicker = keyframes`
  0%, 100% { 
    text-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor,
      0 0 20px currentColor;
    filter: brightness(1);
  }
  50% { 
    text-shadow: 
      0 0 2px currentColor,
      0 0 5px currentColor,
      0 0 8px currentColor,
      0 0 12px currentColor;
    filter: brightness(1.2);
  }
`;

const neonPulse = keyframes`
  0%, 100% { 
    box-shadow: 
      0 0 20px currentColor,
      0 0 40px currentColor,
      0 0 60px currentColor,
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
  50% { 
    box-shadow: 
      0 0 10px currentColor,
      0 0 20px currentColor,
      0 0 30px currentColor,
      inset 0 0 10px rgba(255, 255, 255, 0.2);
  }
`;

const NeonContainer = styled(motion.div)<{ theme: any }>`
  position: relative;
  padding: 40px 60px;
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  backdrop-filter: blur(20px) saturate(120%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Dark glass with neon accents */
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 15px 30px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  
  /* Neon border glow */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      ${props => props.theme.accentColor || '#6c63ff'} 0%,
      transparent 50%,
      ${props => props.theme.accentColor || '#6c63ff'} 100%
    );
    border-radius: 22px;
    z-index: -1;
    opacity: 0.3;
    animation: ${neonPulse} 3s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    padding: 30px 40px;
    border-radius: 16px;
    
    &::before {
      border-radius: 18px;
    }
  }
`;

const NeonTimeDisplay = styled(motion.div)<{ 
  fontSize: string; 
  theme: any; 
  glowIntensity: number;
}>`
  font-size: ${props => {
    switch (props.fontSize) {
      case 'small': return 'clamp(3rem, 8vw, 5rem)';
      case 'medium': return 'clamp(4rem, 10vw, 7rem)';
      case 'large': return 'clamp(5rem, 12vw, 9rem)';
      case 'xl': return 'clamp(6rem, 14vw, 11rem)';
      default: return 'clamp(5rem, 12vw, 9rem)';
    }
  }};
  
  font-weight: 100;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.1em;
  text-align: center;
  line-height: 1;
  
  /* Neon text effect */
  color: ${props => props.theme.accentColor || '#6c63ff'};
  text-shadow: 
    0 0 5px currentColor,
    0 0 10px currentColor,
    0 0 15px currentColor,
    0 0 20px currentColor,
    0 0 35px currentColor,
    0 0 40px currentColor;
  
  /* Flickering animation */
  animation: ${neonFlicker} 4s ease-in-out infinite;
  animation-delay: 0.5s;
  
  /* Glass text reflection */
  position: relative;
  
  &::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: rgba(255, 255, 255, 0.1);
    text-shadow: none;
    z-index: -1;
    transform: scaleY(-1) translateY(100%);
    opacity: 0.3;
    filter: blur(1px);
    mask: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.3) 100%);
    -webkit-mask: linear-gradient(transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  }
`;

const NeonDateDisplay = styled(motion.div)<{ theme: any }>`
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 300;
  font-family: 'Courier New', monospace;
  text-align: center;
  margin-bottom: 30px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  
  /* Subtle neon glow */
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 
    0 0 3px rgba(255, 255, 255, 0.5),
    0 0 6px rgba(255, 255, 255, 0.3),
    0 0 9px rgba(255, 255, 255, 0.2);
  
  animation: ${neonFlicker} 6s ease-in-out infinite;
  animation-delay: 1s;
`;

const NeonSecondsDisplay = styled.span<{ theme: any }>`
  font-size: 0.4em;
  margin-left: 0.2em;
  vertical-align: top;
  
  /* Brighter neon for seconds */
  color: ${props => props.theme.accentColor || '#6c63ff'};
  text-shadow: 
    0 0 3px currentColor,
    0 0 6px currentColor,
    0 0 9px currentColor,
    0 0 12px currentColor;
  
  animation: ${neonFlicker} 2s ease-in-out infinite;
`;

const NeonAccentBar = styled(motion.div)<{ theme: any; position: 'top' | 'bottom' }>`
  position: absolute;
  ${props => props.position}: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, 
    transparent 0%,
    ${props => props.theme.accentColor || '#6c63ff'} 50%,
    transparent 100%
  );
  
  box-shadow: 
    0 0 10px ${props => props.theme.accentColor || '#6c63ff'},
    0 0 20px ${props => props.theme.accentColor || '#6c63ff'};
  
  animation: ${neonPulse} 2s ease-in-out infinite;
  animation-delay: ${props => props.position === 'top' ? '0s' : '1s'};
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 4px;
    background: ${props => props.theme.accentColor || '#6c63ff'};
    border-radius: 2px;
    box-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor;
  }
`;

const NeonCornerAccent = styled(motion.div)<{ 
  theme: any; 
  corner: 'tl' | 'tr' | 'bl' | 'br';
}>`
  position: absolute;
  width: 20px;
  height: 20px;
  
  ${props => {
    switch (props.corner) {
      case 'tl': return 'top: 10px; left: 10px;';
      case 'tr': return 'top: 10px; right: 10px;';
      case 'bl': return 'bottom: 10px; left: 10px;';
      case 'br': return 'bottom: 10px; right: 10px;';
    }
  }}
  
  &::before, &::after {
    content: '';
    position: absolute;
    background: ${props => props.theme.accentColor || '#6c63ff'};
    box-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor;
  }
  
  &::before {
    width: 10px;
    height: 2px;
    ${props => props.corner.includes('t') ? 'top: 0;' : 'bottom: 0;'}
    ${props => props.corner.includes('l') ? 'left: 0;' : 'right: 0;'}
  }
  
  &::after {
    width: 2px;
    height: 10px;
    ${props => props.corner.includes('t') ? 'top: 0;' : 'bottom: 0;'}
    ${props => props.corner.includes('l') ? 'left: 0;' : 'right: 0;'}
  }
  
  animation: ${neonFlicker} 5s ease-in-out infinite;
  animation-delay: ${props => {
    switch (props.corner) {
      case 'tl': return '0s';
      case 'tr': return '1.25s';
      case 'bl': return '2.5s';
      case 'br': return '3.75s';
    }
  }};
`;

interface NeonClockProps {
  time: Date;
  fontSize?: string;
  theme: any;
  showSeconds?: boolean;
  showDate?: boolean;
  glowIntensity?: number;
}

export const NeonClock: React.FC<NeonClockProps> = ({
  time,
  fontSize = 'large',
  theme,
  showSeconds = true,
  showDate = true,
  glowIntensity = 1
}) => {
  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };

    let timeString = date.toLocaleTimeString([], options);
    
    if (showSeconds) {
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return { time: timeString, seconds };
    }
    
    return { time: timeString, seconds: null };
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const { time: timeString, seconds } = formatTime(time);
  const dateString = formatDate(time);

  return (
    <NeonContainer
      theme={theme}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 1, 
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      {/* Corner accents */}
      <NeonCornerAccent
        theme={theme}
        corner="tl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      />
      <NeonCornerAccent
        theme={theme}
        corner="tr"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      />
      <NeonCornerAccent
        theme={theme}
        corner="bl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
      <NeonCornerAccent
        theme={theme}
        corner="br"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      />
      
      {/* Top accent bar */}
      <NeonAccentBar
        theme={theme}
        position="top"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      />
      
      {/* Bottom accent bar */}
      <NeonAccentBar
        theme={theme}
        position="bottom"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      
      {/* Date display */}
      {showDate && (
        <NeonDateDisplay
          theme={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.7,
            type: "spring",
            stiffness: 120,
            damping: 15
          }}
        >
          {dateString}
        </NeonDateDisplay>
      )}
      
      {/* Main time display */}
      <NeonTimeDisplay
        fontSize={fontSize}
        theme={theme}
        glowIntensity={glowIntensity}
        data-text={timeString + (seconds ? `:${seconds}` : '')}
        initial={{ 
          scale: 0.8, 
          opacity: 0,
          filter: 'blur(10px)'
        }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          filter: 'blur(0px)'
        }}
        transition={{ 
          duration: 1.2, 
          delay: 1,
          type: "spring",
          stiffness: 80,
          damping: 20
        }}
      >
        {timeString}
        {seconds && (
          <NeonSecondsDisplay theme={theme}>
            :{seconds}
          </NeonSecondsDisplay>
        )}
      </NeonTimeDisplay>
    </NeonContainer>
  );
}; 