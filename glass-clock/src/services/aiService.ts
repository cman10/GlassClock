import { 
  AIInsight, 
  MoodEntry, 
  SmartSchedule, 
  HabitIntelligence, 
  FocusSession, 
  PredictiveModel,
  AIPersonality,
  ScheduleRecommendation,
  EnergyLevel,
  FocusWindow,
  TimeSlot,
  CoachingIntervention,
  AudioAdaptation
} from '../types';

export class AIService {
  private static instance: AIService;
  private learningData: Map<string, any> = new Map();
  private patterns: Map<string, any> = new Map();

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Productivity Insights Generation
  generateProductivityInsights(
    focusHistory: FocusSession[],
    moodEntries: MoodEntry[],
    habits: HabitIntelligence[]
  ): AIInsight[] {
    const insights: AIInsight[] = [];
    const now = Date.now();

    // Analyze focus patterns
    const focusInsight = this.analyzeFocusPatterns(focusHistory);
    if (focusInsight) insights.push(focusInsight);

    // Analyze mood trends
    const moodInsight = this.analyzeMoodTrends(moodEntries);
    if (moodInsight) insights.push(moodInsight);

    // Analyze habit performance
    const habitInsight = this.analyzeHabitPerformance(habits);
    if (habitInsight) insights.push(habitInsight);

    // Generate schedule optimization insight
    const scheduleInsight = this.generateScheduleOptimization();
    if (scheduleInsight) insights.push(scheduleInsight);

    // Generate wellness recommendations
    const wellnessInsight = this.generateWellnessRecommendations(moodEntries, focusHistory);
    if (wellnessInsight) insights.push(wellnessInsight);

    return insights.sort((a, b) => b.priority === 'urgent' ? 1 : -1);
  }

  private analyzeFocusPatterns(sessions: FocusSession[]): AIInsight | null {
    if (sessions.length < 3) return null;

    const recentSessions = sessions.slice(-7); // Last 7 sessions
    const avgQuality = recentSessions.reduce((sum, s) => sum + s.quality, 0) / recentSessions.length;
    const avgDuration = recentSessions.reduce((sum, s) => sum + s.duration, 0) / recentSessions.length;

    const bestHours = this.findOptimalFocusHours(sessions);
    const distractionPattern = this.analyzeDistractionPatterns(sessions);

    let insight: AIInsight;

    if (avgQuality < 6) {
      insight = {
        id: `focus-improvement-${Date.now()}`,
        type: 'focus',
        title: 'Focus Quality Needs Attention',
        description: `Your average focus quality is ${avgQuality.toFixed(1)}/10 in recent sessions.`,
        recommendation: `Try the Pomodoro technique with shorter intervals, or consider changing your environment. Your best focus time appears to be around ${bestHours.join(', ')}.`,
        confidence: 85,
        priority: 'high',
        actionable: true,
        actions: [
          {
            id: 'switch-pomodoro',
            label: 'Switch to Pomodoro Mode',
            type: 'setting',
            parameters: { timerMode: 'pomodoro' },
            autoExecutable: true
          },
          {
            id: 'schedule-focus',
            label: 'Schedule Focus Time',
            type: 'schedule',
            parameters: { hours: bestHours },
            autoExecutable: false
          }
        ],
        timestamp: Date.now(),
        category: 'Productivity',
        impact: 'positive'
      };
    } else if (avgQuality > 8) {
      insight = {
        id: `focus-excellent-${Date.now()}`,
        type: 'focus',
        title: 'Excellent Focus Performance!',
        description: `You're maintaining exceptional focus quality (${avgQuality.toFixed(1)}/10).`,
        recommendation: 'Consider gradually increasing session duration to maximize your productive state.',
        confidence: 95,
        priority: 'medium',
        actionable: true,
        actions: [
          {
            id: 'extend-sessions',
            label: 'Extend Session Duration',
            type: 'setting',
            parameters: { increase: 10 },
            autoExecutable: true
          }
        ],
        timestamp: Date.now(),
        category: 'Achievement',
        impact: 'positive'
      };
    } else {
      return null;
    }

    return insight;
  }

