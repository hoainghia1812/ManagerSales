import { ProductUpsertForm } from "@/components/product/ProductUpsertForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-semibold text-brand-700">
          Thêm sản phẩm mới
        </h1>
        <p className="text-brand-500 mt-1">
          Upload ảnh, tạo sản phẩm và biến thể đầu tiên.
        </p>
      </div>

      <ProductUpsertForm mode="create" />
    </div>
  );
}

