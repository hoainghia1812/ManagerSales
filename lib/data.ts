// =========================================
// INTERFACES matching Supabase schema
// =========================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category?: Category;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  color: string;
  size: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  created_at: string;
  product?: Product;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer?: Customer;
  order_code: string;
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  total_amount: number;
  payment_status: "unpaid" | "partial" | "paid";
  note: string;
  created_at: string;
  items?: OrderItem[];
  payments?: Payment[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string;
  variant?: ProductVariant;
  quantity: number;
  price: number;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  method: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  paid_at: string;
  created_at: string;
}

export interface InventoryLog {
  id: string;
  variant_id: string;
  variant?: ProductVariant;
  change_type: "order" | "cancel" | "restock" | "adjustment";
  quantity_changed: number;
  note: string;
  created_at: string;
}

// =========================================
// STATUS LABELS & VARIANTS
// =========================================

export const orderStatusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

export const orderStatusVariants: Record<string, string> = {
  pending: "warning",
  processing: "info",
  shipping: "info",
  completed: "success",
  cancelled: "error",
};

export const paymentStatusLabels: Record<string, string> = {
  unpaid: "Chưa thanh toán",
  partial: "Thanh toán một phần",
  paid: "Đã thanh toán",
};

export const paymentStatusVariants: Record<string, string> = {
  unpaid: "error",
  partial: "warning",
  paid: "success",
};

export const inventoryChangeLabels: Record<string, string> = {
  order: "Bán hàng",
  cancel: "Hoàn trả",
  restock: "Nhập kho",
  adjustment: "Điều chỉnh",
};

export const inventoryChangeVariants: Record<string, string> = {
  order: "error",
  cancel: "warning",
  restock: "success",
  adjustment: "info",
};

// =========================================
// MOCK DATA
// =========================================

export const categories: Category[] = [
  { id: "cat-01", name: "Nến thơm", slug: "nen-thom", description: "Nến thơm thủ công cao cấp", created_at: "2025-01-10" },
  { id: "cat-02", name: "Set quà", slug: "set-qua", description: "Bộ quà tặng sang trọng", created_at: "2025-01-10" },
  { id: "cat-03", name: "Xà phòng", slug: "xa-phong", description: "Xà phòng handmade tự nhiên", created_at: "2025-01-10" },
  { id: "cat-04", name: "Tinh dầu", slug: "tinh-dau", description: "Tinh dầu thiên nhiên nguyên chất", created_at: "2025-01-10" },
  { id: "cat-05", name: "Hoa khô", slug: "hoa-kho", description: "Hoa khô nghệ thuật", created_at: "2025-01-10" },
  { id: "cat-06", name: "Phụ kiện", slug: "phu-kien", description: "Phụ kiện & túi thơm", created_at: "2025-01-10" },
];

const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

