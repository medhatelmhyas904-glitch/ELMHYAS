import { Button } from '@/components/ui/button';
import { Plus, Users, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-education.jpg';

const HeroSection = () => {
  const quickActions = [
    { name: 'إضافة طالب جديد', icon: Users, color: 'bg-gradient-to-r from-primary to-primary/80', href: '/students' },
    { name: 'إنشاء مجموعة', icon: Calendar, color: 'bg-gradient-to-r from-secondary to-secondary/80', href: '/groups' },
    { name: 'تسجيل حضور', icon: BookOpen, color: 'bg-gradient-to-r from-green-500 to-green-600', href: '/students' },
    { name: 'عرض التقارير', icon: BarChart3, color: 'bg-gradient-to-r from-purple-500 to-purple-600', href: '/reports' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 text-primary-foreground animate-fade-in">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={heroImage} 
          alt="التعليم الذكي" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-right">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-cairo animate-slide-up">
            مرحباً بك في إمتياز أكاديمي
          </h1>
          <p className="text-lg md:text-xl mb-6 opacity-90 animate-fade-in-1">
            منصة شاملة ومتطورة لإدارة المراكز التعليمية والدروس الخصوصية
          </p>
          <p className="text-base mb-8 opacity-80 animate-fade-in-2">
            تابع طلابك، نظم مجموعاتك، وراقب أداءك بسهولة وفعالية
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-3">
            {quickActions.map((action, index) => (
              <Link key={action.name} to={action.href}>
                <Button
                  variant="secondary"
                  className={`${action.color} text-white border-0 hover:scale-105 transition-all duration-300 p-4 h-auto flex-col gap-2 shadow-lg hover:shadow-xl w-full`}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm font-cairo font-medium leading-tight">
                    {action.name}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden lg:block">
          <div className="relative">
            <div className="w-64 h-64 rounded-full bg-white/10 flex items-center justify-center animate-bounce-in">
              <div className="w-48 h-48 rounded-full bg-white/20 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-white/30 flex items-center justify-center">
                  <Plus className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;