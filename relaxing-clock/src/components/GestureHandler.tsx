import React, { useRef, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface GestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

export const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  onDoubleTap,
  onLongPress,
}) => {
  const { state, dispatch } = useAppContext();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Touch tracking
  const touchStartRef = useRef<TouchPoint | null>(null);
  const lastTouchRef = useRef<TouchPoint | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);
  
  // Pinch tracking
  const initialDistanceRef = useRef<number>(0);
  const lastScaleRef = useRef<number>(1);

  // Helper functions
  const getDistance = (touch1: Touch, touch2: Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchPoint = (touch: Touch): TouchPoint => ({
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now(),
  });

  const isSwipe = (start: TouchPoint, end: TouchPoint): boolean => {
    const distance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
    const time = end.timestamp - start.timestamp;
    const velocity = distance / time;
    
    return distance > 50 && velocity > 0.3; // Minimum distance and velocity for swipe
  };

  const getSwipeDirection = (start: TouchPoint, end: TouchPoint): string => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'right' : 'left';
    } else {
      return dy > 0 ? 'down' : 'up';
    }
  };

  // Gesture handlers
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!state.userPreferences.gesturesEnabled) return;

    const touch = e.touches[0];
    const touchPoint = getTouchPoint(touch);
    
    touchStartRef.current = touchPoint;
    lastTouchRef.current = touchPoint;

    // Handle pinch start
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      initialDistanceRef.current = distance;
      lastScaleRef.current = 1;
    }

    // Handle long press
    if (onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        if (state.userPreferences.hapticsEnabled && navigator.vibrate) {
          navigator.vibrate(100);
        }
        onLongPress();
      }, 500);
    }

    // Handle double tap detection
    const now = Date.now();
    if (now - lastTapRef.current < 300 && onDoubleTap) {
      onDoubleTap();
      lastTapRef.current = 0; // Reset to prevent triple tap
    } else {
      lastTapRef.current = now;
    }
  }, [state.userPreferences, onLongPress, onDoubleTap]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!state.userPreferences.gesturesEnabled) return;
    
    e.preventDefault();

    // Clear long press timer on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle pinch
    if (e.touches.length === 2 && onPinch) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistanceRef.current;
      
      if (Math.abs(scale - lastScaleRef.current) > 0.1) {
        onPinch(scale);
        lastScaleRef.current = scale;
      }
    }

    // Update last touch for swipe detection
    if (e.touches.length === 1) {
      lastTouchRef.current = getTouchPoint(e.touches[0]);
    }
  }, [state.userPreferences, onPinch]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!state.userPreferences.gesturesEnabled) return;

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Handle swipe detection
    if (touchStartRef.current && lastTouchRef.current && e.changedTouches.length === 1) {
      const endPoint = getTouchPoint(e.changedTouches[0]);
      
      if (isSwipe(touchStartRef.current, endPoint)) {
        const direction = getSwipeDirection(touchStartRef.current, endPoint);
        
        // Haptic feedback for swipes
        if (state.userPreferences.hapticsEnabled && navigator.vibrate) {
          navigator.vibrate(50);
        }

        switch (direction) {
          case 'left':
            onSwipeLeft?.();
            break;
          case 'right':
            onSwipeRight?.();
            break;
          case 'up':
            onSwipeUp?.();
            break;
          case 'down':
            onSwipeDown?.();
            break;
        }
      }
    }

    // Reset tracking
    touchStartRef.current = null;
    lastTouchRef.current = null;
  }, [state.userPreferences, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  // Keyboard gesture shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!state.userPreferences.gesturesEnabled) return;

    // Don't trigger if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'arrowleft':
        e.preventDefault();
        onSwipeLeft?.();
        break;
      case 'arrowright':
        e.preventDefault();
        onSwipeRight?.();
        break;
      case 'arrowup':
        e.preventDefault();
        onSwipeUp?.();
        break;
      case 'arrowdown':
        e.preventDefault();
        onSwipeDown?.();
        break;
      case 'enter':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onDoubleTap?.();
        }
        break;
      case ' ':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          onLongPress?.();
        }
        break;
    }
  }, [state.userPreferences, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, onLongPress]);

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleKeyDown]);

  return (
    <div
      ref={containerRef}
      style={{ 
        width: '100%', 
        height: '100%',
        touchAction: state.userPreferences.gesturesEnabled ? 'manipulation' : 'auto',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );
};

// Higher-order component for adding gesture support to any component
export const withGestures = <P extends object>(
  Component: React.ComponentType<P>,
  gestureConfig?: Partial<GestureHandlerProps>
) => {
  return (props: P) => (
    <GestureHandler {...gestureConfig}>
      <Component {...props} />
    </GestureHandler>
  );
};

// Hook for detecting device capabilities
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = React.useState({
    hasTouch: false,
    hasHaptics: false,
    hasMotion: false,
    hasOrientation: false,
    isMobile: false,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      setCapabilities({
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasHaptics: 'vibrate' in navigator,
        hasMotion: 'DeviceMotionEvent' in window,
        hasOrientation: 'DeviceOrientationEvent' in window,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      });
    };

    checkCapabilities();
    window.addEventListener('resize', checkCapabilities);
    
    return () => window.removeEventListener('resize', checkCapabilities);
  }, []);

  return capabilities;
};

// Hook for gesture shortcuts
export const useGestureShortcuts = () => {
  const { dispatch } = useAppContext();

  const shortcuts = React.useMemo(() => ({
    // Navigation shortcuts
    openSettings: () => dispatch({ type: 'TOGGLE_SETTINGS' }),
    goBack: () => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'main' }),
    
    // Mode switching shortcuts
    switchToTimer: () => dispatch({ type: 'SET_ACTIVE_MODE', payload: 'timer' }),
    switchToClock: () => dispatch({ type: 'SET_ACTIVE_MODE', payload: 'clock' }),
    switchToBreathing: () => dispatch({ type: 'SET_ACTIVE_MODE', payload: 'breathing' }),
    
    // Theme shortcuts
    openThemes: () => dispatch({ type: 'SET_CURRENT_VIEW', payload: 'themes' }),
    
    // Fullscreen shortcuts
    toggleFullscreen: () => dispatch({ type: 'TOGGLE_FULLSCREEN' }),
    
    // Audio shortcuts
    toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
  }), [dispatch]);

  return shortcuts;
}; 