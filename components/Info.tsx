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
    a: "Music runs on the beach from 4pm to 8pm each evening",
  },
  {
    q: "Will there be food and drink?",
    a: "Yes — we'll keep serving food and drink right through the evening entertainment in the beach village",
  },
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
            <p className="font-semibold text-base text-cyan-400 mb-1">{q}</p>
            <p className="text-slate-300 text-base leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

    </section>
  );
}
