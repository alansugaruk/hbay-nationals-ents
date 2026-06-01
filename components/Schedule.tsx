const events = [
  {
    day: "Sat",
    label: "Day 1",
    title: "Gear Setup & Warm-up",
    time: "16:00 – 20:00",
    act: "Background music & open sound testing",
    icon: "🎛️",
    note: null,
  },
  {
    day: "Sun",
    label: "Day 2",
    title: "Headline DJ Night",
    time: "18:00 – 20:00",
    act: "DJ Luke",
    icon: "🎧",
    note: "Open Decks warm-up 17:30–18:00",
  },
  {
    day: "Mon",
    label: "Day 3",
    title: "Hip Hop Karaoke + Karaoke",
    time: "18:00 – 20:00",
    act: "Guest Compere",
    icon: "🎤",
    note: "Open Decks warm-up 17:30–18:00",
  },
  {
    day: "Tue",
    label: "Day 4",
    title: "Live Band — End of Juniors Party",
    time: "18:00 – 20:00",
    act: "Shorefire (4-piece Rock/Pop)",
    icon: "🎸",
    note: "Open Decks warm-up 17:30–18:00",
  },
  {
    day: "Wed",
    label: "Day 5",
    title: "Rockaoke & Jam Session Open Mic",
    time: "18:00 – 20:00",
    act: "Backed live by members of Shorefire",
    icon: "🎵",
    note: "Acoustic open mic warm-up 17:30–18:00",
  },
  {
    day: "Thu",
    label: "Day 6",
    title: "Live Band Night 2",
    time: "18:00 – 20:00",
    act: "The Strutts (Live Cover Set)",
    icon: "🎸",
    note: "Open Decks warm-up 17:30–18:00",
  },
  {
    day: "Fri",
    label: "Day 7",
    title: "Silent Disco Finale",
    time: "18:00 – 20:00",
    act: "200 headsets — SSSilent Disco",
    icon: "🎶",
    note: "Headsets distributed from 17:30",
  },
];

export default function Schedule() {
  return (
    <section id="schedule" className="px-4 py-14 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-extrabold text-center mb-2">
        What&apos;s On
      </h2>
      <p className="text-slate-400 text-center text-sm mb-10">
        All events at the Beach Marquee · Hard curfew 20:00
      </p>

      <div className="flex flex-col gap-4">
        {events.map((e) => (
          <div
            key={e.day}
            className="flex gap-4 bg-white/5 rounded-2xl p-4 border border-white/10"
          >
            {/* Day badge */}
            <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center bg-cyan-500/10 rounded-xl py-2 px-1">
              <span className="text-cyan-400 font-extrabold text-lg leading-none">
                {e.day}
              </span>
              <span className="text-slate-500 text-xs mt-0.5">{e.label}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 flex-wrap">
                <span className="text-xl">{e.icon}</span>
                <h3 className="font-bold text-base leading-snug">{e.title}</h3>
              </div>
              <p className="text-cyan-400 text-sm mt-1">{e.act}</p>
              <p className="text-slate-500 text-xs mt-1">{e.time}</p>
              {e.note && (
                <p className="text-slate-600 text-xs mt-1 italic">{e.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
