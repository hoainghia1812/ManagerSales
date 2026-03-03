"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const AUTH_EXPIRES_AT_KEY = "ms_auth_expires_at";
const AUTH_TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checking, setChecking] = useState(true);
  const logoutTimerRef = useRef<number | null>(null);

  function clearLogoutTimer() {
    if (logoutTimerRef.current !== null) {
      window.clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  }

  function getExpiresAt(): number | null {
    try {
      const raw = localStorage.getItem(AUTH_EXPIRES_AT_KEY);
      if (!raw) return null;
      const ms = Number(raw);
      return Number.isFinite(ms) ? ms : null;
    } catch {
      return null;
    }
  }

  function setExpiresAt(ms: number) {
    try {
      localStorage.setItem(AUTH_EXPIRES_AT_KEY, String(ms));
    } catch {
      // ignore
    }
  }

  function clearExpiresAt() {
    try {
      localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
    } catch {
      // ignore
    }
  }

  function scheduleAutoLogout(expiresAt: number) {
    clearLogoutTimer();
    const msLeft = Math.max(0, expiresAt - Date.now());
    logoutTimerRef.current = window.setTimeout(() => {
      void (async () => {
        try {
          await supabase.auth.signOut();
        } finally {
          clearExpiresAt();
          router.replace("/login");
          router.refresh();
        }
      })();
    }, msLeft);
  }

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;

      if (!session) {
        clearLogoutTimer();
        clearExpiresAt();
        router.replace("/login");
        return;
      }

      const existingExpiresAt = getExpiresAt();
      const expiresAt = existingExpiresAt ?? Date.now() + AUTH_TTL_MS;

      if (!existingExpiresAt) {
        setExpiresAt(expiresAt);
      }

      if (Date.now() >= expiresAt) {
        clearLogoutTimer();
        clearExpiresAt();
        await supabase.auth.signOut();
        router.replace("/login");
        return;
      }

      scheduleAutoLogout(expiresAt);
      setChecking(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const expiresAt = Date.now() + AUTH_TTL_MS;
          setExpiresAt(expiresAt);
          scheduleAutoLogout(expiresAt);
          setChecking(false);
          return;
        }

        if (!session || event === "SIGNED_OUT") {
          clearLogoutTimer();
          clearExpiresAt();
          router.replace("/login");
          router.refresh();
        }
      }
    );

    return () => {
      cancelled = true;
      clearLogoutTimer();
      subscription.unsubscribe();
    };
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-400 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-brand-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-brand-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
