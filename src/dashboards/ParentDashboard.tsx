// src/dashboards/ParentDashboard.tsx

import React, { useState, useEffect } from "react";

// استيراد المكونات
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// استيراد الأيقونات
import { Users } from "lucide-react";

// استيراد الواجهة الخلفية الوهمية والأنواع
import mockBackend from "@/lib/mockBackend";
import { AttendanceNote } from "@/lib/types";


interface ParentDashboardProps {
    username: string;
    onLogout: () => void;
}

const ParentDashboard = ({ username, onLogout }: ParentDashboardProps) => {
    const [parentData, setParentData] = useState<any>(null);
    const [studentData, setStudentData] = useState<any>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceNote[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const parent = mockBackend.getUser(username);
            setParentData(parent);
            if (parent && parent.studentId) {
                const student = mockBackend.getUser(parent.studentId);
                setStudentData(student);
                const records = await mockBackend.getAttendanceAndNotes(parent.studentId);
                setAttendanceRecords(records);
            }
        };
        fetchData();
    }, [username]);

    if (!studentData) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
                <div className="flex justify-between w-full max-w-6xl mb-6">
                    <h1 className="text-3xl font-bold text-green-600 font-cairo">لوحة تحكم ولي الأمر</h1>
                    <Button onClick={onLogout} variant="destructive">تسجيل الخروج</Button>
                </div>
                <Card className="w-full max-w-6xl text-center p-8">
                    <Users className="h-16 w-16 mx-auto text-green-400 mb-4" />
                    <p className="text-lg">لا يوجد طالب مرتبط بهذا الحساب.</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="flex justify-between w-full max-w-6xl mb-6">
                <h1 className="text-3xl font-bold text-green-600 font-cairo">لوحة تحكم ولي الأمر</h1>
                <Button onClick={onLogout} variant="destructive">تسجيل الخروج</Button>
            </div>
            <Card className="w-full max-w-6xl">
                <CardHeader>
                    <CardTitle>بيانات الطالب: {studentData.fullName}</CardTitle>
                    <CardDescription>متابعة أداء ابنك وسجل حضوره.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">المرحلة الدراسية:</p>
                            <p className="text-lg font-semibold">{studentData.grade}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">المادة:</p>
                            <p className="text-lg font-semibold">{studentData.subject}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">نوع المجموعة:</p>
                            <p className="text-lg font-semibold">{studentData.groupType}</p>
                        </div>
                    </div>
                    <Separator />
                    <h2 className="text-2xl font-semibold mt-4">سجل الحضور والملاحظات</h2>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>التاريخ</TableHead>
                                    <TableHead>حالة الحضور</TableHead>
                                    <TableHead>الملاحظات</TableHead>
                                    <TableHead>المعلم</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendanceRecords.length > 0 ? attendanceRecords.map((record, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{record.date}</TableCell>
                                        <TableCell>
                                            {record.attendance === "present" ? <span className="text-green-600">حاضر</span> : <span className="text-red-600">غائب</span>}
                                        </TableCell>
                                        <TableCell>{record.note || "-"}</TableCell>
                                        <TableCell>{mockBackend.getUser(record.teacherUsername)?.fullName || record.teacherUsername}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500">لا يوجد سجل حضور حتى الآن.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ParentDashboard;
