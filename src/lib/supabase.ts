// src/supabase/service.ts
import { createClient } from '@supabase/supabase-js';

// تأكد من تحديث هذه المتغيرات ببيانات مشروعك الخاصة
const supabaseUrl = "https://xxoahutoklododjxabjx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4b2FodXRva2xvZG9kanhhYmp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzQyMzIsImV4cCI6MjA2OTU1MDIzMn0.PFH4M5kecKhLKM0QD-6QWXltsxeH70ixjs73LpoI-gQ";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = "student" | "parent" | "teacher" | "accountant" | "supervisor" | "admin";

export const SupabaseService = {
    // ... ضع كل الدوال من قسم Supabase Client & Service هنا
    // signInWithPassword, signOut, registerUser, getPendingUsers, ...
};