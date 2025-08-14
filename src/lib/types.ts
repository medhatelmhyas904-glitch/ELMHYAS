// src/lib/types.ts

//======================================================================
//  تعريف أنواع الأدوار وبياناتها
//======================================================================
export type UserRole = "student" | "parent" | "teacher" | "accountant" | "supervisor" | "admin";

import { AcademicCapIcon, UsersIcon, BookOpenIcon, CalculatorIcon, ShieldCheckIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
// ... rest of the code

export const roleData: Record<UserRole, { label: string; icon: React.ElementType; description: string; color: string }> = {
    student: { label: "طالب", icon: AcademicCapIcon, description: "دخول الطلاب لمتابعة المواد والدروس", color: "text-blue-600" },
    parent: { label: "ولي الأمر", icon: UsersIcon, description: "دخول أولياء الأمور لمتابعة أبنائهم", color: "text-green-600" },
    teacher: { label: "معلم", icon: BookOpenIcon, description: "دخول المعلمين لإدارة الفصول والطلاب", color: "text-purple-600" },
    accountant: { label: "محاسب", icon: CalculatorIcon, description: "دخول قسم الحسابات لإدارة المدفوعات", color: "text-orange-600" },
    supervisor: { label: "مشرف", icon: ShieldCheckIcon, description: "دخول المشرفين لمتابعة العملية التعليمية", color: "text-red-600" },
    admin: { label: "إدارة", icon: Cog6ToothIcon, description: "دخول الإدارة العامة للنظام", color: "text-gray-600" }
};// تعريف نوع AttendanceNote ليتم استخدامه في الداشبورد
export type AttendanceNote = {
    teacherUsername: string;
    studentUsername: string;
    date: string;
    attendance: "present" | "absent";
    note: string;
};

// Add your types here

// Example type for schedule form values
export interface ScheduleFormValues {
  subject: string;
  // Add other fields as needed, e.g.:
  // date?: string;
}