export const products: Product[] = [
  {
    id: "prod-01", name: "Nến thơm Lavender Dreams", slug: "nen-thom-lavender-dreams",
    description: "Nến thơm thủ công hương lavender, đổ tay 100%",
    category_id: "cat-01", base_price: 250000, is_active: true,
    created_at: "2025-03-15", updated_at: "2026-02-20",
  },
  {
    id: "prod-02", name: "Set quà tặng Premium Rose", slug: "set-qua-tang-premium-rose",
    description: "Bộ quà tặng cao cấp với hoa hồng khô và nến thơm",
    category_id: "cat-02", base_price: 750000, is_active: true,
    created_at: "2025-04-20", updated_at: "2026-02-18",
  },
  {
    id: "prod-03", name: "Xà phòng Honey & Oat", slug: "xa-phong-honey-oat",
    description: "Xà phòng handmade mật ong và yến mạch",
    category_id: "cat-03", base_price: 95000, is_active: true,
    created_at: "2025-02-10", updated_at: "2026-01-15",
  },
  {
    id: "prod-04", name: "Tinh dầu Eucalyptus", slug: "tinh-dau-eucalyptus",
    description: "Tinh dầu bạch đàn nguyên chất 100%",
    category_id: "cat-04", base_price: 180000, is_active: true,
    created_at: "2025-05-01", updated_at: "2026-02-10",
  },
  {
    id: "prod-05", name: "Hoa khô Bouquet Vintage", slug: "hoa-kho-bouquet-vintage",
    description: "Bó hoa khô phong cách vintage, sấy thủ công",
    category_id: "cat-05", base_price: 350000, is_active: true,
    created_at: "2025-06-12", updated_at: "2026-02-22",
  },
  {
    id: "prod-06", name: "Nến thơm Vanilla Bean", slug: "nen-thom-vanilla-bean",
    description: "Nến thơm vanilla bean trong hũ thuỷ tinh thủ công",
    category_id: "cat-01", base_price: 220000, is_active: true,
    created_at: "2025-03-28", updated_at: "2026-02-15",
  },
  {
    id: "prod-07", name: "Set quà Tết An Khang", slug: "set-qua-tet-an-khang",
    description: "Set quà Tết cao cấp - nến, tinh dầu, xà phòng, hoa khô",
    category_id: "cat-02", base_price: 1000000, is_active: true,
    created_at: "2025-11-01", updated_at: "2026-01-20",
  },
  {
    id: "prod-08", name: "Túi thơm Lavender Sachet", slug: "tui-thom-lavender-sachet",
    description: "Túi thơm lavender thiên nhiên, may tay thủ công",
    category_id: "cat-06", base_price: 65000, is_active: true,
    created_at: "2025-07-15", updated_at: "2026-02-01",
  },
  {
    id: "prod-09", name: "Xà phòng Charcoal Detox", slug: "xa-phong-charcoal-detox",
    description: "Xà phòng than hoạt tính thải độc da",
    category_id: "cat-03", base_price: 110000, is_active: false,
    created_at: "2025-08-20", updated_at: "2026-01-05",
  },
  {
    id: "prod-10", name: "Nến thơm Cinnamon Spice", slug: "nen-thom-cinnamon-spice",
    description: "Nến thơm quế và gia vị, hương Giáng sinh ấm áp",
    category_id: "cat-01", base_price: 280000, is_active: true,
    created_at: "2025-10-01", updated_at: "2026-02-25",
  },
];

