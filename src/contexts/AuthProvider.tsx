// src/contexts/AuthProvider.tsx

import React, { useState, useEffect, createContext } from 'react';
import { createClient, User as SupabaseUser } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// تعريف نوع المستخدم (User) والملف الشخصي (ProfileType)
type User = {
    id: string;
    email: string | undefined;
};

type ProfileType = {
    id: string;
    full_name?: string;
    email?: string;
    role?: string;
    // أضف أي خصائص أخرى من جدول "profiles" هنا
};

// تعريف نوع السياق (AuthContextType)
export type AuthContextType = {
    user: User | null;
    profile: ProfileType | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

// إنشاء السياق وتصديره
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// المكون الرئيسي الذي يوفر السياق
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const appUser: User = { id: user.id, email: user.email };
                setUser(appUser);
                
                const { data: profileData, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profileData) {
                    setProfile(profileData);
                } else if (error) {
                    console.error("Failed to fetch profile:", error);
                }
            }
            setLoading(false);
        };
        fetchUserData();
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (data.user) {
            const appUser: User = { id: data.user.id, email: data.user.email };
            setUser(appUser);
            
            const { data: profileData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
            setProfile(profileData);
        } else if (error) {
            console.error("Login failed:", error);
        }
        setLoading(false);
    };

    const logout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setLoading(false);
    };

    const value: AuthContextType = {
        user,
        profile,
        login,
        logout,
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;