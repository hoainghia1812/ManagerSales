export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image?: string;
  isHandmade: boolean;
  isNew: boolean;
  description: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  date: string;
  address: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  lastOrder: string;
  avatar?: string;
}

export const statusLabels: Record<string, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã huỷ",
};

export const statusVariants: Record<string, string> = {
  pending: "warning",
  processing: "info",
  shipping: "info",
  completed: "success",
  cancelled: "error",
};

export const categories = [
  "Tất cả",
  "Nến thơm",
  "Quà tặng",
  "Xà phòng",
  "Tinh dầu",
  "Hoa khô",
  "Set quà",
  "Phụ kiện",
];

export const products: Product[] = [
  {
    id: "SP001",
    name: "Nến thơm Lavender Dreams",
    category: "Nến thơm",
    price: 350000,
    stock: 24,
    sold: 156,
    isHandmade: true,
    isNew: false,
    description: "Nến thơm thủ công hương lavender, đổ tay 100%",
  },
  {
    id: "SP002",
    name: "Set quà tặng Premium Rose",
    category: "Set quà",
    price: 890000,
    stock: 12,
    sold: 89,
    isHandmade: true,
    isNew: true,
    description: "Bộ quà tặng cao cấp với hoa hồng khô và nến thơm",
  },
  {
    id: "SP003",
    name: "Xà phòng Honey & Oat",
    category: "Xà phòng",
    price: 120000,
    stock: 56,
    sold: 234,
    isHandmade: true,
    isNew: false,
    description: "Xà phòng handmade mật ong và yến mạch",
  },
  {
    id: "SP004",
    name: "Tinh dầu Eucalyptus",
    category: "Tinh dầu",
    price: 280000,
    stock: 38,
    sold: 112,
    isHandmade: true,
    isNew: false,
    description: "Tinh dầu bạch đàn nguyên chất 100%",
  },
  {
    id: "SP005",
    name: "Hoa khô Bouquet Vintage",
    category: "Hoa khô",
    price: 450000,
    stock: 8,
    sold: 67,
    isHandmade: true,
    isNew: true,
    description: "Bó hoa khô phong cách vintage, sấy thủ công",
  },
  {
    id: "SP006",
    name: "Nến thơm Vanilla Bean",
    category: "Nến thơm",
    price: 320000,
    stock: 31,
    sold: 198,
    isHandmade: true,
    isNew: false,
    description: "Nến thơm vanilla bean trong hũ thuỷ tinh thủ công",
  },
  {
    id: "SP007",
    name: "Set quà Tết An Khang",
    category: "Set quà",
    price: 1250000,
    stock: 5,
    sold: 45,
    isHandmade: true,
    isNew: true,
    description: "Set quà Tết cao cấp - nến, tinh dầu, xà phòng, hoa khô",
  },
  {
    id: "SP008",
    name: "Xà phòng Charcoal Detox",
    category: "Xà phòng",
    price: 135000,
    stock: 42,
    sold: 178,
    isHandmade: true,
    isNew: false,
    description: "Xà phòng than hoạt tính thải độc da",
  },
  {
    id: "SP009",
    name: "Túi thơm Lavender Sachet",
    category: "Phụ kiện",
    price: 85000,
    stock: 67,
    sold: 312,
    isHandmade: true,
    isNew: false,
    description: "Túi thơm lavender thiên nhiên, may tay thủ công",
  },
  {
    id: "SP010",
    name: "Nến thơm Cinnamon Spice",
    category: "Nến thơm",
    price: 380000,
    stock: 19,
    sold: 87,
    isHandmade: true,
    isNew: true,
    description: "Nến thơm quế và gia vị, hương Giáng sinh ấm áp",
  },
  {
    id: "SP011",
    name: "Hoa khô Mini Arrangement",
    category: "Hoa khô",
    price: 250000,
    stock: 22,
    sold: 134,
    isHandmade: true,
    isNew: false,
    description: "Chậu hoa khô mini trang trí bàn làm việc",
  },
  {
    id: "SP012",
    name: "Tinh dầu Tea Tree",
    category: "Tinh dầu",
    price: 260000,
    stock: 45,
    sold: 145,
    isHandmade: true,
    isNew: false,
    description: "Tinh dầu tràm trà nguyên chất, kháng khuẩn tự nhiên",
  },
];

