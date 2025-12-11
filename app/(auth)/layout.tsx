export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between bg-zinc-900 p-12 text-white">
        <div>
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-10 w-auto brightness-0 invert"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-serif font-medium leading-tight">
            AI-Powered Content Generation for Modern Jewelry Brands
          </h1>
          <p className="text-zinc-400 text-lg">
            Create stunning product descriptions, staging images, and social
            posts in seconds.
          </p>
        </div>
        <div className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Kate Crawford Jewelry
        </div>
      </div>

      {/* Right: Content (Login Form) */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
