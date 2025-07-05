import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { AnalogClock } from './AnalogClock';
import { ConcentricClock } from './ConcentricClock';
import { NeonClock } from './NeonClock';
import { WordClock } from './WordClock';

// Floating animation with liquid motion
const floatAnimation = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
    opacity: 0.6;
  }
  33% { 
    transform: translateY(-20px) rotate(120deg) scale(1.1);
    opacity: 0.8;
  }
  66% { 
    transform: translateY(10px) rotate(240deg) scale(0.9);
    opacity: 0.4;
  }
`;

// Liquid ripple effect
const rippleAnimation = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
`;

// Glow pulse animation
const glowPulse = keyframes`
  0%, 100% { 
    opacity: 0.3;
    transform: scale(1);
  }
  50% { 
    opacity: 0.7;
    transform: scale(1.05);
  }
`;

const ClockContainer = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.fontFamily || 'Inter, sans-serif'};
  user-select: none;
  position: relative;
  overflow: hidden;
  
  /* Consistent lighting - key light from top-left */
  background: 
    radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(0, 0, 0, 0.03) 0%, transparent 50%);
`;

// Vibrant accent glows - positioned behind glass
const AccentGlow = styled(motion.div)<{ 
  theme: any; 
  position: { x: string; y: string }; 
  size: number;
  hue: number;
}>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  ${props => props.position.x}: ${props => props.position.x === 'left' ? '10%' : '15%'};
  ${props => props.position.y}: ${props => props.position.y === 'top' ? '20%' : '25%'};
  border-radius: 50%;
  z-index: 1;
  
  /* Vibrant, oversaturated colors with fluid blending */
  background: 
    radial-gradient(circle at 30% 30%, 
      hsl(${props => props.hue}, 85%, 65%) 0%,
      hsl(${props => props.hue + 30}, 90%, 60%) 25%,
      hsl(${props => props.hue + 60}, 80%, 55%) 50%,
      hsl(${props => props.hue + 90}, 75%, 50%) 75%,
      transparent 100%
    );
  
  filter: blur(40px) saturate(150%);
  opacity: 0.4;
  animation: ${glowPulse} 4s ease-in-out infinite;
  animation-delay: ${props => props.hue / 100}s;
  
  /* Liquid motion */
  &::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 20%;
    width: 60%;
    height: 60%;
    background: 
      radial-gradient(circle at 50% 50%, 
        hsl(${props => props.hue + 120}, 90%, 70%) 0%,
        hsl(${props => props.hue + 180}, 95%, 65%) 50%,
        transparent 100%
      );
    border-radius: 50%;
    filter: blur(20px);
    animation: ${floatAnimation} 8s ease-in-out infinite reverse;
  }
`;

