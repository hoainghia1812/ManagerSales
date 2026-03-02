import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { ok, fail, handleError } from "@/lib/api-helpers";

// GET /api/dashboard — Aggregated stats for dashboard
export async function GET(_request: NextRequest) {
  try {
    const [
      productsRes,
      variantsRes,
      customersRes,
      ordersRes,
      revenueRes,
      lowStockRes,
      recentOrdersRes,
      ordersByStatusRes,
    ] = await Promise.all([
      // Total active products
      supabaseAdmin
        .from("products")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true),

      // Total stock across all variants
      supabaseAdmin
        .from("product_variants")
        .select("stock_quantity"),

      // Total customers
      supabaseAdmin
        .from("customers")
        .select("id", { count: "exact", head: true }),

      // Total orders (non-cancelled)
      supabaseAdmin
        .from("orders")
        .select("id", { count: "exact", head: true })
        .neq("status", "cancelled"),

      // Total revenue from completed orders
      supabaseAdmin
        .from("orders")
        .select("total_amount")
        .eq("status", "completed"),

      // Low stock variants (≤ 5)
      supabaseAdmin
        .from("product_variants")
        .select("*, products(name)")
        .lte("stock_quantity", 5)
        .order("stock_quantity", { ascending: true })
        .limit(10),

      // Recent orders
      supabaseAdmin
        .from("orders")
        .select("*, customers(full_name)")
        .order("created_at", { ascending: false })
        .limit(5),

      // Orders by status
      supabaseAdmin
        .from("orders")
        .select("status"),
    ]);

    // Aggregate
    const totalStock = (variantsRes.data ?? []).reduce(
      (sum, v) => sum + (v.stock_quantity ?? 0),
      0
    );

    const totalRevenue = (revenueRes.data ?? []).reduce(
      (sum, o) => sum + (o.total_amount ?? 0),
      0
    );

    const statusCounts = (ordersByStatusRes.data ?? []).reduce(
      (acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const dashboard = {
      stats: {
        totalProducts: productsRes.count ?? 0,
        totalStock,
        totalCustomers: customersRes.count ?? 0,
        totalOrders: ordersRes.count ?? 0,
        totalRevenue,
      },
      ordersByStatus: statusCounts,
      lowStockVariants: lowStockRes.data ?? [],
      recentOrders: recentOrdersRes.data ?? [],
    };

    // Check for errors
    const errors = [productsRes, variantsRes, customersRes, ordersRes, revenueRes]
      .filter((r) => r.error)
      .map((r) => r.error!.message);

    if (errors.length > 0) {
      return fail("Lỗi lấy dữ liệu dashboard", 500, errors.join("; "));
    }

    return ok(dashboard);
  } catch (error) {
    return handleError(error);
  }
}
