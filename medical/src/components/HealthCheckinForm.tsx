import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  Heart, 
  Thermometer, 
  Droplets, 
  Activity, 
  Moon, 
  Coffee, 
  Pill, 
  Smile, 
  Zap, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { healthCheckinService, CheckinFormData } from '../lib/healthCheckinService';

interface HealthCheckinFormProps {
  userId: string;
  onComplete: () => void;
  onCancel: () => void;
}

const HealthCheckinForm: React.FC<HealthCheckinFormProps> = ({ userId, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CheckinFormData>({
    symptoms: [],
    symptomSeverity: 'mild',
    mood: 'good',
    energyLevel: 3,
    stressLevel: 3,
    sleepHours: '7',
    sleepQuality: 'good',
    waterIntake: '2',
    mealsEaten: 3,
    medications: [],
    notes: ''
  });

  const totalSteps = 6;

  const commonSymptoms = [
    'Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Chest pain',
    'Shortness of breath', 'Fever', 'Cough', 'Sore throat',
    'Body aches', 'Loss of appetite', 'Insomnia', 'Anxiety'
  ];

  const handleInputChange = (field: keyof CheckinFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSymptomToggle = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }));
  };

  const handleMedicationToggle = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, taken: !med.taken } : med
      )
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: '', taken: false }]
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await healthCheckinService.saveCheckin(userId, formData);
      onComplete();
    } catch (error) {
      console.error('Error saving check-in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heart className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-xl font-semibold mb-2">Vital Signs</h3>
              <p className="text-muted-foreground">Let's start with your basic vital signs</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="e.g., 72"
                  value={formData.heartRate || ''}
                  onChange={(e) => handleInputChange('heartRate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 98.6"
                  value={formData.temperature || ''}
                  onChange={(e) => handleInputChange('temperature', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systolic">Blood Pressure - Systolic</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="e.g., 120"
                  value={formData.bloodPressureSystolic || ''}
                  onChange={(e) => handleInputChange('bloodPressureSystolic', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="diastolic">Blood Pressure - Diastolic</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="e.g., 80"
                  value={formData.bloodPressureDiastolic || ''}
                  onChange={(e) => handleInputChange('bloodPressureDiastolic', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="oxygenSaturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygenSaturation"
                  type="number"
                  placeholder="e.g., 98"
                  value={formData.oxygenSaturation || ''}
                  onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-xl font-semibold mb-2">Symptoms & Health Issues</h3>
              <p className="text-muted-foreground">Select any symptoms you're experiencing today</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Symptom Severity</Label>
                <Select value={formData.symptomSeverity} onValueChange={(value: any) => handleInputChange('symptomSeverity', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Select Symptoms</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.symptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <Label htmlFor={symptom} className="text-sm">{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Smile className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-xl font-semibold mb-2">Mood & Wellness</h3>
              <p className="text-muted-foreground">How are you feeling today?</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Overall Mood</Label>
                <Select value={formData.mood} onValueChange={(value: any) => handleInputChange('mood', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                    <SelectItem value="terrible">Terrible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Energy Level (1-5)</Label>
                <Select value={formData.energyLevel.toString()} onValueChange={(value) => handleInputChange('energyLevel', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Low</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - High</SelectItem>
                    <SelectItem value="5">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Stress Level (1-5)</Label>
                <Select value={formData.stressLevel.toString()} onValueChange={(value) => handleInputChange('stressLevel', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Very Low</SelectItem>
                    <SelectItem value="2">2 - Low</SelectItem>
                    <SelectItem value="3">3 - Moderate</SelectItem>
                    <SelectItem value="4">4 - High</SelectItem>
                    <SelectItem value="5">5 - Very High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Moon className="w-12 h-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-xl font-semibold mb-2">Sleep & Activity</h3>
              <p className="text-muted-foreground">Tell us about your sleep and physical activity</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Hours of Sleep Last Night</Label>
                <Input
                  id="sleepHours"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 7.5"
                  value={formData.sleepHours}
                  onChange={(e) => handleInputChange('sleepHours', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Sleep Quality</Label>
                <Select value={formData.sleepQuality} onValueChange={(value: any) => handleInputChange('sleepQuality', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="exerciseMinutes">Exercise Minutes Today</Label>
                <Input
                  id="exerciseMinutes"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.exerciseMinutes || ''}
                  onChange={(e) => handleInputChange('exerciseMinutes', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="steps">Steps Today</Label>
                <Input
                  id="steps"
                  type="number"
                  placeholder="e.g., 8000"
                  value={formData.steps || ''}
                  onChange={(e) => handleInputChange('steps', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Coffee className="w-12 h-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">Hydration & Nutrition</h3>
              <p className="text-muted-foreground">Track your daily intake</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waterIntake">Water Intake (Liters)</Label>
                <Input
                  id="waterIntake"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 2.5"
                  value={formData.waterIntake}
                  onChange={(e) => handleInputChange('waterIntake', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Meals Eaten Today</Label>
                <Select value={formData.mealsEaten.toString()} onValueChange={(value) => handleInputChange('mealsEaten', parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Pill className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">Medication & Notes</h3>
              <p className="text-muted-foreground">Track your medications and add any notes</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Medications</Label>
                {formData.medications.map((med, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                    <Checkbox
                      checked={med.taken}
                      onCheckedChange={() => handleMedicationToggle(index)}
                    />
                    <Input
                      placeholder="Medication name"
                      value={med.name}
                      onChange={(e) => {
                        const newMeds = [...formData.medications];
                        newMeds[index].name = e.target.value;
                        handleInputChange('medications', newMeds);
                      }}
                    />
                    <Input
                      placeholder="Dosage"
                      value={med.dosage || ''}
                      onChange={(e) => {
                        const newMeds = [...formData.medications];
                        newMeds[index].dosage = e.target.value;
                        handleInputChange('medications', newMeds);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeMedication(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addMedication}>
                  Add Medication
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional health notes or observations..."
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Health Check-in</CardTitle>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              ✕
            </Button>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Check-in
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthCheckinForm; 