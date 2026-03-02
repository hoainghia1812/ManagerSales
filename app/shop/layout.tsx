import { ShopHeader } from "@/components/layout/ShopHeader";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-50">
      <ShopHeader />
      <main>{children}</main>
      <footer className="bg-brand-700 text-brand-300 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="font-serif text-xl font-bold text-brand-100 mb-2">
                MUSH & CO.
              </h3>
              <p className="text-sm text-brand-400 italic">
                The Luxury of Giving
              </p>
              <p className="text-sm mt-3 leading-relaxed">
                Sản phẩm thủ công cao cấp, mỗi món quà đều chứa đựng tâm
                huyết và sự tinh tế.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-brand-100 mb-3 text-sm uppercase tracking-wider">
                Sản phẩm
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-100 transition-colors">Nến thơm</a></li>
                <li><a href="#" className="hover:text-brand-100 transition-colors">Quà tặng</a></li>
                <li><a href="#" className="hover:text-brand-100 transition-colors">Tinh dầu</a></li>
                <li><a href="#" className="hover:text-brand-100 transition-colors">Xà phòng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-brand-100 mb-3 text-sm uppercase tracking-wider">
                Hỗ trợ
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-brand-100 transition-colors">Hướng dẫn mua hàng</a></li>
                <li><a href="#" className="hover:text-brand-100 transition-colors">Chính sách đổi trả</a></li>
                <li><a href="#" className="hover:text-brand-100 transition-colors">Vận chuyển</a></li>
                <li><a href="#" className="hover:text-brand-100 transition-colors">Liên hệ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-brand-100 mb-3 text-sm uppercase tracking-wider">
                Liên hệ
              </h4>
              <ul className="space-y-2 text-sm">
                <li>TP. Hồ Chí Minh, Việt Nam</li>
                <li>hello@mushco.vn</li>
                <li>0901 234 567</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-600/50 mt-8 pt-6 text-center text-xs text-brand-500">
            &copy; 2026 MUSH & CO. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
