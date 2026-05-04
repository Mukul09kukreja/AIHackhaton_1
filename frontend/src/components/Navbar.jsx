import { Bell, Settings } from 'lucide-react';

const navItems = ['FILES', 'INSIGHTS', 'AUTOMATIONS', 'VAULT'];

export default function Navbar() {
  return (
    <header className="relative z-20 px-4 pt-6">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between rounded-3xl border border-cyan-200/15 bg-black/55 px-6 py-4 shadow-[0_0_40px_rgba(8,145,178,0.15)] backdrop-blur-xl">
        <h1 className="text-3xl font-semibold tracking-[0.2em] text-white">AETHERFILE</h1>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item, i) => (
            <button key={item} className={`text-sm tracking-wider ${i === 0 ? 'text-white underline underline-offset-8' : 'text-white/50'}`}>{item}</button>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-white/80">
          <Bell size={18} />
          <Settings size={18} />
        </div>
      </div>
    </header>
  );
}
