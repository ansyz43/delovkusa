import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { apiFetch, setAccessToken, getAccessToken } from "./api";
import { supabase } from "./supabase";

export interface AppUser {
  id: number | string;
  email: string;
  name: string;
  is_admin: boolean;
  auth_provider: string | null;
  created_at: string;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithPhone: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithTelegram: (tgData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const resp = await apiFetch("/api/auth/me");
      if (resp.ok) {
        const profile = await resp.json();
        setUser(profile);
        return true;
      }
    } catch { /* ignore */ }
    setUser(null);
    return false;
  }, []);

  // On mount: try to restore session via refresh token (httpOnly cookie)
  useEffect(() => {
    (async () => {
      if (getAccessToken()) {
        await loadProfile();
      } else {
        // Try refresh
        try {
          const resp = await fetch(
            `${import.meta.env.VITE_API_URL || ""}/api/auth/refresh`,
            { method: "POST", credentials: "include" },
          );
          if (resp.ok) {
            const data = await resp.json();
            setAccessToken(data.access_token);
            await loadProfile();
          }
        } catch { /* no session */ }
      }
      setLoading(false);
    })();
  }, [loadProfile]);

  const signUp = useCallback(async (email: string, password: string, name?: string) => {
    try {
      const resp = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name: name || email.split("@")[0] }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        return { error: { message: data.detail || "Ошибка регистрации" } };
      }
      const data = await resp.json();
      setAccessToken(data.access_token);
      await loadProfile();
      return { error: null };
    } catch {
      return { error: { message: "Ошибка сети" } };
    }
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const resp = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!resp.ok) {
        const data = await resp.json();
        return { error: { message: data.detail || "Неверный email или пароль" } };
      }
      const data = await resp.json();
      setAccessToken(data.access_token);
      await loadProfile();
      return { error: null };
    } catch {
      return { error: { message: "Ошибка сети" } };
    }
  }, [loadProfile]);

  // SMS via Supabase (remains as-is)
  const signInWithPhone = useCallback(async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    return { error };
  }, []);

  const verifyOtp = useCallback(async (phone: string, token: string) => {
    const { error } = await supabase.auth.verifyOtp({ phone, token, type: "sms" });
    if (!error) {
      // On successful phone auth, also set a local user so ProtectedRoute works
      const session = await supabase.auth.getSession();
      const sUser = session.data.session?.user;
      if (sUser) {
        setUser({
          id: sUser.id,
          email: sUser.email || sUser.phone || "",
          name: sUser.user_metadata?.full_name || sUser.phone || "Пользователь",
          is_admin: false,
          auth_provider: "phone",
          created_at: sUser.created_at,
        });
      }
    }
    return { error };
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const resp = await apiFetch("/api/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
    if (!resp.ok) {
      const data = await resp.json();
      throw new Error(data.detail || "Ошибка входа через Google");
    }
    const data = await resp.json();
    setAccessToken(data.access_token);
    await loadProfile();
  }, [loadProfile]);

  const loginWithTelegram = useCallback(async (tgData: any) => {
    const resp = await apiFetch("/api/auth/telegram", {
      method: "POST",
      body: JSON.stringify(tgData),
    });
    if (!resp.ok) {
      const data = await resp.json();
      throw new Error(data.detail || "Ошибка входа через Telegram");
    }
    const data = await resp.json();
    setAccessToken(data.access_token);
    await loadProfile();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    setAccessToken(null);
    setUser(null);
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch { /* ignore */ }
    try {
      await supabase.auth.signOut();
    } catch { /* ignore */ }
  }, []);

  const isAdmin = user?.is_admin ?? false;

  const value = useMemo(() => ({
    user, loading, isAdmin, signUp, signIn, signInWithPhone, verifyOtp, loginWithGoogle, loginWithTelegram, signOut,
  }), [user, loading, isAdmin, signUp, signIn, signInWithPhone, verifyOtp, loginWithGoogle, loginWithTelegram, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
