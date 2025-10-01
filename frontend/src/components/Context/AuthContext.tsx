"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null | undefined;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProps = {
  children: ReactNode;
};

export const AuthContextProvider = ({ children }: AuthProps) => {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password: password,
      });

      if (error) {
        console.error("Sign-in error:", error.message);
        return { success: false, error: error.message };
      }

      console.log("Sign-in success:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    // Restore session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ signInUser, session }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useUserAuth must be used within AuthContextProvider");
  return context;
};
