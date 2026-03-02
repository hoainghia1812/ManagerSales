"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email hoặc mật khẩu không đúng");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Vui lòng xác nhận email trước khi đăng nhập");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-brand-700">
          Đăng nhập
        </h2>
        <p className="text-brand-500 mt-2">
          Chào mừng trở lại! Đăng nhập để quản lý cửa hàng.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="admin@mushco.vn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} strokeWidth={1.5} />}
          required
        />

        <div className="relative">
          <Input
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} strokeWidth={1.5} />}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-brand-400 hover:text-brand-600 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={loading}
          icon={<LogIn size={18} />}
          className="mt-2"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-500">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-brand-400 hover:text-brand-700 font-semibold transition-colors"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
