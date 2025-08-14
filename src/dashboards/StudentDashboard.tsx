// src/dashboards/StudentDashboard.tsx

import React, { useState, useEffect } from "react";

// استيراد المكونات
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

// استيراد الواجهة الخلفية الوهمية والأنواع
import mockBackend from "@/lib/mockBackend";
import { AttendanceNote } from "@/lib/types";


interface StudentDashboardProps {
    username: string;
    onLogout: () => void;
}

const StudentDashboard = ({ username, onLogout }: StudentDashboardProps) => {
    const [studentData, setStudentData] = useState<any>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceNote[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const user = mockBackend.getUser(username);
            setStudentData(user);
            if (user) {
                const records = await mockBackend.getAttendanceAndNotes(username);
                setAttendanceRecords(records);
            }
        };
        fetchData();
    }, [username]);

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="flex justify-between w-full max-w-6xl mb-6">
                <h1 className="text-3xl font-bold text-blue-600 font-cairo">لوحة تحكم الطالب</h1>
                <Button onClick={onLogout} variant="destructive">تسجيل الخروج</Button>
            </div>
            <Card className="w-full max-w-6xl">
                <CardHeader>
                    <CardTitle>بيانات الطالب</CardTitle>
                    <CardDescription>عرض معلوماتك الشخصية وسجل الحضور.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">الاسم الكامل:</p>
                            <p className="text-lg font-semibold">{studentData?.fullName}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">المرحلة الدراسية:</p>
                            <p className="text-lg font-semibold">{studentData?.grade}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">المادة:</p>
                            <p className="text-lg font-semibold">{studentData?.subject}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">نوع المجموعة:</p>
                            <p className="text-lg font-semibold">{studentData?.groupType}</p>
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

export default StudentDashboard;
