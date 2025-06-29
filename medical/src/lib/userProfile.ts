// User Profile Types and Management
export interface HealthGoal {
  id: string;
  name: string;
  category: 'fitness' | 'chronic_illness' | 'lifestyle' | 'preventive' | 'recovery';
  priority: 'low' | 'medium' | 'high' | 'critical';
  target?: string;
  startDate: string;
  isActive: boolean;
}

export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'wearable' | 'smartphone' | 'medical_device' | 'fitness_tracker';
  brand: string;
  model: string;
  isConnected: boolean;
  lastSync: string;
  dataTypes: string[];
}

export interface HealthData {
  type: 'vitals' | 'activity' | 'sleep' | 'nutrition' | 'medication' | 'symptoms';
  value: any;
  unit?: string;
  timestamp: string;
  source: 'manual' | 'device' | 'app';
  notes?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  
  // Basic Information
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  height?: number; // cm
  weight?: number; // kg
  bmi?: number;
  
  // Health Profile
  healthGoals: HealthGoal[];
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  familyHistory: string[];
  
  // Lifestyle
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
  sleepGoal: number; // hours
  waterGoal: number; // liters
  stressLevel: 'low' | 'medium' | 'high';
  
  // Connected Services
  connectedDevices: ConnectedDevice[];
  connectedApps: string[]; // 'google_fit', 'apple_health', 'fitbit', etc.
  
  // Preferences
  dashboardPreferences: {
    showVitals: boolean;
    showActivity: boolean;
    showSleep: boolean;
    showNutrition: boolean;
    showMedication: boolean;
    showAlerts: boolean;
    showRecommendations: boolean;
    primaryGoal: string;
  };
  
  // Onboarding Status
  onboardingCompleted: boolean;
  onboardingStep: number;
  profileCompleteness: number; // 0-100
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  lastHealthCheck: string;
}

// In-memory storage for demo (replace with database in production)
const userProfiles: Map<string, UserProfile> = new Map();

// Default health goals
export const DEFAULT_HEALTH_GOALS: Omit<HealthGoal, 'id' | 'startDate'>[] = [
  {
    name: 'Improve Fitness',
    category: 'fitness',
    priority: 'medium',
    target: '30 minutes daily exercise',
    isActive: true
  },
  {
    name: 'Better Sleep',
    category: 'lifestyle',
    priority: 'high',
    target: '8 hours per night',
    isActive: true
  },
  {
    name: 'Stay Hydrated',
    category: 'lifestyle',
    priority: 'medium',
    target: '2 liters daily',
    isActive: true
  },
  {
    name: 'Monitor Blood Pressure',
    category: 'chronic_illness',
    priority: 'high',
    isActive: true
  },
  {
    name: 'Weight Management',
    category: 'fitness',
    priority: 'medium',
    isActive: true
  }
];

