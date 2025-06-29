import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Heart, Target, TrendingUp, User } from 'lucide-react';
import { UserProfile, getPersonalizedGreeting, getHealthTips } from '@/lib/userProfile';

interface WelcomeCardProps {
  userProfile: UserProfile;
  onEditProfile: () => void;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ userProfile, onEditProfile }) => {
  const greeting = getPersonalizedGreeting(userProfile);
  const tips = getHealthTips(userProfile);

  return (
    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Heart className="text-white h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{greeting}</h2>
                <p className="text-gray-600">
                  {userProfile.onboardingCompleted 
                    ? `Your health journey is ${userProfile.profileCompleteness}% complete`
                    : 'Let\'s get started with your health profile'
                  }
                </p>
              </div>
            </div>

            {userProfile.onboardingCompleted && (
              <div className="space-y-4">
                {/* Profile Completion */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                    <span className="text-sm text-gray-500">{userProfile.profileCompleteness}%</span>
                  </div>
                  <Progress value={userProfile.profileCompleteness} className="h-2" />
                </div>

                {/* Active Goals */}
                {userProfile.healthGoals.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Active Goals</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {userProfile.healthGoals.slice(0, 3).map((goal) => (
                        <Badge key={goal.id} variant="secondary" className="text-xs">
                          {goal.name}
                        </Badge>
                      ))}
                      {userProfile.healthGoals.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{userProfile.healthGoals.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Health Tips */}
                {tips.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Tips for You</span>
                    </div>
                    <div className="space-y-2">
                      {tips.slice(0, 2).map((tip, index) => (
                        <p key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>{tip}</span>
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!userProfile.onboardingCompleted && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Complete your profile setup to unlock personalized health insights and recommendations.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">What you'll get:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Personalized health recommendations</li>
                    <li>• Goal tracking and progress insights</li>
                    <li>• Customized dashboard modules</li>
                    <li>• AI-powered health suggestions</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onEditProfile}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>{userProfile.onboardingCompleted ? 'Edit Profile' : 'Complete Setup'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard; 