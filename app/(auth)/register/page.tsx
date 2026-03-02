"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Lock, User, UserPlus, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          setError("Email này đã được đăng ký");
        } else {
          setError(authError.message);
        }
        return;
      }

      setSuccess(true);
    } catch {
      setError("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={32} className="text-emerald-500" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-700 mb-2">
          Đăng ký thành công!
        </h2>
        <p className="text-brand-500 mb-6">
          Kiểm tra email <span className="font-medium text-brand-700">{email}</span>{" "}
          để xác nhận tài khoản.
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/login")}
          fullWidth
        >
          Về trang đăng nhập
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-serif text-3xl font-bold text-brand-700">
          Tạo tài khoản
        </h2>
        <p className="text-brand-500 mt-2">
          Đăng ký tài khoản để bắt đầu quản lý cửa hàng.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <Input
          label="Họ và tên"
          type="text"
          placeholder="Nguyễn Văn A"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          icon={<User size={18} strokeWidth={1.5} />}
          required
        />

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
            placeholder="Tối thiểu 6 ký tự"
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

        <Input
          label="Xác nhận mật khẩu"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          icon={<Lock size={18} strokeWidth={1.5} />}
          required
        />

        {password.length > 0 && (
          <div className="space-y-1.5">
            <PasswordRule ok={password.length >= 6} text="Ít nhất 6 ký tự" />
            <PasswordRule
              ok={confirmPassword.length > 0 && password === confirmPassword}
              text="Mật khẩu xác nhận khớp"
            />
          </div>
        )}

        <Button
          type="submit"
          fullWidth
          size="lg"
          disabled={loading}
          icon={<UserPlus size={18} />}
          className="mt-2"
        >
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-brand-500">
        Đã có tài khoản?{" "}
        <Link
          href="/login"
          className="text-brand-400 hover:text-brand-700 font-semibold transition-colors"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}

function PasswordRule({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center ${
          ok ? "bg-emerald-100 text-emerald-600" : "bg-brand-100 text-brand-400"
        }`}
      >
        {ok ? <CheckCircle2 size={12} /> : <div className="w-1.5 h-1.5 rounded-full bg-brand-300" />}
      </div>
      <span className={ok ? "text-emerald-600" : "text-brand-400"}>{text}</span>
    </div>
  );
}
