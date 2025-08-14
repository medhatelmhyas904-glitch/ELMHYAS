import React, { useState, useEffect } from "react";
import { supabase } from "src/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { AuthContext, AuthContextType, Profile } from "src/contexts/AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setSession(null);
        setUser(null);
    };

    useEffect(() => {
        const fetchUserProfile = async (userId: string) => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            return { data, error };
        };

        // Get initial session and profile
        supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
            setSession(currentSession);
            if (currentSession && currentSession.user) {
                fetchUserProfile(currentSession.user.id).then(({ data, error }) => {
                    if (data && !error) {
                        setProfile(data);
                    }
                    setUser(currentSession.user);
                    setLoading(false);
                });
            } else {
                setUser(null);
                setProfile(null);
                setLoading(false);
            }
        });

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, newSession) => {
                setSession(newSession);
                if (newSession && newSession.user) {
                    setUser(newSession.user);
                    const { data, error } = await fetchUserProfile(newSession.user.id);
                    if (data && !error) {
                        setProfile(data);
                    } else {
                        setProfile(null);
                    }
                } else {
                    setUser(null);
                    setProfile(null);
                }
            }
        );

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ session, user, profile, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};



export { AuthContext };
export type { Profile };
