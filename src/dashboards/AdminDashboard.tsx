import React, { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

declare const __initial_auth_token: string | undefined;
declare const __app_id: string | undefined;

const supabaseUrl = 'https://xxoahutoklododjxabjx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4b2FodXRva2xvZG9kanhhYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzQyMzIsImV4cCI6MjA2OTU1MDIzMn0.PFH4M5kecKhLKM0QD-6QWXltsxeH70ixjs73LpoI-gQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { Loader2, UserCheck, UserX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// تعريف أنواع البيانات للمستخدمين
interface UserData {
  uid: string;
  fullName: string;
  username: string;
  userType: "student" | "teacher" | "admin";
  status: "pending" | "approved" | "rejected";
  grade?: string;
  subject?: string;
}

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  // حالة المكون لإدارة البيانات والحالة
  const [pendingStudents, setPendingStudents] = useState<UserData[]>([]);
  const [pendingTeachers, setPendingTeachers] = useState<UserData[]>([]);
  const [allStudents, setAllStudents] = useState<UserData[]>([]);
  const [allStaff, setAllStaff] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [db, setDb] = useState<ReturnType<typeof getFirestore> | null>(null);
  // Removed unused auth state to avoid 'any' type error
  const [userId, setUserId] = useState<string | null>(null);

  const { toast } = useToast();

// تهيئة Supabase
// تهيئة Firestore
useEffect(() => {
  try {
    const firestore = getFirestore();
    setDb(firestore);
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
}, []);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// الاستماع إلى تغييرات حالة التوثيق
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      setUserId(session.user.id);
    } else {
      setUserId(null);
    }
  });

  // استخدام رمز التوثيق المخصص إذا كان متاحاً
  if (typeof __initial_auth_token !== "undefined") {
    supabase.auth.signInWithIdToken({ provider: 'token', token: __initial_auth_token })
      .catch((error) => console.error("Custom token sign-in failed:", error));
  }

  return () => subscription.unsubscribe();
}, []);

  // جلب البيانات من Firestore في الوقت الفعلي
  useEffect(() => {
    if (!db || !userId) return;

    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const usersCollection = collection(db, `/artifacts/${appId}/public/data/users`);

    // الاشتراك في الطلبات المعلقة للطلاب
    const qPendingStudents = query(usersCollection, where("userType", "==", "student"), where("status", "==", "pending"));
    const unsubscribePendingStudents = onSnapshot(qPendingStudents, (snapshot) => {
      const students: UserData[] = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
      setPendingStudents(students);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching pending students: ", error);
      setIsLoading(false);
    });

    // الاشتراك في الطلبات المعلقة للمعلمين
    const qPendingTeachers = query(usersCollection, where("userType", "==", "teacher"), where("status", "==", "pending"));
    const unsubscribePendingTeachers = onSnapshot(qPendingTeachers, (snapshot) => {
      const teachers: UserData[] = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
      setPendingTeachers(teachers);
    }, (error) => {
      console.error("Error fetching pending teachers: ", error);
    });

    // الاشتراك في جميع الطلاب المعتمدين
    const qAllStudents = query(usersCollection, where("userType", "==", "student"), where("status", "==", "approved"));
    const unsubscribeAllStudents = onSnapshot(qAllStudents, (snapshot) => {
      const students: UserData[] = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
      setAllStudents(students);
    }, (error) => {
      console.error("Error fetching all students: ", error);
    });

    // الاشتراك في جميع الموظفين (المعلمين والإدارة) المعتمدين
    const qAllStaff = query(usersCollection, where("userType", "!=", "student"), where("status", "==", "approved"));
    const unsubscribeAllStaff = onSnapshot(qAllStaff, (snapshot) => {
      const staff: UserData[] = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as UserData));
      setAllStaff(staff);
    }, (error) => {
      console.error("Error fetching all staff: ", error);
    });

    // إزالة المشتركين عند إلغاء تحميل المكون
    return () => {
      unsubscribePendingStudents();
      unsubscribePendingTeachers();
      unsubscribeAllStudents();
      unsubscribeAllStaff();
    };
  }, [db, userId]);

  // دالة لقبول طلب التسجيل
  const approveUser = async (uid: string) => {
    if (!db) return;
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userRef = doc(db, `/artifacts/${appId}/public/data/users`, uid);
      await updateDoc(userRef, { status: "approved" });
      toast({
        title: "تم قبول المستخدم",
        description: `تمت الموافقة على طلب المستخدم ذو المعرف: ${uid}.`,
        className: "bg-green-500 text-white"
      });
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "خطأ",
        description: `فشل قبول المستخدم ذو المعرف: ${uid}.`,
        variant: "destructive"
      });
    }
  };

  // دالة لرفض طلب التسجيل
  const rejectUser = async (uid: string) => {
    if (!db) return;
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const userRef = doc(db, `/artifacts/${appId}/public/data/users`, uid);
      await updateDoc(userRef, { status: "rejected" });
      toast({
        title: "تم رفض المستخدم",
        description: `تم رفض طلب المستخدم ذو المعرف: ${uid}.`,
        className: "bg-red-500 text-white"
      });
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast({
        title: "خطأ",
        description: `فشل رفض المستخدم ذو المعرف: ${uid}.`,
        variant: "destructive"
      });
    }
  };

  // عرض شاشة التحميل
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
      </div>
    );
  }

  // عرض واجهة لوحة التحكم
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
        <Button onClick={onLogout} variant="destructive">تسجيل الخروج</Button>
      </header>
      <div className="text-sm text-gray-500 mb-4">
        معرف التطبيق: <span className="font-mono text-xs text-blue-600">{typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}</span>
        <br />
        معرف المستخدم: <span className="font-mono text-xs text-blue-600">{userId}</span>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending">الطلبات المعلقة</TabsTrigger>
          <TabsTrigger value="current">المستخدمون الحاليون</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>طلبات تسجيل الطلاب المعلقة</CardTitle>
              <CardDescription>الطلبات الجديدة في انتظار الموافقة.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم الكامل</TableHead>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>المرحلة</TableHead>
                      <TableHead>العمليات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingStudents.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.grade}</TableCell>
                        <TableCell className="space-x-2">
                          <Button onClick={() => approveUser(user.uid)} variant="secondary" size="sm">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button onClick={() => rejectUser(user.uid)} variant="secondary" size="sm">
                            <UserX className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500">لا توجد طلبات معلقة للطلاب.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>طلبات تسجيل المعلمين المعلقة</CardTitle>
              <CardDescription>الطلبات الجديدة في انتظار الموافقة.</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTeachers.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم الكامل</TableHead>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>المادة</TableHead>
                      <TableHead>العمليات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingTeachers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.subject}</TableCell>
                        <TableCell className="space-x-2">
                          <Button onClick={() => approveUser(user.uid)} variant="secondary" size="sm">
                            <UserCheck className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button onClick={() => rejectUser(user.uid)} variant="secondary" size="sm">
                            <UserX className="h-4 w-4 text-red-600" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500">لا توجد طلبات معلقة للمعلمين.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="current" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>الطلاب المعتمدون</CardTitle>
              <CardDescription>جميع الطلاب المسجلين حالياً.</CardDescription>
            </CardHeader>
            <CardContent>
              {allStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم الكامل</TableHead>
                      <TableHead>اسم المستخدم</TableHead>
                      <TableHead>المرحلة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allStudents.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.grade}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500">لا يوجد طلاب معتمدون.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>الموظفون المعتمدون</CardTitle>
              <CardDescription>المعلمون والإدارة المسجلون حالياً.</CardDescription>
            </CardHeader>
            <CardContent>
              {allStaff.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>الاسم الكامل</TableHead>
                      <TableHead>نوع المستخدم</TableHead>
                      <TableHead>المادة</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allStaff.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.userType === 'teacher' ? 'معلم' : 'إدارة'}</TableCell>
                        <TableCell>{user.subject || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-gray-500">لا يوجد موظفون معتمدون.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
