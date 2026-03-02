"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Code2, Send, Copy, Check } from "lucide-react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type Endpoint = {
  group: string;
  name: string;
  method: HttpMethod;
  path: string;
  sampleBody?: unknown;
};

const endpoints: Endpoint[] = [
  { group: "Dashboard", name: "Dashboard stats", method: "GET", path: "/api/dashboard" },
  { group: "Inventory", name: "Inventory logs", method: "GET", path: "/api/inventory?page=1&limit=20" },
  { group: "Inventory", name: "Create inventory log", method: "POST", path: "/api/inventory", sampleBody: { variant_id: "UUID", change_type: "restock", quantity_changed: 1, note: "..." } },

  { group: "Categories", name: "List categories", method: "GET", path: "/api/categories?page=1&limit=50" },
  { group: "Categories", name: "Create category", method: "POST", path: "/api/categories", sampleBody: { name: "Nến thơm", slug: "nen-thom" } },
  { group: "Categories", name: "Get category", method: "GET", path: "/api/categories/{id}" },
  { group: "Categories", name: "Update category", method: "PUT", path: "/api/categories/{id}", sampleBody: { name: "Tên mới" } },
  { group: "Categories", name: "Delete category", method: "DELETE", path: "/api/categories/{id}" },

  { group: "Products", name: "List products", method: "GET", path: "/api/products?page=1&limit=20" },
  { group: "Products", name: "Create product", method: "POST", path: "/api/products", sampleBody: { name: "Sản phẩm", base_price: 1000, is_active: true, variants: [{ sku: "SKU-1", price: 1000, stock_quantity: 1, image_url: "https://..." }] } },
  { group: "Products", name: "Get product", method: "GET", path: "/api/products/{id}" },
  { group: "Products", name: "Update product", method: "PUT", path: "/api/products/{id}", sampleBody: { name: "Tên mới", category_id: null } },
  { group: "Products", name: "Delete product", method: "DELETE", path: "/api/products/{id}" },

  { group: "Variants", name: "List variants", method: "GET", path: "/api/products/{id}/variants" },
  { group: "Variants", name: "Create variant", method: "POST", path: "/api/products/{id}/variants", sampleBody: { sku: "SKU-2", price: 1000, stock_quantity: 1, image_url: "https://..." } },
  { group: "Variants", name: "Update variant", method: "PUT", path: "/api/products/{id}/variants/{variantId}", sampleBody: { price: 1200 } },
  { group: "Variants", name: "Delete variant", method: "DELETE", path: "/api/products/{id}/variants/{variantId}" },

  { group: "Orders", name: "List orders", method: "GET", path: "/api/orders?page=1&limit=20" },
  { group: "Orders", name: "Create order (RPC)", method: "POST", path: "/api/orders", sampleBody: { customer_id: "UUID", items: [{ variant_id: "UUID", quantity: 1 }], note: "" } },
  { group: "Orders", name: "Get order", method: "GET", path: "/api/orders/{id}" },
  { group: "Orders", name: "Update order", method: "PUT", path: "/api/orders/{id}", sampleBody: { status: "processing" } },
  { group: "Orders", name: "Delete order", method: "DELETE", path: "/api/orders/{id}" },

  { group: "Payments", name: "List payments", method: "GET", path: "/api/payments?page=1&limit=20" },
  { group: "Payments", name: "Create payment", method: "POST", path: "/api/payments", sampleBody: { order_id: "UUID", method: "Chuyển khoản", amount: 1000 } },
  { group: "Payments", name: "Get payment", method: "GET", path: "/api/payments/{id}" },
  { group: "Payments", name: "Update payment", method: "PUT", path: "/api/payments/{id}", sampleBody: { status: "completed" } },

  { group: "Customers", name: "List customers", method: "GET", path: "/api/customers?page=1&limit=20" },
  { group: "Customers", name: "Create customer", method: "POST", path: "/api/customers", sampleBody: { full_name: "Nguyễn Văn A", phone: "090...", email: "a@b.com" } },
  { group: "Customers", name: "Get customer", method: "GET", path: "/api/customers/{id}" },
  { group: "Customers", name: "Update customer", method: "PUT", path: "/api/customers/{id}", sampleBody: { full_name: "Tên mới" } },
  { group: "Customers", name: "Delete customer", method: "DELETE", path: "/api/customers/{id}" },

  { group: "Storage", name: "List product images (server)", method: "GET", path: "/api/product-images" },

  // Public APIs (partner)
  { group: "Public Categories", name: "Public list categories", method: "GET", path: "/api/public/categories?page=1&limit=50" },
  { group: "Public Categories", name: "Public get category", method: "GET", path: "/api/public/categories/{id}" },
  { group: "Public Categories", name: "Public create category", method: "POST", path: "/api/public/categories", sampleBody: { name: "Nến thơm", slug: "nen-thom" } },
  { group: "Public Categories", name: "Public update category", method: "PUT", path: "/api/public/categories/{id}", sampleBody: { name: "Tên mới" } },
  { group: "Public Categories", name: "Public delete category", method: "DELETE", path: "/api/public/categories/{id}" },

  { group: "Public Products", name: "Public list products", method: "GET", path: "/api/public/products?page=1&limit=20" },
  { group: "Public Products", name: "Public get product", method: "GET", path: "/api/public/products/{id}" },
  { group: "Public Products", name: "Public create product", method: "POST", path: "/api/public/products", sampleBody: { name: "Sản phẩm", base_price: 1000, is_active: true, variants: [{ sku: "SKU-1", price: 1000, stock_quantity: 1, image_url: "https://..." }] } },
  { group: "Public Products", name: "Public update product", method: "PUT", path: "/api/public/products/{id}", sampleBody: { name: "Tên mới", category_id: null } },
  { group: "Public Products", name: "Public delete product", method: "DELETE", path: "/api/public/products/{id}" },
];

