"use client";

import { useState } from "react";
import VolunteerFormModal from "./VolunteerFormModal";

type Role = {
  slug: string;
  title: string;
  badge: string;
  when: string;
  target: string;
  image: string;
  description: string;
};

const roles: Role[] = [
  {
    slug: "stage-hands",
    title: "Stage Hands / Runners",
    badge: "Technical",
    when: "Band nights · 16:00 – 17:30",
    target: "At least 2",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    description:
      "Heavy lifting across the sand, routing cables, and helping bands load in before doors open. Essential on the nights we have a live act.",
  },
  {
    slug: "sound-apprentices",
    title: "Sound Engineering Apprentices",
    badge: "Youth Development",
    when: "All week",
    target: "At least 2",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80",
    description:
      "A youth development opportunity for school or college-aged club members. You'll shadow the sound engineers all week, getting hands-on experience setting up and running the tech for a variety of live events. No experience needed, just enthusiasm.",
  },
  {
    slug: "artist-liaison",
    title: "Artist Liaison / Stage Manager",
    badge: "Event Management",
    when: "Interactive nights · 17:30 – 20:00",
    target: "At least 1",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    description:
      "You're the person who keeps the night running on time. Coordinating with performers, chasing down people who haven't shown up yet, and making sure the stage flows smoothly from start to finish. Perfect for someone calm under pressure who loves being at the heart of the action.",
  },
  {
    slug: "mc-compere",
    title: "MC / Compere",
    badge: "Hosting",
    when: "Hip Hop & Jam nights · 17:30 – 20:00",
    target: "At least 1",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    description:
      "The hype person. Host the Hip Hop Karaoke and Jam nights — introduce acts, keep the crowd energised, and hold the room together between performers. If you've got a big personality and a loud voice, this one's for you.",
  },
  {
    slug: "headset-marshals",
    title: "Headset Marshals",
    badge: "Friday Only",
    when: "Friday · 17:30 – 20:30",
    target: "At least 3",
    image:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",
    description:
      "Friday night is Silent Disco — 200 headsets go out onto the beach and every single one needs to come back. You'll manage distribution at the start, track numbers during the night, and do a full secure collection at 20:00. Critical role; slightly longer finish than the other nights.",
  },
];

export default function Volunteers() {
  const [open, setOpen] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<Role | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const toggle = (slug: string) =>
    setOpen((prev) => (prev === slug ? null : slug));

  return (
    <section id="volunteers" className="px-4 py-14 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-extrabold text-center mb-2">Volunteer</h2>
      <p className="text-slate-400 text-center text-sm mb-4">
        Evening Production Crew · 15–21 August 2026
      </p>
      <p className="text-slate-300 text-center text-base leading-relaxed mb-10 max-w-lg mx-auto">
        We&apos;re recruiting from the club&apos;s non-marshalling volunteer pool — if
        your daytime duties wrap up before 16:00, one of these roles could be
        yours. No experience required, just enthusiasm.
      </p>

      <div className="flex flex-col gap-5">
        {roles.map((r) => {
          const isOpen = open === r.slug;
          return (
            <div
              key={r.slug}
              className="rounded-2xl overflow-hidden border border-white/10 bg-white/5"
            >
              {/* Photo strip */}
              <div className="relative h-44 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.image}
                  alt={r.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/80 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-[#0a1628]/60 px-2 py-0.5 rounded-full">
                  {r.badge}
                </span>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-cyan-400 text-xs font-semibold">
                    {r.when}
                  </span>
                  <span className="text-slate-500 text-xs">{r.target}</span>
                </div>
                <h3 className="font-extrabold text-base leading-snug">
                  {r.title}
                </h3>

                <div className="mt-3 text-slate-300 text-base leading-relaxed">
                  <p>
                    {isOpen
                      ? r.description
                      : r.description.slice(0, 80).trimEnd()}
                    {!isOpen && r.description.length > 80 && "…"}
                  </p>
                  {r.description.length > 80 && (
                    <button
                      onClick={() => toggle(r.slug)}
                      className="mt-1 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {isOpen ? "Show less" : "Show more…"}
                    </button>
                  )}
                </div>

                <button
                  onClick={() => { setActiveRole(r); setModalOpen(true); }}
                  className="mt-4 w-full rounded-xl border border-cyan-400 text-cyan-400 font-semibold text-sm py-2 hover:bg-cyan-400 hover:text-[#0a1628] transition-colors"
                >
                  Express interest
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {activeRole && (
        <VolunteerFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          role={activeRole}
        />
      )}
    </section>
  );
}
