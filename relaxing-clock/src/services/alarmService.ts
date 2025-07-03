import { Alarm, AlarmRepeatDay } from '../types';

export class AlarmService {
  private static instance: AlarmService;
  private alarmTimeouts: Map<string, NodeJS.Timeout> = new Map();
  private onAlarmTrigger?: (alarm: Alarm) => void;

  static getInstance(): AlarmService {
    if (!AlarmService.instance) {
      AlarmService.instance = new AlarmService();
    }
    return AlarmService.instance;
  }

  setAlarmTriggerCallback(callback: (alarm: Alarm) => void) {
    this.onAlarmTrigger = callback;
  }

  scheduleAlarms(alarms: Alarm[]) {
    // Clear existing timeouts
    this.clearAllAlarms();

    // Schedule enabled alarms
    alarms.filter(alarm => alarm.enabled).forEach(alarm => {
      this.scheduleAlarm(alarm);
    });
  }

  scheduleAlarm(alarm: Alarm) {
    const nextTriggerTime = this.getNextTriggerTime(alarm);
    if (!nextTriggerTime) return;

    const now = Date.now();
    const delay = nextTriggerTime - now;

    if (delay <= 0) {
      // Alarm should trigger immediately
      this.triggerAlarm(alarm);
      return;
    }

    // Schedule the alarm
    const timeout = setTimeout(() => {
      this.triggerAlarm(alarm);
      // Schedule the next occurrence if it's a repeating alarm
      if (this.hasRepeatDays(alarm)) {
        this.scheduleAlarm(alarm);
      }
    }, delay);

    this.alarmTimeouts.set(alarm.id, timeout);
  }

  private triggerAlarm(alarm: Alarm) {
    // Request notification permission if not granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Show browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(alarm.label || 'Alarm', {
        body: 'Time to wake up!',
        icon: '/logo192.png',
        tag: `alarm-${alarm.id}`,
        requireInteraction: true
      });
    }

    // Trigger the alarm callback
    if (this.onAlarmTrigger) {
      this.onAlarmTrigger(alarm);
    }

    // Vibrate if supported and enabled
    if (alarm.vibration && 'vibrate' in navigator) {
      navigator.vibrate([1000, 500, 1000, 500, 1000]);
    }
  }

  getNextTriggerTime(alarm: Alarm): number | null {
    const [hours, minutes] = alarm.time.split(':').map(Number);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0);

    // If it's a one-time alarm (no repeat days)
    if (!this.hasRepeatDays(alarm)) {
      if (today.getTime() > now.getTime()) {
        return today.getTime();
      } else {
        // Add one day for tomorrow
        return today.getTime() + 24 * 60 * 60 * 1000;
      }
    }

    // For repeating alarms, find the next occurrence
    const enabledDays = alarm.repeatDays.filter(day => day.enabled).map(day => day.day);
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
      const dayName = this.getDayName(checkDate.getDay());
      
      if (enabledDays.includes(dayName)) {
        // If it's today, check if the time hasn't passed yet
        if (i === 0 && checkDate.getTime() <= now.getTime()) {
          continue;
        }
        return checkDate.getTime();
      }
    }

    return null;
  }

  private hasRepeatDays(alarm: Alarm): boolean {
    return alarm.repeatDays.some(day => day.enabled);
  }

  private getDayName(dayIndex: number): AlarmRepeatDay['day'] {
    const days: AlarmRepeatDay['day'][] = [
      'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
    ];
    return days[dayIndex];
  }

  clearAlarm(alarmId: string) {
    const timeout = this.alarmTimeouts.get(alarmId);
    if (timeout) {
      clearTimeout(timeout);
      this.alarmTimeouts.delete(alarmId);
    }
  }

  clearAllAlarms() {
    this.alarmTimeouts.forEach(timeout => clearTimeout(timeout));
    this.alarmTimeouts.clear();
  }

  getTimeUntilNextAlarm(alarms: Alarm[]): { alarm: Alarm; timeUntil: number } | null {
    const enabledAlarms = alarms.filter(alarm => alarm.enabled);
    if (enabledAlarms.length === 0) return null;

    let nextAlarm: Alarm | null = null;
    let nextTime = Infinity;

    enabledAlarms.forEach(alarm => {
      const triggerTime = this.getNextTriggerTime(alarm);
      if (triggerTime && triggerTime < nextTime) {
        nextTime = triggerTime;
        nextAlarm = alarm;
      }
    });

    if (!nextAlarm) return null;

    return {
      alarm: nextAlarm,
      timeUntil: nextTime - Date.now()
    };
  }

  formatTimeUntilAlarm(timeUntil: number): string {
    const hours = Math.floor(timeUntil / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntil % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  }

  // PWA Background Sync for alarms
  registerBackgroundSync() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        // Background sync would be implemented here when supported
        console.log('Service worker ready for alarm sync', registration);
      }).catch(console.error);
    }
  }

  // Handle notification actions
  handleNotificationAction(action: string, alarmId: string) {
    switch (action) {
      case 'snooze':
        // This would be handled by the main app
        break;
      case 'dismiss':
        // This would be handled by the main app
        break;
    }
  }
}

export const alarmService = AlarmService.getInstance(); 