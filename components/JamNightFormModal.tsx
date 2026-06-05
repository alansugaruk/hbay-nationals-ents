"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function JamNightFormModal({ isOpen, onClose }: Props) {
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [club, setClub] = useState("");
  const [role, setRole] = useState("");
  const [instruments, setInstruments] = useState("");
  const [bandmates, setBandmates] = useState("");
  const [songIdeas, setSongIdeas] = useState("");
  const [message, setMessage] = useState("");
  const [gdprConsent, setGdprConsent] = useState(false);
  const [botcheck, setBotcheck] = useState("");

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (botcheck) return;
    setFormState("submitting");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          subject: "Jam Night Registration – HBAY Nationals",
          name,
          email,
          phone: phone || undefined,
          club: club || undefined,
          role,
          instruments: instruments || undefined,
          bandmates: bandmates || undefined,
          song_ideas: songIdeas || undefined,
          message: message || undefined,
          gdpr_consent: true,
          botcheck,
        }),
      });
      const data = await res.json();
      setFormState(data.success ? "success" : "error");
    } catch {
      setFormState("error");
    }
  }

  if (!mounted || !isOpen) return null;

  const inputClass =
    "w-full rounded-lg bg-white/10 border border-white/15 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400";
  const labelClass = "block text-xs font-semibold text-slate-300 mb-1";

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="jam-modal-title"
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a1628] p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 id="jam-modal-title" className="font-extrabold text-lg">
            Register Your Interest
          </h2>
          <button
            onClick={onClose}
            aria-label="Close registration form"
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-400 text-xs mb-5 leading-relaxed">
          Jam Night · Wed 19 Aug · 18:00 – 20:00 · Beach Marquee
        </p>

        {formState === "success" ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎸</div>
            <h3 className="font-extrabold text-lg mb-2">You&apos;re on the list!</h3>
            <p className="text-slate-300 text-sm">
              We&apos;ll be in touch closer to the event to sort out your slot.
            </p>
            <button
              onClick={onClose}
              className="mt-6 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate={false}>
            {/* Honeypot */}
            <input
              type="text"
              name="botcheck"
              value={botcheck}
              onChange={(e) => setBotcheck(e.target.value)}
              aria-hidden="true"
              tabIndex={-1}
              style={{ position: "absolute", opacity: 0, height: 0, width: 0, pointerEvents: "none" }}
            />

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="jam-name" className={labelClass}>
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="jam-name"
                  type="text"
                  required
                  aria-required="true"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jam-email" className={labelClass}>
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="jam-email"
                  type="email"
                  required
                  aria-required="true"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jam-phone" className={labelClass}>
                  Phone <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="jam-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 000000"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jam-club" className={labelClass}>
                  Club / Organisation <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="jam-club"
                  type="text"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="e.g. H-Bay SC"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jam-role" className={labelClass}>
                  How would you like to perform? <span className="text-red-400">*</span>
                </label>
                <select
                  id="jam-role"
                  required
                  aria-required="true"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={inputClass}
                >
                  <option value="" disabled>Select one…</option>
                  <option value="Singer only">Singer only</option>
                  <option value="Instrumentalist only">Instrumentalist only</option>
                  <option value="Singer + instrument(s)">Singer + instrument(s)</option>
                </select>
              </div>

              <div>
                <label htmlFor="jam-instruments" className={labelClass}>
                  Instrument(s) <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="jam-instruments"
                  type="text"
                  value={instruments}
                  onChange={(e) => setInstruments(e.target.value)}
                  placeholder="e.g. guitar, bass, keys"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jam-bandmates" className={labelClass}>
                  Anyone else coming with you? <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="jam-bandmates"
                  rows={2}
                  value={bandmates}
                  onChange={(e) => setBandmates(e.target.value)}
                  placeholder="e.g. bringing a bassist and a drummer"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jam-songs" className={labelClass}>
                  Any song ideas? <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="jam-songs"
                  rows={3}
                  value={songIdeas}
                  onChange={(e) => setSongIdeas(e.target.value)}
                  placeholder="Give us some examples of the kind of thing you'd like to play and we'll see what we can do"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="jam-message" className={labelClass}>
                  Anything else? <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="jam-message"
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Anything you'd like us to know…"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Privacy notice */}
            <p className="text-xs text-slate-400 leading-relaxed mt-5 mb-3">
              Your details will only be used for coordination of events at H-Bay SLSGB Nationals 2026.
              They will not be shared with third parties or used for marketing purposes.
            </p>

            {/* GDPR checkbox */}
            <label className="flex items-start gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                id="jam-gdpr"
                required
                aria-required="true"
                checked={gdprConsent}
                onChange={(e) => setGdprConsent(e.target.checked)}
                className="mt-0.5 accent-cyan-400"
              />
              <span className="text-xs text-slate-300 leading-relaxed">
                I agree to being contacted by email for event organisation.
              </span>
            </label>

            {/* Error banner */}
            {formState === "error" && (
              <p role="alert" className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2 mb-3">
                Something went wrong — please try again or contact us directly.
              </p>
            )}

            <button
              type="submit"
              disabled={formState === "submitting"}
              className="w-full rounded-xl bg-cyan-400 text-[#0a1628] font-extrabold py-2.5 text-sm hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formState === "submitting" ? "Sending…" : "Register my interest"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
