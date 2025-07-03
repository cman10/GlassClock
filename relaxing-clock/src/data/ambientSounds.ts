import { AmbientSound } from '../types';

// For demo purposes, we'll use placeholder URLs
// In production, these would be actual audio files served from your assets
export const ambientSounds: AmbientSound[] = [
  // Nature Sounds
  {
    id: 'rain',
    name: 'Rain',
    url: 'https://www.soundjay.com/misc/sounds/rain-01.wav', // Placeholder
    category: 'nature',
    icon: '🌧️',
    description: 'Gentle rainfall for deep relaxation',
    isLoop: true,
    volume: 0.7,
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    url: 'https://www.soundjay.com/misc/sounds/ocean-waves.wav', // Placeholder
    category: 'nature',
    icon: '🌊',
    description: 'Rhythmic ocean waves for meditation',
    isLoop: true,
    volume: 0.6,
  },
  {
    id: 'forest',
    name: 'Forest',
    url: 'https://www.soundjay.com/misc/sounds/forest-sounds.wav', // Placeholder
    category: 'nature',
    icon: '🌲',
    description: 'Peaceful forest ambience with birds',
    isLoop: true,
    volume: 0.5,
  },
  {
    id: 'thunderstorm',
    name: 'Thunderstorm',
    url: 'https://www.soundjay.com/misc/sounds/thunderstorm.wav', // Placeholder
    category: 'nature',
    icon: '⛈️',
    description: 'Distant thunder and rain',
    isLoop: true,
    volume: 0.6,
  },
  {
    id: 'campfire',
    name: 'Campfire',
    url: 'https://www.soundjay.com/misc/sounds/campfire.wav', // Placeholder
    category: 'nature',
    icon: '🔥',
    description: 'Crackling campfire sounds',
    isLoop: true,
    volume: 0.4,
  },
  
  // White Noise
  {
    id: 'white-noise',
    name: 'White Noise',
    url: 'https://www.soundjay.com/misc/sounds/white-noise.wav', // Placeholder
    category: 'white-noise',
    icon: '📢',
    description: 'Pure white noise for focus',
    isLoop: true,
    volume: 0.5,
  },
  {
    id: 'pink-noise',
    name: 'Pink Noise',
    url: 'https://www.soundjay.com/misc/sounds/pink-noise.wav', // Placeholder
    category: 'white-noise',
    icon: '🎵',
    description: 'Balanced pink noise for sleep',
    isLoop: true,
    volume: 0.5,
  },
  {
    id: 'brown-noise',
    name: 'Brown Noise',
    url: 'https://www.soundjay.com/misc/sounds/brown-noise.wav', // Placeholder
    category: 'white-noise',
    icon: '🎶',
    description: 'Deep brown noise for concentration',
    isLoop: true,
    volume: 0.6,
  },
  
  // Focus Sounds
  {
    id: 'coffee-shop',
    name: 'Coffee Shop',
    url: 'https://www.soundjay.com/misc/sounds/coffee-shop.wav', // Placeholder
    category: 'focus',
    icon: '☕',
    description: 'Ambient coffee shop chatter',
    isLoop: true,
    volume: 0.4,
  },
  {
    id: 'library',
    name: 'Library',
    url: 'https://www.soundjay.com/misc/sounds/library.wav', // Placeholder
    category: 'focus',
    icon: '📚',
    description: 'Quiet library atmosphere',
    isLoop: true,
    volume: 0.3,
  },
];

// For development, we'll create silent audio data URLs as placeholders
// This prevents network errors while testing
const createSilentAudio = (duration: number = 10): string => {
  // Create a silent audio data URL
  return `data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBilJWP`; // Truncated for brevity
};

// Update sounds with silent audio for development
export const ambientSoundsWithFallback: AmbientSound[] = ambientSounds.map(sound => ({
  ...sound,
  url: createSilentAudio(), // Use silent audio for development
}));

export const getSoundsByCategory = (category: AmbientSound['category']): AmbientSound[] => {
  return ambientSoundsWithFallback.filter(sound => sound.category === category);
};

export const getSoundById = (id: string): AmbientSound | undefined => {
  return ambientSoundsWithFallback.find(sound => sound.id === id);
}; 