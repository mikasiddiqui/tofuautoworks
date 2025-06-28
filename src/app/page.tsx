import Image from "next/image";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center gap-6 py-6">

      {/* HEADER */}
      <Card>
        <div className="flex flex-col items-center gap-3 p-5">
          <Image src="logo.webp" alt="Tofu Auto Works" width={260} height={95} />
          <nav className="flex gap-6 text-md font-bold tracking-wide uppercase">
            {["Home", "Products", "About", "Contact"].map((t) => (
              <a key={t} href="#" className="hover:underline">{t}</a>
            ))}
          </nav>
        </div>
      </Card>

      {/* GRID  (1-col < lg  |  3-col ≥ lg) */}
      <section className="
        w-full max-w-6xl
        grid gap-6
        grid-cols-1
        lg:grid-cols-[200px_minmax(0,1fr)_220px]
      ">

        {/* LEFT  (desktop only) */}
        <Card className="hidden lg:block sticky top-8 h-fit p-4">
        <p className="text-[16px] font-bold tracking-[0.02em] mb-2">NOW PLAYING</p>
        <div className="h-32 flex items-center justify-center text-xs bg-[--card-foreground]/20">
            MP3 Widget
          </div>
        </Card>

        {/* MIDDLE  (always) */}
        <div className="flex flex-col gap-6 overflow-y-auto overscroll-contain pr-2">
          {[1, 2, 3].map((n) => (
            <Card key={n}>
              <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
                <Image
                  src={`/placeholder-${n}.jpg`}
                  alt=""
                  width={800}
                  height={450}
                  className="w-full"
                />
                <h2 className="text-2xl font-bold tracking-tight">Blog Post #{n}</h2>
                <p className="text-sm">Lorem ipsum dolor sit amet…</p>
                <Button><a href="#">Read more →</a></Button>
              </div>
            </Card>
          ))}
        </div>

        {/* RIGHT  (desktop only) */}
        <div className="hidden lg:flex lg:flex-col lg:gap-6">

          <Card className="sticky top-8 w-[220px] p-4 self-start">
            <p className="text-[16px] font-bold tracking-[0.02em] mb-2">ARCHIVE</p>
            {["2025", "2024", "2023", "2022"].map((y) => (
              <a key={y} href="#" className="block text-sm hover:underline">{y}</a>
            ))}
          </Card>

          <Card className="sticky top-52 w-[220px] p-4 self-start">
          <p className="text-[16px] font-bold tracking-[0.02em] mb-2">SPONSORS</p>
          <div className="space-y-3">
              <div className="h-12 bg-[--card-foreground]/20" />
              <div className="h-12 bg-[--card-foreground]/20" />
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
