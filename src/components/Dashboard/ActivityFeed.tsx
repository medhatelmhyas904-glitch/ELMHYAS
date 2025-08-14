import { Clock, Users, CreditCard, BookOpen, AlertCircle } from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: 'student',
      title: 'تم تسجيل طالب جديد',
      description: 'محمد عبدالله - الصف الثالث الثانوي',
      time: 'منذ 15 دقيقة',
      icon: Users,
      color: 'text-primary bg-primary/10'
    },
    {
      id: 2,
      type: 'payment',
      title: 'تم استلام دفعة جديدة',
      description: 'سارة أحمد - 800 ر.س',
      time: 'منذ 30 دقيقة',
      icon: CreditCard,
      color: 'text-success bg-success/10'
    },
    {
      id: 3,
      type: 'attendance',
      title: 'تم تسجيل الحضور',
      description: 'مجموعة الرياضيات - 12 طالب حاضر',
      time: 'منذ ساعة',
      icon: BookOpen,
      color: 'text-secondary bg-secondary/10'
    },
    {
      id: 4,
      type: 'alert',
      title: 'تنبيه: دفعة متأخرة',
      description: 'يوسف محمد - متأخر 3 أيام',
      time: 'منذ ساعتين',
      icon: AlertCircle,
      color: 'text-orange-500 bg-orange-500/10'
    },
    {
      id: 5,
      type: 'student',
      title: 'طالب جديد في قائمة الانتظار',
      description: 'فاطمة علي - مجموعة الكيمياء',
      time: 'منذ 3 ساعات',
      icon: Users,
      color: 'text-blue-500 bg-blue-500/10'
    }
  ];

  return (
    <div className="educational-card-gradient">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground font-cairo">آخر الأنشطة</h3>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={`flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary/20 transition-smooth animate-fade-in-${index % 3 + 1} hover-lift`}
          >
            <div className={`p-2 rounded-full ${activity.color}`}>
              <activity.icon className="h-4 w-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground font-cairo mb-1">
                {activity.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="text-sm text-primary hover:text-primary-dark transition-smooth font-cairo font-medium">
          عرض جميع الأنشطة
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;