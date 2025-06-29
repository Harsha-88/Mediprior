// Types for health check-in data
export interface HealthMetrics {
  id: string;
  userId: string;
  date: string;
  timestamp: number;
  
  // Vitals
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  
  // Symptoms
  symptoms: string[];
  symptomSeverity: 'mild' | 'moderate' | 'severe';
  
  // Mood & Wellness
  mood: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  energyLevel: 1 | 2 | 3 | 4 | 5;
  stressLevel: 1 | 2 | 3 | 4 | 5;
  
  // Sleep
  sleepHours: number;
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Hydration & Nutrition
  waterIntake: number; // in liters
  mealsEaten: number;
  
  // Medication
  medications: {
    name: string;
    taken: boolean;
    dosage?: string;
    time?: string;
  }[];
  
  // Notes
  notes?: string;
  
  // Activity
  exerciseMinutes?: number;
  steps?: number;
}

export interface CheckinFormData {
  // Vitals
  bloodPressureSystolic?: string;
  bloodPressureDiastolic?: string;
  heartRate?: string;
  temperature?: string;
  oxygenSaturation?: string;
  
  // Symptoms
  symptoms: string[];
  symptomSeverity: 'mild' | 'moderate' | 'severe';
  
  // Mood & Wellness
  mood: 'excellent' | 'good' | 'fair' | 'poor' | 'terrible';
  energyLevel: 1 | 2 | 3 | 4 | 5;
  stressLevel: 1 | 2 | 3 | 4 | 5;
  
  // Sleep
  sleepHours: string;
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Hydration & Nutrition
  waterIntake: string;
  mealsEaten: number;
  
  // Medication
  medications: {
    name: string;
    taken: boolean;
    dosage?: string;
    time?: string;
  }[];
  
  // Notes
  notes?: string;
  
  // Activity
  exerciseMinutes?: string;
  steps?: string;
}

// Mock database for health check-ins
let healthCheckins: HealthMetrics[] = [];

