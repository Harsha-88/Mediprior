import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ConversationAnalyzer from '../components/ConversationAnalyzer';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import AISuggestions from '../components/AISuggestions';
import HealthCheckinButton from '../components/HealthCheckinButton';
import HealthTrends from '../components/HealthTrends';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  MessageSquare, 
  Lightbulb,
  ChevronRight,
  Activity,
  Heart,
  Brain
} from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [slideDirection, setSlideDirection] = useState('right');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('mediprior_user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
  }, []);

  const tabConfig = [
    {
      value: 'dashboard',
      label: 'Health Dashboard',
      icon: BarChart3,
      description: 'Monitor your health metrics and trends',
      color: 'blue'
    },
    {
      value: 'conversation',
      label: 'Health Chat',
      icon: MessageSquare,
      description: 'AI-powered health conversations and support',
      color: 'green'
    },
    {
      value: 'suggestions',
      label: 'Health Insights',
      icon: Lightbulb,
      description: 'Personalized health recommendations',
      color: 'purple'
    }
  ];

  const getTabIndex = (value: string) => {
    return tabConfig.findIndex(tab => tab.value === value);
  };

  const handleTabChange = (value: string) => {
    if (isTransitioning || value === activeTab) return;
    
    const currentIndex = getTabIndex(activeTab);
    const newIndex = getTabIndex(value);
    
    // Determine slide direction
    if (newIndex > currentIndex) {
      setSlideDirection('left');
    } else if (newIndex < currentIndex) {
      setSlideDirection('right');
    }
    
    setIsTransitioning(true);
    setActiveTab(value);
    
    // Reset transition state after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-600',
        gradient: 'from-blue-500 to-blue-600'
      },
      green: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-600',
        gradient: 'from-green-500 to-green-600'
      },
      purple: {
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-600',
        gradient: 'from-purple-500 to-purple-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center animate-scale-in">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome to MediPrior
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Prioritize Your Health, Detect Early, Live Fully.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="grid grid-cols-3 gap-2">
              {tabConfig.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.value;
                const colors = getColorClasses(tab.color);
                
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleTabChange(tab.value)}
                    disabled={isTransitioning}
                    className={`relative p-4 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                      isActive 
                        ? `bg-gradient-to-r ${colors.gradient} text-white shadow-lg` 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    } ${isTransitioning ? 'pointer-events-none' : ''}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : colors.text}`} />
                      <span className="text-xs font-medium">{tab.label}</span>
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg pulse-glow opacity-20" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative overflow-hidden">
            <div 
              className={`tab-content ${slideDirection === 'left' ? 'slide-in-left' : 'slide-in-right'}`}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Analytics Dashboard */}
                  <AnalyticsDashboard userId={user.id || user.email} />
                </div>
              )}

              {activeTab === 'conversation' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Health Chat
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        AI-powered health conversations and support
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ConversationAnalyzer />
                    <AISuggestions />
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Health Insights
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Personalized health recommendations
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <AISuggestions />
                    <div className="space-y-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover-lift">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                          <Heart className="w-5 h-5 text-red-500" />
                          Health Resources
                        </h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:scale-105">
                            <h4 className="font-medium text-blue-800 dark:text-blue-200">Emergency Support</h4>
                            <p className="text-sm text-blue-600 dark:text-blue-300">24/7 emergency services: 911</p>
                          </div>
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:scale-105">
                            <h4 className="font-medium text-green-800 dark:text-green-200">Wellness Resources</h4>
                            <p className="text-sm text-green-600 dark:text-green-300">Exercise guides and nutrition tips</p>
                          </div>
                          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 cursor-pointer hover:shadow-md transition-all duration-300 transform hover:scale-105">
                            <h4 className="font-medium text-purple-800 dark:text-purple-200">Healthcare Providers</h4>
                            <p className="text-sm text-purple-600 dark:text-purple-300">Find doctors and specialists in your area</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Privacy & Data Protection
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                At MediPrior, we take your privacy and data protection seriously. All personal and medical information you provide is securely encrypted both during transmission and while stored on our servers, ensuring it is protected from unauthorized access.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                You remain in full control of your data at all times. This means you can:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-4">
                <li>• <strong>Access your data:</strong> View your health records, reports, and history anytime.</li>
                <li>• <strong>Export your data:</strong> Download your data in a readable and portable format if you wish to store it elsewhere or share it with a healthcare provider.</li>
                <li>• <strong>Delete your data:</strong> Permanently remove your information from our system at any time, with no hidden traces or backups retained post-deletion.</li>
              </ul>
            </div>
            <div className="hidden md:block transition-transform duration-300 hover:rotate-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">🔒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
