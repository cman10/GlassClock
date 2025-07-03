export interface Theme {
  name: string;
  background: string;
  textColor: string;
  accentColor: string;
  gradientStart?: string;
  gradientEnd?: string;
  isCustom?: boolean;
  category?: 'default' | 'nature' | 'cosmic' | 'minimal' | 'custom';
  isPremium?: boolean;
}

export interface CustomTheme extends Theme {
  isCustom: true;
  id: string;
  createdAt: number;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;
  gradientDirection?: number; // degrees
  gradientStops?: Array<{ color: string; position: number }>;
}

// Phase 4: Premium Features
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
}

export interface UserSubscription {
  planId: string;
  status: 'active' | 'inactive' | 'trial' | 'expired';
  startDate: string;
  endDate: string;
  trialEndsAt?: string;
  autoRenew: boolean;
}

export interface AdvancedTimerMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  isPremium: boolean;
  config: {
    workDuration?: number;
    breakDuration?: number;
    longBreakDuration?: number;
    sessionsUntilLongBreak?: number;
    maxSessions?: number;
    flowMode?: boolean;
    timeboxing?: boolean;
    intervals?: Array<{ name: string; duration: number; type: 'work' | 'break' }>;
  };
}

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  timestamp: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  location?: string;
  type: 'meeting' | 'focus' | 'break' | 'personal';
  color?: string;
}

export interface Analytics {
  dailyStats: DailyStats[];
  weeklyTrends: WeeklyTrend[];
  monthlyInsights: MonthlyInsight[];
  productivityScore: number;
  streakData: StreakData;
  focusPatterns: FocusPattern[];
}

export interface DailyStats {
  date: string;
  totalFocusTime: number;
  sessionsCompleted: number;
  averageSessionDuration: number;
  mostProductiveHour: number;
  distractionCount: number;
  mood?: 'great' | 'good' | 'okay' | 'poor';
}

export interface WeeklyTrend {
  week: string;
  focusTime: number;
  sessionsCount: number;
  productivity: number;
  consistency: number;
}

export interface MonthlyInsight {
  month: string;
  totalFocusHours: number;
  goalAchievement: number;
  topFocusTime: string;
  improvementAreas: string[];
  achievements: string[];
}

export interface StreakData {
  current: number;
  longest: number;
  weekly: number;
  monthly: number;
}

export interface FocusPattern {
  hour: number;
  averageFocus: number;
  sessionCount: number;
  productivity: number;
}

export interface Widget {
  id: string;
  type: 'clock' | 'timer' | 'weather' | 'stats' | 'calendar';
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  settings: Record<string, any>;
  isPremium: boolean;
}

export interface Integration {
  id: string;
  name: string;
  type: 'calendar' | 'weather' | 'music' | 'notifications' | 'wellness';
  enabled: boolean;
  settings: Record<string, any>;
  isPremium: boolean;
  apiKey?: string;
}

export interface ExportData {
  version: string;
  exportDate: string;
  userData: {
    settings: AppState;
    analytics: Analytics;
    themes: CustomTheme[];
  };
}

export interface ClockSettings {
  format: '12' | '24';
  showSeconds: boolean;
  showDate: boolean;
  dateFormat: 'short' | 'long' | 'numeric' | 'custom';
  customDateFormat?: string;
  timezone: string;
  fontSize: 'small' | 'medium' | 'large' | 'xl' | 'custom';
  customFontSize?: number;
  fontFamily: string;
  fontWeight: 'light' | 'normal' | 'medium' | 'bold';
  letterSpacing: number;
  showMilliseconds: boolean;
  clockStyle: 'digital' | 'analog' | 'minimal' | 'concentric' | 'neon' | 'matrix' | 'binary' | 'word';
  animationsEnabled: boolean;
  showWeather: boolean;
  weatherLocation?: string;
  
  // Clock style specific settings
  analogStyle?: 'classic' | 'modern' | 'minimal' | 'roman' | 'dots';
  concentricRings?: number;
  neonGlow?: boolean;
  matrixSpeed?: 'slow' | 'medium' | 'fast';
  wordLanguage?: 'english' | 'spanish' | 'french' | 'german';
  
  // Phase 5: AI Features
  aiInsights?: boolean;
  smartSuggestions?: boolean;
  adaptiveThemes?: boolean;
}

export interface AmbientSound {
  id: string;
  name: string;
  url: string;
  category: 'nature' | 'white-noise' | 'focus' | 'custom' | 'premium';
  icon: string;
  description: string;
  duration?: number;
  isLoop: boolean;
  volume: number;
  fadeIn?: number;
  fadeOut?: number;
  isPremium?: boolean;
  tags?: string[];
}

