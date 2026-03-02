import { z } from "zod";

// ─── Categories ──────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, "Tên danh mục không được trống").max(100),
  slug: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// ─── Products ────────────────────────────────────────────

export const createVariantSchema = z.object({
  sku: z.string().min(1, "SKU không được trống").max(50),
  color: z.string().max(100).nullable().optional(),
  size: z.string().max(100).nullable().optional(),
  price: z.number().min(0, "Giá phải >= 0"),
  stock_quantity: z.number().int().min(0, "Tồn kho phải >= 0").default(0),
  image_url: z.string().url().nullable().optional(),
});

export const updateVariantSchema = createVariantSchema.partial();

export const createProductSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm không được trống").max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).nullable().optional(),
  category_id: z.string().uuid("category_id phải là UUID").nullable().optional(),
  base_price: z.number().min(0, "Giá gốc phải >= 0"),
  is_active: z.boolean().default(true),
  variants: z.array(createVariantSchema).optional(),
});

export const updateProductSchema = createProductSchema.omit({ variants: true }).partial();

// ─── Customers ───────────────────────────────────────────

export const createCustomerSchema = z.object({
  full_name: z.string().min(1, "Họ tên không được trống").max(200),
  phone: z.string().max(20).nullable().optional(),
  email: z.string().email("Email không hợp lệ").nullable().optional(),
  address: z.string().max(500).nullable().optional(),
});

export const updateCustomerSchema = createCustomerSchema.partial();

// ─── Orders ──────────────────────────────────────────────

export const orderItemInput = z.object({
  variant_id: z.string().uuid("variant_id phải là UUID"),
  quantity: z.number().int().min(1, "Số lượng phải >= 1"),
});

export const createOrderSchema = z.object({
  customer_id: z.string().uuid("customer_id phải là UUID"),
  note: z.string().max(500).nullable().optional(),
  items: z.array(orderItemInput).min(1, "Đơn hàng phải có ít nhất 1 sản phẩm"),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipping", "completed", "cancelled"]),
});

export const updatePaymentStatusSchema = z.object({
  payment_status: z.enum(["unpaid", "partial", "paid"]),
});

// ─── Payments ────────────────────────────────────────────

export const createPaymentSchema = z.object({
  order_id: z.string().uuid("order_id phải là UUID"),
  method: z.string().min(1, "Phương thức thanh toán không được trống").max(100),
  amount: z.number().min(0, "Số tiền phải >= 0"),
});

export const updatePaymentSchema = z.object({
  status: z.enum(["pending", "completed", "failed"]),
});

// ─── Inventory ───────────────────────────────────────────

export const createInventoryLogSchema = z.object({
  variant_id: z.string().uuid("variant_id phải là UUID"),
  change_type: z.enum(["restock", "adjustment"]),
  quantity_changed: z.number().int().refine((v) => v !== 0, "Số lượng thay đổi phải khác 0"),
  note: z.string().max(500).nullable().optional(),
});

// ─── Query params ────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.string().default("created_at"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
