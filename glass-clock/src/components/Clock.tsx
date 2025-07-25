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
  cursor: pointer;
  
  /* True Liquid Glass Material */
  background: ${props => props.isLowTransparency ? 
    'rgba(255, 255, 255, 0.15)' : 
    'rgba(255, 255, 255, 0.08)'
  };
  
  /* Advanced backdrop filtering for light manipulation */
  backdrop-filter: 
    blur(${props => props.isLowTransparency ? '20px' : '30px'})
    saturate(180%)
    brightness(110%)
    contrast(120%);
  
  /* Dynamic border radius for liquid feel */
  border-radius: 48px;
  overflow: visible;
  
  /* Liquid Glass Border - Light refraction effect */
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  /* Multi-layered shadow system for depth and lensing */
  box-shadow: 
    /* Primary depth shadow */
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    /* Secondary ambient shadow */
    0 8px 16px -4px rgba(0, 0, 0, 0.12),
    /* Light interaction shadow */
    0 0 0 1px rgba(255, 255, 255, 0.05),
    /* Adaptive content separation shadow */
    0 1px 4px rgba(0, 0, 0, 0.1),
    /* Inner glow for light concentration */
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  
  /* Light bending and lensing effects */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.1) 0%,
      transparent 25%,
      transparent 75%,
      rgba(255, 255, 255, 0.1) 100%
    );
    border-radius: 48px;
    pointer-events: none;
    z-index: -1;
  }
  
  /* Dynamic light concentration layer */
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 40%;
    height: 30%;
    background: 
      radial-gradient(ellipse at 50% 50%, 
        rgba(255, 255, 255, 0.15) 0%, 
        rgba(255, 255, 255, 0.05) 50%,
        transparent 100%
      );
    border-radius: 24px;
    pointer-events: none;
    filter: blur(1px);
    opacity: 0.8;
  }
  
  /* Responsive interaction states */
  &:hover {
    /* Light energization on hover */
    backdrop-filter: 
      blur(${props => props.isLowTransparency ? '22px' : '32px'})
      saturate(200%)
      brightness(115%)
      contrast(125%);
    
    box-shadow: 
      0 32px 64px -12px rgba(0, 0, 0, 0.3),
      0 12px 24px -4px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.1),
      0 2px 8px rgba(0, 0, 0, 0.12),
      inset 0 2px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 0 rgba(255, 255, 255, 0.08),
      /* Inner illumination on interaction */
      inset 0 0 20px rgba(255, 255, 255, 0.1);
    
    /* Light bending intensification */
    &::before {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.15) 0%,
        transparent 20%,
        transparent 80%,
        rgba(255, 255, 255, 0.15) 100%
      );
    }
    
    &::after {
      opacity: 1;
      background: 
        radial-gradient(ellipse at 50% 50%, 
          rgba(255, 255, 255, 0.2) 0%, 
          rgba(255, 255, 255, 0.08) 50%,
          transparent 100%
        );
    }
  }
  
  /* Active state - gel-like compression */
  &:active {
    transform: scale(0.998);
    backdrop-filter: 
      blur(${props => props.isLowTransparency ? '18px' : '28px'})
      saturate(160%)
      brightness(108%)
      contrast(115%);
  }
  
  /* Adaptive behavior for content separation */
  ${props => !props.isLowTransparency && `
    /* Increase shadow opacity over bright content */
    &[data-content-light="true"] {
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.35),
        0 8px 16px -4px rgba(0, 0, 0, 0.18),
        0 0 0 1px rgba(255, 255, 255, 0.08),
        0 2px 8px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        inset 0 -1px 0 rgba(255, 255, 255, 0.04);
    }
    
    /* Reduce shadow opacity over dark content */
    &[data-content-dark="true"] {
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.15),
        0 8px 16px -4px rgba(0, 0, 0, 0.08),
        0 0 0 1px rgba(255, 255, 255, 0.12),
        0 1px 4px rgba(0, 0, 0, 0.06),
        inset 0 1px 0 rgba(255, 255, 255, 0.18),
        inset 0 -1px 0 rgba(255, 255, 255, 0.06);
    }
  `}
  


  /* Tablet optimization - maintain rich liquid glass effects */
  @media (max-width: 1024px) and (min-width: 769px) {
    padding: 50px 70px;
    border-radius: 42px;
    
    &::before {
      border-radius: 42px;
    }
    
    &::after {
      border-radius: 21px;
      top: 7px;
      left: 7px;
    }
  }
  
  /* Mobile optimization - simplified for performance and readability */
  @media (max-width: 768px) {
    padding: 25px 35px;
    border-radius: 24px;
    margin: 20px 0;
    
    /* Reduce blur for mobile performance */
    backdrop-filter: 
      blur(${props => props.isLowTransparency ? '15px' : '20px'})
      saturate(140%)
      brightness(108%)
      contrast(110%);
    
    /* Simplified shadows for mobile */
    box-shadow: 
      0 15px 30px -8px rgba(0, 0, 0, 0.2),
      0 5px 12px -3px rgba(0, 0, 0, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.12),
      inset 0 -1px 0 rgba(255, 255, 255, 0.04);
    
    &::before {
      border-radius: 24px;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.08) 0%,
        transparent 30%,
        transparent 70%,
        rgba(255, 255, 255, 0.08) 100%
      );
    }
    
    &::after {
      border-radius: 12px;
      top: 4px;
      left: 4px;
      width: 35%;
      height: 25%;
      filter: blur(0.5px);
      opacity: 0.6;
    }
    
    /* Simplified hover states for mobile */
    &:hover {
      backdrop-filter: 
        blur(${props => props.isLowTransparency ? '18px' : '25px'})
        saturate(160%)
        brightness(112%)
        contrast(115%);
      
      box-shadow: 
        0 20px 40px -8px rgba(0, 0, 0, 0.25),
        0 8px 16px -3px rgba(0, 0, 0, 0.12),
        0 2px 6px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        inset 0 -1px 0 rgba(255, 255, 255, 0.06);
      
      &::before {
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.12) 0%,
          transparent 25%,
          transparent 75%,
          rgba(255, 255, 255, 0.12) 100%
        );
      }
      
      &::after {
        opacity: 0.8;
      }
    }
  }
  
  /* Small mobile phones - ultra-compact design */
  @media (max-width: 480px) {
    padding: 20px 25px;
    border-radius: 20px;
    margin: 15px 0;
    
    /* Further reduced effects for small screens */
    backdrop-filter: 
      blur(${props => props.isLowTransparency ? '12px' : '16px'})
      saturate(130%)
      brightness(106%)
      contrast(105%);
    
    /* Minimal shadows for performance */
    box-shadow: 
      0 10px 20px -6px rgba(0, 0, 0, 0.18),
      0 4px 8px -2px rgba(0, 0, 0, 0.08),
      0 1px 2px rgba(0, 0, 0, 0.06),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    &::before {
      border-radius: 20px;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.06) 0%,
        transparent 35%,
        transparent 65%,
        rgba(255, 255, 255, 0.06) 100%
      );
    }
    
    &::after {
      border-radius: 10px;
      top: 3px;
      left: 3px;
      width: 30%;
      height: 20%;
      filter: none;
      opacity: 0.5;
    }
    
    /* Touch-optimized states */
    &:active {
      transform: scale(0.995);
      backdrop-filter: 
        blur(${props => props.isLowTransparency ? '10px' : '14px'})
        saturate(120%)
        brightness(104%)
        contrast(102%);
    }
  }
