import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus, Search, Filter } from 'lucide-react';

const Payments = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground font-cairo">إدارة المدفوعات</h1>
          <Button className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
            <Plus className="h-4 w-4 ml-2" />
            تسجيل دفعة جديدة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الإيرادات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">48,500 ر.س</div>
              <div className="text-xs text-green-600">+15% من الشهر الماضي</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">المدفوعات المعلقة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">12,200 ر.س</div>
              <div className="text-xs text-red-600">23 طالب</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">معدل التحصيل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">94%</div>
              <div className="text-xs text-green-600">+2% من الشهر الماضي</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">المعاملات اليوم</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">16</div>
              <div className="text-xs text-green-600">3,450 ر.س</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-cairo">سجل المدفوعات</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 ml-2" />
                  البحث
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 ml-2" />
                  فلترة
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>جاري تطوير واجهة إدارة المدفوعات...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Payments;