import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { getCategorizedThemes } from '../themes';
import { Theme, CustomTheme } from '../types';

const GalleryContainer = styled(motion.div)<{ theme: any }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.theme.background};
  color: ${props => props.theme.textColor};
  padding: 20px;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
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

const HeaderControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const SearchInput = styled.input<{ theme: any }>`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 15px;
  color: ${props => props.theme.textColor};
  font-size: 0.9rem;
  width: 200px;
  transition: all 0.2s;

  &::placeholder {
    color: ${props => props.theme.textColor};
    opacity: 0.6;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
    background: rgba(255, 255, 255, 0.15);
  }
`;

const CreateButton = styled(motion.button)<{ theme: any }>`
  background: ${props => props.theme.accentColor};
  color: white;
  border: none;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
  }
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

const CategoryTabs = styled.div`
  display: flex;
  gap: 5px;
  margin-bottom: 25px;
  overflow-x: auto;
  padding-bottom: 5px;
`;

const CategoryTab = styled(motion.button)<{ theme: any; isActive: boolean }>`
  background: ${props => props.isActive ? props.theme.accentColor : 'transparent'};
  color: ${props => props.isActive ? 'white' : props.theme.textColor};
  border: 1px solid ${props => props.isActive ? props.theme.accentColor : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.isActive ? props.theme.accentColor : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const ThemeCard = styled(motion.div)<{ theme: any; previewTheme: any; isSelected: boolean }>`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.isSelected ? props.theme.accentColor : 'transparent'};
  transition: all 0.3s ease;
  background: ${props => props.previewTheme.background};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
`;

const ThemePreview = styled.div<{ previewTheme: any }>`
  width: 100%;
  height: 120px;
  background: ${props => props.previewTheme.background};
  position: relative;
  overflow: hidden;
`;

const ThemeInfo = styled.div<{ theme: any; previewTheme: any }>`
  padding: 15px;
  background: ${props => props.theme.background};
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ThemeName = styled.h3<{ theme: any }>`
  margin: 0 0 5px 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.theme.textColor};
`;

const ThemeCategory = styled.span<{ theme: any }>`
  font-size: 0.8rem;
  opacity: 0.7;
  color: ${props => props.theme.textColor};
  text-transform: capitalize;
`;

const ThemeActions = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  opacity: 0;
  transition: opacity 0.2s;

  ${ThemeCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled(motion.button)<{ theme: any; variant?: 'danger' }>`
  background: ${props => props.variant === 'danger' ? '#ff4757' : 'rgba(255, 255, 255, 0.9)'};
  color: ${props => props.variant === 'danger' ? 'white' : '#333'};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);

  &:hover {
    transform: scale(1.1);
  }
`;

const ThemeAccent = styled.div<{ previewTheme: any }>`
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.previewTheme.accentColor};
  border: 2px solid rgba(255, 255, 255, 0.3);
`;

const ThemeText = styled.div<{ previewTheme: any }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: ${props => props.previewTheme.textColor};
  font-size: 1.2rem;
  font-weight: 300;
  text-align: center;
`;

const CustomBadge = styled.div<{ theme: any }>`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${props => props.theme.accentColor};
  color: white;
  font-size: 0.7rem;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 500;
`;

const EmptyState = styled.div<{ theme: any }>`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme.textColor};
  opacity: 0.7;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  margin: 0;
`;

const categories = [
  { key: 'all', label: 'All Themes', icon: '🎨' },
  { key: 'default', label: 'Default', icon: '⭐' },
  { key: 'nature', label: 'Nature', icon: '🌿' },
  { key: 'cosmic', label: 'Cosmic', icon: '🌌' },
  { key: 'minimal', label: 'Minimal', icon: '⚪' },
  { key: 'custom', label: 'Custom', icon: '🛠️' },
];

export const ThemeGallery: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categorizedThemes = getCategorizedThemes();
  const allThemes = [
    ...categorizedThemes.default,
    ...categorizedThemes.nature,
    ...categorizedThemes.cosmic,
    ...categorizedThemes.minimal,
    ...state.customThemes,
  ];

  const filteredThemes = useMemo(() => {
    let themes = activeCategory === 'all' 
      ? allThemes 
      : activeCategory === 'custom'
      ? state.customThemes
      : categorizedThemes[activeCategory as keyof typeof categorizedThemes] || [];

    if (searchQuery) {
      themes = themes.filter(theme => 
        theme.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return themes;
  }, [activeCategory, searchQuery, allThemes, categorizedThemes, state.customThemes]);

  const handleThemeSelect = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    dispatch({ type: 'TRACK_FEATURE_USAGE', payload: 'theme_changed' });
  };

  const handleDeleteCustomTheme = (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_CUSTOM_THEME', payload: themeId });
  };

  const handleCreateTheme = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'customize' });
  };

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' });
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: state.clockSettings.format === '12'
    });
  };

  return (
    <GalleryContainer
      theme={state.currentTheme}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <BackButton theme={state.currentTheme} onClick={handleBack}>
            ←
          </BackButton>
          <Title>Theme Gallery</Title>
        </div>
        
        <HeaderControls>
          <SearchInput
            theme={state.currentTheme}
            type="text"
            placeholder="Search themes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CreateButton
            theme={state.currentTheme}
            onClick={handleCreateTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Create
          </CreateButton>
        </HeaderControls>
      </Header>

      <CategoryTabs>
        {categories.map((category) => (
          <CategoryTab
            key={category.key}
            theme={state.currentTheme}
            isActive={activeCategory === category.key}
            onClick={() => setActiveCategory(category.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.icon} {category.label}
          </CategoryTab>
        ))}
      </CategoryTabs>

      {filteredThemes.length === 0 ? (
        <EmptyState theme={state.currentTheme}>
          <EmptyIcon>🎨</EmptyIcon>
          <EmptyText>
            {searchQuery 
              ? `No themes found for "${searchQuery}"`
              : 'No themes in this category'
            }
          </EmptyText>
        </EmptyState>
      ) : (
        <ThemeGrid>
          <AnimatePresence mode="popLayout">
            {filteredThemes.map((theme) => (
              <ThemeCard
                key={theme.name}
                theme={state.currentTheme}
                previewTheme={theme}
                isSelected={state.currentTheme.name === theme.name}
                onClick={() => handleThemeSelect(theme)}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <ThemePreview previewTheme={theme}>
                  <ThemeText previewTheme={theme}>
                    {getCurrentTime()}
                  </ThemeText>
                  <ThemeAccent previewTheme={theme} />
                  {theme.isCustom && (
                    <CustomBadge theme={state.currentTheme}>
                      Custom
                    </CustomBadge>
                  )}
                </ThemePreview>

                <ThemeActions>
                  {theme.isCustom && (
                    <ActionButton
                      theme={state.currentTheme}
                      variant="danger"
                      onClick={(e) => handleDeleteCustomTheme((theme as CustomTheme).id, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      🗑️
                    </ActionButton>
                  )}
                </ThemeActions>

                <ThemeInfo theme={state.currentTheme} previewTheme={theme}>
                  <ThemeName theme={state.currentTheme}>{theme.name}</ThemeName>
                  <ThemeCategory theme={state.currentTheme}>
                    {theme.category || 'default'}
                  </ThemeCategory>
                </ThemeInfo>
              </ThemeCard>
            ))}
          </AnimatePresence>
        </ThemeGrid>
      )}
    </GalleryContainer>
  );
}; 