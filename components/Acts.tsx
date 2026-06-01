const acts = [
  {
    name: "DJ Luke",
    type: "DJ",
    night: "Sunday",
    bio: "Cornwall's go-to DJ for beach events — a high-energy set spanning house, garage, and anthems guaranteed to get the marquee moving.",
    image:
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80",
  },
  {
    name: "Shorefire",
    type: "Live Band",
    night: "Tuesday & Wednesday",
    bio: "4-piece rock/pop covers band from the South West. Huge crowd-pleasers — think Foo Fighters to Dua Lipa via Kings of Leon.",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
  },
  {
    name: "The Strutts",
    type: "Live Band",
    night: "Thursday",
    bio: "High-octane live cover set with a rock edge. If Tuesday night wasn't enough, The Strutts bring the energy back for the penultimate evening.",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  },
  {
    name: "SSSilent Disco",
    type: "Silent Disco",
    night: "Friday",
    bio: "200 wireless headsets, three channels, one beach marquee. The perfect send-off for championships week — dance your way out.",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
  },
];

export default function Acts() {
  return (
    <section className="px-4 py-14 max-w-2xl mx-auto w-full">
      <div className="border-t border-white/10 mb-14" />

      <h2 className="text-2xl font-extrabold text-center mb-2">The Acts</h2>
      <p className="text-slate-400 text-center text-sm mb-10">
        Performers confirmed for championships week
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {acts.map((act) => (
          <div
            key={act.name}
            className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex flex-col"
          >
            <div className="relative h-44 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={act.image}
                alt={act.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-[#0a1628]/60 px-2 py-0.5 rounded-full">
                {act.type}
              </span>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-extrabold text-base mb-0.5">{act.name}</h3>
              <p className="text-cyan-400 text-xs mb-2">{act.night}</p>
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                {act.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
