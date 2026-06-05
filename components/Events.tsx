"use client";

import { useState } from "react";
import OpenDecksFormModal from "./OpenDecksFormModal";
import JamNightFormModal from "./JamNightFormModal";
import HipHopKaraokeFormModal from "./HipHopKaraokeFormModal";

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
    slug: "hbay-djs",
    day: "Sat",
    date: "15 Aug",
    time: "18:00 – 20:00",
    title: "H-Bay DJs",
    act: "H-Bay DJs",
    type: "DJ",
    image:
      "https://images.unsplash.com/photo-1660211934853-e33d8a02201d?w=800&q=80",
    bio: "Our favourite beach DJs get the party started",
  },
  {
    slug: "open-decks",
    day: "Sun",
    date: "16 Aug",
    time: "18:00 – 20:00",
    title: "Open Decks",
    act: "Got some tunes?  Come and DJ",
    type: "DJ",
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    bio: "The decks are open — come and play. Anyone can step up for a slot on the night. All genres welcome, all abilities encouraged.",
  },
  {
    slug: "hip-hop-karaoke",
    day: "Mon",
    date: "17 Aug",
    time: "18:00 – 20:00",
    title: "Hip Hop Karaoke",
    act: "Can you spit some rhymes?  You know you want to",
    type: "Hip-Hop-Karaoke",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    bio: "Pick your track, grab the mic, and rap it out. Big list of Hip-Hop tunes to choose from",
  },
  {
    slug: "shorefire",
    day: "Tue",
    date: "18 Aug",
    time: "18:00 – 20:00",
    title: "Shorefire - Live Band",
    act: "Probably the best surf life saving band in Holywell Bay, maybe the galaxy",
    type: "Live Band",
    image:
      "/shorefire2.png",
    bio: "Coolio to Dolly Parton via Michael Jackson and Rage Against The Machine.  This band exists to play beach parties",
  },
  {
    slug: "jam",
    day: "Wed",
    date: "19 Aug",
    time: "18:00 – 20:00",
    title: "Jam Night",
    act: "with help from house band Shorefire",
    type: "Rockaoke",
    image:
      "https://images.unsplash.com/photo-1546708770-589dab7b22c7?w=800&q=80",
    bio: "Want to sing a song with a live band?  Want to perform a song with some other musicians?  Sign up and choose a song.  Our house band Shorefire will fill in the gaps, or if you've got a whole band with you then go for it - the stage is yours...",
  },
  {
    slug: "the-strutts",
    day: "Thu",
    date: "20 Aug",
    time: "18:00 – 20:00",
    title: "The Strutts - Live Band",
    act: "The Strutts",
    type: "Live Band",
    image:
      "/thestrutts.jpg",
    bio: "Cornwall's best pop-disco-rock party band.  So sooo goood",
  },
  {
    slug: "silent-disco",
    day: "Fri",
    date: "21 Aug",
    time: "18:00 – 20:00",

    title: "Silent Disco",
    act: "Silent Disco",
    type: "Silent Disco",
    image:
      "/silent-disco.jpg",
    bio: "We all know what Silent Disco is right?  Even more fun with your toes in the sand",
  },
];

export default function Events() {
  const [open, setOpen] = useState<string | null>(null);
  const [djModalOpen, setDjModalOpen] = useState(false);
  const [jamModalOpen, setJamModalOpen] = useState(false);
  const [hhkModalOpen, setHhkModalOpen] = useState(false);

  const toggle = (slug: string) =>
    setOpen((prev) => (prev === slug ? null : slug));

  return (
    <section id="events" className="px-4 py-14 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-extrabold text-center mb-2">What&apos;s On</h2>
      <p className="text-slate-400 text-center text-sm mb-10">
        Warm-up from 16:00 · Main acts 18:00 – 20:00
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
                <p className="text-cyan-400 text-base mt-0.5">{e.act}</p>
                {e.warmup && (
                  <p className="text-slate-600 text-xs mt-1 italic">
                    {e.warmup}
                  </p>
                )}

                {/* Bio with expand */}
                {e.bio && (
                  <div className="mt-3 text-slate-300 text-base leading-relaxed">
                    <p>
                      {isOpen ? e.bio : e.bio.slice(0, 80).trimEnd()}
                      {!isOpen && e.bio.length > 80 && "…"}
                    </p>
                    {e.bio.length > 80 && (
                      <button
                        onClick={() => toggle(e.slug)}
                        className="mt-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        {isOpen ? "Show less" : "Show more…"}
                      </button>
                    )}
                  </div>
                )}

                {/* Register interest buttons */}
                {e.slug === "open-decks" && (
                  <button
                    onClick={() => setDjModalOpen(true)}
                    className="mt-4 w-full rounded-xl border border-cyan-400 text-cyan-400 font-semibold text-sm py-2 hover:bg-cyan-400 hover:text-[#0a1628] transition-colors"
                  >
                    Register your interest
                  </button>
                )}
                {e.slug === "jam" && (
                  <button
                    onClick={() => setJamModalOpen(true)}
                    className="mt-4 w-full rounded-xl border border-cyan-400 text-cyan-400 font-semibold text-sm py-2 hover:bg-cyan-400 hover:text-[#0a1628] transition-colors"
                  >
                    Register your interest
                  </button>
                )}
                {e.slug === "hip-hop-karaoke" && (
                  <button
                    onClick={() => setHhkModalOpen(true)}
                    className="mt-4 w-full rounded-xl border border-cyan-400 text-cyan-400 font-semibold text-sm py-2 hover:bg-cyan-400 hover:text-[#0a1628] transition-colors"
                  >
                    Register your interest
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <OpenDecksFormModal isOpen={djModalOpen} onClose={() => setDjModalOpen(false)} />
      <JamNightFormModal isOpen={jamModalOpen} onClose={() => setJamModalOpen(false)} />
      <HipHopKaraokeFormModal isOpen={hhkModalOpen} onClose={() => setHhkModalOpen(false)} />
    </section>
  );
}