  private analyzeMoodTrends(moodEntries: MoodEntry[]): AIInsight | null {
    if (moodEntries.length < 5) return null;

    const recent = moodEntries.slice(-7);
    const moodScores = recent.map(entry => {
      const moodValues = { excellent: 5, good: 4, neutral: 3, low: 2, stressed: 1 };
      return moodValues[entry.mood];
    });

    const avgMood = moodScores.reduce((sum, score) => sum + score, 0) / moodScores.length;
    const trend = this.calculateTrend(moodScores);

    if (avgMood < 2.5 || trend < -0.3) {
      return {
        id: `mood-concern-${Date.now()}`,
        type: 'mood',
        title: 'Mood Pattern Needs Attention',
        description: 'Your recent mood entries show a concerning pattern.',
        recommendation: 'Consider taking more breaks, trying breathing exercises, or adjusting your work schedule.',
        confidence: 80,
        priority: 'high',
        actionable: true,
        actions: [
          {
            id: 'breathing-session',
            label: 'Start Breathing Exercise',
            type: 'focus',
            parameters: { mode: 'breathing', duration: 300 },
            autoExecutable: true
          },
          {
            id: 'schedule-breaks',
            label: 'Add More Breaks',
            type: 'schedule',
            parameters: { breakFrequency: 'increase' },
            autoExecutable: false
          }
        ],
        timestamp: Date.now(),
        category: 'Wellness',
        impact: 'positive'
      };
    }

    return null;
  }

  private analyzeHabitPerformance(habits: HabitIntelligence[]): AIInsight | null {
    const strugglingHabits = habits.filter(h => h.completionRate < 60 && h.currentStreak < 3);
    
    if (strugglingHabits.length > 0) {
      const habit = strugglingHabits[0];
      return {
        id: `habit-support-${Date.now()}`,
        type: 'habit',
        title: `Boost Your ${habit.name} Habit`,
        description: `Your ${habit.name} habit has a ${habit.completionRate}% completion rate.`,
        recommendation: 'Try reducing the frequency or adjusting the timing based on your energy patterns.',
        confidence: 75,
        priority: 'medium',
        actionable: true,
        actions: [
          {
            id: 'adjust-habit',
            label: 'Optimize Habit Timing',
            type: 'habit',
            parameters: { habitId: habit.id, adjustment: 'timing' },
            autoExecutable: false
          }
        ],
        timestamp: Date.now(),
        category: 'Habit Formation',
        impact: 'positive'
      };
    }

    return null;
  }

  private generateScheduleOptimization(): AIInsight {
    return {
      id: `schedule-optimization-${Date.now()}`,
      type: 'schedule',
      title: 'Smart Schedule Suggestion',
      description: 'AI has identified optimal times for your most important tasks.',
      recommendation: 'Schedule deep work during your peak energy hours (9-11 AM) and administrative tasks during lower energy periods.',
      confidence: 88,
      priority: 'medium',
      actionable: true,
      actions: [
        {
          id: 'generate-schedule',
          label: 'Generate AI Schedule',
          type: 'schedule',
          parameters: { type: 'ai_optimized' },
          autoExecutable: false
        }
      ],
      timestamp: Date.now(),
      category: 'Time Management',
      impact: 'positive'
    };
  }

  private generateWellnessRecommendations(moodEntries: MoodEntry[], focusSessions: FocusSession[]): AIInsight {
    const recentStress = moodEntries.slice(-3).filter(m => m.mood === 'stressed').length;
    
    if (recentStress >= 2) {
      return {
        id: `wellness-stress-${Date.now()}`,
        type: 'wellness',
        title: 'Stress Management Recommendation',
        description: 'Your recent entries indicate elevated stress levels.',
        recommendation: 'Consider incorporating more breathing exercises and shorter work sessions.',
        confidence: 82,
        priority: 'high',
        actionable: true,
        actions: [
          {
            id: 'stress-relief',
            label: 'Start Stress Relief Session',
            type: 'focus',
            parameters: { mode: 'breathing', pattern: '4-7-8' },
            autoExecutable: true
          }
        ],
        timestamp: Date.now(),
        category: 'Wellness',
        impact: 'positive'
      };
    }

    return {
      id: `wellness-general-${Date.now()}`,
      type: 'wellness',
      title: 'Maintain Your Wellness Balance',
      description: 'Your wellness metrics look good. Keep up the great work!',
      recommendation: 'Continue your current routine and consider adding variety to prevent monotony.',
      confidence: 70,
      priority: 'low',
      actionable: false,
      timestamp: Date.now(),
      category: 'Wellness',
      impact: 'positive'
    };
  }

