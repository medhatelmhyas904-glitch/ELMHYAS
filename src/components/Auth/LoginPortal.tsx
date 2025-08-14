// src/components/Auth/LoginPortal.tsx

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// استيراد المكونات من مكتبة Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

// استيراد الأيقونات
import { Loader2 } from "lucide-react";

// استيراد الواجهة الخلفية الوهمية والأنواع والبيانات المشتركة
import mockBackend from "@/lib/mockBackend";
import { UserRole, roleData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "../ui/toaster";


const loginSchema = z.object({
    username: z.string().min(2, "يرجى إدخال اسم المستخدم"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    role: z.enum(["student", "parent", "teacher", "accountant", "supervisor", "admin"] as const)
});
type LoginForm = z.infer<typeof loginSchema>;

interface LoginPortalProps {
    onLogin: (roles: UserRole[], username: string) => void;
    onNavigateToSignup: (role: UserRole) => void;
    // تمت إضافة هذا السطر الجديد
    onBackToLogin?: () => void;
}
const LoginPortal = ({ onLogin, onNavigateToSignup }: LoginPortalProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
    const [rememberMe, setRememberMe] = useState(false);
    const { toast } = useToast();
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        }
    });

    useEffect(() => {
        if (selectedRole) {
            form.setValue("role", selectedRole);
        }
    }, [selectedRole, form]);

    useEffect(() => {
        const rememberedUsername = localStorage.getItem('rememberedUsername');
        const rememberedUserRole = localStorage.getItem('rememberedUserRole') as UserRole;
        if (rememberedUsername && rememberedUserRole && roleData[rememberedUserRole]) {
            form.setValue("username", rememberedUsername);
            setSelectedRole(rememberedUserRole);
            setRememberMe(true);
        }
    }, [form]);

    const handleLogin = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const { data: authData, error } = await mockBackend.signInWithPassword({
                username: data.username,
                password: data.password
            });

            if (error) {
                toast({ title: "خطأ في تسجيل الدخول", description: error.message, variant: "destructive" });
                return;
            }

// ... (Your existing code before the catch block)

        } catch (error) {
            let errorMessage = "حدث خطأ غير متوقع.";
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'object' && error !== null && 'message' in error) {
                errorMessage = String(error.message);
            }
            toast({
                title: "خطأ",
                description: `حدث خطأ غير متوقع: ${errorMessage}`,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground font-cairo mb-4">امتياز أكاديمي</h1>
                    <p className="text-muted-foreground text-lg">اختر نوع المستخدم لتسجيل الدخول</p>
                </div>
                {!selectedRole ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(roleData).map(([role, data]) => {
                            const Icon = data.icon;
                            return (
                                <Card
                                    key={role}
                                    className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50"
                                    onClick={() => setSelectedRole(role as UserRole)}
                                >
                                    <CardHeader className="text-center">
                                        <Icon className={`h-12 w-12 mx-auto mb-2 ${data.color}`} />
                                        <CardTitle className="font-cairo">{data.label}</CardTitle>
                                        <CardDescription className="text-sm">
                                            {data.description}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <Card className="max-w-md mx-auto">
                        <CardHeader className="text-center">
                            {(() => {
                                const Icon = roleData[selectedRole].icon;
                                return <Icon className={`h-12 w-12 mx-auto mb-2 ${roleData[selectedRole].color}`} />;
                            })()}
                            <CardTitle className="font-cairo">دخول {roleData[selectedRole].label}</CardTitle>
                            <CardDescription>أدخل بيانات الدخول الخاصة بك</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                                    <FormField control={form.control} name="username" render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>اسم المستخدم</FormLabel>
                                            <FormControl><Input placeholder="أدخل اسم المستخدم" {...field} /></FormControl>
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
                                    <input type="hidden" {...form.register("role")} value={selectedRole ?? ""} />
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-2 self-start">
                                            <Checkbox id="rememberMe" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
                                            <label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">تذكرني</label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="button" variant="outline" onClick={() => setSelectedRole(null)} className="flex-1">رجوع</Button>
                                            <Button type="submit" disabled={isLoading} className="flex-1">
                                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                دخول
                                            </Button>
                                        </div>
                                        {(selectedRole === "student" || selectedRole === "teacher") && (
                                            <Button type="button" variant="ghost" onClick={() => onNavigateToSignup(selectedRole)} className="mt-4 w-full">
                                                تسجيل حساب جديد
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </div>
            <Toaster />
        </div>
    );
};

export default LoginPortal;