export const variants: ProductVariant[] = [
  // Lavender Dreams - 3 sizes
  { id: "var-01", product_id: "prod-01", sku: "LD-100", color: "Tím lavender", size: "100g", price: 250000, stock_quantity: 24, image_url: "", created_at: "2025-03-15" },
  { id: "var-02", product_id: "prod-01", sku: "LD-200", color: "Tím lavender", size: "200g", price: 380000, stock_quantity: 15, image_url: "", created_at: "2025-03-15" },
  { id: "var-03", product_id: "prod-01", sku: "LD-500", color: "Tím lavender", size: "500g", price: 650000, stock_quantity: 8, image_url: "", created_at: "2025-03-15" },
  // Premium Rose - 2 tiers
  { id: "var-04", product_id: "prod-02", sku: "PR-STD", color: "Hồng pastel", size: "Standard", price: 750000, stock_quantity: 12, image_url: "", created_at: "2025-04-20" },
  { id: "var-05", product_id: "prod-02", sku: "PR-DLX", color: "Hồng đậm", size: "Deluxe", price: 1200000, stock_quantity: 6, image_url: "", created_at: "2025-04-20" },
  // Honey & Oat - 2 variants
  { id: "var-06", product_id: "prod-03", sku: "HO-100", color: "Vàng mật ong", size: "100g", price: 95000, stock_quantity: 45, image_url: "", created_at: "2025-02-10" },
  { id: "var-07", product_id: "prod-03", sku: "HO-SET3", color: "Vàng mật ong", size: "Set 3 bánh", price: 250000, stock_quantity: 20, image_url: "", created_at: "2025-02-10" },
  // Eucalyptus - 3 volumes
  { id: "var-08", product_id: "prod-04", sku: "EU-10", color: "Xanh lá", size: "10ml", price: 180000, stock_quantity: 38, image_url: "", created_at: "2025-05-01" },
  { id: "var-09", product_id: "prod-04", sku: "EU-30", color: "Xanh lá", size: "30ml", price: 350000, stock_quantity: 22, image_url: "", created_at: "2025-05-01" },
  { id: "var-10", product_id: "prod-04", sku: "EU-50", color: "Xanh lá", size: "50ml", price: 480000, stock_quantity: 10, image_url: "", created_at: "2025-05-01" },
  // Bouquet Vintage - 2 styles
  { id: "var-11", product_id: "prod-05", sku: "BV-SM", color: "Nâu vintage", size: "Nhỏ", price: 350000, stock_quantity: 8, image_url: "", created_at: "2025-06-12" },
  { id: "var-12", product_id: "prod-05", sku: "BV-LG", color: "Nâu vintage", size: "Lớn", price: 550000, stock_quantity: 4, image_url: "", created_at: "2025-06-12" },
  // Vanilla Bean - 2 sizes
  { id: "var-13", product_id: "prod-06", sku: "VB-150", color: "Kem vanilla", size: "150g", price: 220000, stock_quantity: 31, image_url: "", created_at: "2025-03-28" },
  { id: "var-14", product_id: "prod-06", sku: "VB-300", color: "Kem vanilla", size: "300g", price: 380000, stock_quantity: 18, image_url: "", created_at: "2025-03-28" },
  // Set Tết - 2 tiers
  { id: "var-15", product_id: "prod-07", sku: "TET-PRE", color: "Đỏ truyền thống", size: "Premium", price: 1250000, stock_quantity: 5, image_url: "", created_at: "2025-11-01" },
  { id: "var-16", product_id: "prod-07", sku: "TET-LUX", color: "Vàng kim", size: "Luxury", price: 1800000, stock_quantity: 3, image_url: "", created_at: "2025-11-01" },
  // Lavender Sachet - 2 options
  { id: "var-17", product_id: "prod-08", sku: "LS-1", color: "Tím nhạt", size: "1 túi", price: 85000, stock_quantity: 67, image_url: "", created_at: "2025-07-15" },
  { id: "var-18", product_id: "prod-08", sku: "LS-SET5", color: "Tím nhạt", size: "Set 5 túi", price: 350000, stock_quantity: 25, image_url: "", created_at: "2025-07-15" },
  // Charcoal Detox
  { id: "var-19", product_id: "prod-09", sku: "CD-100", color: "Đen", size: "100g", price: 110000, stock_quantity: 0, image_url: "", created_at: "2025-08-20" },
  { id: "var-20", product_id: "prod-09", sku: "CD-SET3", color: "Đen", size: "Set 3 bánh", price: 290000, stock_quantity: 0, image_url: "", created_at: "2025-08-20" },
  // Cinnamon Spice - 2 sizes
  { id: "var-21", product_id: "prod-10", sku: "CS-150", color: "Nâu quế", size: "150g", price: 280000, stock_quantity: 19, image_url: "", created_at: "2025-10-01" },
  { id: "var-22", product_id: "prod-10", sku: "CS-300", color: "Nâu quế", size: "300g", price: 450000, stock_quantity: 11, image_url: "", created_at: "2025-10-01" },
];

// Attach variants + categories to products
export const productsWithDetails: Product[] = products.map((p) => ({
  ...p,
  category: categoryMap[p.category_id],
  variants: variants.filter((v) => v.product_id === p.id),
}));

// Attach product to variants
export const variantsWithProduct: ProductVariant[] = variants.map((v) => ({
  ...v,
  product: products.find((p) => p.id === v.product_id),
}));