export interface Alarm {
  id: string;
  label: string;
  time: string; // HH:MM format
  enabled: boolean;
  repeatDays: AlarmRepeatDay[];
  sound: AmbientSound | null;
  volume: number;
  snoozeEnabled: boolean;
  snoozeDuration: number; // minutes
  gradualWake: boolean;
  vibration: boolean;
  createdAt: number;
  lastTriggered?: number;
  nextTrigger?: number;
}

export interface AlarmRepeatDay {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  enabled: boolean;
}

export interface AlarmState {
  alarms: Alarm[];
  activeAlarm: ActiveAlarm | null;
  isAlarmScreenVisible: boolean;
  snoozeCount: number;
  lastSnoozeTime?: number;
}

export interface ActiveAlarm {
  alarm: Alarm;
  triggeredAt: number;
  isSnoozing: boolean;
  snoozeUntil?: number;
  audioContext?: AudioContext;
  wakeLockSentinel?: any; // WakeLockSentinel type
}

export interface AudioSettings {
  currentSound: AmbientSound | null;
  volume: number;
  isPlaying: boolean;
  isMuted: boolean;
  fadeInDuration: number;
  fadeOutDuration: number;
  crossfadeDuration: number;
  enableSpatialAudio: boolean;
  bassBoost: number;
  trebleBoost: number;
  reverbLevel: number;
  smartMixing: boolean;
  adaptiveVolume: boolean;
}

export interface TimerSettings {
  mode: 'pomodoro' | 'custom' | 'meditation' | 'breathing' | 'flowtime' | 'timeboxing' | 'intervals' | 'ai_optimized';
  pomodoroWorkDuration: number;
  pomodoroBreakDuration: number;
  pomodoroLongBreakDuration: number;
  pomodoroSessionsUntilLongBreak: number;
  customDuration: number;
  meditationDuration: number;
  breathingInDuration: number;
  breathingOutDuration: number;
  breathingHoldDuration: number;
  enableNotifications: boolean;
  notificationSound: string;
  autoStartBreaks: boolean;
  autoStartWork: boolean;
  dimScreenDuringBreaks: boolean;
  
  // Phase 4: Advanced Timer Features
  flowtimeMinSession: number;
  flowtimeBreakRatio: number;
  timeboxingSlots: Array<{ name: string; duration: number; priority: 'high' | 'medium' | 'low' }>;
  customIntervals: Array<{ name: string; duration: number; type: 'work' | 'break' | 'rest' }>;
  smartBreaks: boolean;
  adaptiveTiming: boolean;
  goalTracking: boolean;
  dailyGoal: number;
  
  // Phase 5: AI-Optimized Timer Features
  aiOptimized: AIOptimizedSettings;
  adaptiveDuration: boolean;
  contextAwareness: boolean;
}

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  timeRemaining: number;
  totalTime: number;
  currentSession: number;
  sessionType: 'work' | 'break' | 'longBreak' | 'meditation' | 'custom' | 'flow' | 'timebox';
  completedSessions: number;
  totalSessionsToday: number;
  totalFocusTime: number;
  streak: number;
  
  // Phase 4: Advanced Timer State
  currentInterval?: number;
  flowStartTime?: number;
  adaptiveBreakSuggestion?: number;
  distractionCount: number;
  currentGoalProgress: number;
}

export interface BreathingState {
  isActive: boolean;
  currentPhase: 'inhale' | 'hold' | 'exhale' | 'pause';
  cycleProgress: number;
  totalCycles: number;
  currentCycle: number;
  pattern: '4-4-4' | '4-7-8' | '5-5-5' | 'custom' | 'box' | 'triangle' | 'coherent';
  guidanceType: 'visual' | 'audio' | 'both' | 'haptic';
  
  // Phase 4: Advanced Breathing Features
  sessionDuration: number;
  heartRateVariability?: number;
  stressLevel?: number;
  guidedSession?: string;
  
  // Phase 5: AI Features
  aiCoaching?: boolean;
  adaptiveRhythm?: boolean;
  biofeedback?: boolean;
}

export interface UserPreferences {
  language: string;
  region: string;
  currency: string;
  firstDayOfWeek: 0 | 1;
  use24HourTime: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
  gesturesEnabled: boolean;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  largeFonts: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  
  // Phase 4: Premium Preferences
  analyticsEnabled: boolean;
  cloudSyncEnabled: boolean;
  smartNotifications: boolean;
  weatherIntegration: boolean;
  calendarIntegration: boolean;
  autoBackup: boolean;
  dataExportFormat: 'json' | 'csv' | 'pdf';
  
  // Phase 5: AI Preferences
  aiFeatures: boolean;
  personalizedExperience: boolean;
  adaptiveBehavior: boolean;
}

