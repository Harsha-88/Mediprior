import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { 
  Heart, 
  LogOut, 
  User, 
  Settings, 
  Bell, 
  MessageSquare,
  Moon,
  Sun,
  FileText,
  Calendar,
  Menu,
  Download,
  FileDown,
  Activity,
  ChevronDown,
  Upload,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useChatbot } from '../contexts/ChatbotContext';
import { Badge } from './ui/badge';
import FileUploadDialog from './FileUploadDialog';

const Header = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { openChatbot } = useChatbot();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: Heart,
    },
    {
      label: 'My Reports',
      path: '/reports',
      icon: FileDown,
    },
    {
      label: 'Appointments',
      path: '/appointments',
      icon: Calendar,
    },
    {
      label: 'About',
      path: '/about',
      icon: Users,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const exportReports = (format: 'pdf' | 'csv') => {
    console.log(`Exporting reports as ${format}`);
    // Implement export functionality
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left Side - Logo & Navigation */}
          <div className="flex items-center space-x-32">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Heart className="text-white h-5 w-5" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                MediPrior
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive(item.path)
                        ? 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20'
                        : 'text-gray-600 dark:text-gray-300 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {!isActive(item.path) && (
                      <div className="absolute bottom-0 left-0 h-0.5 bg-green-500 transition-all duration-300 ease-out w-0 group-hover:w-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Right Side - Tools & User Actions */}
          <div className="flex items-center space-x-4">
            {/* Health Coach Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={openChatbot}
              className="hidden sm:flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all duration-200"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden lg:inline">Health Coach</span>
            </Button>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse" />
            </Button>

            {/* Upload Report */}
            <FileUploadDialog>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Upload className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </Button>
            </FileUploadDialog>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </Button>

            {/* User Profile */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full hover:scale-105 transition-all duration-200"
                  >
                    <Avatar className="h-8 w-8 ring-2 ring-green-200 dark:ring-green-800">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-sm font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user.role}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center transition-colors duration-200 hover:text-green-600">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center transition-colors duration-200 hover:text-green-600">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 transition-colors duration-200 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded flex items-center justify-center">
                      <Heart className="text-white h-4 w-4" />
                    </div>
                    <span>MediPrior</span>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Mobile Navigation */}
                  <nav className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive(item.path)
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>

                  <div className="border-t pt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => {
                        openChatbot();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Talk to Health Coach
                    </Button>
                    
                    <FileUploadDialog>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Report
                      </Button>
                    </FileUploadDialog>
                    
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={toggleDarkMode}
                    >
                      {isDarkMode ? (
                        <Sun className="mr-2 h-4 w-4" />
                      ) : (
                        <Moon className="mr-2 h-4 w-4" />
                      )}
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
