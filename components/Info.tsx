const faqs = [
  {
    q: "Where is the Beach Marquee?",
    a: "The marquee is located directly on the beach at Holywell Bay, Cornwall — follow signs from the championship HQ.",
  },
  {
    q: "Do I need a ticket?",
    a: "All evening entertainment is free to attend for competitors, officials, and supporters. No ticket or wristband required.",
  },
  {
    q: "What time do events start and finish?",
    a: "Main acts run 18:00–20:00 each evening. Warm-up acts typically start at 17:30. A hard curfew of 20:00 applies on all nights.",
  },
  {
    q: "Is there a bar?",
    a: "Yes — the Beach Marquee bar opens from 17:00. ID may be required. No glass beyond the marquee perimeter.",
  },
  {
    q: "Can I bring my own headset for the Silent Disco?",
    a: "No — you must use one of the 200 SSSilent Disco headsets provided. Headset distribution begins at 17:30 on the Friday.",
  },
  {
    q: "Is the venue accessible?",
    a: "The marquee has a firm matted floor and level entry. Contact the championships office in advance if you need specific access support.",
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
            <p className="font-semibold text-sm text-cyan-400 mb-1">{q}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{a}</p>
          </div>
        ))}
      </div>

      {/* Contact callout */}
      <div className="mt-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 p-6 text-center">
        <p className="text-cyan-300 font-semibold mb-1">Got a question?</p>
        <p className="text-slate-400 text-sm">
          Email the entertainment team at{" "}
          <a
            href="mailto:ents@hbaynationalsents.co.uk"
            className="text-cyan-400 underline underline-offset-2"
          >
            ents@hbaynationalsents.co.uk
          </a>
        </p>
      </div>
    </section>
  );
}