export const orders: Order[] = [
  {
    id: "DH001",
    customer: "Nguyễn Thị Minh Anh",
    email: "minhanh@email.com",
    phone: "0901234567",
    product: "Nến thơm Lavender Dreams",
    items: 2,
    total: 700000,
    status: "completed",
    date: "2026-02-28",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
  },
  {
    id: "DH002",
    customer: "Trần Văn Hoàng",
    email: "hoang.tv@email.com",
    phone: "0912345678",
    product: "Set quà tặng Premium Rose",
    items: 1,
    total: 890000,
    status: "shipping",
    date: "2026-02-27",
    address: "45 Lê Lợi, Q.3, TP.HCM",
  },
  {
    id: "DH003",
    customer: "Lê Thị Thu Hà",
    email: "thuha.le@email.com",
    phone: "0923456789",
    product: "Xà phòng Honey & Oat x3",
    items: 3,
    total: 360000,
    status: "processing",
    date: "2026-02-27",
    address: "78 Hai Bà Trưng, Q.1, TP.HCM",
  },
  {
    id: "DH004",
    customer: "Phạm Đức Trung",
    email: "trung.pd@email.com",
    phone: "0934567890",
    product: "Set quà Tết An Khang",
    items: 1,
    total: 1250000,
    status: "pending",
    date: "2026-02-26",
    address: "12 Pasteur, Q.1, TP.HCM",
  },
  {
    id: "DH005",
    customer: "Hoàng Thị Lan",
    email: "lan.ht@email.com",
    phone: "0945678901",
    product: "Tinh dầu Eucalyptus",
    items: 2,
    total: 560000,
    status: "completed",
    date: "2026-02-26",
    address: "56 Võ Văn Tần, Q.3, TP.HCM",
  },
  {
    id: "DH006",
    customer: "Võ Minh Khôi",
    email: "khoi.vm@email.com",
    phone: "0956789012",
    product: "Hoa khô Bouquet Vintage",
    items: 1,
    total: 450000,
    status: "cancelled",
    date: "2026-02-25",
    address: "89 Điện Biên Phủ, Bình Thạnh, TP.HCM",
  },
  {
    id: "DH007",
    customer: "Đỗ Thị Hương",
    email: "huong.dt@email.com",
    phone: "0967890123",
    product: "Nến thơm Vanilla Bean x2",
    items: 2,
    total: 640000,
    status: "completed",
    date: "2026-02-25",
    address: "34 Nguyễn Đình Chiểu, Q.3, TP.HCM",
  },
  {
    id: "DH008",
    customer: "Bùi Anh Tuấn",
    email: "tuan.ba@email.com",
    phone: "0978901234",
    product: "Túi thơm Lavender Sachet x5",
    items: 5,
    total: 425000,
    status: "shipping",
    date: "2026-02-24",
    address: "67 Cách Mạng Tháng 8, Q.10, TP.HCM",
  },
  {
    id: "DH009",
    customer: "Nguyễn Thanh Tùng",
    email: "tung.nt@email.com",
    phone: "0989012345",
    product: "Xà phòng Charcoal Detox x2",
    items: 2,
    total: 270000,
    status: "completed",
    date: "2026-02-24",
    address: "90 Trần Hưng Đạo, Q.5, TP.HCM",
  },
  {
    id: "DH010",
    customer: "Trương Thị Mai",
    email: "mai.tt@email.com",
    phone: "0990123456",
    product: "Set quà tặng Premium Rose",
    items: 1,
    total: 890000,
    status: "processing",
    date: "2026-02-23",
    address: "23 Lý Tự Trọng, Q.1, TP.HCM",
  },
];

export const customers: Customer[] = [
  {
    id: "KH001",
    name: "Nguyễn Thị Minh Anh",
    email: "minhanh@email.com",
    phone: "0901234567",
    totalOrders: 12,
    totalSpent: 8500000,
    joinDate: "2025-06-15",
    lastOrder: "2026-02-28",
  },
  {
    id: "KH002",
    name: "Trần Văn Hoàng",
    email: "hoang.tv@email.com",
    phone: "0912345678",
    totalOrders: 8,
    totalSpent: 6200000,
    joinDate: "2025-08-20",
    lastOrder: "2026-02-27",
  },
  {
    id: "KH003",
    name: "Lê Thị Thu Hà",
    email: "thuha.le@email.com",
    phone: "0923456789",
    totalOrders: 15,
    totalSpent: 12300000,
    joinDate: "2025-03-10",
    lastOrder: "2026-02-27",
  },
  {
    id: "KH004",
    name: "Phạm Đức Trung",
    email: "trung.pd@email.com",
    phone: "0934567890",
    totalOrders: 5,
    totalSpent: 4800000,
    joinDate: "2025-09-05",
    lastOrder: "2026-02-26",
  },
  {
    id: "KH005",
    name: "Hoàng Thị Lan",
    email: "lan.ht@email.com",
    phone: "0945678901",
    totalOrders: 20,
    totalSpent: 15600000,
    joinDate: "2025-01-22",
    lastOrder: "2026-02-26",
  },
  {
    id: "KH006",
    name: "Võ Minh Khôi",
    email: "khoi.vm@email.com",
    phone: "0956789012",
    totalOrders: 3,
    totalSpent: 1850000,
    joinDate: "2025-11-18",
    lastOrder: "2026-02-25",
  },
  {
    id: "KH007",
    name: "Đỗ Thị Hương",
    email: "huong.dt@email.com",
    phone: "0967890123",
    totalOrders: 9,
    totalSpent: 7200000,
    joinDate: "2025-07-30",
    lastOrder: "2026-02-25",
  },
  {
    id: "KH008",
    name: "Bùi Anh Tuấn",
    email: "tuan.ba@email.com",
    phone: "0978901234",
    totalOrders: 6,
    totalSpent: 3400000,
    joinDate: "2025-10-12",
    lastOrder: "2026-02-24",
  },
];

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

export const recentOrders = orders.slice(0, 5).map((o) => ({
  id: o.id,
  customer: o.customer,
  product: o.product,
  total: formatCurrency(o.total),
  status: statusLabels[o.status],
  statusType: statusVariants[o.status],
  date: o.date,
}));

export const topProducts = [
  { name: "Túi thơm Lavender Sachet", sold: 312, revenue: "26,520,000đ" },
  { name: "Xà phòng Honey & Oat", sold: 234, revenue: "28,080,000đ" },
  { name: "Nến thơm Vanilla Bean", sold: 198, revenue: "63,360,000đ" },
  { name: "Xà phòng Charcoal Detox", sold: 178, revenue: "24,030,000đ" },
  { name: "Nến thơm Lavender Dreams", sold: 156, revenue: "54,600,000đ" },
];

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
