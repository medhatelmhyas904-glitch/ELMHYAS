// src/contexts/AuthContext.tsx

import React, { useState, useEffect, useContext, createContext, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { Session, User } from '@supabase/supabase-js';
import { Loader2 } from 'lucide-react';


// 1. Define the Profile type (assuming you have a 'profiles' table in Supabase)
export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  // Add other fields from your 'profiles' table
  // For example:
  // created_at: string;
  // full_name: string;
}

// 2. Define the AuthContextType to specify the shape of the context value
export interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null; //
  loading: boolean;
  logout: () => Promise<void>;
}

// 3. Create the Context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Create a custom hook to use the context
// Moved useAuth to a separate file (useAuth.ts)

// 5. The AuthProvider component
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

  const value = {
    session,
    user,
    profile,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
