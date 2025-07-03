import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { createCustomTheme, getContrastColor } from '../themes';
import { CustomTheme } from '../types';

const CreatorContainer = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  overflow-y: auto;
`;

const CreatorHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
`;

const BackButton = styled.button<{ theme: any }>`
  background: none;
  border: none;
  color: ${props => props.theme.textColor};
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 5px;
  border-radius: 4px;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const PreviewSection = styled.div`
  margin-bottom: 25px;
`;

const PreviewTitle = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 15px;
  opacity: 0.9;
`;

const ThemePreview = styled.div<{ previewTheme: any }>`
  width: 100%;
  height: 120px;
  border-radius: 12px;
  background: ${props => props.previewTheme.background};
  color: ${props => props.previewTheme.textColor};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
`;

const PreviewClock = styled.div<{ previewTheme: any }>`
  font-size: 2rem;
  font-weight: 300;
  color: ${props => props.previewTheme.textColor};
  text-align: center;
`;

const PreviewAccent = styled.div<{ previewTheme: any }>`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.previewTheme.accentColor};
`;

const ControlSection = styled.div`
  margin-bottom: 25px;
`;

const ControlTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 15px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
  font-size: 0.9rem;
  opacity: 0.9;
  min-width: 100px;
`;

const Input = styled.input<{ theme: any }>`
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  min-width: 100px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
  }
`;

const ColorInput = styled.input<{ theme: any }>`
  width: 50px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: none;
  cursor: pointer;
  overflow: hidden;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 6px;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ToggleButton = styled.button<{ theme: any; isActive: boolean }>`
  flex: 1;
  padding: 10px 15px;
  border: none;
  background: ${props => props.isActive ? props.theme.accentColor : 'transparent'};
  color: ${props => props.isActive ? 'white' : props.theme.textColor};
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isActive ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const GradientBuilder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 15px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const GradientPreview = styled.div<{ gradient: string }>`
  width: 100%;
  height: 40px;
  border-radius: 6px;
  background: ${props => props.gradient};
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const SaveSection = styled.div`
  margin-top: auto;
  padding-top: 20px;
`;

const SaveButton = styled(motion.button)<{ theme: any; isValid: boolean }>`
  width: 100%;
  padding: 15px;
  border-radius: 12px;
  border: none;
  background: ${props => props.isValid ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isValid ? 'white' : props.theme.textColor};
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.isValid ? 'pointer' : 'not-allowed'};
  opacity: ${props => props.isValid ? 1 : 0.5};
  transition: all 0.2s;

  &:hover {
    transform: ${props => props.isValid ? 'scale(1.02)' : 'none'};
  }

  &:active {
    transform: ${props => props.isValid ? 'scale(0.98)' : 'none'};
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 5px;
  opacity: 0.8;
`;

