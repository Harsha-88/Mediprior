import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useChatbot } from '../contexts/ChatbotContext';

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isChatbotOpen, openChatbot } = useChatbot();

  // Don't show on login, signup, or chat pages
  if (['/login', '/signup', '/chat'].includes(location.pathname)) {
    return null;
  }

  // Don't show if chatbot is already open
  if (isChatbotOpen) {
    return null;
  }

  return (
    <Button
      onClick={openChatbot}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      size="icon"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
};

export default FloatingChatButton;
