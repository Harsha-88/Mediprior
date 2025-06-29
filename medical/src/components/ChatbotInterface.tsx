import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  X, 
  Bot, 
  User,
  Sparkles,
  Heart,
  Activity,
  Moon,
  Droplets
} from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotInterface = () => {
  const { isChatbotOpen, closeChatbot } = useChatbot();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your Health Coach. I'm here to help you with your health journey. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isChatbotOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isChatbotOpen]);

  const quickReplies = [
    "How can I improve my sleep?",
    "What exercises should I do?",
    "Help me track my water intake",
    "I'm feeling stressed today",
    "Check my health metrics"
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('sleep')) {
      return "Great question about sleep! Here are some tips:\n\n• Maintain a consistent sleep schedule\n• Create a relaxing bedtime routine\n• Keep your bedroom cool and dark\n• Avoid screens 1 hour before bed\n• Try meditation or deep breathing\n\nWould you like me to help you set up a sleep tracking goal?";
    }
    
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout')) {
      return "Exercise is essential for your health! Here are some recommendations:\n\n• Aim for 150 minutes of moderate activity weekly\n• Include strength training 2-3 times per week\n• Start with walking if you're new to exercise\n• Listen to your body and rest when needed\n• Find activities you enjoy to stay motivated\n\nWhat type of exercise interests you most?";
    }
    
    if (lowerMessage.includes('water') || lowerMessage.includes('hydration')) {
      return "Staying hydrated is crucial! Here's how to track it:\n\n• Aim for 8 glasses (2 liters) of water daily\n• Use a water tracking app or bottle\n• Drink water before, during, and after exercise\n• Monitor your urine color (should be light yellow)\n• Set reminders throughout the day\n\nI can help you set up a hydration tracking goal!";
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      return "I understand stress can be challenging. Here are some strategies:\n\n• Practice deep breathing exercises\n• Try mindfulness or meditation\n• Get regular physical activity\n• Maintain a healthy sleep schedule\n• Consider talking to a healthcare provider\n\nWould you like me to guide you through a quick breathing exercise?";
    }
    
    if (lowerMessage.includes('health') && lowerMessage.includes('metric')) {
      return "I can help you track various health metrics:\n\n• Heart rate and blood pressure\n• Sleep duration and quality\n• Daily steps and activity\n• Mood and energy levels\n• Water intake and nutrition\n\nWhich metrics would you like to focus on?";
    }
    
    return "Thank you for your message! I'm here to support your health journey. I can help you with:\n\n• Sleep optimization\n• Exercise recommendations\n• Stress management\n• Nutrition guidance\n• Health tracking\n\nWhat would you like to work on today?";
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  if (!isChatbotOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md h-[600px] flex flex-col bg-white dark:bg-gray-800">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Bot className="h-5 w-5" />
              Health Coach
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeChatbot}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Online</span>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                      {message.sender === 'user' && (
                        <User className="h-4 w-4 text-green-200 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-green-200' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-green-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          {messages.length === 1 && (
            <div className="p-4 border-t">
              <p className="text-xs text-gray-600 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs h-auto py-1 px-2"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatbotInterface; 