import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Stethoscope, AlertTriangle, CheckCircle } from 'lucide-react';

const EmotionDetection = () => {
  const [symptomData, setSymptomData] = useState(null);
  const [symptoms, setSymptoms] = useState('');

  const analyzeSymptoms = () => {
    if (!symptoms.trim()) return;

    // Simulate symptom analysis
    setTimeout(() => {
      const commonSymptoms = symptoms.toLowerCase().split(' ');
      const detectedSymptoms = ['headache', 'fatigue', 'nausea', 'fever', 'cough', 'sore throat', 'body aches'].filter(symptom => 
        commonSymptoms.some(word => word.includes(symptom) || symptom.includes(word))
      );

      setSymptomData({
        detectedSymptoms: detectedSymptoms.length > 0 ? detectedSymptoms : ['general symptoms'],
        confidence: 0.68,
        possibleConditions: ['migraine', 'stress', 'dehydration', 'viral infection', 'common cold', 'flu'],
        severity: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'moderate' : 'low',
        timestamp: new Date().toLocaleTimeString()
      });
    }, 2000);
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getConditionColor = (condition: string) => {
    const colors = {
      'migraine': 'bg-purple-100 text-purple-800',
      'stress': 'bg-blue-100 text-blue-800',
      'dehydration': 'bg-cyan-100 text-cyan-800',
      'viral infection': 'bg-red-100 text-red-800',
      'common cold': 'bg-orange-100 text-orange-800',
      'flu': 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          Symptom Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Symptoms Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your symptoms:
          </label>
          <Textarea
            placeholder="Example: I have a headache, feel tired, and have been nauseous for the past few hours..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="min-h-20"
          />
          <Button 
            onClick={analyzeSymptoms}
            disabled={!symptoms.trim()}
            className="w-full mt-2 bg-green-600 hover:bg-green-700"
          >
            Analyze Symptoms
          </Button>
        </div>

        {/* Analysis Results */}
        {symptomData && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Analysis Results:
              </h4>
              <span className="text-sm text-gray-500">{symptomData.timestamp}</span>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Detected Symptoms:</h5>
              <div className="flex flex-wrap gap-2">
                {symptomData.detectedSymptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Possible Conditions:</h5>
              <div className="flex flex-wrap gap-2">
                {symptomData.possibleConditions.map((condition, index) => (
                  <Badge key={index} className={getConditionColor(condition)}>
                    {condition}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Severity Level:</h5>
              <Badge className={getSeverityColor(symptomData.severity)}>
                {symptomData.severity} ({(symptomData.confidence * 100).toFixed(0)}% confidence)
              </Badge>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h5 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Recommendations:
              </h5>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Monitor symptoms for 24-48 hours</li>
                <li>• Keep a symptom diary with timestamps</li>
                <li>• Contact healthcare provider if symptoms worsen</li>
                <li>• Avoid self-diagnosis and seek professional medical advice</li>
              </ul>
            </div>
          </div>
        )}

        {/* Medical Disclaimer */}
        <div className="text-xs text-gray-500 bg-red-50 p-3 rounded-lg border border-red-200">
          <strong>Medical Disclaimer:</strong> This tool is for informational purposes only and should not replace professional medical diagnosis. Always consult with a qualified healthcare provider for medical concerns.
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionDetection;
