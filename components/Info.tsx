const faqs = [
  {
    q: "Where is the Beach Marquee?",
    a: "The marquee is located directly on the beach at Holywell Bay, Cornwall next to the surf life saving club hut",
  },
  {
    q: "Do I need a ticket?",
    a: "Nope. All evening entertainment is free to attend and open to all",
  },
  {
    q: "What time do events start and finish?",
    a: "Main acts run 18:00–20:00 each evening",
  }
];

export default function Info() {
  return (
    <section className="px-4 py-14 max-w-2xl mx-auto w-full">
      {/* Divider */}
      <div className="border-t border-white/10 mb-14" />

      <h2 className="text-2xl font-extrabold text-center mb-2">
        Good to Know
      </h2>
      <p className="text-slate-400 text-center text-sm mb-10">
        Frequently asked questions about the entertainment programme
      </p>

      <div className="flex flex-col gap-4">
        {faqs.map(({ q, a }) => (
          <div
            key={q}
            className="bg-white/5 rounded-2xl p-5 border border-white/10"
          >
            <p className="font-semibold text-sm text-cyan-400 mb-1">{q}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
