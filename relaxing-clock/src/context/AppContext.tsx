import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { 
  AppState, 
  AppAction, 
  ClockSettings, 
  AudioSettings, 
  TimerSettings, 
  TimerState, 
  BreathingState, 
  AlarmState,
  Alarm,
  UserPreferences, 
  CustomTheme, 
  Analytics, 
  SubscriptionPlan,
  AISettings,
  AIInsight,
  MoodEntry,
  SmartSchedule,
  HabitIntelligence,
  FocusSession,
  AdaptiveAudio,
  PredictiveModel,
  AIPersonality
} from '../types';
import { themes } from '../themes';
import { ambientSounds } from '../data/ambientSounds';

const defaultClockSettings: ClockSettings = {
  format: '12',
  showSeconds: true,
  showDate: true,
  dateFormat: 'short',
  customDateFormat: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  fontSize: 'large',
  customFontSize: 48,
  fontFamily: 'Inter',
  fontWeight: 'normal',
  letterSpacing: 0,
  showMilliseconds: false,
  clockStyle: 'digital',
  animationsEnabled: true,
  showWeather: false,
  weatherLocation: '',
  
  // Clock style specific settings
  analogStyle: 'modern',
  concentricRings: 4,
  neonGlow: true,
  matrixSpeed: 'medium',
  wordLanguage: 'english'
};

const defaultAudioSettings: AudioSettings = {
  currentSound: null,
  volume: 50,
  isPlaying: false,
  isMuted: false,
  fadeInDuration: 3,
  fadeOutDuration: 3,
  crossfadeDuration: 2,
  enableSpatialAudio: false,
  bassBoost: 0,
  trebleBoost: 0,
  reverbLevel: 0,
  smartMixing: false,
  adaptiveVolume: false
};

const defaultTimerSettings: TimerSettings = {
  mode: 'pomodoro',
  pomodoroWorkDuration: 25,
  pomodoroBreakDuration: 5,
  pomodoroLongBreakDuration: 15,
  pomodoroSessionsUntilLongBreak: 4,
  customDuration: 25,
  meditationDuration: 15,
  breathingInDuration: 4,
  breathingOutDuration: 4,
  breathingHoldDuration: 4,
  enableNotifications: true,
  notificationSound: 'chime',
  autoStartBreaks: false,
  autoStartWork: false,
  dimScreenDuringBreaks: false,
  flowtimeMinSession: 15,
  flowtimeBreakRatio: 15,
  timeboxingSlots: [],
  customIntervals: [],
  smartBreaks: false,
  adaptiveTiming: false,
  goalTracking: true,
  dailyGoal: 480,
  
  // Phase 5: AI-Optimized Timer Features
  aiOptimized: {
    enabled: false,
    baseDuration: 25,
    adaptToEnergy: true,
    adaptToMood: true,
    adaptToTime: true,
    adaptToHistory: true,
    maxDuration: 90,
    minDuration: 15,
    learningPeriod: 7
  },
  adaptiveDuration: false,
  contextAwareness: false
};

const defaultTimerState: TimerState = {
  isActive: false,
  isPaused: false,
  timeRemaining: 1500,
  totalTime: 1500,
  currentSession: 1,
  sessionType: 'work',
  completedSessions: 0,
  totalSessionsToday: 0,
  totalFocusTime: 0,
  streak: 0,
  currentInterval: 0,
  flowStartTime: 0,
  adaptiveBreakSuggestion: 0,
  distractionCount: 0,
  currentGoalProgress: 0
};

const defaultBreathingState: BreathingState = {
  isActive: false,
  currentPhase: 'inhale',
  cycleProgress: 0,
  totalCycles: 10,
  currentCycle: 0,
  pattern: '4-4-4',
  guidanceType: 'visual',
  sessionDuration: 600,
  heartRateVariability: 0,
  stressLevel: 0,
  guidedSession: ''
};

const defaultAlarmState: AlarmState = {
  alarms: [],
  activeAlarm: null,
  isAlarmScreenVisible: false,
  snoozeCount: 0,
  lastSnoozeTime: undefined
};