// Profile Management Functions
export const createUserProfile = async (userId: string, initialData: Partial<UserProfile>): Promise<UserProfile> => {
  const profile: UserProfile = {
    id: `profile_${Date.now()}`,
    userId,
    age: 0,
    gender: 'prefer_not_to_say',
    healthGoals: [],
    medicalConditions: [],
    medications: [],
    allergies: [],
    familyHistory: [],
    activityLevel: 'moderately_active',
    sleepGoal: 8,
    waterGoal: 2,
    stressLevel: 'medium',
    connectedDevices: [],
    connectedApps: [],
    dashboardPreferences: {
      showVitals: true,
      showActivity: true,
      showSleep: true,
      showNutrition: true,
      showMedication: true,
      showAlerts: true,
      showRecommendations: true,
      primaryGoal: 'general_health'
    },
    onboardingCompleted: false,
    onboardingStep: 0,
    profileCompleteness: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastHealthCheck: new Date().toISOString(),
    ...initialData
  };

  userProfiles.set(userId, profile);
  return profile;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  return userProfiles.get(userId) || null;
};

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> => {
  const profile = userProfiles.get(userId);
  if (!profile) return null;

  const updatedProfile: UserProfile = {
    ...profile,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  // Calculate profile completeness
  updatedProfile.profileCompleteness = calculateProfileCompleteness(updatedProfile);

  userProfiles.set(userId, updatedProfile);
  return updatedProfile;
};

export const addHealthGoal = async (userId: string, goal: Omit<HealthGoal, 'id' | 'startDate'>): Promise<UserProfile | null> => {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const newGoal: HealthGoal = {
    ...goal,
    id: `goal_${Date.now()}`,
    startDate: new Date().toISOString()
  };

  return updateUserProfile(userId, {
    healthGoals: [...profile.healthGoals, newGoal]
  });
};

export const updateHealthGoal = async (userId: string, goalId: string, updates: Partial<HealthGoal>): Promise<UserProfile | null> => {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const updatedGoals = profile.healthGoals.map(goal =>
    goal.id === goalId ? { ...goal, ...updates } : goal
  );

  return updateUserProfile(userId, { healthGoals: updatedGoals });
};

export const addConnectedDevice = async (userId: string, device: Omit<ConnectedDevice, 'id' | 'lastSync'>): Promise<UserProfile | null> => {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const newDevice: ConnectedDevice = {
    ...device,
    id: `device_${Date.now()}`,
    lastSync: new Date().toISOString()
  };

  return updateUserProfile(userId, {
    connectedDevices: [...profile.connectedDevices, newDevice]
  });
};

export const updateOnboardingStep = async (userId: string, step: number, isCompleted: boolean = false): Promise<UserProfile | null> => {
  return updateUserProfile(userId, {
    onboardingStep: step,
    onboardingCompleted: isCompleted
  });
};

// Utility Functions
const calculateProfileCompleteness = (profile: UserProfile): number => {
  let completed = 0;
  let total = 0;

  // Basic info (20%)
  total += 4;
  if (profile.age > 0) completed += 1;
  if (profile.gender !== 'prefer_not_to_say') completed += 1;
  if (profile.height) completed += 1;
  if (profile.weight) completed += 1;

  // Health goals (20%)
  total += 2;
  if (profile.healthGoals.length > 0) completed += 1;
  if (profile.healthGoals.some(g => g.isActive)) completed += 1;

  // Medical info (20%)
  total += 3;
  if (profile.medicalConditions.length > 0) completed += 1;
  if (profile.medications.length > 0) completed += 1;
  if (profile.allergies.length > 0) completed += 1;

  // Lifestyle (20%)
  total += 3;
  if (profile.activityLevel !== 'moderately_active') completed += 1;
  if (profile.sleepGoal !== 8) completed += 1;
  if (profile.waterGoal !== 2) completed += 1;

  // Connected devices (20%)
  total += 2;
  if (profile.connectedDevices.length > 0) completed += 1;
  if (profile.connectedApps.length > 0) completed += 1;

  return Math.round((completed / total) * 100);
};

export const getDashboardModules = (profile: UserProfile): string[] => {
  const modules: string[] = [];

  // Always show welcome and profile completion
  modules.push('welcome', 'profile_completion');

  // Show modules based on preferences and data availability
  if (profile.dashboardPreferences.showVitals) {
    modules.push('vitals_summary');
  }

  if (profile.dashboardPreferences.showActivity) {
    modules.push('activity_insights');
  }

  if (profile.dashboardPreferences.showSleep) {
    modules.push('sleep_tracking');
  }

  if (profile.dashboardPreferences.showNutrition) {
    modules.push('nutrition_tracker');
  }

  if (profile.dashboardPreferences.showMedication) {
    modules.push('medication_reminder');
  }

  if (profile.dashboardPreferences.showAlerts) {
    modules.push('health_alerts');
  }

  if (profile.dashboardPreferences.showRecommendations) {
    modules.push('ai_recommendations');
  }

  // Show onboarding modules if not completed
  if (!profile.onboardingCompleted) {
    modules.push('onboarding_guide');
  }

  // Show device connection if no devices connected
  if (profile.connectedDevices.length === 0) {
    modules.push('connect_devices');
  }

  return modules;
};

export const getPersonalizedGreeting = (profile: UserProfile): string => {
  const hour = new Date().getHours();
  let timeGreeting = '';
  
  if (hour < 12) timeGreeting = 'Good morning';
  else if (hour < 17) timeGreeting = 'Good afternoon';
  else timeGreeting = 'Good evening';

  if (profile.onboardingCompleted) {
    return `${timeGreeting}, ${profile.healthGoals.length > 0 ? 'how are you feeling today?' : 'welcome back!'}`;
  } else {
    return `${timeGreeting}! Let's set up your health profile.`;
  }
};

export const getHealthTips = (profile: UserProfile): string[] => {
  const tips: string[] = [];

  if (profile.onboardingCompleted) {
    if (profile.connectedDevices.length === 0) {
      tips.push('Connect a wearable device to automatically track your health data');
    }
    
    if (profile.healthGoals.length === 0) {
      tips.push('Set your first health goal to get personalized recommendations');
    }
    
    if (profile.profileCompleteness < 50) {
      tips.push('Complete your health profile for better insights');
    }
  } else {
    tips.push('Complete your onboarding to unlock personalized features');
    tips.push('Connect your health devices for automatic data sync');
    tips.push('Set your health goals to get tailored recommendations');
  }

  return tips;
}; 