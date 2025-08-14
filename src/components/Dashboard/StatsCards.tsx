import { Users, BookOpen, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

const StatsCards = () => {
  const stats = [
    {
      title: 'إجمالي الطلاب',
      value: '324',
      change: '+12%',
      icon: Users,
      color: 'bg-gradient-to-r from-primary to-primary/80',
      trend: 'up'
    },
    {
      title: 'المعلمين النشطين',
      value: '18',
      change: '+2',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-secondary to-secondary/80',
      trend: 'up'
    },
    {
      title: 'المجموعات الفعالة',
      value: '45',
      change: '+5',
      icon: Calendar,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: 'up'
    },
    {
      title: 'إجمالي الإيرادات',
      value: '٤٥,٢٣٠ ر.س',
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      trend: 'up'
    },
    {
      title: 'معدل الحضور',
      value: '٨٧٪',
      change: '+3.1%',
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: 'up'
    },
    {
      title: 'المدفوعات المعلقة',
      value: '١٢,٤٥٠ ر.س',
      change: '-5.2%',
      icon: AlertTriangle,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600',
      trend: 'down'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {stats.map((stat, index) => (
        <div
          key={stat.title}
          className={`educational-card-gradient hover-lift transition-smooth animate-fade-in-${index % 4 + 1}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1 font-cairo">
                {stat.title}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl lg:text-3xl font-bold text-foreground font-cairo">
                  {stat.value}
                </p>
                <span
                  className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.trend === 'up'
                      ? 'text-success bg-success/10'
                      : 'text-orange-500 bg-orange-500/10'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className={`${stat.color} p-3 rounded-xl shadow-elegant`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`${stat.color} h-2 rounded-full transition-smooth`}
                style={{ width: `${Math.random() * 40 + 60}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;