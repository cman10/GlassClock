import React, { useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

export const AudioManager: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, []);

  // Fade audio volume
  const fadeAudio = useCallback((targetVolume: number, duration: number, onComplete?: () => void) => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const startVolume = audio.volume;
    const volumeDifference = targetVolume - startVolume;
    const steps = 50;
    const stepTime = (duration * 1000) / steps;
    const stepVolume = volumeDifference / steps;

    let currentStep = 0;

    const fadeStep = () => {
      if (!audioRef.current) return;

      currentStep++;
      const newVolume = Math.max(0, Math.min(1, startVolume + (stepVolume * currentStep)));
      audioRef.current.volume = newVolume;

      if (currentStep < steps && Math.abs(newVolume - targetVolume) > 0.01) {
        fadeTimeoutRef.current = setTimeout(fadeStep, stepTime);
      } else {
        audioRef.current.volume = targetVolume;
        if (onComplete) onComplete();
      }
    };

    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }
    fadeStep();
  }, []);

  // Handle sound changes
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    const { currentSound, isPlaying, volume, isMuted, fadeInDuration, fadeOutDuration } = state.audioSettings;

    if (currentSound && isPlaying && !isMuted) {
      // Load new sound
      if (audio.src !== currentSound.url) {
        audio.src = currentSound.url;
        audio.load();
      }

      // Play with fade in
      audio.volume = 0;
      audio.play().then(() => {
        fadeAudio(volume, fadeInDuration);
      }).catch((error) => {
        console.warn('Audio playback failed:', error);
        dispatch({ type: 'STOP_SOUND' });
      });
    } else if (!isPlaying && audio.src) {
      // Fade out and pause
      fadeAudio(0, fadeOutDuration, () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      });
    }
  }, [state.audioSettings, fadeAudio, dispatch]);

  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;

    const { volume, isMuted, isPlaying } = state.audioSettings;
    if (isPlaying && !isMuted) {
      audioRef.current.volume = volume;
    } else if (isMuted) {
      audioRef.current.volume = 0;
    }
  }, [state.audioSettings.volume, state.audioSettings.isMuted, state.audioSettings.isPlaying]);

  // Handle audio events
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleError = () => {
      console.warn('Audio loading error');
      dispatch({ type: 'STOP_SOUND' });
    };

    const handleEnded = () => {
      // This shouldn't happen with loop=true, but just in case
      if (state.audioSettings.isPlaying) {
        audio.play().catch(handleError);
      }
    };

    const handleCanPlay = () => {
      console.log('Audio can play');
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [state.audioSettings.isPlaying, dispatch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
}; 