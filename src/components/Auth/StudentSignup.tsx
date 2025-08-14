// src/components/Auth/StudentSignup.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// استيراد المكونات
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// استيراد الأيقونات
import { Loader2, UserPlus } from "lucide-react";

// استيراد الواجهة الخلفية الوهمية والأنواع
import mockBackend from "@/lib/mockBackend";
import { useToast } from "@/hooks/use-toast";

// تعريف مخطط التحقق (validation schema) باستخدام Zod
// تم تصحيح الخطأ هنا بإزالة التكرار في تعريف z.object
const studentSignupSchema = z.object({
  fullName: z.string().min(2, "الاسم الكامل مطلوب"),
  username: z.string().min(4, "اسم المستخدم يجب أن يكون 4 أحرف على الأقل"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  phoneNumber: z.string().regex(/^01[0-2,5]\d{8}$/, "رقم الهاتف غير صحيح"),
  parentPhoneNumber: z.string().regex(/^01[0-2,5]\d{8}$/, "رقم هاتف ولي الأمر غير صحيح"),
  grade: z.enum(["primary", "secondary1", "secondary2", "secondary3"])
    .refine(val => !!val, { message: "يرجى اختيار المرحلة الدراسية" }),
  groupType: z.enum(["private", "group_5", "group_10"])
    .refine(val => !!val, { message: "يرجى اختيار نوع المجموعة" }),
  subject: z.string().min(1, "يرجى تحديد المادة")
});

// تعريف نوع البيانات من المخطط
type StudentSignupForm = z.infer<typeof studentSignupSchema>;

interface StudentSignupProps {
  onBackToLogin: () => void;
}

const StudentSignup = ({ onBackToLogin }: StudentSignupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // تهيئة useForm
  const form = useForm<StudentSignupForm>({
    resolver: zodResolver(studentSignupSchema),
  });

  // دالة التعامل مع إرسال النموذج
  const onSubmit = async (data: StudentSignupForm) => {
    setIsLoading(true);
    // استخدام mockBackend للتسجيل
    const result = await mockBackend.registerUser(data.username, "student", data);
    setIsLoading(false);
    if (result.success) {
      toast({
        title: "تم إرسال طلب التسجيل",
        description: "سيتم مراجعة طلبك من قبل الإدارة والموافقة عليه قريباً."
      });
      onBackToLogin();
    } else {
      toast({
        title: "خطأ في التسجيل",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <UserPlus className="h-12 w-12 mx-auto mb-2 text-blue-600" />
          <CardTitle className="font-cairo">تسجيل طالب جديد</CardTitle>
          <CardDescription>املأ البيانات التالية لإرسال طلب التسجيل.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem>
                  <FormLabel>الاسم الكامل</FormLabel>
                  <FormControl><Input placeholder="الاسم الكامل" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="username" render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المستخدم</FormLabel>
                  <FormControl><Input placeholder="اسم المستخدم" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl><Input placeholder="01xxxxxxxxx" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="parentPhoneNumber" render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم هاتف ولي الأمر</FormLabel>
                  <FormControl><Input placeholder="01xxxxxxxxx" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="grade" render={({ field }) => (
                <FormItem>
                  <FormLabel>المرحلة الدراسية</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="اختر المرحلة" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primary">ابتدائي</SelectItem>
                      <SelectItem value="secondary1">الصف الأول الثانوي</SelectItem>
                      <SelectItem value="secondary2">الصف الثاني الثانوي</SelectItem>
                      <SelectItem value="secondary3">الصف الثالث الثانوي</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="groupType" render={({ field }) => (
                <FormItem>
                  <FormLabel>نوع المجموعة</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="اختر نوع المجموعة" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">خاص</SelectItem>
                      <SelectItem value="group_5">مجموعة (5 طلاب)</SelectItem>
                      <SelectItem value="group_10">مجموعة (10 طلاب)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem>
                  <FormLabel>المادة</FormLabel>
                  <FormControl><Input placeholder="مثل: اللغة الفرنسية" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onBackToLogin} className="flex-1">رجوع</Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  إرسال الطلب
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSignup;
