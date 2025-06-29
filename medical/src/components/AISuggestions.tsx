import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Heart, Activity, Calendar, Droplets, Moon, TrendingUp, Target } from 'lucide-react';

const AISuggestions = () => {
  const [suggestions, setSuggestions] = useState([
    {
      type: 'activity',
      icon: Activity,
      title: 'Increase Daily Movement',
      content: "Your step count is below the recommended 10,000 steps. Try taking a 15-minute walk during lunch or using the stairs instead of the elevator.",
      category: 'fitness',
      priority: 'medium'
    },
    {
      type: 'health',
      icon: Heart,
      title: 'Blood Pressure Monitoring',
      content: 'Your blood pressure readings have been slightly elevated. Consider reducing salt intake and scheduling a check-up with your doctor.',
      category: 'vitals',
      priority: 'high'
    },
    {
      type: 'lifestyle',
      icon: Moon,
      title: 'Sleep Optimization',
      content: 'Your sleep duration is below the recommended 8 hours. Try establishing a consistent bedtime routine and limiting screen time before bed.',
      category: 'wellness',
      priority: 'medium'
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshSuggestions = () => {
    setIsRefreshing(true);
    
    // Simulate AI generating new suggestions
    setTimeout(() => {
      const newSuggestions = [
        {
          type: 'nutrition',
          icon: Droplets,
          title: 'Hydration Reminder',
          content: 'You\'ve only consumed 6 glasses of water today. Aim for 8 glasses to maintain proper hydration and support overall health.',
          category: 'nutrition',
          priority: 'medium'
        },
        {
          type: 'prevention',
          icon: Target,
          title: 'Preventive Care',
          content: 'It\'s been 6 months since your last check-up. Schedule an annual physical to catch any potential health issues early.',
          category: 'prevention',
          priority: 'low'
        },
        {
          type: 'activity',
          icon: TrendingUp,
          title: 'Exercise Recommendation',
          content: 'Consider adding 30 minutes of moderate exercise 3-4 times per week to improve cardiovascular health and energy levels.',
          category: 'fitness',
          priority: 'medium'
        }
      ];
      setSuggestions(newSuggestions);
      setIsRefreshing(false);
    }, 1500);
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      activity: 'bg-blue-100 text-blue-800',
      health: 'bg-red-100 text-red-800',
      lifestyle: 'bg-purple-100 text-purple-800',
      nutrition: 'bg-cyan-100 text-cyan-800',
      prevention: 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Health Insights & Recommendations
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshSuggestions}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const IconComponent = suggestion.icon;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <IconComponent className="h-5 w-5 text-gray-600" />
                  <h4 className="font-medium text-gray-800">{suggestion.title}</h4>
                </div>
                <div className="flex space-x-2">
                  <Badge className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority}
                  </Badge>
                  <Badge variant="outline" className={getTypeColor(suggestion.type)}>
                    {suggestion.type}
                  </Badge>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {suggestion.content}
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Category:</span>
                <Badge variant="outline" className="text-xs">
                  {suggestion.category}
                </Badge>
              </div>
            </div>
          );
        })}

        <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg mt-4">
          <strong>AI-Powered Insights:</strong> Recommendations are based on your health data and follow evidence-based guidelines for optimal wellness.
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestions;
