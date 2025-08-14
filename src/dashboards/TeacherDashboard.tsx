// src/dashboards/TeacherDashboard.tsx

import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// استيراد المكونات
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";

// استيراد الأيقونات
import { Loader2, ClipboardCheck, CheckCircle, XCircle } from "lucide-react";

// استيراد الواجهة الخلفية الوهمية والأنواع
import mockBackend from "@/lib/mockBackend";
import { UserRole, AttendanceNote } from "@/lib/types";


interface TeacherDashboardProps {
    userRoles: UserRole[];
    username: string;
    onLogout: () => void;
}

const TeacherDashboard = ({ username, onLogout }: TeacherDashboardProps) => {
    const [students, setStudents] = useState<any[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [attendance, setAttendance] = useState<"present" | "absent" | "">("");
    const [note, setNote] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchStudents = async () => {
            const assignedStudents = await mockBackend.getStudentsByTeacherAssignment(username);
            setStudents(assignedStudents);
        };
        fetchStudents();
    }, [username]);

    const handleSaveAttendance = async () => {
        if (!selectedStudent || !attendance) {
            toast({ title: "خطأ", description: "يرجى تحديد الطالب والحالة.", variant: "destructive" });
            return;
        }
        setIsSaving(true);
        const result = await mockBackend.saveAttendanceAndNotes({
            teacherUsername: username,
            studentUsername: selectedStudent.id,
            date: new Date().toISOString().slice(0, 10),
            attendance,
            note
        });
        setIsSaving(false);

        if (result.success) {
            toast({ title: "تم الحفظ بنجاح", description: `تم تسجيل الحضور والملاحظات للطالب ${selectedStudent.fullName}.` });
            setSelectedStudent(null);
            setAttendance("");
            setNote("");
        } else {
            toast({ title: "خطأ", description: "حدث خطأ أثناء الحفظ.", variant: "destructive" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="flex justify-between w-full max-w-6xl mb-6">
                <h1 className="text-3xl font-bold text-purple-600 font-cairo">لوحة تحكم المعلم</h1>
                <Button onClick={onLogout} variant="destructive">تسجيل الخروج</Button>
            </div>
            <Card className="w-full max-w-6xl">
                <CardHeader>
                    <CardTitle>قائمة طلابي</CardTitle>
                    <CardDescription>اختر طالبًا لتسجيل الحضور والملاحظات.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>الاسم</TableHead>
                                    <TableHead>رقم الهاتف</TableHead>
                                    <TableHead>المرحلة</TableHead>
                                    <TableHead>الإجراء</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.length > 0 ? students.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-medium">{student.fullName}</TableCell>
                                        <TableCell>{student.phoneNumber}</TableCell>
                                        <TableCell>{student.grade}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => setSelectedStudent(student)} variant="outline" className="flex items-center gap-1">
                                                <ClipboardCheck className="h-4 w-4" />
                                                تسجيل حضور
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">لا يوجد طلاب مسجلون</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {selectedStudent && (
                <Card className="w-full max-w-lg mt-6">
                    <CardHeader>
                        <CardTitle>تسجيل حضور وملاحظات للطالب: {selectedStudent.fullName}</CardTitle>
                        <CardDescription>اختر حالة الحضور وأضف ملاحظة إذا لزم الأمر.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="font-medium">حالة الحضور:</span>
                            <div className="flex gap-2">
                                <Button
                                    variant={attendance === "present" ? "default" : "outline"}
                                    onClick={() => setAttendance("present")}
                                    className="flex-1"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    حاضر
                                </Button>
                                <Button
                                    variant={attendance === "absent" ? "destructive" : "outline"}
                                    onClick={() => setAttendance("absent")}
                                    className="flex-1"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    غائب
                                </Button>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="note">ملاحظات</Label>
                            <Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="أضف ملاحظاتك هنا..." className="mt-2" />
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                        <Button onClick={() => setSelectedStudent(null)} variant="outline">إلغاء</Button>
                        <Button onClick={handleSaveAttendance} disabled={isSaving || !attendance}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            حفظ
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
};

export default TeacherDashboard;