`;

const TimeDisplay = styled(motion.div)<{ fontSize: string; theme: any }>`
  /* Desktop and tablet font sizes - rich visual experience */
  font-size: ${props => {
    switch (props.fontSize) {
      case 'small': return 'clamp(4rem, 10vw, 7rem)';
      case 'medium': return 'clamp(5rem, 12vw, 9rem)';
      case 'large': return 'clamp(6rem, 14vw, 11rem)';
      case 'xl': return 'clamp(7rem, 16vw, 13rem)';
      default: return 'clamp(6rem, 14vw, 11rem)';
    }
  }};
  
  /* Liquid Glass Typography - Ultra-clear and readable */
  font-weight: 400;
  letter-spacing: -0.015em;
  margin-bottom: 0;
  text-align: center;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
  position: relative;
  z-index: 20;
  
  /* Crystal clear text optimized for liquid glass material */
  color: rgba(255, 255, 255, 0.98);
  
  /* Advanced text rendering for clarity */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  -webkit-text-size-adjust: 100%;
  
  /* Adaptive shadow system for content separation */
  text-shadow: 
    /* Primary contrast shadow */
    0 2px 4px rgba(0, 0, 0, 0.6),
    0 4px 8px rgba(0, 0, 0, 0.4),
    0 6px 12px rgba(0, 0, 0, 0.25),
    /* Edge definition */
    1px 1px 2px rgba(0, 0, 0, 0.7),
    -1px -1px 2px rgba(0, 0, 0, 0.7),
    /* Legibility glow */
    0 0 15px rgba(255, 255, 255, 0.15);
  
  /* Light interaction effects for liquid glass */
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: 
      radial-gradient(ellipse at 50% 20%, 
        rgba(255, 255, 255, 0.03) 0%, 
        transparent 60%
      );
    border-radius: 20px;
    pointer-events: none;
    z-index: -1;
  }
  
  /* Dynamic light bending on hover */
  &:hover::before {
    background: 
      radial-gradient(ellipse at 50% 20%, 
        rgba(255, 255, 255, 0.06) 0%, 
        rgba(255, 255, 255, 0.02) 40%,
        transparent 70%
      );
  }
  
  /* Mobile optimization - readability focused */
  @media (max-width: 768px) {
    /* Mobile-optimized font sizes */
    font-size: ${props => {
      switch (props.fontSize) {
        case 'small': return 'clamp(2.5rem, 8vw, 4rem)';
        case 'medium': return 'clamp(3rem, 10vw, 5rem)';
        case 'large': return 'clamp(3.5rem, 12vw, 6rem)';
        case 'xl': return 'clamp(4rem, 14vw, 7rem)';
        default: return 'clamp(3.5rem, 12vw, 6rem)';
      }
    }};
    
    line-height: 0.95;
    letter-spacing: -0.01em;
    
    /* Simplified text shadows for mobile performance */
    text-shadow: 
      0 1px 3px rgba(0, 0, 0, 0.8),
      0 2px 6px rgba(0, 0, 0, 0.4),
      1px 1px 1px rgba(0, 0, 0, 0.9),
      -1px -1px 1px rgba(0, 0, 0, 0.9),
      0 0 8px rgba(255, 255, 255, 0.1);
    
    /* Simplified light effects */
    &::before {
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: 
        radial-gradient(ellipse at 50% 20%, 
          rgba(255, 255, 255, 0.02) 0%, 
          transparent 50%
        );
      border-radius: 12px;
    }
    
    &:hover::before {
      background: 
        radial-gradient(ellipse at 50% 20%, 
          rgba(255, 255, 255, 0.04) 0%, 
          rgba(255, 255, 255, 0.01) 30%,
          transparent 60%
        );
    }
  }
  
  /* Small mobile phones - ultra-compact */
  @media (max-width: 480px) {
    /* Ultra-compact font sizes */
    font-size: ${props => {
      switch (props.fontSize) {
        case 'small': return 'clamp(2rem, 7vw, 3rem)';
        case 'medium': return 'clamp(2.5rem, 9vw, 4rem)';
        case 'large': return 'clamp(3rem, 11vw, 5rem)';
        case 'xl': return 'clamp(3.5rem, 13vw, 6rem)';
        default: return 'clamp(3rem, 11vw, 5rem)';
      }
    }};
    
    line-height: 1;
    letter-spacing: 0;
    
    /* Minimal text shadows for performance */
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.9),
      0 2px 4px rgba(0, 0, 0, 0.5),
      1px 1px 1px rgba(0, 0, 0, 1),
      -1px -1px 1px rgba(0, 0, 0, 1);
    
    /* Minimal light effects */
    &::before {
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: 
        radial-gradient(ellipse at 50% 20%, 
          rgba(255, 255, 255, 0.015) 0%, 
          transparent 40%
        );
      border-radius: 8px;
    }
    
    &:hover::before {
      background: 
        radial-gradient(ellipse at 50% 20%, 
          rgba(255, 255, 255, 0.03) 0%, 
          transparent 50%
        );
    }
  }
  
  /* Accessibility and contrast optimization */
  @media (prefers-contrast: high) {
    color: white;
    text-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.9),
      0 4px 8px rgba(0, 0, 0, 0.8),
      0 6px 12px rgba(0, 0, 0, 0.6),
      2px 2px 4px rgba(0, 0, 0, 0.9),
      -2px -2px 4px rgba(0, 0, 0, 0.9),
      0 0 20px rgba(255, 255, 255, 0.3);
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    &::before {
      display: none;
    }
  }
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
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: clamp(0.9rem, 2.5vw, 1.3rem);
    margin-bottom: 25px;
    letter-spacing: 0.08em;
    
    /* Simplified shadows for mobile performance */
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.8),
      0 2px 4px rgba(0, 0, 0, 0.6),
      1px 1px 1px rgba(0, 0, 0, 0.9),
      -1px -1px 1px rgba(0, 0, 0, 0.9),
      0 0 8px rgba(255, 255, 255, 0.15);
  }
  
  /* Small mobile phones */
  @media (max-width: 480px) {
    font-size: clamp(0.8rem, 2vw, 1.1rem);
    margin-bottom: 20px;
    letter-spacing: 0.06em;
    
    /* Minimal shadows for performance */
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.9),
      1px 1px 1px rgba(0, 0, 0, 1),
      -1px -1px 1px rgba(0, 0, 0, 1);
  }
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
  
  /* Mobile optimization */
  @media (max-width: 768px) {
    font-size: 0.4em;
    margin-left: 0.12em;
    
    /* Simplified shadows for mobile performance */
    text-shadow: 
      0 1px 2px rgba(0, 0, 0, 0.9),
      1px 1px 1px rgba(0, 0, 0, 1),
      -1px -1px 1px rgba(0, 0, 0, 1),
      0 0 6px rgba(255, 255, 255, 0.15);
  }
  
  /* Small mobile phones */
  @media (max-width: 480px) {
    font-size: 0.35em;
    margin-left: 0.1em;
    
    /* Minimal shadows for performance */
    text-shadow: 
      0 1px 1px rgba(0, 0, 0, 1),
      1px 1px 0px rgba(0, 0, 0, 1),
      -1px -1px 0px rgba(0, 0, 0, 1);
  }
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
  
  /* Mobile optimization - simplified depth layer */
  @media (max-width: 768px) {
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    border-radius: 20px;
    
    backdrop-filter: blur(12px) saturate(110%);
    
    /* Simplified shadows for mobile */
    box-shadow: 
      inset 0 1px 2px rgba(255, 255, 255, 0.15),
      inset 0 -1px 2px rgba(0, 0, 0, 0.03);
    
    &::before {
      top: 3px;
      left: 3px;
      width: 50%;
      height: 30%;
      border-radius: 15px;
      filter: blur(1px);
      background: 
        radial-gradient(ellipse at 40% 30%, 
          rgba(255, 255, 255, 0.1) 0%, 
          rgba(255, 255, 255, 0.05) 50%,
          transparent 100%
        );
    }
  }
  
  /* Small mobile phones - minimal depth layer */
  @media (max-width: 480px) {
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    border-radius: 16px;
    
    backdrop-filter: blur(8px) saturate(105%);
    
    /* Minimal shadows for performance */
    box-shadow: 
      inset 0 1px 1px rgba(255, 255, 255, 0.1);
    
    &::before {
      top: 2px;
      left: 2px;
      width: 40%;
      height: 25%;
      border-radius: 10px;
      filter: none;
      background: 
        radial-gradient(ellipse at 40% 30%, 
          rgba(255, 255, 255, 0.08) 0%, 
          transparent 60%
        );
    }
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
  
  /* Mobile optimization - simplified orbs */
  @media (max-width: 768px) {
    width: ${(props) => Math.max(props.size * 0.7, 20)}px;
    height: ${(props) => Math.max(props.size * 0.7, 20)}px;
    
    background: 
      radial-gradient(circle at 35% 35%, 
        rgba(255, 255, 255, 0.15) 0%, 
        rgba(255, 255, 255, 0.08) 50%,
        rgba(255, 255, 255, 0.03) 100%
      );
    backdrop-filter: blur(10px);
    
    /* Simplified shadows for mobile */
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.1),
      0 2px 6px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 10px rgba(255, 255, 255, 0.05);
    
    /* Simplified highlight */
    &::before {
      background: radial-gradient(circle at 30% 30%, 
        rgba(255, 255, 255, 0.4) 0%, 
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      filter: blur(1px);
    }
  }
  
  /* Small mobile phones - hide some orbs for performance */
  @media (max-width: 480px) {
    /* Hide smaller orbs on very small screens */
    ${(props) => props.size < 40 && `
      display: none;
    `}
    
    width: ${(props) => Math.max(props.size * 0.5, 24)}px;
    height: ${(props) => Math.max(props.size * 0.5, 24)}px;
    
    background: 
      radial-gradient(circle at 35% 35%, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.05) 60%,
        transparent 100%
      );
    backdrop-filter: blur(6px);
    
    /* Minimal shadows for performance */
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    
    /* Minimal highlight */
    &::before {
      background: radial-gradient(circle at 30% 30%, 
        rgba(255, 255, 255, 0.3) 0%, 
        transparent 70%
      );
      filter: none;
    }
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
  
  &:active {
    transform: scale(0.95);
  }
  
  /* Mobile optimization - larger touch target */
  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
    width: 44px;
    height: 44px;
    font-size: 18px;
    
    /* Ensure minimum touch target size */
    min-width: 44px;
    min-height: 44px;
    
    /* Enhanced touch feedback */
    &:active {
      transform: scale(0.9);
      background: ${props => props.isActive ? 
        'rgba(255, 255, 255, 0.95)' : 
        'rgba(255, 255, 255, 0.4)'
      };
    }
  }
  
  /* Small mobile phones - even larger for better accessibility */
  @media (max-width: 480px) {
    top: 12px;
    right: 12px;
    width: 48px;
    height: 48px;
    font-size: 20px;
    
    /* Larger minimum touch target */
    min-width: 48px;
    min-height: 48px;
    
    /* Simplified backdrop for performance */
    backdrop-filter: blur(6px);
  }
`;

export const Clock: React.FC = () => {
  const { state } = useAppContext();
  const [time, setTime] = useState(new Date());
  const [showRipple, setShowRipple] = useState(false);
  const [isLowTransparency, setIsLowTransparency] = useState(false);
  const [backgroundLuminance, setBackgroundLuminance] = useState<'light' | 'dark' | 'auto'>('auto');
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
            data-content-light={backgroundLuminance === 'light'}
            data-content-dark={backgroundLuminance === 'dark'}
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
              data-bg-light={backgroundLuminance === 'light'}
              data-bg-dark={backgroundLuminance === 'dark'}
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
              data-content-light={backgroundLuminance === 'light'}
              data-content-dark={backgroundLuminance === 'dark'}
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
                data-bg-light={backgroundLuminance === 'light'}
                data-bg-dark={backgroundLuminance === 'dark'}
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