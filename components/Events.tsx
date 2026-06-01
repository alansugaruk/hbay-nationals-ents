"use client";

import { useState } from "react";

type Event = {
  slug: string;
  day: string;
  date: string;
  time: string;
  warmup?: string;
  title: string;
  act: string;
  type: string;
  image: string;
  bio: string;
};

const events: Event[] = [
  {
    slug: "dj-luke",
    day: "Sat",
    date: "15 Aug",
    time: "18:00 – 20:00",
    warmup: "Open Decks 17:30 – 18:00",
    title: "Headline DJ Night",
    act: "DJ Luke",
    type: "DJ",
    image:
      "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80",
    bio: "Cornwall's go-to DJ for beach events — a high-energy set spanning house, garage, and anthems guaranteed to get the marquee moving.",
  },
  {
    slug: "open-decks",
    day: "Sun",
    date: "16 Aug",
    time: "18:00 – 20:00",
    title: "Open Decks",
    act: "Community DJ Night",
    type: "DJ",
    image:
      "https://images.unsplash.com/photo-1598387993441-a364f854cca7?w=800&q=80",
    bio: "The decks are open — come and play. Anyone can step up for a slot on the night. All genres welcome, all abilities encouraged.",
  },
  {
    slug: "hip-hop-karaoke",
    day: "Mon",
    date: "17 Aug",
    time: "18:00 – 20:00",
    warmup: "Open Decks 17:30 – 18:00",
    title: "Hip Hop Karaoke",
    act: "Guest Compere",
    type: "Karaoke",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    bio: "Pick your track, grab the mic, and rap it out in front of the marquee. Guest compere keeps the energy high. Classic hip hop anthems from the 90s to now.",
  },
  {
    slug: "shorefire",
    day: "Tue",
    date: "18 Aug",
    time: "18:00 – 20:00",
    warmup: "Open Decks 17:30 – 18:00",
    title: "Live Band Night",
    act: "Shorefire",
    type: "Live Band",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    bio: "4-piece rock/pop covers band from the South West. Huge crowd-pleasers — think Foo Fighters to Dua Lipa via Kings of Leon.",
  },
  {
    slug: "rockaoke",
    day: "Wed",
    date: "19 Aug",
    time: "18:00 – 20:00",
    warmup: "Acoustic open mic 17:30 – 18:00",
    title: "Rockaoke & Jam Session",
    act: "Backed live by Shorefire",
    type: "Rockaoke",
    image:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    bio: "You sing it, the band plays it. Choose your rock anthem and get up on stage with a live band behind you. Open mic jam session from 17:30.",
  },
  {
    slug: "the-strutts",
    day: "Thu",
    date: "20 Aug",
    time: "18:00 – 20:00",
    warmup: "Open Decks 17:30 – 18:00",
    title: "Live Band Night 2",
    act: "The Strutts",
    type: "Live Band",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    bio: "High-octane live cover set with a rock edge. The Strutts bring the energy back for the penultimate evening of championships week.",
  },
  {
    slug: "silent-disco",
    day: "Fri",
    date: "21 Aug",
    time: "18:00 – 20:00",
    warmup: "Headsets from 17:30",
    title: "Silent Disco Finale",
    act: "200 headsets · Three channels",
    type: "Silent Disco",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
    bio: "200 wireless headsets, three channels, one beach marquee. The perfect send-off for championships week — dance your way out.",
  },
];

export default function Events() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (slug: string) =>
    setOpen((prev) => (prev === slug ? null : slug));

  return (
    <section id="events" className="px-4 py-14 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-extrabold text-center mb-2">What&apos;s On</h2>
      <p className="text-slate-400 text-center text-sm mb-10">
        Beach Marquee · All events 18:00 – 20:00 · Hard curfew 20:00
      </p>

      <div className="flex flex-col gap-5">
        {events.map((e) => {
          const isOpen = open === e.slug;
          return (
            <div
              key={e.slug}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/5"
            >
              {/* Photo strip */}
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={e.image}
                  alt={e.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-[#0a1628]/60 px-2 py-0.5 rounded-full">
                  {e.type}
                </span>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-cyan-400 text-xs font-semibold">
                    {e.day} · {e.date}
                  </span>
                  <span className="text-slate-500 text-xs">{e.time}</span>
                </div>
                <h3 className="font-extrabold text-base leading-snug">
                  {e.title}
                </h3>
                <p className="text-cyan-400 text-sm mt-0.5">{e.act}</p>
                {e.warmup && (
                  <p className="text-slate-600 text-xs mt-1 italic">
                    {e.warmup}
                  </p>
                )}

                {/* Expand toggle */}
                <button
                  onClick={() => toggle(e.slug)}
                  className="mt-3 flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <span>{isOpen ? "Less info" : "More info"}</span>
                  <span
                    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>

                {/* Expanded bio */}
                {isOpen && (
                  <p className="mt-3 text-slate-300 text-sm leading-relaxed border-t border-white/10 pt-3">
                    {e.bio}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