const GlassTimeContainer = styled(motion.div)<{ theme: any; isLowTransparency?: boolean }>`
  position: relative;
  padding: 60px 80px;
  z-index: 10;
  transform-style: preserve-3d;
  
  /* Enhanced multi-layer glass with greater depth */
  background: ${props => props.isLowTransparency ? 
    `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.45) 0%,
      rgba(255, 255, 255, 0.25) 25%,
      rgba(255, 255, 255, 0.35) 75%,
      rgba(255, 255, 255, 0.4) 100%
    )` :
    `linear-gradient(135deg, 
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.08) 20%,
      rgba(255, 255, 255, 0.05) 40%,
      rgba(255, 255, 255, 0.12) 60%,
      rgba(255, 255, 255, 0.18) 80%,
      rgba(255, 255, 255, 0.15) 100%
    )`
  };
  
  backdrop-filter: ${props => props.isLowTransparency ? 
    'blur(25px) saturate(120%) brightness(110%)' : 
    'blur(40px) saturate(140%) brightness(105%)'
  };
  
  border-radius: 48px;
  overflow: hidden;
  
  /* Enhanced depth with multiple shadow layers */
  box-shadow: 
    /* Dramatic outer shadows for floating effect */
    0 60px 120px rgba(0, 0, 0, 0.35),
    0 40px 80px rgba(0, 0, 0, 0.25),
    0 25px 50px rgba(0, 0, 0, 0.2),
    0 15px 30px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.1),
    /* Complex inner shadows for glass depth */
    inset 0 3px 0 rgba(255, 255, 255, 0.5),
    inset 0 -3px 0 rgba(255, 255, 255, 0.25),
    inset 3px 0 0 rgba(255, 255, 255, 0.2),
    inset -3px 0 0 rgba(255, 255, 255, 0.2),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3),
    /* Enhanced glow for depth */
    0 0 80px rgba(255, 255, 255, 0.15),
    0 0 40px rgba(255, 255, 255, 0.1);
  
  /* Enhanced border with gradient */
  border: 3px solid;
  border-image: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.5) 0%,
    rgba(255, 255, 255, 0.2) 25%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.1) 75%,
    rgba(255, 255, 255, 0.3) 100%
  ) 1;
  
  /* Enhanced top edge highlight with depth */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, 
      transparent 0%,
      rgba(255, 255, 255, 0.95) 15%,
      rgba(255, 255, 255, 0.8) 30%,
      rgba(255, 255, 255, 0.9) 50%,
      rgba(255, 255, 255, 0.8) 70%,
      rgba(255, 255, 255, 0.95) 85%,
      transparent 100%
    );
    border-radius: 48px 48px 0 0;
    z-index: 15;
    box-shadow: 
      0 1px 3px rgba(255, 255, 255, 0.5),
      0 0 20px rgba(255, 255, 255, 0.3);
  }

  /* Enhanced glass surface reflection with multiple layers */
  &::after {
    content: '';
    position: absolute;
    top: 10px;
    left: 10px;
    width: 75%;
    height: 65%;
    background: 
      /* Primary reflection layer */
      radial-gradient(ellipse at 35% 25%, 
        rgba(255, 255, 255, 0.4) 0%, 
        rgba(255, 255, 255, 0.25) 25%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.05) 60%,
        transparent 100%
      ),
      /* Secondary reflection */
      linear-gradient(135deg, 
        rgba(255, 255, 255, 0.25) 0%, 
        rgba(255, 255, 255, 0.12) 25%,
        rgba(255, 255, 255, 0.06) 50%,
        rgba(255, 255, 255, 0.08) 75%,
        transparent 100%
      );
    border-radius: 40px;
    pointer-events: none;
    filter: blur(1px);
    z-index: 12;
  }

  /* Gradient border overlay - light refraction simulation */
  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, 
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.2) 25%,
      rgba(255, 255, 255, 0.4) 50%,
      rgba(255, 255, 255, 0.1) 75%,
      rgba(255, 255, 255, 0.5) 100%
    );
    border-radius: 50px;
    z-index: -1;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    padding: 40px 60px;
    border-radius: 36px;
    
    &::before {
      border-radius: 36px 36px 0 0;
      height: 3px;
    }
    
    &::after {
      border-radius: 30px;
      top: 6px;
      left: 6px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 30px 45px;
    border-radius: 28px;
    
    &::before {
      border-radius: 28px 28px 0 0;
      height: 2px;
    }
    
    &::after {
      border-radius: 24px;
      top: 4px;
      left: 4px;
    }
  }
`;

const TimeDisplay = styled(motion.div)<{ fontSize: string; theme: any }>`
  font-size: ${props => {
    switch (props.fontSize) {
      case 'small': return 'clamp(4rem, 10vw, 7rem)';
      case 'medium': return 'clamp(5rem, 12vw, 9rem)';
      case 'large': return 'clamp(6rem, 14vw, 11rem)';
      case 'xl': return 'clamp(7rem, 16vw, 13rem)';
      default: return 'clamp(6rem, 14vw, 11rem)';
    }
  }};
  
  /* Enhanced typography for maximum clarity */
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: 0;
  text-align: center;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
  position: relative;
  z-index: 20;
  
  /* Crystal clear, sharp text for maximum readability */
  color: white;
  
  /* Clean, sharp text shadows for contrast and depth */
  text-shadow: 
    /* Strong contrast shadows */
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.6),
    0 6px 12px rgba(0, 0, 0, 0.4),
    /* Sharp edge definition */
    1px 1px 2px rgba(0, 0, 0, 0.9),
    -1px -1px 2px rgba(0, 0, 0, 0.9),
    /* Subtle glow for visibility */
    0 0 20px rgba(255, 255, 255, 0.3);
`;