export interface AppState {
  currentTheme: Theme;
  customThemes: CustomTheme[];
  clockSettings: ClockSettings;
  audioSettings: AudioSettings;
  timerSettings: TimerSettings;
  timerState: TimerState;
  breathingState: BreathingState;
  alarmState: AlarmState;
  userPreferences: UserPreferences;
  isFullscreen: boolean;
  isSettingsOpen: boolean;
  activeMode: 'clock' | 'timer' | 'meditation' | 'breathing' | 'alarm' | 'widget';
  currentView: 'main' | 'themes' | 'customize' | 'stats' | 'about' | 'premium' | 'integrations' | 'analytics' | 'coach' | 'mood' | 'schedule' | 'habits' | 'focus' | 'ai-settings' | 'advanced-analytics' | 'ml-models' | 'device-sync';
  installPromptDismissed: boolean;
  onboardingCompleted: boolean;
  lastActiveDate: string;
  totalUsageTime: number;
  featureUsage: Record<string, number>;
  
  // Phase 4: Premium State
  subscription?: UserSubscription;
  weatherData?: WeatherData;
  calendarEvents: CalendarEvent[];
  analytics: Analytics;
  widgets: Widget[];
  integrations: Integration[];
  notifications: AppNotification[];
  lastSyncTime?: string;
  
  // Phase 5: AI Features
  aiSettings: AISettings;
  aiInsights: AIInsight[];
  moodEntries: MoodEntry[];
  smartSchedule: SmartSchedule | null;
  habitIntelligence: HabitIntelligence[];
  currentFocusSession: FocusSession | null;
  focusHistory: FocusSession[];
  adaptiveAudio: AdaptiveAudio;
  predictiveModels: PredictiveModel[];
  aiPersonality: AIPersonality;
  learningData: {
    patterns: Record<string, any>;
    preferences: Record<string, any>;
    effectiveness: Record<string, number>;
  };
  
  // Phase 6: Advanced Analytics & ML
  advancedAnalytics: AdvancedAnalytics;
  mlModels: MachineLearningModel[];
  crossDeviceSync: CrossDeviceSync;
  advancedIntegrations: AdvancedIntegration[];
  performanceOptimization: {
    enabled: boolean;
    level: 'basic' | 'advanced' | 'aggressive';
    metrics: PerformanceMetrics;
    recommendations: SmartRecommendation[];
  };
  dataExport: {
    formats: string[];
    scheduledExports: ScheduledExport[];
    lastExport: number;
  };
  privacySettings: {
    dataMinimization: boolean;
    anonymization: boolean;
    retentionPeriod: number; // days
    shareAnalytics: boolean;
    localProcessing: boolean;
  };
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'premium';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  action?: {
    label: string;
    type: 'navigate' | 'dismiss' | 'upgrade';
    payload?: any;
  };
}

