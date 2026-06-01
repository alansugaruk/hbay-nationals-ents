export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-end overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://www.holywellbayslsc.co.uk/wp-content/uploads/2024/11/KAVS-Main_Emblem-sliders_Hbay-1-copy.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/60 to-transparent" />

      <div className="relative z-10 w-full px-5 pb-12 pt-8 max-w-2xl mx-auto text-center">
        <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">
          SLSGB Nationals 2026
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-4">
          H-Bay Ents
        </h1>
        <p className="text-slate-300 text-base sm:text-lg mb-2">
          Beach Marquee · Holywell Bay
        </p>
        <p className="text-slate-400 text-sm mb-8">
          Every evening 18:00 – 20:00 · 15–21 August 2026
        </p>
        <a
          href="#events"
          className="inline-block bg-cyan-500 hover:bg-cyan-400 text-[#0a1628] font-bold px-8 py-3 rounded-full text-sm uppercase tracking-wider transition-colors"
        >
          See What&apos;s On
        </a>
      </div>
    </section>
  );
}