const DateDisplay = styled(motion.div)<{ theme: any }>`
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 400;
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 20;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  
  /* Sharp, clear date text */
  color: white;
  
  text-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.7),
    0 2px 6px rgba(0, 0, 0, 0.5),
    0 3px 9px rgba(0, 0, 0, 0.3),
    1px 1px 2px rgba(0, 0, 0, 0.8),
    -1px -1px 2px rgba(0, 0, 0, 0.8),
    0 0 15px rgba(255, 255, 255, 0.2);
`;

const SecondsDisplay = styled.span<{ theme: any }>`
  font-size: 0.45em;
  margin-left: 0.15em;
  vertical-align: top;
  
  /* Sharp, clear seconds text */
  color: white;
  
  text-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.8),
    0 2px 4px rgba(0, 0, 0, 0.6),
    0 3px 6px rgba(0, 0, 0, 0.4),
    1px 1px 1px rgba(0, 0, 0, 0.9),
    -1px -1px 1px rgba(0, 0, 0, 0.9),
    0 0 10px rgba(255, 255, 255, 0.2);
`;

// Enhanced glass depth layer for more 3D effect
const GlassDepthLayer = styled(motion.div)`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border-radius: 38px;
  z-index: 5;
  pointer-events: none;
  
  /* Additional glass layer for depth */
  background: linear-gradient(125deg, 
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 75%,
    rgba(255, 255, 255, 0.05) 100%
  );
  backdrop-filter: blur(20px) saturate(120%);
  
  /* Inner depth shadows */
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.05),
    inset 2px 0 4px rgba(255, 255, 255, 0.1),
    inset -2px 0 4px rgba(0, 0, 0, 0.03);
  
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  /* Additional reflection layer */
  &::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 5px;
    width: 60%;
    height: 40%;
    background: 
      radial-gradient(ellipse at 40% 30%, 
        rgba(255, 255, 255, 0.15) 0%, 
        rgba(255, 255, 255, 0.08) 40%,
        rgba(255, 255, 255, 0.03) 70%,
        transparent 100%
      );
    border-radius: 30px;
    filter: blur(2px);
  }
`;

// Floating orbs with better glass morphism
const FloatingOrb = styled(motion.div)<{ delay: number; size: number }>`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  border-radius: 50%;
  z-index: 2;
  
  /* Translucent glass orb */
  background: 
    radial-gradient(circle at 35% 35%, 
      rgba(255, 255, 255, 0.25) 0%, 
      rgba(255, 255, 255, 0.12) 40%,
      rgba(255, 255, 255, 0.08) 70%,
      rgba(255, 255, 255, 0.03) 100%
    );
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Orb shadows and glow */
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 20px rgba(255, 255, 255, 0.1);
  
  animation: ${floatAnimation} ${(props) => 8 + props.delay * 2}s ease-in-out infinite;
  animation-delay: ${(props) => props.delay}s;
  
  /* Orb highlight */
  &::before {
    content: '';
    position: absolute;
    top: 15%;
    left: 25%;
    width: 40%;
    height: 40%;
    background: radial-gradient(circle at 30% 30%, 
      rgba(255, 255, 255, 0.6) 0%, 
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    border-radius: 50%;
    filter: blur(2px);
  }
`;

// Ripple effect for interactions
const RippleEffect = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  pointer-events: none;
  z-index: 5;
`;

// Accessibility toggle for low transparency mode
const AccessibilityToggle = styled(motion.button)<{ isActive: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isActive ? 
    'rgba(255, 255, 255, 0.8)' : 
    'rgba(255, 255, 255, 0.2)'
  };
  backdrop-filter: blur(10px);
  color: ${props => props.isActive ? '#000' : '#fff'};
  cursor: pointer;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  
  &:hover {
    background: ${props => props.isActive ? 
      'rgba(255, 255, 255, 0.9)' : 
      'rgba(255, 255, 255, 0.3)'
    };
  }
`;

