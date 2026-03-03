"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Lock, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loadingSession, setLoadingSession] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (cancelled) return;
        if (!session) {
          setSessionError(
            "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSession(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
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

    setUpdating(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Không thể cập nhật mật khẩu. Vui lòng thử lại.");
    } finally {
      setUpdating(false);
    }
  }

  if (loadingSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-50">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-400 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-sm text-brand-500">Đang kiểm tra link...</p>
        </div>
      </div>
    );
  }

  if (sessionError) {
    return (
      <div className="max-w-md mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100/60 p-6">
          <h2 className="font-serif text-2xl font-bold text-brand-700 mb-3">
            Link không hợp lệ
          </h2>
          <p className="text-sm text-brand-500 mb-6">{sessionError}</p>
          <Button fullWidth onClick={() => router.push("/login")}>
            Về trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-brand-100/60 p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-brand-700 mb-2">
            Đặt lại mật khẩu thành công
          </h2>
          <p className="text-sm text-brand-500 mb-6">
            Bạn có thể đăng nhập lại bằng mật khẩu mới.
          </p>
          <Button fullWidth onClick={() => router.push("/login")}>
            Về trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-brand-100/60 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 flex items-center justify-center">
            <Lock size={20} className="text-brand-500" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-700">
              Đặt lại mật khẩu
            </h2>
            <p className="text-sm text-brand-500">
              Nhập mật khẩu mới cho tài khoản của bạn.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="Tối thiểu 6 ký tự"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} strokeWidth={1.5} />}
            required
          />

          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={18} strokeWidth={1.5} />}
            required
          />

          <Button
            type="submit"
            fullWidth
            disabled={updating}
            className="mt-2"
          >
            {updating ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </Button>
        </form>
      </div>
    </div>
  );
}

