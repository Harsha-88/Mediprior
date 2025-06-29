import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import HealthCheckinButton from '../components/HealthCheckinButton';
import HealthTrends from '../components/HealthTrends';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  ArrowLeft, 
  Activity, 
  TrendingUp, 
  Heart,
  Calendar
} from 'lucide-react';

const HealthCheckin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('mediprior_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 bg-white/50 hover:bg-white/80 transition-all duration-300 border-green-200 hover:border-green-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Health Check-in
                </h1>
                <p className="text-gray-600 text-sm">Monitor your daily health and view trends</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Health Check-in Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Calendar className="h-5 w-5" />
                  Daily Health Check-in
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthCheckinButton 
                  userId={user.id || user.email} 
                  onCheckinComplete={() => {
                    // Refresh trends when check-in is completed
                    window.location.reload();
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Health Trends Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="h-5 w-5" />
                  Health Trends & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HealthTrends userId={user.id || user.email} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800 text-lg">
                <Heart className="h-5 w-5" />
                Why Check-in Daily?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• Track your health patterns over time</li>
                <li>• Identify early warning signs</li>
                <li>• Monitor medication effectiveness</li>
                <li>• Share data with healthcare providers</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
                <Activity className="h-5 w-5" />
                What We Track
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-green-700 space-y-2">
                <li>• Vital signs (heart rate, blood pressure)</li>
                <li>• Mood and energy levels</li>
                <li>• Sleep quality and duration</li>
                <li>• Medication adherence</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 text-lg">
                <TrendingUp className="h-5 w-5" />
                Smart Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• AI-powered health recommendations</li>
                <li>• Trend analysis and predictions</li>
                <li>• Personalized wellness tips</li>
                <li>• Early detection alerts</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default HealthCheckin; 