export const ThemeCreator: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [themeName, setThemeName] = useState('');
  const [backgroundType, setBackgroundType] = useState<'solid' | 'gradient'>('gradient');
  const [primaryColor, setPrimaryColor] = useState('#667eea');
  const [secondaryColor, setSecondaryColor] = useState('#764ba2');
  const [textColor, setTextColor] = useState('#ffffff');
  const [accentColor, setAccentColor] = useState('#a8edea');
  const [gradientDirection, setGradientDirection] = useState(135);
  const [error, setError] = useState('');

  // Generate preview theme
  const previewTheme = React.useMemo(() => {
    const background = backgroundType === 'gradient'
      ? `linear-gradient(${gradientDirection}deg, ${primaryColor} 0%, ${secondaryColor} 100%)`
      : primaryColor;

    return {
      name: themeName || 'Custom Theme',
      background,
      textColor,
      accentColor,
      gradientStart: backgroundType === 'gradient' ? primaryColor : undefined,
      gradientEnd: backgroundType === 'gradient' ? secondaryColor : undefined,
    };
  }, [themeName, backgroundType, primaryColor, secondaryColor, textColor, accentColor, gradientDirection]);

  // Auto-generate contrasting text color
  useEffect(() => {
    if (backgroundType === 'solid') {
      const contrastColor = getContrastColor(primaryColor);
      setTextColor(contrastColor);
    }
  }, [primaryColor, backgroundType]);

  // Validation
  const isValid = React.useMemo(() => {
    if (!themeName.trim()) {
      setError('Theme name is required');
      return false;
    }
    if (themeName.length < 3) {
      setError('Theme name must be at least 3 characters');
      return false;
    }
    if (state.customThemes.some(theme => theme.name.toLowerCase() === themeName.toLowerCase())) {
      setError('Theme name already exists');
      return false;
    }
    setError('');
    return true;
  }, [themeName, state.customThemes]);

  const handleSave = () => {
    if (!isValid) return;

    const customTheme: CustomTheme = {
      id: `custom-${Date.now()}`,
      name: themeName,
      background: previewTheme.background,
      textColor,
      accentColor,
      gradientStart: previewTheme.gradientStart,
      gradientEnd: previewTheme.gradientEnd,
      isCustom: true,
      category: 'custom',
      createdAt: Date.now(),
      backgroundType,
      gradientDirection: backgroundType === 'gradient' ? gradientDirection : undefined,
    };

    dispatch({ type: 'ADD_CUSTOM_THEME', payload: customTheme });
    dispatch({ type: 'SET_THEME', payload: customTheme });
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'themes' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'themes' });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: state.clockSettings.format === '12'
    });
  };

  return (
    <CreatorContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <CreatorHeader>
        <Title>Create Custom Theme</Title>
        <BackButton theme={state.currentTheme} onClick={handleBack}>
          ←
        </BackButton>
      </CreatorHeader>

      <PreviewSection>
        <PreviewTitle>Preview</PreviewTitle>
        <ThemePreview previewTheme={previewTheme}>
          <PreviewClock previewTheme={previewTheme}>
            {getCurrentTime()}
          </PreviewClock>
          <PreviewAccent previewTheme={previewTheme} />
        </ThemePreview>
      </PreviewSection>

      <ControlSection>
        <ControlTitle>Theme Details</ControlTitle>
        <ControlGroup>
          <ControlRow>
            <Label>Name</Label>
            <Input
              theme={state.currentTheme}
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              placeholder="My Custom Theme"
              maxLength={30}
            />
          </ControlRow>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ControlGroup>
      </ControlSection>

      <ControlSection>
        <ControlTitle>Background</ControlTitle>
        <ControlGroup>
          <ControlRow>
            <Label>Type</Label>
            <ToggleGroup>
              <ToggleButton
                theme={state.currentTheme}
                isActive={backgroundType === 'solid'}
                onClick={() => setBackgroundType('solid')}
              >
                Solid
              </ToggleButton>
              <ToggleButton
                theme={state.currentTheme}
                isActive={backgroundType === 'gradient'}
                onClick={() => setBackgroundType('gradient')}
              >
                Gradient
              </ToggleButton>
            </ToggleGroup>
          </ControlRow>

          <ControlRow>
            <Label>Primary Color</Label>
            <ColorInput
              theme={state.currentTheme}
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
            />
          </ControlRow>

          {backgroundType === 'gradient' && (
            <>
              <ControlRow>
                <Label>Secondary Color</Label>
                <ColorInput
                  theme={state.currentTheme}
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                />
              </ControlRow>

              <ControlRow>
                <Label>Direction</Label>
                <Input
                  theme={state.currentTheme}
                  type="range"
                  min="0"
                  max="360"
                  value={gradientDirection}
                  onChange={(e) => setGradientDirection(parseInt(e.target.value))}
                />
              </ControlRow>

              <GradientBuilder>
                <Label>Gradient Preview</Label>
                <GradientPreview 
                  gradient={`linear-gradient(${gradientDirection}deg, ${primaryColor} 0%, ${secondaryColor} 100%)`}
                />
              </GradientBuilder>
            </>
          )}
        </ControlGroup>
      </ControlSection>

      <ControlSection>
        <ControlTitle>Colors</ControlTitle>
        <ControlGroup>
          <ControlRow>
            <Label>Text Color</Label>
            <ColorInput
              theme={state.currentTheme}
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
          </ControlRow>

          <ControlRow>
            <Label>Accent Color</Label>
            <ColorInput
              theme={state.currentTheme}
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
            />
          </ControlRow>
        </ControlGroup>
      </ControlSection>

      <SaveSection>
        <SaveButton
          theme={state.currentTheme}
          isValid={isValid}
          onClick={handleSave}
          whileHover={{ scale: isValid ? 1.02 : 1 }}
          whileTap={{ scale: isValid ? 0.98 : 1 }}
          disabled={!isValid}
        >
          {isValid ? 'Create Theme' : 'Fix Errors to Continue'}
        </SaveButton>
      </SaveSection>
    </CreatorContainer>
  );
}; 