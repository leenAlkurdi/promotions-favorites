import { LanguageToggle } from "@/components/Navbar/LanguageToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-center text-zinc-900">
      <div className="max-w-xl space-y-4">
        <h1 className="text-3xl font-semibold">Promotions Favorites</h1>
        <p className="text-base text-zinc-600">
          Frontend setup complete. Next step: build promotions and favorites UI.
        </p>
        <div className="flex justify-center pt-4">
          {/* <LanguageToggle /> */}
        </div>

      </div>
    </main>
  );
}
