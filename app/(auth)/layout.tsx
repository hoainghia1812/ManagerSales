import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-brand-50">
      {/* Left panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-700 relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-brand-400" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-brand-900" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-400" />
        </div>

        <div className="relative z-10 text-center">
          <Image
            src="/logo.png"
            alt="MUSH&CO."
            width={80}
            height={80}
            className="mx-auto rounded-2xl brightness-200 mb-6"
          />
          <h1 className="font-serif text-4xl font-bold text-brand-100 tracking-wide">
            MUSH&CO.
          </h1>
          <p className="text-brand-400 italic mt-2 text-lg tracking-widest">
            The Luxury of Giving
          </p>
          <div className="w-16 h-0.5 bg-brand-400/50 mx-auto my-8" />
          <p className="text-brand-300 text-sm max-w-xs leading-relaxed">
            Hệ thống quản lý bán hàng thương hiệu handmade cao cấp.
            Mỗi sản phẩm là một tác phẩm nghệ thuật.
          </p>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <Image
              src="/logo.png"
              alt="MUSH&CO."
              width={56}
              height={56}
              className="rounded-xl"
            />
            <span className="font-serif text-xl font-bold text-brand-700 tracking-wide">
              MUSH&CO.
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">{children}</div>

        <p className="mt-8 text-xs text-brand-400 text-center">
          &copy; 2026 MUSH&CO. All rights reserved.
        </p>
      </div>
    </div>
  );
}
