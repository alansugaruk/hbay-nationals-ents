const details = [
  {
    icon: "📍",
    heading: "Location",
    body: "Beach Marquee, Holywell Bay, Cornwall, TR8 5PW. Follow championship signage from the car park.",
  },
  {
    icon: "🚌",
    heading: "Shuttle Bus",
    body: "Free shuttle runs between Trevornick Campsite and the beach marquee from 17:00, with final return at 20:30.",
  },
  {
    icon: "🅿️",
    heading: "Parking",
    body: "Trevornick Campsite is a short walk from the marquee.",
  },
  {
    icon: "🍺",
    heading: "Bar",
    body: "Licensed bar serving drinks throughout the evening. Card and cash accepted.",
  },
];

export default function VenueInfo() {
  return (
    <section className="px-4 py-14 max-w-2xl mx-auto w-full">
      <div className="border-t border-white/10 mb-14" />

      <h2 className="text-2xl font-extrabold text-center mb-2">
        Venue &amp; Getting There
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
              <p className="font-semibold text-base mb-1">{heading}</p>
              <p className="text-slate-400 text-base leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <iframe
        src="https://maps.google.com/maps?q=Holywell+Bay,+Cornwall,+TR8+5PW&t=&z=14&ie=UTF8&iwloc=&output=embed"
        className="w-full h-64 rounded-2xl border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Holywell Bay map"
      />
    </section>
  );
}
