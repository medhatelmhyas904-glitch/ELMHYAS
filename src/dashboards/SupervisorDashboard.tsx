// src/dashboards/SupervisorDashboard.tsx

import React from "react";
// استيراد المكونات
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// استيراد الأيقونات
import { Shield } from "lucide-react";

interface SupervisorDashboardProps {
    onLogout: () => void;
}

const SupervisorDashboard = ({ onLogout }: SupervisorDashboardProps) => {
    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="flex justify-between w-full max-w-6xl mb-6">
                <h1 className="text-3xl font-bold text-red-600 font-cairo">لوحة تحكم المشرف</h1>
                <Button onClick={onLogout} variant="destructive">تسجيل الخروج</Button>
            </div>
            <div className="w-full max-w-6xl text-center text-gray-500">
                <Shield className="h-16 w-16 mx-auto text-red-400 mb-4" />
                <p className="text-lg">مرحباً بك في لوحة تحكم المشرف. يمكنك هنا متابعة العمليات التعليمية.</p>
                <p className="text-sm mt-2">وظائف هذه اللوحة قيد التطوير...</p>
            </div>
        </div>
    );
};

export default SupervisorDashboard;