const defaultUserPreferences: UserPreferences = {
  language: 'en',
  region: 'US',
  currency: 'USD',
  firstDayOfWeek: 0,
  use24HourTime: false,
  temperatureUnit: 'celsius',
  gesturesEnabled: true,
  hapticsEnabled: true,
  reduceMotion: false,
  highContrast: false,
  largeFonts: false,
  colorBlindMode: 'none',
  analyticsEnabled: true,
  cloudSyncEnabled: false,
  smartNotifications: true,
  weatherIntegration: false,
  calendarIntegration: false,
  autoBackup: true,
  dataExportFormat: 'json',
  
  // Phase 5: AI Preferences
  aiFeatures: true,
  personalizedExperience: true,
  adaptiveBehavior: true
};

const defaultAnalytics: Analytics = {
  dailyStats: [],
  weeklyTrends: [],
  monthlyInsights: [],
  productivityScore: 0,
  streakData: {
    current: 0,
    longest: 0,
    weekly: 0,
    monthly: 0
  },
  focusPatterns: []
};

// Phase 5: AI Default States
const defaultAISettings: AISettings = {
  enabled: true,
  personality: {
    name: 'Smart Coach',
    style: 'friendly',
    tone: 'encouraging',
    expertise: ['productivity', 'wellness', 'habits'],
    responseLength: 'moderate',
    proactiveness: 7,
    adaptability: 8
  },
  features: {
    smartScheduling: true,
    moodTracking: true,
    habitCoaching: true,
    focusAssistant: true,
    adaptiveAudio: true,
    predictiveInsights: true,
    autoOptimization: false,
    privacyMode: false
  },
  dataRetention: {
    insights: 30,
    patterns: 90,
    personalData: 365
  },
  notifications: {
    insights: true,
    coaching: true,
    recommendations: true,
    reminders: true
  }
};

const defaultAdaptiveAudio: AdaptiveAudio = {
  enabled: true,
  learningMode: true,
  preferences: {
    morningTypes: ['nature-birds', 'gentle-rain'],
    afternoonTypes: ['white-noise-focus', 'coffee-shop'],
    eveningTypes: ['ambient-calm', 'soft-piano'],
    focusTypes: ['white-noise-focus', 'brown-noise'],
    relaxTypes: ['nature-ocean', 'ambient-calm'],
    creativTypes: ['ambient-space', 'soft-piano']
  },
  adaptations: [],
  effectiveness: {},
  contextualMixing: true,
  biofeedbackIntegration: false
};

