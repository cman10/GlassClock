import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const WordContainer = styled(motion.div)<{ theme: any }>`
  position: relative;
  padding: 50px 60px;
  
  /* Liquid glass container */
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.10) 100%
  );
  backdrop-filter: blur(30px) saturate(120%);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  
  /* Glass shadows */
  box-shadow: 
    0 30px 60px rgba(0, 0, 0, 0.2),
    0 15px 30px rgba(0, 0, 0, 0.1),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(255, 255, 255, 0.1),
    0 0 40px rgba(255, 255, 255, 0.08);
  
  /* Glass highlight */
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 8px;
    width: 60%;
    height: 40%;
    background: radial-gradient(ellipse at 30% 30%, 
      rgba(255, 255, 255, 0.3) 0%, 
      rgba(255, 255, 255, 0.1) 50%,
      transparent 100%
    );
    border-radius: 20px;
    filter: blur(1px);
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    padding: 35px 45px;
    border-radius: 20px;
    
    &::before {
      border-radius: 16px;
    }
  }
`;

const WordGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  z-index: 2;
`;

const WordRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const Word = styled(motion.span)<{ 
  active: boolean; 
  theme: any; 
  size?: 'small' | 'medium' | 'large';
}>`
  font-size: ${props => {
    switch (props.size) {
      case 'small': return 'clamp(1.2rem, 3vw, 1.8rem)';
      case 'medium': return 'clamp(1.5rem, 4vw, 2.2rem)';
      case 'large': return 'clamp(1.8rem, 5vw, 2.6rem)';
      default: return 'clamp(1.5rem, 4vw, 2.2rem)';
    }
  }};
  
  font-weight: ${props => props.active ? '400' : '200'};
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  user-select: none;
  position: relative;
  
  /* Glass text effect */
  color: ${props => props.active ? 'transparent' : 'rgba(255, 255, 255, 0.3)'};
  
  ${props => props.active && `
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%,
      rgba(255, 255, 255, 0.7) 50%,
      rgba(255, 255, 255, 0.9) 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(255, 255, 255, 0.2);
  `}
  
  ${props => !props.active && `
    text-shadow: 
      0 0 10px rgba(255, 255, 255, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.2);
  `}
`;

const DateDisplay = styled(motion.div)<{ theme: any }>`
  text-align: center;
  margin-bottom: 30px;
  font-size: clamp(1rem, 2.5vw, 1.4rem);
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  
  /* Glass date text */
  color: transparent;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0.7) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  text-shadow: 
    0 0 15px rgba(255, 255, 255, 0.3),
    0 2px 6px rgba(0, 0, 0, 0.2);
`;

interface WordClockProps {
  time: Date;
  theme: any;
  language?: 'english' | 'spanish' | 'french' | 'german';
  showDate?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const WordClock: React.FC<WordClockProps> = ({
  time,
  theme,
  language = 'english',
  showDate = true,
  size = 'medium'
}) => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  
  // English word mappings
  const englishWords = {
    numbers: [
      'twelve', 'one', 'two', 'three', 'four', 'five', 'six',
      'seven', 'eight', 'nine', 'ten', 'eleven'
    ],
    minutes: {
      0: [],
      5: ['five', 'past'],
      10: ['ten', 'past'],
      15: ['quarter', 'past'],
      20: ['twenty', 'past'],
      25: ['twenty', 'five', 'past'],
      30: ['half', 'past'],
      35: ['twenty', 'five', 'to'],
      40: ['twenty', 'to'],
      45: ['quarter', 'to'],
      50: ['ten', 'to'],
      55: ['five', 'to']
    },
    base: ['it', 'is']
  };
  
  // Spanish word mappings
  const spanishWords = {
    numbers: [
      'doce', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis',
      'siete', 'ocho', 'nueve', 'diez', 'once'
    ],
    minutes: {
      0: [],
      5: ['cinco', 'y'],
      10: ['diez', 'y'],
      15: ['cuarto', 'y'],
      20: ['veinte', 'y'],
      25: ['veinticinco', 'y'],
      30: ['media', 'y'],
      35: ['veinticinco', 'menos'],
      40: ['veinte', 'menos'],
      45: ['cuarto', 'menos'],
      50: ['diez', 'menos'],
      55: ['cinco', 'menos']
    },
    base: ['son', 'las']
  };
  
  // Get current language words
  const words = language === 'spanish' ? spanishWords : englishWords;
  
  // Calculate displayed hour (12-hour format)
  const displayHour = hours % 12;
  const hourIndex = displayHour === 0 ? 0 : displayHour;
  
  // Round minutes to nearest 5
  const roundedMinutes = Math.round(minutes / 5) * 5;
  const minuteKey = roundedMinutes === 60 ? 0 : roundedMinutes;
  
  // Determine if we need next hour for "to" times
  const useNextHour = roundedMinutes > 30;
  const finalHourIndex = useNextHour ? (hourIndex + 1) % 12 : hourIndex;
  
  // Get active words
  const activeWords = [
    ...words.base,
    ...(words.minutes[minuteKey as keyof typeof words.minutes] || []),
    words.numbers[finalHourIndex]
  ];
  
  // All possible words for display
  const allWords = [
    ...words.base,
    ...words.numbers,
    'five', 'ten', 'quarter', 'twenty', 'half', 'past', 'to',
    // Spanish words
    'cinco', 'diez', 'cuarto', 'veinte', 'veinticinco', 'media', 'menos', 'son', 'las'
  ];
  
  // Filter unique words for current language
  const allDisplayWords = [
    ...words.base,
    ...words.numbers,
    ...Object.values(words.minutes).flat()
  ];
  const displayWords = Array.from(new Set(allDisplayWords));
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return date.toLocaleDateString(
      language === 'spanish' ? 'es-ES' : 
      language === 'french' ? 'fr-FR' :
      language === 'german' ? 'de-DE' : 'en-US',
      options
    );
  };
  
  // Create word grid layout
  const createWordGrid = () => {
    const rows = [];
    const wordsPerRow = 4;
    
    for (let i = 0; i < displayWords.length; i += wordsPerRow) {
      const rowWords = displayWords.slice(i, i + wordsPerRow);
      rows.push(rowWords);
    }
    
    return rows;
  };
  
  const wordGrid = createWordGrid();

  return (
    <WordContainer
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
      {/* Date display */}
      {showDate && (
        <DateDisplay
          theme={theme}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.5,
            type: "spring",
            stiffness: 120,
            damping: 15
          }}
        >
          {formatDate(time)}
        </DateDisplay>
      )}
      
      {/* Word grid */}
      <WordGrid>
        {wordGrid.map((row, rowIndex) => (
          <WordRow key={`row-${rowIndex}`}>
            {row.map((word, wordIndex) => {
              const isActive = activeWords.includes(word);
              const globalIndex = rowIndex * 4 + wordIndex;
              
              return (
                <Word
                  key={`word-${word}-${wordIndex}`}
                  active={isActive}
                  theme={theme}
                  size={size}
                  initial={{ 
                    opacity: 0, 
                    y: 20,
                    scale: 0.8
                  }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    scale: 1
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.7 + globalIndex * 0.1,
                    type: "spring",
                    stiffness: 120,
                    damping: 15
                  }}
                  whileHover={{
                    scale: isActive ? 1.1 : 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  {word}
                </Word>
              );
            })}
          </WordRow>
        ))}
      </WordGrid>
    </WordContainer>
  );
}; 