export const customers: Customer[] = [
  { id: "cus-01", full_name: "Nguyễn Thị Minh Anh", phone: "0901234567", email: "minhanh@email.com", address: "123 Nguyễn Huệ, Q.1, TP.HCM", created_at: "2025-06-15" },
  { id: "cus-02", full_name: "Trần Văn Hoàng", phone: "0912345678", email: "hoang.tv@email.com", address: "45 Lê Lợi, Q.3, TP.HCM", created_at: "2025-08-20" },
  { id: "cus-03", full_name: "Lê Thị Thu Hà", phone: "0923456789", email: "thuha.le@email.com", address: "78 Hai Bà Trưng, Q.1, TP.HCM", created_at: "2025-03-10" },
  { id: "cus-04", full_name: "Phạm Đức Trung", phone: "0934567890", email: "trung.pd@email.com", address: "12 Pasteur, Q.1, TP.HCM", created_at: "2025-09-05" },
  { id: "cus-05", full_name: "Hoàng Thị Lan", phone: "0945678901", email: "lan.ht@email.com", address: "56 Võ Văn Tần, Q.3, TP.HCM", created_at: "2025-01-22" },
  { id: "cus-06", full_name: "Võ Minh Khôi", phone: "0956789012", email: "khoi.vm@email.com", address: "89 Điện Biên Phủ, Bình Thạnh, TP.HCM", created_at: "2025-11-18" },
  { id: "cus-07", full_name: "Đỗ Thị Hương", phone: "0967890123", email: "huong.dt@email.com", address: "34 Nguyễn Đình Chiểu, Q.3, TP.HCM", created_at: "2025-07-30" },
  { id: "cus-08", full_name: "Bùi Anh Tuấn", phone: "0978901234", email: "tuan.ba@email.com", address: "67 Cách Mạng Tháng 8, Q.10, TP.HCM", created_at: "2025-10-12" },
];

const customerMap = Object.fromEntries(customers.map((c) => [c.id, c]));
const variantMap = Object.fromEntries(variantsWithProduct.map((v) => [v.id, v]));

export const orders: Order[] = [
  {
    id: "ord-01", customer_id: "cus-01", order_code: "MC-20260228-001",
    status: "completed", total_amount: 760000, payment_status: "paid",
    note: "Gói quà tặng sinh nhật", created_at: "2026-02-28",
  },
  {
    id: "ord-02", customer_id: "cus-02", order_code: "MC-20260227-002",
    status: "shipping", total_amount: 1200000, payment_status: "paid",
    note: "", created_at: "2026-02-27",
  },
  {
    id: "ord-03", customer_id: "cus-03", order_code: "MC-20260227-003",
    status: "processing", total_amount: 475000, payment_status: "partial",
    note: "Khách đặt trước 50%", created_at: "2026-02-27",
  },
  {
    id: "ord-04", customer_id: "cus-04", order_code: "MC-20260226-004",
    status: "pending", total_amount: 1250000, payment_status: "unpaid",
    note: "Quà Tết cho công ty", created_at: "2026-02-26",
  },
  {
    id: "ord-05", customer_id: "cus-05", order_code: "MC-20260226-005",
    status: "completed", total_amount: 560000, payment_status: "paid",
    note: "", created_at: "2026-02-26",
  },
  {
    id: "ord-06", customer_id: "cus-06", order_code: "MC-20260225-006",
    status: "cancelled", total_amount: 550000, payment_status: "unpaid",
    note: "Khách huỷ - đổi ý", created_at: "2026-02-25",
  },
  {
    id: "ord-07", customer_id: "cus-07", order_code: "MC-20260225-007",
    status: "completed", total_amount: 730000, payment_status: "paid",
    note: "", created_at: "2026-02-25",
  },
  {
    id: "ord-08", customer_id: "cus-08", order_code: "MC-20260224-008",
    status: "shipping", total_amount: 350000, payment_status: "paid",
    note: "Giao trước 5pm", created_at: "2026-02-24",
  },
  {
    id: "ord-09", customer_id: "cus-01", order_code: "MC-20260224-009",
    status: "completed", total_amount: 380000, payment_status: "paid",
    note: "", created_at: "2026-02-24",
  },
  {
    id: "ord-10", customer_id: "cus-03", order_code: "MC-20260223-010",
    status: "processing", total_amount: 890000, payment_status: "unpaid",
    note: "Gói kỹ, có thiệp", created_at: "2026-02-23",
  },
];