const initialState: AppState = {
  currentTheme: themes[0],
  customThemes: [],
  clockSettings: defaultClockSettings,
  audioSettings: defaultAudioSettings,
  timerSettings: defaultTimerSettings,
  timerState: defaultTimerState,
  breathingState: defaultBreathingState,
  alarmState: defaultAlarmState,
  userPreferences: defaultUserPreferences,
  isFullscreen: false,
  isSettingsOpen: false,
  activeMode: 'clock',
  currentView: 'main',
  installPromptDismissed: false,
  onboardingCompleted: false,
  lastActiveDate: new Date().toISOString().split('T')[0],
  totalUsageTime: 0,
  featureUsage: {},
  subscription: undefined,
  weatherData: undefined,
  calendarEvents: [],
  analytics: defaultAnalytics,
  widgets: [],
  integrations: [],
  notifications: [],
  lastSyncTime: undefined,
  
  // Phase 5: AI Features
  aiSettings: defaultAISettings,
  aiInsights: [],
  moodEntries: [],
  smartSchedule: null,
  habitIntelligence: [],
  currentFocusSession: null,
  focusHistory: [],
  adaptiveAudio: defaultAdaptiveAudio,
  predictiveModels: [],
  aiPersonality: defaultAISettings.personality,
  learningData: {
    patterns: {},
    preferences: {},
    effectiveness: {}
  },

  // Phase 6: Advanced Analytics & ML
  advancedAnalytics: {
    id: 'analytics-default',
    userId: 'user-1',
    timeRange: 'week',
    insights: [],
    predictions: [],
    patterns: [],
    performance: {
      overall: 0,
      productivity: {
        score: 0,
        focusTime: 0,
        deepWorkSessions: 0,
        distractionRate: 0,
        completionRate: 0,
        qualityScore: 0,
        peakHours: [],
        trends: []
      },
      wellness: {
        score: 0,
        stressLevel: 5,
        energyLevel: 5,
        moodStability: 0,
        workLifeBalance: 0,
        burnoutRisk: 0,
        recoveryRate: 0,
        trends: []
      },
      consistency: {
        score: 0,
        habitStreak: 0,
        scheduleAdherence: 0,
        routineStability: 0,
        variability: 0,
        reliability: 0,
        trends: []
      },
      growth: {
        score: 0,
        improvementRate: 0,
        skillDevelopment: 0,
        goalAchievement: 0,
        learningVelocity: 0,
        adaptability: 0,
        trends: []
      },
      efficiency: {
        score: 0,
        timeUtilization: 0,
        taskOptimization: 0,
        resourceUsage: 0,
        automationLevel: 0,
        wasteReduction: 0,
        trends: []
      }
    },
    recommendations: [],
    dataQuality: {
      completeness: 0,
      accuracy: 0,
      consistency: 0,
      timeliness: 0,
      validity: 0,
      overall: 0,
      issues: [],
      lastAssessed: Date.now()
    },
    lastUpdated: Date.now()
  },
  mlModels: [],
  crossDeviceSync: {
    id: 'sync-default',
    userId: 'user-1',
    devices: [],
    syncStatus: {
      status: 'offline',
      progress: 0,
      pendingChanges: 0,
      bandwidth: 'high'
    },
    lastSync: Date.now(),
    conflicts: [],
    settings: {
      autoSync: true,
      syncFrequency: 'real-time',
      dataTypes: [],
      conflictResolution: 'latest',
      bandwidth: 'unlimited',
      encryption: true
    }
  },
  advancedIntegrations: [],
  performanceOptimization: {
    enabled: false,
    level: 'basic',
    metrics: {
      overall: 0,
      productivity: {
        score: 0,
        focusTime: 0,
        deepWorkSessions: 0,
        distractionRate: 0,
        completionRate: 0,
        qualityScore: 0,
        peakHours: [],
        trends: []
      },
      wellness: {
        score: 0,
        stressLevel: 5,
        energyLevel: 5,
        moodStability: 0,
        workLifeBalance: 0,
        burnoutRisk: 0,
        recoveryRate: 0,
        trends: []
      },
      consistency: {
        score: 0,
        habitStreak: 0,
        scheduleAdherence: 0,
        routineStability: 0,
        variability: 0,
        reliability: 0,
        trends: []
      },
      growth: {
        score: 0,
        improvementRate: 0,
        skillDevelopment: 0,
        goalAchievement: 0,
        learningVelocity: 0,
        adaptability: 0,
        trends: []
      },
      efficiency: {
        score: 0,
        timeUtilization: 0,
        taskOptimization: 0,
        resourceUsage: 0,
        automationLevel: 0,
        wasteReduction: 0,
        trends: []
      }
    },
    recommendations: []
  },
  dataExport: {
    formats: ['json', 'csv', 'pdf'],
    scheduledExports: [],
    lastExport: 0
  },
  privacySettings: {
    dataMinimization: true,
    anonymization: false,
    retentionPeriod: 365,
    shareAnalytics: false,
    localProcessing: true
  }
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, currentTheme: action.payload };
    
    case 'ADD_CUSTOM_THEME':
      return { 
        ...state, 
        customThemes: [...state.customThemes, action.payload] 
      };
    
    case 'UPDATE_CUSTOM_THEME':
      return {
        ...state,
        customThemes: state.customThemes.map(theme =>
          theme.id === action.payload.id
            ? { ...theme, ...action.payload.updates }
            : theme
        )
      };
    
    case 'DELETE_CUSTOM_THEME':
      return {
        ...state,
        customThemes: state.customThemes.filter(theme => theme.id !== action.payload)
      };
    
    case 'UPDATE_CLOCK_SETTINGS':
      return { 
        ...state, 
        clockSettings: { ...state.clockSettings, ...action.payload } 
      };
    
    case 'UPDATE_AUDIO_SETTINGS':
      return { 
        ...state, 
        audioSettings: { ...state.audioSettings, ...action.payload } 
      };
    
    case 'UPDATE_TIMER_SETTINGS':
      return { 
        ...state, 
        timerSettings: { ...state.timerSettings, ...action.payload } 
      };
    
    case 'UPDATE_TIMER_STATE':
      return { 
        ...state, 
        timerState: { ...state.timerState, ...action.payload } 
      };
    
    case 'UPDATE_BREATHING_STATE':
      return { 
        ...state, 
        breathingState: { ...state.breathingState, ...action.payload } 
      };
    
    case 'UPDATE_USER_PREFERENCES':
      return { 
        ...state, 
        userPreferences: { ...state.userPreferences, ...action.payload } 
      };
    
    case 'TOGGLE_FULLSCREEN':
      return { ...state, isFullscreen: !state.isFullscreen };
    
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload };
    
    case 'TOGGLE_SETTINGS':
      return { ...state, isSettingsOpen: !state.isSettingsOpen };
    
    case 'SET_ACTIVE_MODE':
      return { ...state, activeMode: action.payload };
    
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'START_TIMER':
      return {
        ...state,
        timerState: {
          ...state.timerState,
          isActive: true,
          isPaused: false
        }
      };
    
    case 'PAUSE_TIMER':
      return {
        ...state,
        timerState: {
          ...state.timerState,
          isActive: false,
          isPaused: true
        }
      };
    
    case 'RESET_TIMER':
      return {
        ...state,
        timerState: {
          ...state.timerState,
          isActive: false,
          isPaused: false,
          timeRemaining: state.timerSettings.mode === 'pomodoro' 
            ? state.timerSettings.pomodoroWorkDuration * 60
            : state.timerSettings.customDuration * 60
        }
      };
    
    case 'START_BREATHING':
      return {
        ...state,
        breathingState: {
          ...state.breathingState,
          isActive: true
        }
      };
    
    case 'STOP_BREATHING':
      return {
        ...state,
        breathingState: {
          ...state.breathingState,
          isActive: false
        }
      };
    
    case 'PLAY_SOUND':
      return {
        ...state,
        audioSettings: {
          ...state.audioSettings,
          currentSound: action.payload,
          isPlaying: true
        }
      };
    
    case 'STOP_SOUND':
      return {
        ...state,
        audioSettings: {
          ...state.audioSettings,
          isPlaying: false
        }
      };
    
    case 'TOGGLE_SOUND':
      return {
        ...state,
        audioSettings: {
          ...state.audioSettings,
          isPlaying: !state.audioSettings.isPlaying
        }
      };
    
    case 'ADD_ALARM':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          alarms: [...state.alarmState.alarms, action.payload]
        }
      };
    
    case 'UPDATE_ALARM':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          alarms: state.alarmState.alarms.map(alarm =>
            alarm.id === action.payload.id
              ? { ...alarm, ...action.payload.updates }
              : alarm
          )
        }
      };
    
    case 'DELETE_ALARM':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          alarms: state.alarmState.alarms.filter(alarm => alarm.id !== action.payload)
        }
      };
    
    case 'TOGGLE_ALARM':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          alarms: state.alarmState.alarms.map(alarm =>
            alarm.id === action.payload
              ? { ...alarm, enabled: !alarm.enabled }
              : alarm
          )
        }
      };
    
    case 'TRIGGER_ALARM':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          activeAlarm: {
            alarm: action.payload,
            triggeredAt: Date.now(),
            isSnoozing: false
          },
          isAlarmScreenVisible: true,
          snoozeCount: 0
        }
      };
    
    case 'SNOOZE_ALARM':
      const snoozeUntil = Date.now() + (state.alarmState.activeAlarm?.alarm.snoozeDuration || 5) * 60 * 1000;
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          activeAlarm: state.alarmState.activeAlarm ? {
            ...state.alarmState.activeAlarm,
            isSnoozing: true,
            snoozeUntil
          } : null,
          isAlarmScreenVisible: false,
          snoozeCount: state.alarmState.snoozeCount + 1,
          lastSnoozeTime: Date.now()
        }
      };
    
    case 'DISMISS_ALARM':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          activeAlarm: null,
          isAlarmScreenVisible: false,
          snoozeCount: 0,
          lastSnoozeTime: undefined
        }
      };
    
    case 'SHOW_ALARM_SCREEN':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          isAlarmScreenVisible: true
        }
      };
    
    case 'HIDE_ALARM_SCREEN':
      return {
        ...state,
        alarmState: {
          ...state.alarmState,
          isAlarmScreenVisible: false
        }
      };
    
    case 'UPDATE_ALARM_STATE':
      return {
        ...state,
        alarmState: { ...state.alarmState, ...action.payload }
      };
    
    case 'DISMISS_INSTALL_PROMPT':
      return { ...state, installPromptDismissed: true };
    
    case 'COMPLETE_ONBOARDING':
      return { ...state, onboardingCompleted: true };
    
    case 'TRACK_FEATURE_USAGE':
      return {
        ...state,
        featureUsage: {
          ...state.featureUsage,
          [action.payload]: (state.featureUsage[action.payload] || 0) + 1
        }
      };
    
    case 'UPDATE_USAGE_TIME':
      return {
        ...state,
        totalUsageTime: state.totalUsageTime + action.payload
      };
    
    case 'SET_SUBSCRIPTION':
      return { ...state, subscription: action.payload };
    
    case 'UPDATE_WEATHER':
      return { ...state, weatherData: action.payload };
    
    case 'ADD_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: [...state.calendarEvents, action.payload]
      };
    
    case 'UPDATE_CALENDAR_EVENTS':
      return { ...state, calendarEvents: action.payload };
    
    case 'UPDATE_ANALYTICS':
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload }
      };
    
    case 'ADD_WIDGET':
      return {
        ...state,
        widgets: [...state.widgets, action.payload]
      };
    
    case 'UPDATE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.map(widget =>
          widget.id === action.payload.id
            ? { ...widget, ...action.payload.updates }
            : widget
        )
      };
    
    case 'REMOVE_WIDGET':
      return {
        ...state,
        widgets: state.widgets.filter(widget => widget.id !== action.payload)
      };
    
    case 'UPDATE_INTEGRATION':
      return {
        ...state,
        integrations: state.integrations.map(integration =>
          integration.id === action.payload.id
            ? { ...integration, ...action.payload.updates }
            : integration
        )
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    
    case 'SYNC_DATA':
      return { ...state, lastSyncTime: new Date().toISOString() };
    
    case 'EXPORT_DATA':
      return state;
    
    case 'IMPORT_DATA':
      return { ...state, ...action.payload.userData.settings };
    
    // Phase 5: AI Actions
    case 'TOGGLE_AI_FEATURES':
      return {
        ...state,
        aiSettings: { ...state.aiSettings, enabled: action.payload }
      };
    
    case 'UPDATE_AI_SETTINGS':
      return {
        ...state,
        aiSettings: { ...state.aiSettings, ...action.payload }
      };
    
    case 'ADD_AI_INSIGHT':
      return {
        ...state,
        aiInsights: [...state.aiInsights, action.payload]
      };
    
    case 'DISMISS_AI_INSIGHT':
      return {
        ...state,
        aiInsights: state.aiInsights.filter(insight => insight.id !== action.payload)
      };
    
    case 'ADD_MOOD_ENTRY':
      return {
        ...state,
        moodEntries: [...state.moodEntries, action.payload]
      };
    
    case 'UPDATE_MOOD_ENTRY':
      return {
        ...state,
        moodEntries: state.moodEntries.map(entry =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload.updates }
            : entry
        )
      };
    
    case 'GENERATE_SMART_SCHEDULE':
      return {
        ...state,
        smartSchedule: action.payload
      };
    
    case 'UPDATE_SCHEDULE_SLOT':
      return {
        ...state,
        smartSchedule: state.smartSchedule ? {
          ...state.smartSchedule,
          timeSlots: state.smartSchedule.timeSlots.map(slot =>
            slot.id === action.payload.id
              ? { ...slot, ...action.payload.updates }
              : slot
          )
        } : null
      };
    
    case 'ADD_HABIT':
      return {
        ...state,
        habitIntelligence: [...state.habitIntelligence, action.payload]
      };
    
    case 'UPDATE_HABIT':
      return {
        ...state,
        habitIntelligence: state.habitIntelligence.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        )
      };
    
    case 'COMPLETE_HABIT':
      return {
        ...state,
        habitIntelligence: state.habitIntelligence.map(habit => {
          if (habit.id === action.payload.id) {
            const newEntry = {
              date: action.payload.date,
              completed: true,
              quality: action.payload.quality
            };
            const updatedEntries = [...habit.entries, newEntry];
            const completedCount = updatedEntries.filter(e => e.completed).length;
            const completionRate = Math.round((completedCount / updatedEntries.length) * 100);
            
            // Calculate new streak
            const sortedEntries = updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            let currentStreak = 0;
            for (const entry of sortedEntries) {
              if (entry.completed) {
                currentStreak++;
              } else {
                break;
              }
            }
            
            return {
              ...habit,
              entries: updatedEntries,
              completionRate,
              currentStreak,
              longestStreak: Math.max(habit.longestStreak, currentStreak)
            };
          }
          return habit;
        })
      };
    
    case 'START_FOCUS_SESSION':
      return {
        ...state,
        currentFocusSession: action.payload
      };
    
    case 'END_FOCUS_SESSION':
      return {
        ...state,
        currentFocusSession: null,
        focusHistory: state.currentFocusSession 
          ? [...state.focusHistory, {
              ...state.currentFocusSession,
              endTime: action.payload.endTime,
              quality: action.payload.quality,
              duration: Math.floor((action.payload.endTime - state.currentFocusSession.startTime) / 1000)
            }]
          : state.focusHistory
      };
    
    case 'ADD_DISTRACTION':
      return {
        ...state,
        currentFocusSession: state.currentFocusSession ? {
          ...state.currentFocusSession,
          distractions: [...state.currentFocusSession.distractions, action.payload.distraction]
        } : null
      };
    
    case 'ADD_COACHING_INTERVENTION':
      return {
        ...state,
        currentFocusSession: state.currentFocusSession ? {
          ...state.currentFocusSession,
          aiCoaching: {
            ...state.currentFocusSession.aiCoaching,
            interventions: [...state.currentFocusSession.aiCoaching.interventions, action.payload.intervention]
          }
        } : null
      };
    
    case 'UPDATE_ADAPTIVE_AUDIO':
      return {
        ...state,
        adaptiveAudio: { ...state.adaptiveAudio, ...action.payload }
      };
    
    case 'TRAIN_PREDICTIVE_MODEL':
      return {
        ...state,
        predictiveModels: [...state.predictiveModels.filter(m => m.name !== action.payload.name), action.payload]
      };
    
    case 'UPDATE_AI_PERSONALITY':
      return {
        ...state,
        aiPersonality: { ...state.aiPersonality, ...action.payload },
        aiSettings: {
          ...state.aiSettings,
          personality: { ...state.aiSettings.personality, ...action.payload }
        }
      };
    
    case 'PROCESS_AI_FEEDBACK':
      return {
        ...state,
        learningData: {
          ...state.learningData,
          preferences: {
            ...state.learningData.preferences,
            [action.payload.type]: action.payload.feedback
          }
        }
      };
    
    case 'OPTIMIZE_SETTINGS':
      // Apply AI-recommended optimizations
      return state;
    
    case 'GENERATE_AI_RECOMMENDATIONS':
      // Trigger AI insight generation
      return state;
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load saved preferences from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('relaxing-clock-preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        if (preferences.theme) {
          dispatch({ type: 'SET_THEME', payload: preferences.theme });
        }
        if (preferences.clockSettings) {
          dispatch({ type: 'UPDATE_CLOCK_SETTINGS', payload: preferences.clockSettings });
        }
        if (preferences.audioSettings) {
          dispatch({ type: 'UPDATE_AUDIO_SETTINGS', payload: preferences.audioSettings });
        }
        if (preferences.timerSettings) {
          dispatch({ type: 'UPDATE_TIMER_SETTINGS', payload: preferences.timerSettings });
        }
      } catch (error) {
        console.warn('Failed to load saved preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when state changes
  useEffect(() => {
    const preferences = {
      theme: state.currentTheme,
      clockSettings: state.clockSettings,
      audioSettings: {
        ...state.audioSettings,
        isPlaying: false, // Don't persist playing state
        currentSound: null, // Don't persist current sound
      },
      timerSettings: state.timerSettings,
    };
    localStorage.setItem('relaxing-clock-preferences', JSON.stringify(preferences));
  }, [state.currentTheme, state.clockSettings, state.audioSettings, state.timerSettings]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
} 