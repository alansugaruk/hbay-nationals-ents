export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1200&q=80')",
        }}
      />
      {/* Gradient overlay — dark at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />

      <div className="relative z-10 w-full px-5 pb-12 pt-8 max-w-2xl mx-auto text-center">
        <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">
          SLSGB Nationals 2026
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          Après-Surf
          <br />
          <span className="text-cyan-400">Evening Entertainment</span>
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mb-2">
          Beach Marquee · Holywell Bay
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Every evening 18:00 – 20:00 · Championships Week · Late August
        </p>
        <a
          href="#schedule"
          className="inline-block bg-cyan-500 hover:bg-cyan-400 text-[#0a1628] font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wider transition-colors"
        >
          See the Schedule
        </a>
      </div>
    </section>
  );
}
