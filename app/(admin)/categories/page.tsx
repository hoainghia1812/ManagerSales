"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Plus, Loader2, Trash2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await fetch(
        "/api/categories?page=1&limit=100&sort=created_at&order=desc"
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể tải danh mục");
        return;
      }
      setCategories(json.data ?? []);
      setError("");
    } catch {
      setError("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCategories();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tên danh mục không được trống");
      return;
    }

    try {
      setCreating(true);
      setError("");
      const body = {
        name: name.trim(),
        slug: slug.trim() || undefined,
        description: description.trim() || undefined,
      };

      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Không thể tạo danh mục");
        return;
      }

      setName("");
      setSlug("");
      setDescription("");
      await loadCategories();
    } catch {
      setError("Không thể tạo danh mục");
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xoá danh mục này?")) return;
    try {
      setDeletingId(id);
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        await res.json();
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
            Danh mục sản phẩm
          </h1>
          <p className="text-brand-500 mt-1">
            Quản lý và tạo mới danh mục để phân loại sản phẩm.
          </p>
        </div>
      </div>

      <Card padding="md">
        <CardHeader
          title="Tạo danh mục mới"
          subtitle="Tên danh mục là bắt buộc, slug và mô tả là tuỳ chọn."
        />
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
        >
          <Input
            label="Tên danh mục"
            placeholder="Ví dụ: Nến thơm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Slug (tuỳ chọn)"
            placeholder="Ví dụ: nen-thom"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          <div className="md:col-span-1 flex md:block flex-col gap-2">
            <Input
              label="Mô tả (tuỳ chọn)"
              placeholder="Mô tả ngắn về danh mục"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="md:col-span-3 flex items-center justify-between">
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}
            <div className="flex-1" />
            <Button
              type="submit"
              icon={creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              disabled={creating}
            >
              {creating ? "Đang tạo..." : "Tạo danh mục"}
            </Button>
          </div>
        </form>
      </Card>

      <Card padding="md">
        <CardHeader
          title="Danh sách danh mục"
          subtitle={
            loading
              ? "Đang tải danh mục..."
              : `${categories.length} danh mục hiện có`
          }
          action={
            !loading && (
              <Badge variant="default">
                {categories.length} danh mục
              </Badge>
            )
          }
        />
        <div className="overflow-x-auto -mx-5">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-brand-100">
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Tên
                </th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Slug
                </th>
                <th className="text-left py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="text-right py-3 px-5 text-brand-500 font-medium text-xs uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="w-16 py-3 px-5"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-5 text-center text-brand-400 text-sm"
                  >
                    Đang tải danh mục...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 px-5 text-center text-brand-400 text-sm"
                  >
                    Chưa có danh mục nào. Hãy tạo danh mục đầu tiên ở trên.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-t border-brand-50 hover:bg-brand-50/40 transition-colors"
                  >
                    <td className="py-3 px-5 font-medium text-brand-700">
                      {cat.name}
                    </td>
                    <td className="py-3 px-5 text-brand-500 font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="py-3 px-5 text-brand-500 text-sm">
                      {cat.description || "—"}
                    </td>
                    <td className="py-3 px-5 text-right text-brand-400 text-xs">
                      {new Date(cat.created_at).toLocaleString("vi-VN")}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <button
                        onClick={() => void handleDelete(cat.id)}
                        className="p-1.5 rounded-lg text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        disabled={deletingId === cat.id}
                      >
                        {deletingId === cat.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

