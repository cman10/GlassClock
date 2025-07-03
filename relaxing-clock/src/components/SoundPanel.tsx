import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { ambientSoundsWithFallback, getSoundsByCategory } from '../data/ambientSounds';

const SoundContainer = styled.div`
  margin-bottom: 30px;
`;

const CategoryTitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 15px;
  opacity: 0.9;
  text-transform: capitalize;
`;

const SoundGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 20px;
`;

const SoundButton = styled(motion.button)<{ theme: any; isActive: boolean; isPlaying: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 12px;
  border: 2px solid ${props => props.isActive ? props.theme.accentColor : 'transparent'};
  background: ${props => props.isActive ? 
    `${props.theme.accentColor}20` : 
    'rgba(255, 255, 255, 0.05)'
  };
  color: ${props => props.theme.textColor};
  cursor: pointer;
  transition: all 0.2s;
  min-height: 80px;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => props.isActive ? 
      `${props.theme.accentColor}30` : 
      'rgba(255, 255, 255, 0.1)'
    };
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  ${props => props.isPlaying && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, ${props.theme.accentColor}30, transparent);
      animation: shimmer 2s infinite;
    }
  `}

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const SoundIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 6px;
`;

const SoundName = styled.div`
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.2;
  opacity: 0.9;
`;

const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
`;

const VolumeLabel = styled.label`
  font-size: 0.9rem;
  opacity: 0.9;
  min-width: 60px;
`;

const VolumeSlider = styled.input<{ theme: any }>`
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.accentColor};
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.accentColor};
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;

const VolumeValue = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
  min-width: 30px;
  text-align: right;
`;

const PlaybackControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
`;

const ControlButton = styled(motion.button)<{ theme: any; isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: ${props => props.isActive ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isActive ? 'white' : props.theme.textColor};
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isActive ? props.theme.accentColor : 'rgba(255, 255, 255, 0.2)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const CurrentlyPlaying = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
`;

const PlayingIcon = styled.div`
  font-size: 1.2rem;
`;

const PlayingText = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const SoundPanel: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { audioSettings } = state;

  const handleSoundSelect = (soundId: string) => {
    const sound = ambientSoundsWithFallback.find(s => s.id === soundId);
    if (!sound) return;

    if (audioSettings.currentSound?.id === soundId) {
      // Toggle current sound
      dispatch({ type: 'TOGGLE_SOUND' });
    } else {
      // Play new sound
      dispatch({ type: 'PLAY_SOUND', payload: sound });
    }
  };

  const handleVolumeChange = (volume: number) => {
    dispatch({ 
      type: 'UPDATE_AUDIO_SETTINGS', 
      payload: { volume } 
    });
  };

  const handleMuteToggle = () => {
    dispatch({ 
      type: 'UPDATE_AUDIO_SETTINGS', 
      payload: { isMuted: !audioSettings.isMuted } 
    });
  };

  const handleStopAll = () => {
    dispatch({ type: 'STOP_SOUND' });
  };

  const categories = ['nature', 'white-noise', 'focus'] as const;

  return (
    <>
      {audioSettings.currentSound && (
        <CurrentlyPlaying>
          <PlayingIcon>{audioSettings.currentSound.icon}</PlayingIcon>
          <PlayingText>
            {audioSettings.isPlaying ? 'Playing' : 'Paused'}: {audioSettings.currentSound.name}
          </PlayingText>
        </CurrentlyPlaying>
      )}

      <PlaybackControls>
        <ControlButton
          theme={state.currentTheme}
          onClick={() => dispatch({ type: 'TOGGLE_SOUND' })}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={audioSettings.isPlaying ? 'Pause' : 'Play'}
        >
          {audioSettings.isPlaying ? '⏸️' : '▶️'}
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          onClick={handleStopAll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Stop"
        >
          ⏹️
        </ControlButton>

        <ControlButton
          theme={state.currentTheme}
          isActive={audioSettings.isMuted}
          onClick={handleMuteToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={audioSettings.isMuted ? 'Unmute' : 'Mute'}
        >
          {audioSettings.isMuted ? '🔇' : '🔊'}
        </ControlButton>
      </PlaybackControls>

      <VolumeControl>
        <VolumeLabel>Volume</VolumeLabel>
        <VolumeSlider
          theme={state.currentTheme}
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={audioSettings.volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        />
        <VolumeValue>{Math.round(audioSettings.volume * 100)}%</VolumeValue>
      </VolumeControl>

      {categories.map(category => {
        const sounds = getSoundsByCategory(category);
        if (sounds.length === 0) return null;

        return (
          <SoundContainer key={category}>
            <CategoryTitle>{category.replace('-', ' ')}</CategoryTitle>
            <SoundGrid>
              {sounds.map(sound => (
                <SoundButton
                  key={sound.id}
                  theme={state.currentTheme}
                  isActive={audioSettings.currentSound?.id === sound.id}
                  isPlaying={audioSettings.currentSound?.id === sound.id && audioSettings.isPlaying}
                  onClick={() => handleSoundSelect(sound.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={sound.description}
                >
                  <SoundIcon>{sound.icon}</SoundIcon>
                  <SoundName>{sound.name}</SoundName>
                </SoundButton>
              ))}
            </SoundGrid>
          </SoundContainer>
        );
      })}
    </>
  );
}; 