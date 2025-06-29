import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import Header from '@/components/Header';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  emotions?: string[];
}

const Chat = () => {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm here to provide emotional support and guidance. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = localStorage.getItem('mediprior_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const detectEmotions = (text: string): string[] => {
    const emotions: string[] = [];
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('anxious') || lowerText.includes('worried') || lowerText.includes('nervous')) {
      emotions.push('anxiety');
    }
    if (lowerText.includes('sad') || lowerText.includes('depressed') || lowerText.includes('down')) {
      emotions.push('sadness');
    }
    if (lowerText.includes('stressed') || lowerText.includes('overwhelmed') || lowerText.includes('pressure')) {
      emotions.push('stress');
    }
    if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('excited')) {
      emotions.push('joy');
    }
    if (lowerText.includes('angry') || lowerText.includes('frustrated') || lowerText.includes('mad')) {
      emotions.push('anger');
    }
    
    return emotions;
  };

  const generateAIResponse = (userMessage: string, detectedEmotions: string[]): string => {
    if (detectedEmotions.includes('anxiety')) {
      return "I can sense you're feeling anxious. That's completely understandable. Let's take a moment to breathe together. Try the 4-7-8 breathing technique: breathe in for 4, hold for 7, exhale for 8. What specific situation is causing you to feel this way?";
    }
    
    if (detectedEmotions.includes('sadness')) {
      return "I hear that you're feeling sad, and I want you to know that your feelings are valid. It's okay to feel this way. Sometimes sadness is our heart's way of processing difficult experiences. Would you like to share what's been weighing on your mind?";
    }
    
    if (detectedEmotions.includes('stress')) {
      return "It sounds like you're under a lot of stress right now. Stress can feel overwhelming, but remember that you've handled difficult situations before. Let's break this down into smaller, manageable pieces. What's the main source of your stress today?";
    }
    
    if (detectedEmotions.includes('joy')) {
      return "I'm so glad to hear you're feeling positive! It's wonderful when we can recognize and celebrate these good moments. What's bringing you joy today? Sharing positive experiences can help strengthen those feelings.";
    }
    
    if (detectedEmotions.includes('anger')) {
      return "I can tell you're feeling frustrated or angry. These are natural emotions, and it's important to acknowledge them. Let's work through this together. What's triggering these feelings, and how can we address the situation constructively?";
    }
    
    return "Thank you for sharing with me. I'm here to listen and support you. Can you tell me more about what you're experiencing? Sometimes talking through our thoughts and feelings can provide clarity and relief.";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const emotions = detectEmotions(inputMessage);
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      emotions
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateAIResponse(inputMessage, emotions),
        sender: 'ai',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getEmotionColor = (emotion: string) => {
    const colors = {
      anxiety: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
      sadness: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      stress: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
      joy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      anger: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200'
    };
    return colors[emotion] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">AI Support Chat</h2>
          <p className="text-gray-600 dark:text-gray-300">Get personalized emotional support and guidance</p>
        </div>

        <Card className="h-[600px] flex flex-col bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800 dark:text-white">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>MediPrior AI Assistant</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex space-x-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={message.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300'}>
                        {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      
                      {message.emotions && message.emotions.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {message.emotions.map((emotion, index) => (
                            <Badge key={index} className={`text-xs ${getEmotionColor(emotion)}`}>
                              {emotion}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex space-x-3 max-w-[80%]">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chat;
