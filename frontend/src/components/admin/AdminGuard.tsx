"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminShell from "./AdminShell";
import { getToken, clearToken } from "@/lib/auth";
import { adminLogin, adminLogout } from "@/lib/api";
import { GraduationCap, Loader2 } from "lucide-react";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const isLoginRoute = PUBLIC_ADMIN_PATHS.includes(pathname || "");

  useEffect(() => {
    const token = getToken();
    if (!token && !isLoginRoute) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [isLoginRoute, router]);

  // Login screen renders bare
  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink-900 text-white">
        <Loader2 className="animate-spin text-indigo-400" />
      </div>
    );
  }

  return <AdminShell onLogout={handleLogout(router)}>{children}</AdminShell>;
}

function handleLogout(router: ReturnType<typeof useRouter>) {
  return async () => {
    const token = getToken();
    if (token) {
      try {
        await adminLogout(token);
      } catch {}
    }
    clearToken();
    router.replace("/admin/login");
  };
}
