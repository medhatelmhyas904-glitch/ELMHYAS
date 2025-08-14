// src/components/Navigation.tsx (أو ProtectedRoutes.tsx)
import { useState } from 'react';
import { Menu, X, GraduationCap, Users, BookOpen, Calendar, CreditCard, BarChart3, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/useAuth'; // تأكد من هذا المسار

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  // تأكد من استخدام logout هنا وليس signOut
  const { profile, logout } = useAuth(); 

  const navigationItems = [
    { name: 'الرئيسية', icon: GraduationCap, href: '/' },
    { name: 'الطلاب', icon: Users, href: '/students' },
    { name: 'المعلمين', icon: BookOpen, href: '/teachers' },
    { name: 'المجموعات', icon: Calendar, href: '/groups' },
    { name: 'المدفوعات', icon: CreditCard, href: '/payments' },
    { name: 'التقارير', icon: BarChart3, href: '/reports' },
    { name: 'الإعدادات', icon: Settings, href: '/settings' },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 gradient-primary rounded-lg">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground font-cairo">إمتياز أكاديمي</h1>
              <p className="text-sm text-muted-foreground">نظام إدارة المراكز التعليمية</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-cairo">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* User Avatar & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* User Profile */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-left">
                <p className="text-sm font-medium text-foreground font-cairo">
                  {profile?.full_name || profile?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {profile?.role === 'admin' && 'مدير النظام'}
                  {profile?.role === 'supervisor' && 'مشرف'}
                  {profile?.role === 'teacher' && 'معلم'}
                  {profile?.role === 'accountant' && 'محاسب'}
                  {profile?.role === 'student' && 'طالب'}
                  {profile?.role === 'parent' && 'ولي أمر'}
                </p>
              </div>
              <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">
                  {profile?.full_name?.charAt(0) || profile?.email?.charAt(0) || 'ن'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()} // تأكد من استدعاء logout هنا
                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`flex items-center gap-3 px-4 py-3 text-right justify-start w-full transition-all duration-300 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-cairo font-medium">{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

export type AuthContextType = {
  logout: () => void;
  profile: {
    full_name?: string;
    email?: string;
    role?: string;
    // add other profile fields as needed
  } | null;
  // ... other properties
};
