import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Heart, 
  User, 
  Target, 
  Activity, 
  Smartphone, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  X
} from 'lucide-react';
import { UserProfile, HealthGoal, DEFAULT_HEALTH_GOALS, updateUserProfile, addHealthGoal } from '@/lib/userProfile';

interface OnboardingFlowProps {
  userProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ userProfile, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(userProfile.onboardingStep);
  const [formData, setFormData] = useState({
    age: userProfile.age || '',
    gender: userProfile.gender,
    height: userProfile.height || '',
    weight: userProfile.weight || '',
    activityLevel: userProfile.activityLevel,
    sleepGoal: userProfile.sleepGoal,
    waterGoal: userProfile.waterGoal,
    stressLevel: userProfile.stressLevel,
    selectedGoals: [] as string[],
    customGoals: [] as Omit<HealthGoal, 'id' | 'startDate'>[],
    connectedApps: [] as string[]
  });

  const totalSteps = 5;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about yourself',
      icon: User
    },
    {
      title: 'Health Goals',
      description: 'What do you want to achieve?',
      icon: Target
    },
    {
      title: 'Lifestyle',
      description: 'Your daily habits and preferences',
      icon: Activity
    },
    {
      title: 'Connect Devices',
      description: 'Sync your health data',
      icon: Smartphone
    },
    {
      title: 'Complete Setup',
      description: 'Review and finish',
      icon: CheckCircle
    }
  ];

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      const nextStep = currentStep + 1;
      await updateUserProfile(userProfile.userId, { onboardingStep: nextStep });
      setCurrentStep(nextStep);
    } else {
      await handleComplete();
    }
  };

  const handleBack = async () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      await updateUserProfile(userProfile.userId, { onboardingStep: prevStep });
      setCurrentStep(prevStep);
    }
  };

  const handleComplete = async () => {
    // Update profile with all collected data
    const updatedProfile = await updateUserProfile(userProfile.userId, {
      age: Number(formData.age),
      gender: formData.gender,
      height: Number(formData.height),
      weight: Number(formData.weight),
      activityLevel: formData.activityLevel,
      sleepGoal: formData.sleepGoal,
      waterGoal: formData.waterGoal,
      stressLevel: formData.stressLevel,
      connectedApps: formData.connectedApps,
      onboardingCompleted: true,
      onboardingStep: totalSteps - 1
    });

    if (updatedProfile) {
      // Add selected health goals
      for (const goalName of formData.selectedGoals) {
        const goal = DEFAULT_HEALTH_GOALS.find(g => g.name === goalName);
        if (goal) {
          await addHealthGoal(userProfile.userId, goal);
        }
      }

      // Add custom goals
      for (const customGoal of formData.customGoals) {
        await addHealthGoal(userProfile.userId, customGoal);
      }

      onComplete(updatedProfile);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Enter your age"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value: any) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Enter your height"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Enter your weight"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select your health goals</Label>
              <p className="text-sm text-gray-600 mt-1">Choose goals that matter to you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEFAULT_HEALTH_GOALS.map((goal) => (
                <div key={goal.name} className="flex items-center space-x-3">
                  <Checkbox
                    id={goal.name}
                    checked={formData.selectedGoals.includes(goal.name)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          selectedGoals: [...prev.selectedGoals, goal.name]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          selectedGoals: prev.selectedGoals.filter(g => g !== goal.name)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={goal.name} className="flex-1 cursor-pointer">
                    <div>
                      <div className="font-medium">{goal.name}</div>
                      <div className="text-sm text-gray-500">{goal.target}</div>
                    </div>
                  </Label>
                  <Badge variant={goal.priority === 'high' ? 'destructive' : 'secondary'}>
                    {goal.priority}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Add custom goals (optional)</Label>
              {formData.customGoals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={goal.name}
                    onChange={(e) => {
                      const updatedGoals = [...formData.customGoals];
                      updatedGoals[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, customGoals: updatedGoals }));
                    }}
                    placeholder="Enter goal name"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        customGoals: prev.customGoals.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    customGoals: [...prev.customGoals, {
                      name: '',
                      category: 'lifestyle',
                      priority: 'medium',
                      isActive: true
                    }]
                  }));
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Goal
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select value={formData.activityLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, activityLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="lightly_active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="extremely_active">Extremely Active (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stressLevel">Stress Level</Label>
                <Select value={formData.stressLevel} onValueChange={(value: any) => setFormData(prev => ({ ...prev, stressLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleepGoal">Sleep Goal (hours per night)</Label>
                <Input
                  id="sleepGoal"
                  type="number"
                  value={formData.sleepGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, sleepGoal: Number(e.target.value) }))}
                  min="4"
                  max="12"
                  step="0.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="waterGoal">Water Goal (liters per day)</Label>
                <Input
                  id="waterGoal"
                  type="number"
                  value={formData.waterGoal}
                  onChange={(e) => setFormData(prev => ({ ...prev, waterGoal: Number(e.target.value) }))}
                  min="0.5"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Connect your health apps</Label>
              <p className="text-sm text-gray-600 mt-1">Sync your existing health data</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: 'google_fit', name: 'Google Fit', icon: '📱' },
                { id: 'apple_health', name: 'Apple Health', icon: '🍎' },
                { id: 'fitbit', name: 'Fitbit', icon: '⌚' },
                { id: 'garmin', name: 'Garmin', icon: '🏃' },
                { id: 'samsung_health', name: 'Samsung Health', icon: '📱' },
                { id: 'myfitnesspal', name: 'MyFitnessPal', icon: '🍽️' }
              ].map((app) => (
                <div key={app.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={app.id}
                    checked={formData.connectedApps.includes(app.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({
                          ...prev,
                          connectedApps: [...prev.connectedApps, app.id]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          connectedApps: prev.connectedApps.filter(a => a !== app.id)
                        }));
                      }
                    }}
                  />
                  <Label htmlFor={app.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{app.icon}</span>
                      <span>{app.name}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 You can always connect more apps later in your profile settings.
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold">You're all set!</h3>
              <p className="text-gray-600">Review your information and complete your profile</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Age:</span> {formData.age || 'Not specified'}
                </div>
                <div>
                  <span className="font-medium">Gender:</span> {formData.gender.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Activity Level:</span> {formData.activityLevel.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Sleep Goal:</span> {formData.sleepGoal} hours
                </div>
              </div>
              
              <div>
                <span className="font-medium">Health Goals:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.selectedGoals.map(goal => (
                    <Badge key={goal} variant="secondary">{goal}</Badge>
                  ))}
                  {formData.customGoals.map((goal, index) => (
                    <Badge key={`custom-${index}`} variant="outline">{goal.name}</Badge>
                  ))}
                </div>
              </div>
              
              {formData.connectedApps.length > 0 && (
                <div>
                  <span className="font-medium">Connected Apps:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.connectedApps.map(app => (
                      <Badge key={app} variant="outline">{app.replace('_', ' ')}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Heart className="text-white h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">Welcome to MediPrior</CardTitle>
                  <p className="text-sm text-gray-600">Let's personalize your health journey</p>
                </div>
              </div>
              <Button variant="ghost" onClick={onSkip}>
                Skip for now
              </Button>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Step {currentStep + 1} of {totalSteps}</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-2">
                {React.createElement(steps[currentStep].icon, { className: "h-5 w-5 text-blue-600" })}
                <h2 className="text-lg font-semibold">{steps[currentStep].title}</h2>
              </div>
              <p className="text-gray-600">{steps[currentStep].description}</p>
            </div>
            
            {renderStepContent()}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                {currentStep === totalSteps - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingFlow; 