function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

const REQUIRED_PASSWORD = "18122006";
const UNLOCK_KEY = "api_explorer_unlocked";

export default function ApiExplorerPage() {
  const abortRef = useRef<AbortController | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [method, setMethod] = useState<HttpMethod>("GET");
  const [path, setPath] = useState("/api/products?page=1&limit=20");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [durationMs, setDurationMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(UNLOCK_KEY) === "1") {
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, Endpoint[]>();
    for (const e of endpoints) {
      const list = map.get(e.group) ?? [];
      list.push(e);
      map.set(e.group, list);
    }
    return Array.from(map.entries());
  }, []);

  function loadEndpoint(e: Endpoint) {
    setMethod(e.method);
    setPath(e.path);
    setError(null);
    setStatus(null);
    setDurationMs(null);
    setResponseText("");
    if (e.sampleBody && e.method !== "GET" && e.method !== "DELETE") {
      setBody(prettyJson(e.sampleBody));
    } else {
      setBody("");
    }
  }

  async function handleSend(): Promise<void> {
    const normalizedPath = path.trim();
    if (!normalizedPath.startsWith("/")) {
      setError("Path phải bắt đầu bằng '/' (ví dụ: /api/products)");
      return;
    }

    const isGetLike = method === "GET" || method === "DELETE";

    let parsedBody: unknown | undefined;
    if (!isGetLike && body.trim().length > 0) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        setError("Body JSON không hợp lệ");
        return;
      }
    }

    // Abort previous request to avoid race condition
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setStatus(null);
    setDurationMs(null);
    setResponseText("");

    const start = performance.now();
    try {
      const headers: Record<string, string> = {};
      if (!isGetLike) headers["Content-Type"] = "application/json";

      const res = await fetch(normalizedPath, {
        method,
        headers: Object.keys(headers).length ? headers : undefined,
        body: !isGetLike && parsedBody !== undefined ? JSON.stringify(parsedBody) : undefined,
        signal: controller.signal,
      });

      const end = performance.now();
      setDurationMs(Math.round(end - start));
      setStatus(res.status);

      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        const json = await res.json();
        setResponseText(prettyJson(json));
      } else {
        const text = await res.text();
        setResponseText(text);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError("Không thể gọi API (kiểm tra path / quyền truy cập)");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(responseText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  function handleUnlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = password === REQUIRED_PASSWORD;
    if (!ok) {
      setAuthError("Sai mật khẩu");
      return;
    }
    setAuthError(null);
    setUnlocked(true);
    try {
      sessionStorage.setItem(UNLOCK_KEY, "1");
    } catch {
      // ignore
    }
  }

  if (!unlocked) {
    return (
      <div className="max-w-lg mx-auto">
        <Card padding="md">
          <CardHeader
            title="API Explorer"
            subtitle="Nhập mật khẩu để truy cập công cụ test API."
          />
          <form onSubmit={handleUnlock} className="space-y-4">
            <Input
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
            />
            {authError && <p className="text-sm text-red-500">{authError}</p>}
            <div className="flex justify-end">
              <Button type="submit">Vào API Explorer</Button>
            </div>
          </form>
          
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
          API Explorer
        </h1>
        <p className="text-brand-500 mt-1">
          Chọn endpoint ở bên trái, nhập tham số và gửi request để test nhanh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-6">
        <Card className="lg:col-span-2" padding="md">
          <CardHeader
            title="Danh sách API"
            subtitle="Click để nạp vào form test."
          />
          <div className="space-y-4">
            {grouped.map(([group, list]) => (
              <div key={group}>
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider mb-2">
                  {group}
                </p>
                <div className="space-y-1">
                  {list.map((e) => (
                    <button
                      key={`${e.method}-${e.path}`}
                      type="button"
                      onClick={() => loadEndpoint(e)}
                      className="w-full text-left px-3 py-2 rounded-xl border border-brand-100 hover:border-brand-300 hover:bg-brand-50 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-brand-700 truncate">
                            {e.name}
                          </p>
                          <p className="text-xs text-brand-400 truncate">
                            {e.path}
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-brand-600 border border-brand-200 rounded-lg px-2 py-1">
                          {e.method}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3" padding="md">
          <CardHeader
            title="Gửi request"
            subtitle="Hỗ trợ JSON body và hiển thị response."
            action={
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={<Code2 size={14} />}
                onClick={() => {
                  setMethod("GET");
                  setPath("/api/products?page=1&limit=20");
                  setBody("");
                  setError(null);
                  setStatus(null);
                  setDurationMs(null);
                  setResponseText("");
                }}
              >
                Reset
              </Button>
            }
          />

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-brand-600 mb-1.5">
                  Method
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  className="w-full px-4 py-2.5 rounded-xl border border-brand-200 bg-white text-brand-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <Input
                  label="Path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/api/products?page=1&limit=20"
                />
              </div>
            </div>

            {method !== "GET" && method !== "DELETE" && (
              <div>
                <label className="block text-sm font-medium text-brand-600 mb-1.5">
                  JSON Body
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-brand-200 bg-white text-brand-700 text-sm font-mono placeholder:text-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 focus:border-brand-400 transition-all duration-200"
                  placeholder='{"key":"value"}'
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                {error && (
                  <p className="text-sm text-red-500 truncate">{error}</p>
                )}
                {!error && status !== null && (
                  <p className="text-sm text-brand-500">
                    Status: <span className="font-semibold text-brand-700">{status}</span>
                    {durationMs !== null && (
                      <>
                        {" "}·{" "}
                        <span className="text-brand-400">{durationMs}ms</span>
                      </>
                    )}
                  </p>
                )}
              </div>
              <Button
                type="button"
                icon={<Send size={16} />}
                disabled={loading}
                onClick={() => void handleSend()}
              >
                {loading ? "Đang gửi..." : "Gửi"}
              </Button>
            </div>

            <div className="rounded-2xl border border-brand-100 bg-brand-50/40 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-brand-100">
                <p className="text-xs font-semibold text-brand-500 uppercase tracking-wider">
                  Response
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={copied ? <Check size={14} /> : <Copy size={14} />}
                  disabled={!responseText}
                  onClick={() => void handleCopy()}
                >
                  {copied ? "Đã copy" : "Copy"}
                </Button>
              </div>
              <pre className="p-4 text-xs text-brand-700 overflow-x-auto whitespace-pre-wrap">
{responseText || "Chưa có response. Hãy chọn endpoint và bấm Gửi."}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