export type AppAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'ADD_CUSTOM_THEME'; payload: CustomTheme }
  | { type: 'UPDATE_CUSTOM_THEME'; payload: { id: string; updates: Partial<CustomTheme> } }
  | { type: 'DELETE_CUSTOM_THEME'; payload: string }
  | { type: 'UPDATE_CLOCK_SETTINGS'; payload: Partial<ClockSettings> }
  | { type: 'UPDATE_AUDIO_SETTINGS'; payload: Partial<AudioSettings> }
  | { type: 'UPDATE_TIMER_SETTINGS'; payload: Partial<TimerSettings> }
  | { type: 'UPDATE_TIMER_STATE'; payload: Partial<TimerState> }
  | { type: 'UPDATE_BREATHING_STATE'; payload: Partial<BreathingState> }
  | { type: 'UPDATE_USER_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'TOGGLE_FULLSCREEN' }
  | { type: 'TOGGLE_SETTINGS' }
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_ACTIVE_MODE'; payload: 'clock' | 'timer' | 'meditation' | 'breathing' | 'alarm' | 'widget' }
  | { type: 'SET_CURRENT_VIEW'; payload: 'main' | 'themes' | 'customize' | 'stats' | 'about' | 'premium' | 'integrations' | 'analytics' | 'coach' | 'mood' | 'schedule' | 'habits' | 'focus' | 'ai-settings' | 'advanced-analytics' | 'ml-models' | 'device-sync' }
  | { type: 'START_TIMER' }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'START_BREATHING' }
  | { type: 'STOP_BREATHING' }
  | { type: 'PLAY_SOUND'; payload: AmbientSound }
  | { type: 'STOP_SOUND' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'ADD_ALARM'; payload: Alarm }
  | { type: 'UPDATE_ALARM'; payload: { id: string; updates: Partial<Alarm> } }
  | { type: 'DELETE_ALARM'; payload: string }
  | { type: 'TOGGLE_ALARM'; payload: string }
  | { type: 'TRIGGER_ALARM'; payload: Alarm }
  | { type: 'SNOOZE_ALARM' }
  | { type: 'DISMISS_ALARM' }
  | { type: 'SHOW_ALARM_SCREEN' }
  | { type: 'HIDE_ALARM_SCREEN' }
  | { type: 'UPDATE_ALARM_STATE'; payload: Partial<AlarmState> }
  | { type: 'DISMISS_INSTALL_PROMPT' }
  | { type: 'COMPLETE_ONBOARDING' }
  | { type: 'TRACK_FEATURE_USAGE'; payload: string }
  | { type: 'UPDATE_USAGE_TIME'; payload: number }
  // Phase 4: Premium Actions
  | { type: 'SET_SUBSCRIPTION'; payload: UserSubscription }
  | { type: 'UPDATE_WEATHER'; payload: WeatherData }
  | { type: 'ADD_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_CALENDAR_EVENTS'; payload: CalendarEvent[] }
  | { type: 'UPDATE_ANALYTICS'; payload: Partial<Analytics> }
  | { type: 'ADD_WIDGET'; payload: Widget }
  | { type: 'UPDATE_WIDGET'; payload: { id: string; updates: Partial<Widget> } }
  | { type: 'REMOVE_WIDGET'; payload: string }
  | { type: 'UPDATE_INTEGRATION'; payload: { id: string; updates: Partial<Integration> } }
  | { type: 'ADD_NOTIFICATION'; payload: AppNotification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'SYNC_DATA' }
  | { type: 'EXPORT_DATA'; payload: ExportData }
  | { type: 'IMPORT_DATA'; payload: ExportData }
  // Phase 5: AI Actions
  | { type: 'TOGGLE_AI_FEATURES'; payload: boolean }
  | { type: 'UPDATE_AI_SETTINGS'; payload: Partial<AISettings> }
  | { type: 'ADD_AI_INSIGHT'; payload: AIInsight }
  | { type: 'DISMISS_AI_INSIGHT'; payload: string }
  | { type: 'ADD_MOOD_ENTRY'; payload: MoodEntry }
  | { type: 'UPDATE_MOOD_ENTRY'; payload: { id: string; updates: Partial<MoodEntry> } }
  | { type: 'GENERATE_SMART_SCHEDULE'; payload: SmartSchedule }
  | { type: 'UPDATE_SCHEDULE_SLOT'; payload: { id: string; updates: Partial<TimeSlot> } }
  | { type: 'ADD_HABIT'; payload: HabitIntelligence }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<HabitIntelligence> } }
  | { type: 'COMPLETE_HABIT'; payload: { id: string; date: string; quality?: number } }
  | { type: 'START_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'END_FOCUS_SESSION'; payload: { id: string; endTime: number; quality: number } }
  | { type: 'ADD_DISTRACTION'; payload: { sessionId: string; distraction: Distraction } }
  | { type: 'ADD_COACHING_INTERVENTION'; payload: { sessionId: string; intervention: CoachingIntervention } }
  | { type: 'UPDATE_ADAPTIVE_AUDIO'; payload: Partial<AdaptiveAudio> }
  | { type: 'TRAIN_PREDICTIVE_MODEL'; payload: PredictiveModel }
  | { type: 'UPDATE_AI_PERSONALITY'; payload: Partial<AIPersonality> }
  | { type: 'PROCESS_AI_FEEDBACK'; payload: { type: string; feedback: any } }
  | { type: 'OPTIMIZE_SETTINGS'; payload: { recommendations: any[] } }
  | { type: 'GENERATE_AI_RECOMMENDATIONS' }
  // Phase 6: Advanced Analytics & ML Actions
  | { type: 'UPDATE_ADVANCED_ANALYTICS'; payload: Partial<AdvancedAnalytics> }
  | { type: 'ADD_ANALYTICS_INSIGHT'; payload: AnalyticsInsight }
  | { type: 'DISMISS_ANALYTICS_INSIGHT'; payload: string }
  | { type: 'ADD_PREDICTIVE_INSIGHT'; payload: PredictiveInsight }
  | { type: 'UPDATE_BEHAVIOR_PATTERN'; payload: BehaviorPattern }
  | { type: 'TRAIN_ML_MODEL'; payload: { modelId: string; config: TrainingConfig } }
  | { type: 'DEPLOY_ML_MODEL'; payload: { modelId: string; config: DeploymentConfig } }
  | { type: 'UPDATE_MODEL_PERFORMANCE'; payload: { modelId: string; performance: ModelPerformance } }
  | { type: 'SYNC_CROSS_DEVICE'; payload: Partial<CrossDeviceSync> }
  | { type: 'ADD_DEVICE'; payload: ConnectedDevice }
  | { type: 'REMOVE_DEVICE'; payload: string }
  | { type: 'RESOLVE_SYNC_CONFLICT'; payload: { conflictId: string; resolution: any } }
  | { type: 'ADD_ADVANCED_INTEGRATION'; payload: AdvancedIntegration }
  | { type: 'UPDATE_INTEGRATION_STATUS'; payload: { integrationId: string; status: string } }
  | { type: 'TRIGGER_INTEGRATION_ACTION'; payload: { integrationId: string; action: string; params: any } }
  | { type: 'UPDATE_PERFORMANCE_OPTIMIZATION'; payload: Partial<PerformanceMetrics> }
  | { type: 'GENERATE_SMART_RECOMMENDATIONS' }
  | { type: 'APPLY_RECOMMENDATION'; payload: { recommendationId: string; action: RecommendedAction } }
  | { type: 'SCHEDULE_DATA_EXPORT'; payload: ScheduledExport }
  | { type: 'UPDATE_PRIVACY_SETTINGS'; payload: Partial<AppState['privacySettings']> }
  | { type: 'OPTIMIZE_PERFORMANCE'; payload: { level: 'basic' | 'advanced' | 'aggressive' } }
  | { type: 'DISCOVER_PATTERNS' }
  | { type: 'RETRAIN_MODELS' }
  | { type: 'BACKUP_DATA'; payload: { destination: string; encryption: boolean } };

// Phase 5: AI-Powered Features & Smart Automation
export interface AIInsight {
  id: string;
  type: 'productivity' | 'wellness' | 'habit' | 'schedule' | 'focus' | 'mood';
  title: string;
  description: string;
  recommendation: string;
  confidence: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionable: boolean;
  actions?: AIAction[];
  timestamp: number;
  category: string;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface AIAction {
  id: string;
  label: string;
  type: 'schedule' | 'setting' | 'reminder' | 'habit' | 'break' | 'focus';
  parameters: Record<string, any>;
  autoExecutable: boolean;
}

export interface MoodEntry {
  id: string;
  timestamp: number;
  mood: 'excellent' | 'good' | 'neutral' | 'low' | 'stressed';
  energy: number; // 1-10
  focus: number; // 1-10
  stress: number; // 1-10
  notes?: string;
  context: {
    activity: string;
    environment: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  };
  triggers?: string[];
}

export interface SmartSchedule {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlots: TimeSlot[];
  aiRecommendations: ScheduleRecommendation[];
  optimizationScore: number; // 0-100
  energyPattern: EnergyLevel[];
  focusWindows: FocusWindow[];
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  type: 'work' | 'break' | 'meeting' | 'creative' | 'admin' | 'personal';
  title: string;
  priority: 'low' | 'medium' | 'high';
  estimatedFocus: number; // 1-10
  aiSuggested: boolean;
  completed?: boolean;
  actualFocus?: number;
}

export interface ScheduleRecommendation {
  id: string;
  type: 'optimal_time' | 'break_suggestion' | 'task_reorder' | 'energy_match';
  title: string;
  description: string;
  timeSlot: string; // HH:MM
  confidence: number;
  reasoning: string;
}

export interface EnergyLevel {
  hour: number; // 0-23
  predicted: number; // 1-10
  actual?: number; // 1-10
  confidence: number; // 0-100
}

export interface FocusWindow {
  startHour: number;
  endHour: number;
  quality: 'peak' | 'good' | 'moderate' | 'low';
  type: 'deep' | 'creative' | 'collaborative' | 'administrative';
  confidence: number;
}

export interface HabitIntelligence {
  id: string;
  name: string;
  category: 'productivity' | 'wellness' | 'learning' | 'health';
  targetFrequency: 'daily' | 'weekly' | 'monthly';
  currentStreak: number;
  longestStreak: number;
  completionRate: number; // 0-100
  aiCoaching: {
    enabled: boolean;
    lastSuggestion: string;
    nextMilestone: string;
    difficulty: 'easy' | 'medium' | 'hard';
    adaptations: HabitAdaptation[];
  };
  pattern: {
    bestTimes: string[]; // HH:MM
    bestDays: string[]; // monday, tuesday, etc.
    triggerEvents: string[];
    barriers: string[];
  };
  entries: HabitEntry[];
}

export interface HabitAdaptation {
  date: string;
  type: 'time_adjustment' | 'frequency_change' | 'reminder_update' | 'goal_modification';
  description: string;
  success: boolean;
}

export interface HabitEntry {
  date: string; // YYYY-MM-DD
  completed: boolean;
  quality?: number; // 1-10
  notes?: string;
  mood?: string;
  context?: string;
}

export interface FocusSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration: number; // seconds
  type: 'deep' | 'creative' | 'learning' | 'administrative';
  quality: number; // 1-10
  distractions: Distraction[];
  aiCoaching: FocusCoaching;
  mood: {
    start: string;
    end?: string;
  };
  environment: {
    sound: string;
    lighting: string;
    interruptions: number;
  };
}

export interface Distraction {
  timestamp: number;
  type: 'internal' | 'external' | 'digital' | 'physical';
  description: string;
  severity: number; // 1-10
  resolved: boolean;
  aiSuggestion?: string;
}

export interface FocusCoaching {
  enabled: boolean;
  interventions: CoachingIntervention[];
  adaptiveBreaks: boolean;
  personalizedTips: string[];
  currentStrategy: string;
  effectiveness: number; // 0-100
}

export interface CoachingIntervention {
  timestamp: number;
  type: 'break_reminder' | 'focus_tip' | 'distraction_help' | 'motivation' | 'technique_suggestion';
  message: string;
  action?: string;
  userResponse?: 'helpful' | 'not_helpful' | 'ignored';
}

export interface AdaptiveAudio {
  enabled: boolean;
  learningMode: boolean;
  preferences: {
    morningTypes: string[];
    afternoonTypes: string[];
    eveningTypes: string[];
    focusTypes: string[];
    relaxTypes: string[];
    creativTypes: string[];
  };
  adaptations: AudioAdaptation[];
  effectiveness: Record<string, number>; // sound_id -> effectiveness score
  contextualMixing: boolean;
  biofeedbackIntegration: boolean;
}

export interface AudioAdaptation {
  timestamp: number;
  context: string;
  previousSound: string;
  newSound: string;
  reason: string;
  userFeedback?: 'positive' | 'negative' | 'neutral';
}

export interface AIPersonality {
  name: string;
  style: 'professional' | 'friendly' | 'motivational' | 'gentle' | 'direct';
  tone: 'formal' | 'casual' | 'encouraging' | 'scientific' | 'humorous';
  expertise: string[];
  responseLength: 'brief' | 'moderate' | 'detailed';
  proactiveness: number; // 1-10
  adaptability: number; // 1-10
}

export interface AISettings {
  enabled: boolean;
  personality: AIPersonality;
  features: {
    smartScheduling: boolean;
    moodTracking: boolean;
    habitCoaching: boolean;
    focusAssistant: boolean;
    adaptiveAudio: boolean;
    predictiveInsights: boolean;
    autoOptimization: boolean;
    privacyMode: boolean;
  };
  dataRetention: {
    insights: number; // days
    patterns: number; // days
    personalData: number; // days
  };
  notifications: {
    insights: boolean;
    coaching: boolean;
    recommendations: boolean;
    reminders: boolean;
  };
}

export interface PredictiveModel {
  name: string;
  type: 'productivity' | 'mood' | 'energy' | 'focus' | 'habit';
  accuracy: number; // 0-100
  lastTrained: number;
  features: string[];
  predictions: Prediction[];
}

export interface Prediction {
  timestamp: number;
  horizon: number; // hours ahead
  value: number;
  confidence: number; // 0-100
  factors: string[];
}

export interface AIOptimizedSettings {
  enabled: boolean;
  baseDuration: number;
  adaptToEnergy: boolean;
  adaptToMood: boolean;
  adaptToTime: boolean;
  adaptToHistory: boolean;
  maxDuration: number;
  minDuration: number;
  learningPeriod: number; // days
}

// Phase 6: Advanced Analytics & Machine Learning
export interface AdvancedAnalytics {
  id: string;
  userId: string;
  timeRange: 'day' | 'week' | 'month' | 'quarter' | 'year';
  insights: AnalyticsInsight[];
  predictions: PredictiveInsight[];
  patterns: BehaviorPattern[];
  performance: PerformanceMetrics;
  recommendations: SmartRecommendation[];
  dataQuality: DataQualityMetrics;
  lastUpdated: number;
}

export interface AnalyticsInsight {
  id: string;
  type: 'productivity' | 'wellness' | 'efficiency' | 'growth' | 'optimization';
  category: 'trend' | 'anomaly' | 'achievement' | 'opportunity' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  dataPoints: DataPoint[];
  visualization: VisualizationConfig;
  actionable: boolean;
  actions?: RecommendedAction[];
  timestamp: number;
}

export interface PredictiveInsight {
  id: string;
  model: string;
  prediction: string;
  probability: number; // 0-100
  timeHorizon: number; // hours ahead
  factors: PredictionFactor[];
  confidence: number;
  accuracy: number; // historical accuracy
  recommendations: string[];
  lastTrained: number;
}

export interface BehaviorPattern {
  id: string;
  type: 'temporal' | 'contextual' | 'seasonal' | 'cyclical' | 'trigger-based';
  name: string;
  description: string;
  frequency: number;
  strength: number; // 0-100
  triggers: string[];
  outcomes: string[];
  correlations: PatternCorrelation[];
  discovered: number;
  lastSeen: number;
}

export interface PatternCorrelation {
  variable: string;
  correlation: number; // -1 to 1
  significance: number; // 0-100
  type: 'positive' | 'negative' | 'neutral';
}

export interface PerformanceMetrics {
  overall: number; // 0-100
  productivity: ProductivityMetrics;
  wellness: WellnessMetrics;
  consistency: ConsistencyMetrics;
  growth: GrowthMetrics;
  efficiency: EfficiencyMetrics;
}

export interface ProductivityMetrics {
  score: number; // 0-100
  focusTime: number; // minutes
  deepWorkSessions: number;
  distractionRate: number;
  completionRate: number;
  qualityScore: number;
  peakHours: string[];
  trends: MetricTrend[];
}

export interface WellnessMetrics {
  score: number; // 0-100
  stressLevel: number; // 1-10
  energyLevel: number; // 1-10
  moodStability: number; // 0-100
  workLifeBalance: number; // 0-100
  burnoutRisk: number; // 0-100
  recoveryRate: number; // 0-100
  trends: MetricTrend[];
}

export interface ConsistencyMetrics {
  score: number; // 0-100
  habitStreak: number;
  scheduleAdherence: number; // 0-100
  routineStability: number; // 0-100
  variability: number; // 0-100 (lower is more consistent)
  reliability: number; // 0-100
  trends: MetricTrend[];
}

export interface GrowthMetrics {
  score: number; // 0-100
  improvementRate: number; // % per week
  skillDevelopment: number; // 0-100
  goalAchievement: number; // 0-100
  learningVelocity: number; // 0-100
  adaptability: number; // 0-100
  trends: MetricTrend[];
}

export interface EfficiencyMetrics {
  score: number; // 0-100
  timeUtilization: number; // 0-100
  taskOptimization: number; // 0-100
  resourceUsage: number; // 0-100
  automationLevel: number; // 0-100
  wasteReduction: number; // 0-100
  trends: MetricTrend[];
}

export interface MetricTrend {
  period: string;
  value: number;
  change: number; // % change
  direction: 'up' | 'down' | 'stable';
}

export interface DataPoint {
  timestamp: number;
  value: number;
  context?: Record<string, any>;
  quality: number; // 0-100
}

export interface VisualizationConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'radar' | 'gauge' | 'treemap';
  title: string;
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
  interactive: boolean;
  animations: boolean;
  filters?: string[];
}

