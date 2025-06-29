import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, Activity, AlertTriangle, TrendingUp } from 'lucide-react';

const ConversationAnalyzer = () => {
  const [conversationText, setConversationText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeConversation = async () => {
    if (!conversationText.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const healthTopics = ['symptoms', 'medication', 'exercise', 'nutrition', 'sleep', 'stress'];
      const randomTopics = healthTopics.slice(0, Math.floor(Math.random() * 3) + 1);

      setAnalysis({
        healthTopics: randomTopics,
        urgency: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        confidence: (Math.random() * 0.4 + 0.6).toFixed(2),
        suggestions: [
          "Consider tracking these symptoms in your health journal for the next few days",
          "Schedule a follow-up with your healthcare provider to discuss these concerns",
          "Try implementing the suggested lifestyle changes and monitor for improvements"
        ],
        nextSteps: [
          "Log symptoms in health tracker",
          "Schedule doctor appointment",
          "Update medication list"
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const getTopicColor = (topic: string) => {
    const colors = {
      symptoms: 'bg-red-100 text-red-800',
      medication: 'bg-blue-100 text-blue-800',
      exercise: 'bg-green-100 text-green-800',
      nutrition: 'bg-yellow-100 text-yellow-800',
      sleep: 'bg-purple-100 text-purple-800',
      stress: 'bg-orange-100 text-orange-800'
    };
    return colors[topic] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          Health Chat Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your health concerns or symptoms:
          </label>
          <Textarea
            placeholder="Example: I've been experiencing headaches for the past week, and my sleep has been irregular..."
            value={conversationText}
            onChange={(e) => setConversationText(e.target.value)}
            className="min-h-32"
          />
        </div>

        <Button
          onClick={analyzeConversation}
          disabled={!conversationText.trim() || isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isAnalyzing ? 'Analyzing Health Data...' : 'Analyze Health Concerns'}
        </Button>

        {analysis && (
          <div className="space-y-4 mt-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Identified Health Topics:
              </h4>
              <div className="flex flex-wrap gap-2">
                {analysis.healthTopics.map((topic, index) => (
                  <Badge key={index} className={getTopicColor(topic)}>
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                Urgency Level:
              </h4>
              <Badge className={getUrgencyColor(analysis.urgency)}>
                {analysis.urgency} priority ({(parseFloat(analysis.confidence) * 100).toFixed(0)}% confidence)
              </Badge>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Recommended Actions:
              </h4>
              <ul className="space-y-2">
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Next Steps:
              </h4>
              <div className="space-y-2">
                {analysis.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg mt-4">
          <strong>Note:</strong> This analysis is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for medical concerns.
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationAnalyzer;