  // Smart Scheduling
  generateSmartSchedule(date: string, preferences: any): SmartSchedule {
    const energyPattern = this.generateEnergyPattern();
    const focusWindows = this.generateFocusWindows(energyPattern);
    const timeSlots = this.generateOptimalTimeSlots(focusWindows);
    const recommendations = this.generateScheduleRecommendations(timeSlots, energyPattern);

    return {
      id: `schedule-${date}`,
      date,
      timeSlots,
      aiRecommendations: recommendations,
      optimizationScore: this.calculateOptimizationScore(timeSlots, energyPattern),
      energyPattern,
      focusWindows
    };
  }

  private generateEnergyPattern(): EnergyLevel[] {
    const pattern: EnergyLevel[] = [];
    
    // Simulate typical energy patterns throughout the day
    for (let hour = 0; hour < 24; hour++) {
      let predicted: number;
      
      if (hour >= 6 && hour <= 10) {
        predicted = 7 + Math.random() * 2; // Morning peak
      } else if (hour >= 14 && hour <= 16) {
        predicted = 6 + Math.random() * 2; // Afternoon moderate
      } else if (hour >= 19 && hour <= 21) {
        predicted = 5 + Math.random() * 2; // Evening moderate
      } else if (hour >= 22 || hour <= 5) {
        predicted = 2 + Math.random() * 2; // Night/early morning low
      } else {
        predicted = 4 + Math.random() * 3; // Other times variable
      }

      pattern.push({
        hour,
        predicted: Math.min(10, Math.max(1, predicted)),
        confidence: 75 + Math.random() * 20
      });
    }

    return pattern;
  }

  private generateFocusWindows(energyPattern: EnergyLevel[]): FocusWindow[] {
    const windows: FocusWindow[] = [];
    
    // Morning deep work window
    windows.push({
      startHour: 9,
      endHour: 11,
      quality: 'peak',
      type: 'deep',
      confidence: 90
    });

    // Afternoon creative window
    windows.push({
      startHour: 14,
      endHour: 16,
      quality: 'good',
      type: 'creative',
      confidence: 75
    });

    // Evening administrative window
    windows.push({
      startHour: 19,
      endHour: 20,
      quality: 'moderate',
      type: 'administrative',
      confidence: 65
    });

    return windows;
  }

  private generateOptimalTimeSlots(focusWindows: FocusWindow[]): TimeSlot[] {
    const slots: TimeSlot[] = [];
    let id = 1;

    focusWindows.forEach(window => {
      const duration = window.endHour - window.startHour;
      const slotDuration = window.type === 'deep' ? 90 : 60; // minutes
      const numSlots = Math.floor((duration * 60) / slotDuration);

      for (let i = 0; i < numSlots; i++) {
        const startMinutes = window.startHour * 60 + (i * slotDuration);
        const endMinutes = startMinutes + slotDuration;
        
        slots.push({
          id: `slot-${id++}`,
          startTime: this.minutesToTime(startMinutes),
          endTime: this.minutesToTime(endMinutes),
          type: window.type === 'deep' ? 'work' : window.type === 'creative' ? 'creative' : 'admin',
          title: this.generateSlotTitle(window.type),
          priority: window.quality === 'peak' ? 'high' : window.quality === 'good' ? 'medium' : 'low',
          estimatedFocus: window.quality === 'peak' ? 9 : window.quality === 'good' ? 7 : 5,
          aiSuggested: true
        });
      }
    });

    return slots;
  }

  private generateScheduleRecommendations(slots: TimeSlot[], energy: EnergyLevel[]): ScheduleRecommendation[] {
    const recommendations: ScheduleRecommendation[] = [];

    recommendations.push({
      id: 'morning-deep-work',
      type: 'optimal_time',
      title: 'Schedule Deep Work in Morning',
      description: 'Your energy levels are highest between 9-11 AM',
      timeSlot: '09:00',
      confidence: 90,
      reasoning: 'Historical data shows peak cognitive performance during morning hours'
    });

    recommendations.push({
      id: 'afternoon-break',
      type: 'break_suggestion',
      title: 'Take a Break Around 3 PM',
      description: 'Energy typically dips in mid-afternoon',
      timeSlot: '15:00',
      confidence: 75,
      reasoning: 'Natural circadian rhythm suggests lower alertness at this time'
    });

    return recommendations;
  }

