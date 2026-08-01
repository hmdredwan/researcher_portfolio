"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, Lock, User as UserIcon } from "lucide-react";
import { adminLogin } from "@/lib/api";
import { getToken, setToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await adminLogin(username, password);
      setToken(token);
      router.replace("/admin");
    } catch {
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-ink-900 px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center text-white">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            <GraduationCap size={28} />
          </span>
          <h1 className="mt-4 font-serif text-2xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-sm text-ink-400">Sign in to manage your content</p>
        </div>

        <form onSubmit={onSubmit} className="rounded-2xl bg-white p-7 shadow-2xl">
          <div>
            <label className="label" htmlFor="username">Username</label>
            <div className="relative">
              <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input pl-9"
                placeholder="admin"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pl-9"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full disabled:opacity-60"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : "Sign in"}
          </button>

          <p className="mt-4 text-center text-xs text-ink-400">
            Demo credentials: <span className="font-semibold text-ink-600">admin</span> / <span className="font-semibold text-ink-600">admin123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
