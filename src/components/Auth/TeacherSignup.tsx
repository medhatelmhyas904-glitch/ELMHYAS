// src/components/Auth/TeacherSignup.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// استيراد المكونات
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// استيراد الأيقونات
import { Loader2, UserPlus } from "lucide-react";

// استيراد الواجهة الخلفية الوهمية والأنواع
import mockBackend from "@/lib/mockBackend";
import { useToast } from "@/hooks/use-toast";


const teacherSignupSchema = z.object({
    fullName: z.string().min(2, "الاسم الكامل مطلوب"),
    username: z.string().min(4, "اسم المستخدم يجب أن يكون 4 أحرف على الأقل"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    phoneNumber: z.string().regex(/^01[0-2,5]\d{8}$/, "رقم الهاتف غير صحيح"),
    specialty: z.string().min(1, "يرجى تحديد التخصص")
});
type TeacherSignupForm = z.infer<typeof teacherSignupSchema>;

interface TeacherSignupProps {
    onBackToLogin: () => void;
}

const TeacherSignup = ({ onBackToLogin }: TeacherSignupProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<TeacherSignupForm>({
        resolver: zodResolver(teacherSignupSchema),
    });

    const onSubmit = async (data: TeacherSignupForm) => {
        setIsLoading(true);
        const result = await mockBackend.registerUser(data.username, "teacher", data);
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
                    <UserPlus className="h-12 w-12 mx-auto mb-2 text-purple-600" />
                    <CardTitle className="font-cairo">تسجيل معلم جديد</CardTitle>
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
                            <FormField control={form.control} name="specialty" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>التخصص</FormLabel>
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

export default TeacherSignup;