export interface RecommendedAction {
  id: string;
  type: 'immediate' | 'short-term' | 'long-term';
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  expectedImpact: number; // 0-100
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  steps: ActionStep[];
  success_metrics: string[];
}

export interface ActionStep {
  id: string;
  description: string;
  completed: boolean;
  dueDate?: number;
  estimatedTime: number; // minutes
}

export interface SmartRecommendation {
  id: string;
  type: 'optimization' | 'intervention' | 'enhancement' | 'prevention';
  title: string;
  description: string;
  reasoning: string;
  confidence: number; // 0-100
  expectedOutcome: string;
  implementation: RecommendedAction[];
  personalization: PersonalizationLevel;
  contextRelevance: number; // 0-100
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface PersonalizationLevel {
  score: number; // 0-100
  factors: string[];
  adaptations: string[];
  learningRate: number; // 0-100
}

export interface DataQualityMetrics {
  completeness: number; // 0-100
  accuracy: number; // 0-100
  consistency: number; // 0-100
  timeliness: number; // 0-100
  validity: number; // 0-100
  overall: number; // 0-100
  issues: DataQualityIssue[];
  lastAssessed: number;
}

export interface DataQualityIssue {
  type: 'missing' | 'inconsistent' | 'outdated' | 'invalid' | 'duplicate';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedData: string[];
  resolution: string;
  autoFixable: boolean;
}

export interface PredictionFactor {
  name: string;
  importance: number; // 0-100
  value: any;
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0-100
}

export interface MachineLearningModel {
  id: string;
  name: string;
  type: 'regression' | 'classification' | 'clustering' | 'forecasting' | 'anomaly_detection';
  purpose: string;
  algorithm: string;
  features: ModelFeature[];
  performance: ModelPerformance;
  training: TrainingConfig;
  deployment: DeploymentConfig;
  version: string;
  created: number;
  lastTrained: number;
  nextRetraining: number;
}

export interface ModelFeature {
  name: string;
  type: 'numerical' | 'categorical' | 'temporal' | 'text' | 'boolean';
  importance: number; // 0-100
  transformation?: string;
  engineered: boolean;
}

export interface ModelPerformance {
  accuracy: number; // 0-100
  precision: number; // 0-100
  recall: number; // 0-100
  f1Score: number; // 0-100
  rmse?: number;
  mae?: number;
  crossValidation: number; // 0-100
  validationHistory: PerformanceHistory[];
}

export interface PerformanceHistory {
  date: number;
  metrics: Record<string, number>;
  dataSize: number;
  notes?: string;
}

export interface TrainingConfig {
  dataSource: string[];
  splitRatio: number; // 0-1
  validationMethod: string;
  hyperparameters: Record<string, any>;
  featureSelection: string;
  preprocessing: string[];
  autoTuning: boolean;
}

export interface DeploymentConfig {
  environment: 'production' | 'staging' | 'development';
  updateFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  rollbackTriggers: string[];
  monitoringMetrics: string[];
  scalingPolicy: ScalingPolicy;
}

export interface ScalingPolicy {
  minInstances: number;
  maxInstances: number;
  targetUtilization: number; // 0-100
  scaleUpCooldown: number; // seconds
  scaleDownCooldown: number; // seconds
}

export interface CrossDeviceSync {
  id: string;
  userId: string;
  devices: ConnectedDevice[];
  syncStatus: SyncStatus;
  lastSync: number;
  conflicts: SyncConflict[];
  settings: SyncSettings;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'watch' | 'tv';
  platform: string;
  lastSeen: number;
  syncEnabled: boolean;
  capabilities: DeviceCapability[];
  version: string;
}

export interface DeviceCapability {
  feature: string;
  supported: boolean;
  version?: string;
  limitations?: string[];
}

export interface SyncStatus {
  status: 'synced' | 'syncing' | 'conflict' | 'error' | 'offline';
  progress: number; // 0-100
  lastError?: string;
  pendingChanges: number;
  bandwidth: 'low' | 'medium' | 'high';
}

export interface SyncConflict {
  id: string;
  type: 'data' | 'settings' | 'preferences' | 'state';
  description: string;
  devices: string[];
  resolution: 'manual' | 'auto' | 'latest' | 'merge';
  timestamp: number;
  resolved: boolean;
}

export interface SyncSettings {
  autoSync: boolean;
  syncFrequency: 'real-time' | 'minutes' | 'hours' | 'manual';
  dataTypes: SyncDataType[];
  conflictResolution: 'ask' | 'latest' | 'merge' | 'device_priority';
  bandwidth: 'unlimited' | 'wifi_only' | 'limited';
  encryption: boolean;
}

export interface SyncDataType {
  type: string;
  enabled: boolean;
  priority: 'high' | 'medium' | 'low';
  size: number; // bytes
}

export interface AdvancedIntegration {
  id: string;
  name: string;
  type: 'productivity' | 'health' | 'calendar' | 'communication' | 'automation' | 'ai_assistant';
  provider: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  capabilities: IntegrationCapability[];
  dataFlow: DataFlow;
  authentication: AuthConfig;
  settings: IntegrationSettings;
  usage: UsageMetrics;
  lastSync: number;
}

export interface IntegrationCapability {
  action: string;
  description: string;
  inputs: CapabilityInput[];
  outputs: CapabilityOutput[];
  realTime: boolean;
  rateLimits?: RateLimit;
}

export interface CapabilityInput {
  name: string;
  type: string;
  required: boolean;
  description: string;
  validation?: string;
}

export interface CapabilityOutput {
  name: string;
  type: string;
  description: string;
  format?: string;
}

export interface DataFlow {
  direction: 'inbound' | 'outbound' | 'bidirectional';
  frequency: 'real-time' | 'polling' | 'webhook' | 'manual';
  dataTypes: string[];
  transformations: DataTransformation[];
  filters: DataFilter[];
}

export interface DataTransformation {
  input: string;
  output: string;
  function: string;
  parameters?: Record<string, any>;
}

export interface DataFilter {
  field: string;
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between';
  value: any;
  active: boolean;
}

export interface AuthConfig {
  type: 'oauth2' | 'api_key' | 'basic' | 'jwt' | 'custom';
  credentials: Record<string, string>;
  scopes: string[];
  refreshToken?: string;
  expiresAt?: number;
}

export interface IntegrationSettings {
  autoSync: boolean;
  notifications: boolean;
  dataRetention: number; // days
  errorHandling: 'ignore' | 'retry' | 'alert';
  customFields: Record<string, any>;
}

export interface UsageMetrics {
  requests: number;
  dataTransferred: number; // bytes
  errors: number;
  latency: number; // ms
  uptime: number; // %
  lastMonth: UsageStats;
}

export interface UsageStats {
  requests: number;
  dataTransferred: number;
  errors: number;
  averageLatency: number;
  uptime: number;
}

export interface RateLimit {
  requests: number;
  period: number; // seconds
  remaining: number;
  resetTime: number;
}

export interface ScheduledExport {
  id: string;
  format: 'json' | 'csv' | 'pdf' | 'excel';
  frequency: 'daily' | 'weekly' | 'monthly';
  dataTypes: string[];
  destination: 'download' | 'cloud' | 'email';
  lastRun: number;
  nextRun: number;
  enabled: boolean;
} 