  // Mood Analysis and Recommendations
  analyzeMoodContext(entry: MoodEntry): string[] {
    const suggestions: string[] = [];

    if (entry.mood === 'stressed') {
      suggestions.push('Try a 5-minute breathing exercise');
      suggestions.push('Consider taking a short walk');
      suggestions.push('Switch to calming ambient sounds');
    } else if (entry.mood === 'low') {
      suggestions.push('Start with a shorter work session');
      suggestions.push('Try uplifting background music');
      suggestions.push('Set a smaller, achievable goal');
    } else if (entry.mood === 'excellent') {
      suggestions.push('This is a great time for challenging tasks');
      suggestions.push('Consider extending your work session');
      suggestions.push('Tackle your most important project');
    }

    return suggestions;
  }

  // Focus Coaching
  generateFocusCoaching(session: FocusSession): CoachingIntervention[] {
    const interventions: CoachingIntervention[] = [];
    const sessionDuration = Date.now() - session.startTime;

    // Check if user has been working for too long
    if (sessionDuration > 90 * 60 * 1000) { // 90 minutes
      interventions.push({
        timestamp: Date.now(),
        type: 'break_reminder',
        message: 'You\'ve been focused for 90 minutes. Consider taking a 15-minute break to maintain peak performance.',
        action: 'suggest_break'
      });
    }

    // Provide focus tips based on distraction count
    if (session.distractions.length > 3) {
      interventions.push({
        timestamp: Date.now(),
        type: 'focus_tip',
        message: 'I notice you\'re getting distracted. Try the "2-minute rule" - if a distraction takes less than 2 minutes, do it now, otherwise write it down for later.',
        action: 'show_focus_techniques'
      });
    }

    return interventions;
  }

  // Adaptive Audio Recommendations
  generateAudioRecommendations(context: any): AudioAdaptation[] {
    const adaptations: AudioAdaptation[] = [];
    const currentHour = new Date().getHours();

    let recommendedSound: string;
    let reason: string;

    if (currentHour >= 6 && currentHour <= 10) {
      recommendedSound = 'nature-birds';
      reason = 'Morning hours benefit from gentle, energizing sounds';
    } else if (currentHour >= 14 && currentHour <= 16) {
      recommendedSound = 'white-noise-focus';
      reason = 'Afternoon focus sessions work well with consistent background noise';
    } else {
      recommendedSound = 'ambient-calm';
      reason = 'Evening sessions benefit from calming, low-stimulation audio';
    }

    adaptations.push({
      timestamp: Date.now(),
      context: `Time: ${currentHour}:00, Activity: ${context.activity || 'work'}`,
      previousSound: context.currentSound || 'none',
      newSound: recommendedSound,
      reason
    });

    return adaptations;
  }

  // Habit Intelligence
  analyzeHabitPatterns(habit: HabitIntelligence): any {
    const recentEntries = habit.entries.slice(-30); // Last 30 days
    const completionsByDay = this.groupBy(recentEntries.filter(e => e.completed), 'date');
    
    // Find best days and times
    const dayPatterns = this.analyzeDayPatterns(recentEntries);
    const barriers = this.identifyBarriers(habit);
    
    return {
      bestDays: dayPatterns.bestDays,
      barriers,
      suggestions: this.generateHabitSuggestions(habit, dayPatterns, barriers)
    };
  }

  private generateHabitSuggestions(habit: HabitIntelligence, patterns: any, barriers: string[]): string[] {
    const suggestions: string[] = [];

    if (habit.completionRate < 50) {
      suggestions.push('Consider reducing the frequency or making the habit smaller');
      suggestions.push('Try habit stacking - attach this habit to an existing routine');
    }

    if (barriers.includes('time')) {
      suggestions.push('Schedule this habit at a specific time each day');
    }

    if (barriers.includes('motivation')) {
      suggestions.push('Set up a reward system for completing this habit');
    }

    return suggestions;
  }

