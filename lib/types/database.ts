// Row types matching Supabase schema exactly

export type Category = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  category_id: string | null;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductWithDetails = Product & {
  categories: Category | null;
  product_variants: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  product_id: string;
  sku: string | null;
  color: string | null;
  size: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  created_at: string;
};

export type VariantWithProduct = ProductVariant & {
  products: Product | null;
};

export type Customer = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  created_at: string;
};

export type Order = {
  id: string;
  customer_id: string | null;
  order_code: string | null;
  status: string;
  total_amount: number;
  payment_status: string;
  note: string | null;
  created_at: string;
};

export type OrderWithDetails = Order & {
  customers: Customer | null;
  order_items: OrderItemWithVariant[];
  payments: Payment[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  created_at: string;
};

export type OrderItemWithVariant = OrderItem & {
  product_variants: VariantWithProduct | null;
};

export type Payment = {
  id: string;
  order_id: string;
  method: string | null;
  amount: number | null;
  status: string;
  paid_at: string | null;
  created_at: string;
};

export type InventoryLog = {
  id: string;
  variant_id: string;
  change_type: string | null;
  quantity_changed: number | null;
  note: string | null;
  created_at: string;
};

export type InventoryLogWithVariant = InventoryLog & {
  product_variants: VariantWithProduct | null;
};

// API response types
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiListResponse<T> = {
  data: T[];
  pagination: PaginationMeta;
};

export type ApiResponse<T> = {
  data: T;
};

export type ApiError = {
  error: string;
  details?: string;
};
