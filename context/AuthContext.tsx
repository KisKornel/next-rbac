"use client";

import React, { createContext, useEffect, useState, useContext } from "react";
import { createClient } from "@/utils/supabase/client";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { Roles } from "@/lib/interface";
import { User } from "@supabase/supabase-js";

interface CustomJwtPayload extends JwtPayload {
  user_role: Roles;
}

interface AuthContextProps {
  userRole: Roles | null;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextProps>({
  userRole: null,
  isLoading: true,
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<Roles | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const supabase = createClient();

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session load error:", error);
      }
      if (data.session) {
        const jwt = jwtDecode<CustomJwtPayload>(data.session.access_token);
        setUserRole(jwt.user_role);
        setUser(data.session.user);
      } else {
        setUserRole(null);
        setUser(null);
      }
      setIsLoading(false);
    };

    loadSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const jwt = jwtDecode<CustomJwtPayload>(session.access_token);
          setUserRole(jwt.user_role);
          setUser(session.user);
        } else {
          setUserRole(null);
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
