import { Theme } from '../types';

// Default themes (from Phase 1)
export const defaultTheme: Theme = {
  name: 'Midnight',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
  textColor: '#ffffff',
  accentColor: '#6c63ff',
  gradientStart: '#1a1a2e',
  gradientEnd: '#16213e',
  category: 'default'
};

// Core themes collection
export const coreThemes: Theme[] = [
  defaultTheme,
  {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #2E3192 0%, #1BFFFF 100%)',
    textColor: '#ffffff',
    accentColor: '#1BFFFF',
    gradientStart: '#2E3192',
    gradientEnd: '#1BFFFF',
    category: 'nature'
  },
  {
    name: 'Forest',
    background: 'linear-gradient(135deg, #134E5E 0%, #71B280 100%)',
    textColor: '#ffffff',
    accentColor: '#71B280',
    gradientStart: '#134E5E',
    gradientEnd: '#71B280',
    category: 'nature'
  },
  {
    name: 'Sunset',
    background: 'linear-gradient(135deg, #FA8072 0%, #FF6347 50%, #FFD700 100%)',
    textColor: '#ffffff',
    accentColor: '#FFD700',
    gradientStart: '#FA8072',
    gradientEnd: '#FFD700',
    category: 'nature'
  },
  {
    name: 'Light',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    textColor: '#212529',
    accentColor: '#007bff',
    gradientStart: '#f8f9fa',
    gradientEnd: '#e9ecef',
    category: 'minimal'
  },
  {
    name: 'Minimal',
    background: '#fafafa',
    textColor: '#333333',
    accentColor: '#6c63ff',
    category: 'minimal'
  }
];

// NEW: Premium themes for Phase 3
export const premiumThemes: Theme[] = [
  // Cosmic Collection
  {
    name: 'Nebula',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#a8edea',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    category: 'cosmic'
  },
  {
    name: 'Galaxy',
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 25%, #9b59b6 50%, #e74c3c 75%, #f39c12 100%)',
    textColor: '#ffffff',
    accentColor: '#f39c12',
    gradientStart: '#2c3e50',
    gradientEnd: '#f39c12',
    category: 'cosmic'
  },
  {
    name: 'Aurora',
    background: 'linear-gradient(135deg, #000428 0%, #004e92 35%, #009ffd 70%, #00d2ff 100%)',
    textColor: '#ffffff',
    accentColor: '#00d2ff',
    gradientStart: '#000428',
    gradientEnd: '#00d2ff',
    category: 'cosmic'
  },
  {
    name: 'Solar',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
    textColor: '#2c3e50',
    accentColor: '#e74c3c',
    gradientStart: '#ff9a9e',
    gradientEnd: '#fecfef',
    category: 'cosmic'
  },

  // Nature Collection Extended
  {
    name: 'Mountain',
    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    textColor: '#ffffff',
    accentColor: '#74b9ff',
    gradientStart: '#1e3c72',
    gradientEnd: '#2a5298',
    category: 'nature'
  },
  {
    name: 'Desert',
    background: 'linear-gradient(135deg, #f7931e 0%, #ffd200 100%)',
    textColor: '#2c3e50',
    accentColor: '#e17055',
    gradientStart: '#f7931e',
    gradientEnd: '#ffd200',
    category: 'nature'
  },
  {
    name: 'Arctic',
    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
    textColor: '#263238',
    accentColor: '#0277bd',
    gradientStart: '#e3f2fd',
    gradientEnd: '#bbdefb',
    category: 'nature'
  },
  {
    name: 'Rainforest',
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    textColor: '#ffffff',
    accentColor: '#55efc4',
    gradientStart: '#11998e',
    gradientEnd: '#38ef7d',
    category: 'nature'
  },

  // Minimal Collection Extended
  {
    name: 'Paper',
    background: '#fefefe',
    textColor: '#2c3e50',
    accentColor: '#74b9ff',
    category: 'minimal'
  },
  {
    name: 'Charcoal',
    background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
    textColor: '#ffffff',
    accentColor: '#fdcb6e',
    gradientStart: '#2c2c2c',
    gradientEnd: '#1a1a1a',
    category: 'minimal'
  },
  {
    name: 'Cream',
    background: 'linear-gradient(135deg, #fff8e1 0%, #f3e5ab 100%)',
    textColor: '#5d4037',
    accentColor: '#ff7043',
    gradientStart: '#fff8e1',
    gradientEnd: '#f3e5ab',
    category: 'minimal'
  },
  {
    name: 'Slate',
    background: 'linear-gradient(135deg, #434343 0%, #000000 100%)',
    textColor: '#ffffff',
    accentColor: '#81c784',
    gradientStart: '#434343',
    gradientEnd: '#000000',
    category: 'minimal'
  },

  // Default Collection Extended
  {
    name: 'Violet',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#a29bfe',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    category: 'default'
  },
  {
    name: 'Rose',
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    accentColor: '#fd79a8',
    gradientStart: '#f093fb',
    gradientEnd: '#f5576c',
    category: 'default'
  },
  {
    name: 'Emerald',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    accentColor: '#00b894',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    category: 'default'
  }
];

// All themes combined
export const themes: Theme[] = [...coreThemes, ...premiumThemes];

// Theme utilities
export const getThemesByCategory = (category: Theme['category']): Theme[] => {
  return themes.filter(theme => theme.category === category);
};

export const getThemeByName = (name: string): Theme | undefined => {
  return themes.find(theme => theme.name === name);
};

export const getCategorizedThemes = () => {
  return {
    default: getThemesByCategory('default'),
    nature: getThemesByCategory('nature'),
    cosmic: getThemesByCategory('cosmic'),
    minimal: getThemesByCategory('minimal'),
  };
};

export const createCustomTheme = (
  name: string,
  backgroundType: 'solid' | 'gradient',
  colors: { primary: string; secondary?: string },
  textColor: string,
  accentColor: string
): Theme => {
  const background = backgroundType === 'gradient' && colors.secondary
    ? `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`
    : colors.primary;

  return {
    name,
    background,
    textColor,
    accentColor,
    gradientStart: backgroundType === 'gradient' ? colors.primary : undefined,
    gradientEnd: backgroundType === 'gradient' ? colors.secondary : undefined,
    isCustom: true,
    category: 'custom'
  };
};

export const getContrastColor = (hexColor: string): string => {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

export const validateTheme = (theme: Partial<Theme>): boolean => {
  return !!(
    theme.name &&
    theme.background &&
    theme.textColor &&
    theme.accentColor
  );
};

// Accessibility helpers
export const getAccessibleTheme = (theme: Theme, accessibility: {
  highContrast?: boolean;
  colorBlindMode?: string;
  reducedMotion?: boolean;
}): Theme => {
  let accessibleTheme = { ...theme };

  // High contrast mode
  if (accessibility.highContrast) {
    accessibleTheme.textColor = accessibleTheme.textColor === '#ffffff' ? '#ffffff' : '#000000';
    accessibleTheme.background = accessibleTheme.textColor === '#ffffff' ? '#000000' : '#ffffff';
  }

  // Color blind adjustments
  if (accessibility.colorBlindMode && accessibility.colorBlindMode !== 'none') {
    // Simplified color blind adjustments
    switch (accessibility.colorBlindMode) {
      case 'protanopia':
        accessibleTheme.accentColor = '#0066cc'; // Blue
        break;
      case 'deuteranopia':
        accessibleTheme.accentColor = '#cc6600'; // Orange
        break;
      case 'tritanopia':
        accessibleTheme.accentColor = '#cc0066'; // Magenta
        break;
    }
  }

  return accessibleTheme;
}; 