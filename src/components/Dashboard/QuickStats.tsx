import { TrendingUp, Clock, DollarSign, UserCheck } from 'lucide-react';

const QuickStats = () => {
  const quickStats = [
    {
      title: 'حضور اليوم',
      value: '٢٨٧',
      total: '٣٢٤',
      percentage: 89,
      icon: UserCheck,
      color: 'text-success'
    },
    {
      title: 'المجموعات النشطة',
      value: '١٢',
      total: '٤٥',
      percentage: 27,
      icon: Clock,
      color: 'text-primary'
    },
    {
      title: 'إيرادات الشهر',
      value: '١٨,٥٠٠',
      total: '٢٥,٠٠٠',
      percentage: 74,
      icon: DollarSign,
      color: 'text-success'
    },
    {
      title: 'معدل النمو',
      value: '+١٢٪',
      total: 'هذا الشهر',
      percentage: 85,
      icon: TrendingUp,
      color: 'text-secondary'
    }
  ];

  return (
    <div className="educational-card-gradient">
      <h3 className="text-lg font-bold text-foreground font-cairo mb-6">
        إحصائيات سريعة
      </h3>
      
      <div className="space-y-6">
        {quickStats.map((stat, index) => (
          <div
            key={stat.title}
            className={`animate-fade-in-${index + 1}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color} bg-current/10`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground font-cairo">
                    {stat.title}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground font-cairo">
                      {stat.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      / {stat.total}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <span className={`text-sm font-bold ${stat.color}`}>
                  {stat.percentage}%
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-smooth ${
                  stat.color === 'text-success' ? 'gradient-success' :
                  stat.color === 'text-primary' ? 'gradient-primary' :
                  stat.color === 'text-secondary' ? 'gradient-secondary' : 'bg-gray-500'
                }`}
                style={{ width: `${stat.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;