export const orderItems: OrderItem[] = [
  { id: "oi-01", order_id: "ord-01", variant_id: "var-02", quantity: 2, price: 380000, created_at: "2026-02-28" },
  { id: "oi-02", order_id: "ord-02", variant_id: "var-05", quantity: 1, price: 1200000, created_at: "2026-02-27" },
  { id: "oi-03", order_id: "ord-03", variant_id: "var-06", quantity: 3, price: 95000, created_at: "2026-02-27" },
  { id: "oi-04", order_id: "ord-03", variant_id: "var-08", quantity: 1, price: 180000, created_at: "2026-02-27" },
  { id: "oi-05", order_id: "ord-04", variant_id: "var-15", quantity: 1, price: 1250000, created_at: "2026-02-26" },
  { id: "oi-06", order_id: "ord-05", variant_id: "var-09", quantity: 1, price: 350000, created_at: "2026-02-26" },
  { id: "oi-07", order_id: "ord-05", variant_id: "var-08", quantity: 1, price: 180000, created_at: "2026-02-26" },
  { id: "oi-08", order_id: "ord-05", variant_id: "var-17", quantity: 1, price: 85000, created_at: "2026-02-26" },
  { id: "oi-09", order_id: "ord-06", variant_id: "var-12", quantity: 1, price: 550000, created_at: "2026-02-25" },
  { id: "oi-10", order_id: "ord-07", variant_id: "var-13", quantity: 2, price: 220000, created_at: "2026-02-25" },
  { id: "oi-11", order_id: "ord-07", variant_id: "var-21", quantity: 1, price: 280000, created_at: "2026-02-25" },
  { id: "oi-12", order_id: "ord-08", variant_id: "var-18", quantity: 1, price: 350000, created_at: "2026-02-24" },
  { id: "oi-13", order_id: "ord-09", variant_id: "var-14", quantity: 1, price: 380000, created_at: "2026-02-24" },
  { id: "oi-14", order_id: "ord-10", variant_id: "var-04", quantity: 1, price: 750000, created_at: "2026-02-23" },
  { id: "oi-15", order_id: "ord-10", variant_id: "var-17", quantity: 2, price: 85000, created_at: "2026-02-23" },
];

export const payments: Payment[] = [
  { id: "pay-01", order_id: "ord-01", method: "Chuyển khoản", amount: 760000, status: "completed", paid_at: "2026-02-28", created_at: "2026-02-28" },
  { id: "pay-02", order_id: "ord-02", method: "Momo", amount: 1200000, status: "completed", paid_at: "2026-02-27", created_at: "2026-02-27" },
  { id: "pay-03", order_id: "ord-03", method: "Chuyển khoản", amount: 237500, status: "completed", paid_at: "2026-02-27", created_at: "2026-02-27" },
  { id: "pay-04", order_id: "ord-05", method: "Tiền mặt", amount: 560000, status: "completed", paid_at: "2026-02-26", created_at: "2026-02-26" },
  { id: "pay-05", order_id: "ord-07", method: "ZaloPay", amount: 730000, status: "completed", paid_at: "2026-02-25", created_at: "2026-02-25" },
  { id: "pay-06", order_id: "ord-08", method: "Chuyển khoản", amount: 350000, status: "completed", paid_at: "2026-02-24", created_at: "2026-02-24" },
  { id: "pay-07", order_id: "ord-09", method: "Tiền mặt", amount: 380000, status: "completed", paid_at: "2026-02-24", created_at: "2026-02-24" },
];

