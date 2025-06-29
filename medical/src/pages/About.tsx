import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { 
  Heart, 
  Shield, 
  Users, 
  Target, 
  CheckCircle, 
  Brain, 
  FileText, 
  MessageSquare,
  Lock,
  ArrowRight,
  Activity,
  Stethoscope,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const About = () => {
  const features = [
    {
      icon: CheckCircle,
      title: 'Daily Health Check-In',
      description: 'Track your daily health metrics with AI-powered insights.',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      icon: Brain,
      title: 'Disease Prediction',
      description: 'AI algorithms analyze symptoms for early detection.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      icon: FileText,
      title: 'Report Management',
      description: 'Securely upload and organize your medical reports.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      icon: MessageSquare,
      title: 'Health Coach',
      description: '24/7 AI health coach for personalized guidance.',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-green-600 to-teal-600">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Welcome to MediPrior
              <span className="block text-2xl font-medium text-blue-100 mt-2">
                Your Health, Prioritized
              </span>
            </h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6">
              Empowering individuals with AI-driven health insights and proactive disease analysis.
            </p>
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link to="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Who We Are</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                MediPrior is a team of healthcare professionals, data scientists, and technology experts dedicated to revolutionizing personal health management through AI-powered insights and proactive care.
              </p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">MD</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">AI</span>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">DS</span>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Expert healthcare & AI team</span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-xl p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                  <Activity className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Health Monitoring</h3>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                  <Brain className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">AI Analysis</h3>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                  <Stethoscope className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Medical Expertise</h3>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                  <Lightbulb className="w-6 h-6 text-orange-600 mb-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Innovation</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            To empower individuals with AI-driven health insights and proactive disease analysis, making healthcare more accessible and preventive.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Empower</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Control over your health journey</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Protect</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Secure and private data handling</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Care</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Personalized health guidance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Core Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful tools that make MediPrior your comprehensive health companion
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="text-center pb-3">
                    <div className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-center text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Data Privacy & Trust Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Privacy & Trust</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                At MediPrior, we take your privacy seriously. All personal and medical information is securely encrypted and you maintain full control over your data at all times.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">HIPAA compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Full user control</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Your Data is Safe</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Industry-leading security measures protect your health information
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="font-semibold text-gray-900 dark:text-white">256-bit</div>
                    <div className="text-gray-600 dark:text-gray-300">Encryption</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="font-semibold text-gray-900 dark:text-white">99.9%</div>
                    <div className="text-gray-600 dark:text-gray-300">Uptime</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Prioritize Your Health?</h2>
          <p className="text-blue-100 mb-6">
            Join thousands of users taking control of their health with MediPrior
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
            <Link to="/signup" className="flex items-center gap-2">
              Get Started Today
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About; 