export const healthCheckinService = {
  // Save a new health check-in
  async saveCheckin(userId: string, formData: CheckinFormData): Promise<HealthMetrics> {
    const checkin: HealthMetrics = {
      id: `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      
      // Parse and validate vitals
      bloodPressure: formData.bloodPressureSystolic && formData.bloodPressureDiastolic ? {
        systolic: parseInt(formData.bloodPressureSystolic),
        diastolic: parseInt(formData.bloodPressureDiastolic)
      } : undefined,
      heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
      temperature: formData.temperature ? parseFloat(formData.temperature) : undefined,
      oxygenSaturation: formData.oxygenSaturation ? parseInt(formData.oxygenSaturation) : undefined,
      
      // Symptoms
      symptoms: formData.symptoms,
      symptomSeverity: formData.symptomSeverity,
      
      // Mood & Wellness
      mood: formData.mood,
      energyLevel: formData.energyLevel,
      stressLevel: formData.stressLevel,
      
      // Sleep
      sleepHours: parseFloat(formData.sleepHours) || 0,
      sleepQuality: formData.sleepQuality,
      
      // Hydration & Nutrition
      waterIntake: parseFloat(formData.waterIntake) || 0,
      mealsEaten: formData.mealsEaten,
      
      // Medication
      medications: formData.medications,
      
      // Notes
      notes: formData.notes,
      
      // Activity
      exerciseMinutes: formData.exerciseMinutes ? parseInt(formData.exerciseMinutes) : undefined,
      steps: formData.steps ? parseInt(formData.steps) : undefined,
    };
    
    healthCheckins.push(checkin);
    
    // Save to localStorage for persistence
    localStorage.setItem(`healthCheckins_${userId}`, JSON.stringify(healthCheckins));
    
    return checkin;
  },
  
  // Get all check-ins for a user
  async getUserCheckins(userId: string): Promise<HealthMetrics[]> {
    // Load from localStorage
    const stored = localStorage.getItem(`healthCheckins_${userId}`);
    if (stored) {
      healthCheckins = JSON.parse(stored);
    }
    
    return healthCheckins.filter(checkin => checkin.userId === userId);
  },
  
  // Get check-ins for a specific date range
  async getCheckinsByDateRange(userId: string, startDate: string, endDate: string): Promise<HealthMetrics[]> {
    const checkins = await this.getUserCheckins(userId);
    return checkins.filter(checkin => 
      checkin.date >= startDate && checkin.date <= endDate
    );
  },
  
  // Get the latest check-in
  async getLatestCheckin(userId: string): Promise<HealthMetrics | null> {
    const checkins = await this.getUserCheckins(userId);
    if (checkins.length === 0) return null;
    
    return checkins.sort((a, b) => b.timestamp - a.timestamp)[0];
  },
  
  // Get check-in trends for the last 7 days
  async getWeeklyTrends(userId: string): Promise<{
    mood: { date: string; value: string }[];
    sleepHours: { date: string; value: number }[];
    energyLevel: { date: string; value: number }[];
    stressLevel: { date: string; value: number }[];
    waterIntake: { date: string; value: number }[];
  }> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const checkins = await this.getCheckinsByDateRange(userId, startDate, endDate);
    
    const moodMap = { excellent: 5, good: 4, fair: 3, poor: 2, terrible: 1 };
    
    return {
      mood: checkins.map(c => ({ date: c.date, value: c.mood })),
      sleepHours: checkins.map(c => ({ date: c.date, value: c.sleepHours })),
      energyLevel: checkins.map(c => ({ date: c.date, value: c.energyLevel })),
      stressLevel: checkins.map(c => ({ date: c.date, value: c.stressLevel })),
      waterIntake: checkins.map(c => ({ date: c.date, value: c.waterIntake })),
    };
  },
  
  // Get health insights based on recent data
  async getHealthInsights(userId: string): Promise<{
    type: 'warning' | 'info' | 'positive';
    message: string;
    metric: string;
  }[]> {
    const checkins = await this.getUserCheckins(userId);
    if (checkins.length === 0) return [];
    
    const recentCheckins = checkins
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 7);
    
    const insights: { type: 'warning' | 'info' | 'positive'; message: string; metric: string }[] = [];
    
    // Analyze sleep patterns
    const avgSleepHours = recentCheckins.reduce((sum, c) => sum + c.sleepHours, 0) / recentCheckins.length;
    if (avgSleepHours < 6) {
      insights.push({
        type: 'warning',
        message: `Your average sleep is ${avgSleepHours.toFixed(1)} hours. Consider aiming for 7-9 hours for better health.`,
        metric: 'sleep'
      });
    } else if (avgSleepHours >= 7) {
      insights.push({
        type: 'positive',
        message: `Great job! You're averaging ${avgSleepHours.toFixed(1)} hours of sleep.`,
        metric: 'sleep'
      });
    }
    
    // Analyze water intake
    const avgWaterIntake = recentCheckins.reduce((sum, c) => sum + c.waterIntake, 0) / recentCheckins.length;
    if (avgWaterIntake < 2) {
      insights.push({
        type: 'warning',
        message: `Your average water intake is ${avgWaterIntake.toFixed(1)}L. Try to drink at least 2-3L daily.`,
        metric: 'hydration'
      });
    }
    
    // Analyze stress levels
    const avgStressLevel = recentCheckins.reduce((sum, c) => sum + c.stressLevel, 0) / recentCheckins.length;
    if (avgStressLevel > 3) {
      insights.push({
        type: 'warning',
        message: 'Your stress levels have been elevated. Consider stress management techniques.',
        metric: 'stress'
      });
    }
    
    // Analyze mood trends
    const recentMoods = recentCheckins.map(c => c.mood);
    const positiveMoods = recentMoods.filter(m => ['excellent', 'good'].includes(m)).length;
    const moodPercentage = (positiveMoods / recentMoods.length) * 100;
    
    if (moodPercentage < 50) {
      insights.push({
        type: 'info',
        message: 'Your mood has been lower than usual. Consider activities that boost your spirits.',
        metric: 'mood'
      });
    }
    
    return insights;
  },
  
  // Check if user has already checked in today
  async hasCheckedInToday(userId: string): Promise<boolean> {
    const today = new Date().toISOString().split('T')[0];
    const checkins = await this.getUserCheckins(userId);
    return checkins.some(checkin => checkin.date === today);
  }
}; 