export const inventoryLogs: InventoryLog[] = [
  { id: "inv-01", variant_id: "var-02", change_type: "order", quantity_changed: -2, note: "Đơn MC-20260228-001", created_at: "2026-02-28" },
  { id: "inv-02", variant_id: "var-05", change_type: "order", quantity_changed: -1, note: "Đơn MC-20260227-002", created_at: "2026-02-27" },
  { id: "inv-03", variant_id: "var-06", change_type: "order", quantity_changed: -3, note: "Đơn MC-20260227-003", created_at: "2026-02-27" },
  { id: "inv-04", variant_id: "var-08", change_type: "order", quantity_changed: -1, note: "Đơn MC-20260227-003", created_at: "2026-02-27" },
  { id: "inv-05", variant_id: "var-15", change_type: "order", quantity_changed: -1, note: "Đơn MC-20260226-004", created_at: "2026-02-26" },
  { id: "inv-06", variant_id: "var-12", change_type: "cancel", quantity_changed: 1, note: "Hoàn trả - Đơn MC-20260225-006", created_at: "2026-02-25" },
  { id: "inv-07", variant_id: "var-01", change_type: "restock", quantity_changed: 20, note: "Nhập lô mới tháng 2", created_at: "2026-02-20" },
  { id: "inv-08", variant_id: "var-06", change_type: "restock", quantity_changed: 30, note: "Nhập lô mới tháng 2", created_at: "2026-02-20" },
  { id: "inv-09", variant_id: "var-13", change_type: "restock", quantity_changed: 25, note: "Nhập lô mới tháng 2", created_at: "2026-02-20" },
  { id: "inv-10", variant_id: "var-17", change_type: "restock", quantity_changed: 50, note: "Nhập lô lớn", created_at: "2026-02-18" },
  { id: "inv-11", variant_id: "var-19", change_type: "adjustment", quantity_changed: -5, note: "Hàng lỗi - huỷ", created_at: "2026-02-15" },
  { id: "inv-12", variant_id: "var-21", change_type: "restock", quantity_changed: 15, note: "Nhập hàng mùa Giáng sinh", created_at: "2026-02-10" },
];

// Attach relations
export const ordersWithDetails: Order[] = orders.map((o) => ({
  ...o,
  customer: customerMap[o.customer_id],
  items: orderItems
    .filter((i) => i.order_id === o.id)
    .map((i) => ({ ...i, variant: variantMap[i.variant_id] })),
  payments: payments.filter((p) => p.order_id === o.id),
}));

export const inventoryLogsWithDetails: InventoryLog[] = inventoryLogs.map((l) => ({
  ...l,
  variant: variantMap[l.variant_id],
}));

// =========================================
// CHART DATA
// =========================================

export const revenueData = [
  { name: "T2", revenue: 4200000, orders: 18 },
  { name: "T3", revenue: 5800000, orders: 24 },
  { name: "T4", revenue: 3900000, orders: 15 },
  { name: "T5", revenue: 7200000, orders: 32 },
  { name: "T6", revenue: 6500000, orders: 28 },
  { name: "T7", revenue: 8100000, orders: 35 },
  { name: "CN", revenue: 9500000, orders: 42 },
];

export const monthlyRevenue = [
  { name: "T1", revenue: 32000000, orders: 120 },
  { name: "T2", revenue: 38000000, orders: 145 },
  { name: "T3", revenue: 35000000, orders: 132 },
  { name: "T4", revenue: 42000000, orders: 168 },
  { name: "T5", revenue: 48000000, orders: 190 },
  { name: "T6", revenue: 44000000, orders: 175 },
  { name: "T7", revenue: 52000000, orders: 210 },
  { name: "T8", revenue: 58000000, orders: 235 },
  { name: "T9", revenue: 55000000, orders: 220 },
  { name: "T10", revenue: 62000000, orders: 250 },
  { name: "T11", revenue: 70000000, orders: 280 },
  { name: "T12", revenue: 85000000, orders: 340 },
];

export const categoryRevenue = [
  { name: "Nến thơm", value: 35, revenue: 156000000 },
  { name: "Set quà", value: 25, revenue: 112000000 },
  { name: "Xà phòng", value: 15, revenue: 67000000 },
  { name: "Tinh dầu", value: 12, revenue: 54000000 },
  { name: "Hoa khô", value: 8, revenue: 36000000 },
  { name: "Phụ kiện", value: 5, revenue: 22000000 },
];

// =========================================
// HELPERS
// =========================================

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

// Computed stats
export function getTotalStock(): number {
  return variants.reduce((s, v) => s + v.stock_quantity, 0);
}

export function getLowStockVariants(threshold = 5): ProductVariant[] {
  return variantsWithProduct.filter(
    (v) => v.stock_quantity <= threshold && v.stock_quantity > 0
  );
}

export function getOutOfStockVariants(): ProductVariant[] {
  return variantsWithProduct.filter((v) => v.stock_quantity === 0);
}
