// src/dashboards/AccountantDashboard.tsx

import React from "react";
// استيراد المكونات
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// استيراد الأيقونات
import { Calculator } from "lucide-react";

interface AccountantDashboardProps {
    onLogout: () => void;
}

const AccountantDashboard = ({ onLogout }: AccountantDashboardProps) => {
    return (
        <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
            <div className="flex justify-between w-full max-w-6xl mb-6">
                <h1 className="text-3xl font-bold text-orange-600 font-cairo">لوحة تحكم المحاسب</h1>
                <Button onClick={onLogout} variant="destructive">تسجيل الخروج</Button>
            </div>
            <div className="w-full max-w-6xl text-center text-gray-500">
                <Calculator className="h-16 w-16 mx-auto text-orange-400 mb-4" />
                <p className="text-lg">مرحباً بك في لوحة تحكم المحاسب. يمكنك هنا إدارة المدفوعات والحسابات.</p>
                <p className="text-sm mt-2">وظائف هذه اللوحة قيد التطوير...</p>
            </div>
        </div>
    );
};

export default AccountantDashboard;
