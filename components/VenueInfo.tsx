const details = [
  {
    icon: "📍",
    heading: "Location",
    body: "Beach Marquee, Holywell Bay, Cornwall, TR8 5PW. Follow championship signage from the car park.",
  },
  {
    icon: "🕕",
    heading: "Doors & Timings",
    body: "Bar opens 17:00. Warm-up acts from 17:30. Main act 18:00–20:00. Hard curfew 20:00 — no exceptions.",
  },
  {
    icon: "🚌",
    heading: "Shuttle Bus",
    body: "Free shuttle runs between the HQ campsite and the beach marquee from 17:00, with final return at 20:30.",
  },
  {
    icon: "🅿️",
    heading: "Parking",
    body: "Holywell Bay car park is a short walk from the marquee. Overflow parking at the farm field — follow marshals.",
  },
  {
    icon: "🍺",
    heading: "Bar",
    body: "Licensed bar open from 17:00. Card and cash accepted. No glass beyond the marquee perimeter. Proof of age may be required.",
  },
  {
    icon: "♿",
    heading: "Accessibility",
    body: "Firm matted floor and level entry. For specific access needs contact the championships office in advance.",
  },
];

export default function VenueInfo() {
  return (
    <section className="px-4 py-14 max-w-2xl mx-auto w-full">
      <div className="border-t border-white/10 mb-14" />

      <h2 className="text-2xl font-extrabold text-center mb-2">
        Venue &amp; Practical Info
      </h2>
      <p className="text-slate-400 text-center text-sm mb-10">
        Everything you need to find us and plan your evening
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {details.map(({ icon, heading, body }) => (
          <div
            key={heading}
            className="bg-white/5 rounded-2xl p-5 border border-white/10 flex gap-3"
          >
            <span className="text-2xl flex-shrink-0 mt-0.5">{icon}</span>
            <div>
              <p className="font-semibold text-sm mb-1">{heading}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Map embed placeholder */}
      <div className="rounded-2xl overflow-hidden border border-white/10 h-56 bg-white/5 flex items-center justify-center">
        <a
          href="https://maps.google.com/?q=Holywell+Bay,+Cornwall,+TR8+5PW"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <span className="text-3xl">🗺️</span>
          <span className="text-sm font-medium">Open in Google Maps</span>
          <span className="text-xs text-slate-600">Holywell Bay, TR8 5PW</span>
        </a>
      </div>
    </section>
  );
}