  // Predictive Models
  trainProductivityModel(data: any[]): PredictiveModel {
    // Simulate training a productivity prediction model
    return {
      name: 'Productivity Predictor',
      type: 'productivity',
      accuracy: 78 + Math.random() * 15,
      lastTrained: Date.now(),
      features: ['time_of_day', 'mood', 'previous_session_quality', 'break_duration'],
      predictions: this.generateProductivityPredictions()
    };
  }

  private generateProductivityPredictions(): any[] {
    const predictions = [];
    const now = new Date();

    for (let i = 1; i <= 24; i++) {
      const futureTime = new Date(now.getTime() + i * 60 * 60 * 1000);
      const hour = futureTime.getHours();
      
      let productivity: number;
      if (hour >= 9 && hour <= 11) {
        productivity = 8 + Math.random() * 2;
      } else if (hour >= 14 && hour <= 16) {
        productivity = 6 + Math.random() * 2;
      } else {
        productivity = 3 + Math.random() * 4;
      }

      predictions.push({
        timestamp: futureTime.getTime(),
        horizon: i,
        value: Math.min(10, Math.max(1, productivity)),
        confidence: 70 + Math.random() * 25,
        factors: ['circadian_rhythm', 'historical_patterns', 'current_mood']
      });
    }

    return predictions;
  }

  // Utility methods
  private findOptimalFocusHours(sessions: FocusSession[]): string[] {
    const hourQuality: { [hour: number]: number[] } = {};
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      if (!hourQuality[hour]) hourQuality[hour] = [];
      hourQuality[hour].push(session.quality);
    });

    const avgQualityByHour = Object.entries(hourQuality)
      .map(([hour, qualities]) => ({
        hour: parseInt(hour),
        avgQuality: qualities.reduce((sum, q) => sum + q, 0) / qualities.length
      }))
      .sort((a, b) => b.avgQuality - a.avgQuality)
      .slice(0, 3);

    return avgQualityByHour.map(h => `${h.hour}:00`);
  }

  private analyzeDistractionPatterns(sessions: FocusSession[]): any {
    const allDistractions = sessions.flatMap(s => s.distractions);
    const distractionsByType = this.groupBy(allDistractions, 'type');
    
    return {
      mostCommon: Object.keys(distractionsByType).sort((a, b) => 
        distractionsByType[b].length - distractionsByType[a].length
      )[0],
      averagePerSession: allDistractions.length / sessions.length
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private calculateOptimizationScore(slots: TimeSlot[], energy: EnergyLevel[]): number {
    let score = 0;
    let totalSlots = slots.length;

    slots.forEach(slot => {
      const hour = parseInt(slot.startTime.split(':')[0]);
      const energyLevel = energy.find(e => e.hour === hour);
      
      if (energyLevel) {
        // Higher score for matching high-energy times with important tasks
        if (slot.priority === 'high' && energyLevel.predicted > 7) {
          score += 10;
        } else if (slot.priority === 'medium' && energyLevel.predicted > 5) {
          score += 7;
        } else if (slot.priority === 'low' && energyLevel.predicted <= 5) {
          score += 5;
        } else {
          score += 2;
        }
      }
    });

    return Math.min(100, (score / (totalSlots * 10)) * 100);
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  private generateSlotTitle(type: string): string {
    const titles = {
      deep: ['Deep Work Session', 'Focus Time', 'Concentrated Work'],
      creative: ['Creative Work', 'Brainstorming', 'Design Time'],
      administrative: ['Admin Tasks', 'Email & Communication', 'Planning']
    };
    
    const typeKey = type as keyof typeof titles;
    const options = titles[typeKey] || ['Work Session'];
    return options[Math.floor(Math.random() * options.length)];
  }

  private groupBy<T>(array: T[], key: keyof T): { [key: string]: T[] } {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as { [key: string]: T[] });
  }

  private analyzeDayPatterns(entries: any[]): any {
    // Simplified day pattern analysis
    return {
      bestDays: ['monday', 'tuesday', 'wednesday'],
      worstDays: ['friday', 'saturday']
    };
  }

  private identifyBarriers(habit: HabitIntelligence): string[] {
    const barriers: string[] = [];
    
    if (habit.completionRate < 30) {
      barriers.push('motivation');
    }
    
    if (habit.currentStreak < 2) {
      barriers.push('consistency');
    }
    
    barriers.push('time');
    
    return barriers;
  }
}

export const aiService = AIService.getInstance(); 