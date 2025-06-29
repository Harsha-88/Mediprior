import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Heart, 
  Moon, 
  Droplets, 
  Activity,
  AlertTriangle,
  Info,
  CheckCircle
} from 'lucide-react';
import { healthCheckinService } from '../lib/healthCheckinService';

interface HealthTrendsProps {
  userId: string;
}

const HealthTrends: React.FC<HealthTrendsProps> = ({ userId }) => {
  const [trends, setTrends] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrendsAndInsights();
  }, [userId]);

  const loadTrendsAndInsights = async () => {
    try {
      const [trendsData, insightsData] = await Promise.all([
        healthCheckinService.getWeeklyTrends(userId),
        healthCheckinService.getHealthInsights(userId)
      ]);
      
      setTrends(trendsData);
      setInsights(insightsData);
    } catch (error) {
      console.error('Error loading trends and insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'positive':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'border-orange-200 bg-orange-50';
      case 'positive':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const calculateAverage = (data: any[]) => {
    if (data.length === 0) return 0;
    return data.reduce((sum, item) => sum + item.value, 0) / data.length;
  };

  const getMoodScore = (mood: string) => {
    const scores: { [key: string]: number } = {
      excellent: 5,
      good: 4,
      fair: 3,
      poor: 2,
      terrible: 1
    };
    return scores[mood] || 3;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Health Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trends || trends.mood.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Health Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Complete your first health check-in to see trends and insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  const avgMood = calculateAverage(trends.mood.map((item: any) => ({ value: getMoodScore(item.value) })));
  const avgSleep = calculateAverage(trends.sleepHours);
  const avgEnergy = calculateAverage(trends.energyLevel);
  const avgStress = calculateAverage(trends.stressLevel);
  const avgWater = calculateAverage(trends.waterIntake);

  return (
    <div className="space-y-6">
      {/* Health Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Health Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
                >
                  <div className="flex items-start space-x-2">
                    {getInsightIcon(insight.type)}
                    <p className="text-sm">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weekly Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Weekly Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mood Trend */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="font-medium">Mood</span>
                </div>
                {getTrendIcon(avgMood, 3)}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {avgMood.toFixed(1)}/5
              </div>
              <p className="text-sm text-gray-600">
                Average over {trends.mood.length} days
              </p>
            </div>

            {/* Sleep Trend */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Moon className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Sleep</span>
                </div>
                {getTrendIcon(avgSleep, 7)}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {avgSleep.toFixed(1)}h
              </div>
              <p className="text-sm text-gray-600">
                Average per night
              </p>
            </div>

            {/* Energy Trend */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="font-medium">Energy</span>
                </div>
                {getTrendIcon(avgEnergy, 3)}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {avgEnergy.toFixed(1)}/5
              </div>
              <p className="text-sm text-gray-600">
                Average level
              </p>
            </div>

            {/* Stress Trend */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">Stress</span>
                </div>
                {getTrendIcon(avgStress, 3)}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {avgStress.toFixed(1)}/5
              </div>
              <p className="text-sm text-gray-600">
                Average level
              </p>
            </div>

            {/* Water Intake Trend */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span className="font-medium">Hydration</span>
                </div>
                {getTrendIcon(avgWater, 2)}
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {avgWater.toFixed(1)}L
              </div>
              <p className="text-sm text-gray-600">
                Average daily intake
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Check-ins Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trends.mood.slice(-5).reverse().map((item: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{item.date}</p>
                    <p className="text-sm text-gray-600">
                      Sleep: {trends.sleepHours.find((s: any) => s.date === item.date)?.value || 0}h
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {item.value}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthTrends; 