export const Clock: React.FC = () => {
  const { state } = useAppContext();
  const [time, setTime] = useState(new Date());
  const [showRipple, setShowRipple] = useState(false);
  const [isLowTransparency, setIsLowTransparency] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse position for parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring animations
  const springConfig = { stiffness: 300, damping: 30, mass: 1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Parallax transforms
  const rotateX = useTransform(y, [-300, 300], [5, -5]);
  const rotateY = useTransform(x, [-300, 300], [-5, 5]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle mouse move for parallax
  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  // Trigger ripple effect on click
  const handleClick = () => {
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 600);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: state.clockSettings.format === '12',
      timeZone: state.clockSettings.timezone,
    };

    let timeString = date.toLocaleTimeString([], options);
    
    if (state.clockSettings.showSeconds) {
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return { time: timeString, seconds };
    }
    
    return { time: timeString, seconds: null };
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: state.clockSettings.timezone,
      ...(state.clockSettings.dateFormat === 'short' && {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }),
      ...(state.clockSettings.dateFormat === 'long' && {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      ...(state.clockSettings.dateFormat === 'numeric' && {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
    };

    return date.toLocaleDateString([], options);
  };

  const { time: timeString, seconds } = formatTime(time);
  const dateString = formatDate(time);

  // Get theme-based hue for accent glows
  const getThemeHue = (theme: any): number => {
    if (theme.accentColor) {
      // Extract hue from accent color (simplified)
      const colorMap: { [key: string]: number } = {
        '#6c63ff': 250, // violet
        '#1BFFFF': 180, // cyan
        '#71B280': 120, // green
        '#FFD700': 60,  // yellow
        '#007bff': 220, // blue
        '#a8edea': 170, // aqua
        '#f39c12': 35,  // orange
        '#00d2ff': 190, // light blue
        '#e74c3c': 0,   // red
        '#74b9ff': 210, // light blue
        '#e17055': 15,  // orange-red
        '#0277bd': 200, // blue
        '#55efc4': 160, // mint
        '#fdcb6e': 45,  // yellow
        '#ff7043': 20,  // red-orange
        '#81c784': 110, // light green
        '#a29bfe': 260, // light purple
        '#fd79a8': 330, // pink
        '#00b894': 150, // teal
      };
      return colorMap[theme.accentColor] || 240;
    }
    return 240; // default purple
  };

  const themeHue = getThemeHue(state.currentTheme);

  // Render different clock styles
  const renderClockStyle = () => {
    const clockStyle = state.clockSettings.clockStyle;
    
    switch (clockStyle) {
      case 'analog':
        return (
          <AnalogClock
            time={time}
            style={state.clockSettings.analogStyle || 'modern'}
            size={300}
            theme={state.currentTheme}
            showSeconds={state.clockSettings.showSeconds}
          />
        );
        
      case 'concentric':
        return (
          <ConcentricClock
            time={time}
            rings={state.clockSettings.concentricRings || 4}
            size={350}
            theme={state.currentTheme}
            showDate={state.clockSettings.showDate}
          />
        );
        
      case 'neon':
        return (
          <NeonClock
            time={time}
            fontSize={state.clockSettings.fontSize}
            theme={state.currentTheme}
            showSeconds={state.clockSettings.showSeconds}
            showDate={state.clockSettings.showDate}
            glowIntensity={state.clockSettings.neonGlow ? 1.5 : 1}
          />
        );
        
      case 'word':
        return (
          <WordClock
            time={time}
            theme={state.currentTheme}
            language={state.clockSettings.wordLanguage || 'english'}
            showDate={state.clockSettings.showDate}
            size={state.clockSettings.fontSize === 'small' ? 'small' : 
                  state.clockSettings.fontSize === 'large' ? 'large' : 'medium'}
          />
        );
        
      case 'minimal':
        return (
          <GlassTimeContainer
            theme={state.currentTheme}
            isLowTransparency={isLowTransparency}
            style={{
              rotateX,
              rotateY,
              padding: '40px 50px',
              borderRadius: '16px'
            }}
            initial={{ 
              scale: 0.8, 
              opacity: 0, 
              y: 30,
              rotateX: 0,
              rotateY: 0
            }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
            }}
            transition={{ 
              duration: 1.2, 
              delay: 1,
              type: "spring",
              stiffness: 80,
              damping: 20
            }}
            whileHover={{
              scale: 1.02,
              y: -3,
              transition: { 
                duration: 0.4, 
                type: "spring",
                stiffness: 200,
                damping: 25
              }
            }}
          >
            {/* Enhanced Glass Depth Layer for Minimal Style */}
            <GlassDepthLayer
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />

            <TimeDisplay
              fontSize={state.clockSettings.fontSize}
              theme={state.currentTheme}
              style={{ fontSize: 'clamp(4rem, 10vw, 8rem)' }}
              initial={{ 
                scale: 0.9, 
                opacity: 0, 
                y: 20
              }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0
              }}
              transition={{ 
                duration: 1, 
                delay: 1.5, 
                type: "spring", 
                stiffness: 120,
                damping: 20
              }}
            >
              {timeString}
              {seconds && (
                <SecondsDisplay theme={state.currentTheme}>
                  :{seconds}
                </SecondsDisplay>
              )}
            </TimeDisplay>
          </GlassTimeContainer>
        );
        
      default: // digital
        return (
          <>
            {state.clockSettings.showDate && (
              <DateDisplay
                theme={state.currentTheme}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  duration: 1, 
                  delay: 0.8, 
                  type: "spring",
                  stiffness: 100,
                  damping: 20
                }}
              >
                {dateString}
              </DateDisplay>
            )}
            
            <GlassTimeContainer
              theme={state.currentTheme}
              isLowTransparency={isLowTransparency}
              style={{
                rotateX,
                rotateY,
              }}
              initial={{ 
                scale: 0.8, 
                opacity: 0, 
                y: 30,
                rotateX: 0,
                rotateY: 0
              }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                y: 0,
              }}
              transition={{ 
                duration: 1.2, 
                delay: 1,
                type: "spring",
                stiffness: 80,
                damping: 20
              }}
              whileHover={{
                scale: 1.02,
                y: -3,
                transition: { 
                  duration: 0.4, 
                  type: "spring",
                  stiffness: 200,
                  damping: 25
                }
              }}
            >
              {/* Enhanced Glass Depth Layer */}
              <GlassDepthLayer
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.8 }}
              />

              {/* Ripple Effect */}
              {showRipple && (
                <RippleEffect
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              )}

              <TimeDisplay
                fontSize={state.clockSettings.fontSize}
                theme={state.currentTheme}
                initial={{ 
                  scale: 0.9, 
                  opacity: 0, 
                  y: 20
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1, 
                  y: 0
                }}
                transition={{ 
                  duration: 1, 
                  delay: 1.5, 
                  type: "spring", 
                  stiffness: 120,
                  damping: 20
                }}
              >
                {timeString}
                {seconds && (
                  <SecondsDisplay theme={state.currentTheme}>
                    :{seconds}
                  </SecondsDisplay>
                )}
              </TimeDisplay>
            </GlassTimeContainer>
          </>
        );
    }
  };

  return (
    <ClockContainer
      ref={containerRef}
      theme={state.currentTheme}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Accessibility Toggle */}
      <AccessibilityToggle
        isActive={isLowTransparency}
        onClick={() => setIsLowTransparency(!isLowTransparency)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Toggle Low Transparency Mode"
      >
        👁
      </AccessibilityToggle>

      {/* Vibrant Accent Glows */}
      <AccentGlow
        theme={state.currentTheme}
        position={{ x: 'left', y: 'top' }}
        size={300}
        hue={themeHue}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      <AccentGlow
        theme={state.currentTheme}
        position={{ x: 'right', y: 'bottom' }}
        size={250}
        hue={themeHue + 120}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />
      <AccentGlow
        theme={state.currentTheme}
        position={{ x: 'left', y: 'bottom' }}
        size={200}
        hue={themeHue + 240}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.35, scale: 1 }}
        transition={{ duration: 2, delay: 1.5 }}
      />

      {/* Background elements only for digital and minimal styles */}
      {(state.clockSettings.clockStyle === 'digital' || state.clockSettings.clockStyle === 'minimal') && (
        <>
          {/* Floating Glass Orbs */}
          <FloatingOrb 
            delay={0} 
            size={25}
            style={{ top: '15%', left: '10%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 1.5, delay: 2, type: "spring" }}
          />
          <FloatingOrb 
            delay={2} 
            size={18}
            style={{ top: '65%', right: '15%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.5, delay: 2.5, type: "spring" }}
          />
          <FloatingOrb 
            delay={4} 
            size={30}
            style={{ bottom: '20%', left: '8%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.5, delay: 3, type: "spring" }}
          />
          <FloatingOrb 
            delay={1} 
            size={22}
            style={{ top: '40%', right: '5%' }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.5, delay: 3.5, type: "spring" }}
          />
        </>
      )}

      {/* Render the selected clock style */}
      {renderClockStyle()}
    </ClockContainer>
  );
}; 