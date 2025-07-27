import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Moon, Sun, User, Menu, ChevronDown, Settings, LogOut, FileText, Image, Brain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export function UploadNavbar({ currentPage }) {
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const toolsRef = useRef(null);

  const navItems = [
    { name: 'Compress', path: '/compress', icon: Image },
    { name: 'Convert', path: '/convert', icon: FileText },
    { name: 'AI PDF', path: '/ai/summarize', icon: Brain }
  ];

  const isActive = (path) => {
    if (path === '/compress') return currentPage === 'compress';
    if (path === '/convert') return currentPage === 'convert';
    if (path === '/ai/summarize') return currentPage === 'ai';
    return false;
  };

  const getInitials = (email) => {
    if (!email) return 'U';
    return email.charAt(0).toUpperCase();
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setIsToolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-foreground">Bytrix</span>
          </Link>
        </div>

        <nav className="hidden min-[520px]:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="min-[520px]:hidden relative" ref={toolsRef}>
          <button
            onClick={() => setIsToolsOpen(!isToolsOpen)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
              isToolsOpen
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span className="text-sm font-medium">Tools</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
          </button>

          {isToolsOpen && (
            <div className="absolute left-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
              <div className="py-1">
                {navItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsToolsOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 hover:bg-muted transition-colors text-left ${
                        isActive(item.path)
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {getInitials(user?.email)}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b border-border">
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      href="/me"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-muted transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Account Settings</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-muted transition-colors text-left text-destructive"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}