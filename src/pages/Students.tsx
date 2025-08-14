import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Search, Filter } from 'lucide-react';
import AddStudentDialog from '@/components/Students/AddStudentDialog';

const Students = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-foreground font-cairo">إدارة الطلاب</h1>
          <AddStudentDialog onAddSchedule={async (values) => {
            // TODO: Implement schedule addition logic here
            return Promise.resolve();
          }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي الطلاب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">324</div>
              <div className="text-xs text-green-600">+12% من الشهر الماضي</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">الطلاب النشطين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">298</div>
              <div className="text-xs text-green-600">+8% من الشهر الماضي</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">طلاب جدد هذا الشهر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">26</div>
              <div className="text-xs text-green-600">+15% من الشهر الماضي</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">متوسط الحضور</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">92%</div>
              <div className="text-xs text-green-600">+3% من الشهر الماضي</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-cairo">قائمة الطلاب</CardTitle>
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
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>جاري تطوير واجهة إدارة الطلاب...</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Students;