"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Role {
  slug: string;
  title: string;
  badge: string;
  when: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function VolunteerFormModal({ isOpen, onClose, role }: Props) {
  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState<FormState>("idle");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [club, setClub] = useState("");
  const [availability, setAvailability] = useState("");
  const [about, setAbout] = useState("");
  const [message, setMessage] = useState("");
  const [age, setAge] = useState("");
  const [parentalConsent, setParentalConsent] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [botcheck, setBotcheck] = useState("");

  const isSoundApprentice = role.slug === "sound-apprentices";

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
          subject: `Volunteer Registration: ${role.title} – HBAY Nationals`,
          role: role.title,
          name,
          email,
          phone: phone || undefined,
          club: club || undefined,
          availability: availability || undefined,
          about: about || undefined,
          message: message || undefined,
          age: isSoundApprentice ? age : undefined,
          parental_consent: isSoundApprentice ? parentalConsent : undefined,
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
        aria-labelledby="vol-modal-title"
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a1628] p-6 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h2 id="vol-modal-title" className="font-extrabold text-lg">
            {role.title}
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
          {role.when} · Beach Marquee
        </p>

        {formState === "success" ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🙌</div>
            <h3 className="font-extrabold text-lg mb-2">Thanks for putting your hand up!</h3>
            <p className="text-slate-300 text-sm">
              We&apos;ll be in touch closer to the event to confirm your role.
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
                <label htmlFor="vol-name" className={labelClass}>
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="vol-name"
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
                <label htmlFor="vol-email" className={labelClass}>
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="vol-email"
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
                <label htmlFor="vol-phone" className={labelClass}>
                  Phone <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="vol-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+44 7700 000000"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="vol-club" className={labelClass}>
                  Club / Organisation <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="vol-club"
                  type="text"
                  value={club}
                  onChange={(e) => setClub(e.target.value)}
                  placeholder="e.g. H-Bay SC"
                  className={inputClass}
                />
              </div>

              {isSoundApprentice && (
                <div>
                  <label htmlFor="vol-age" className={labelClass}>
                    Age <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="vol-age"
                    type="number"
                    required
                    aria-required="true"
                    min={13}
                    max={25}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 16"
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label htmlFor="vol-availability" className={labelClass}>
                  Availability <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <input
                  id="vol-availability"
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="Which days/nights can you make it? (if not all)"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="vol-about" className={labelClass}>
                  About you <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="vol-about"
                  rows={3}
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Tell us a bit about yourself — any relevant experience welcome, but not required"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="vol-message" className={labelClass}>
                  Anything else? <span className="text-slate-500 font-normal">(optional)</span>
                </label>
                <textarea
                  id="vol-message"
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

            {/* Parental consent — Sound Apprentices only */}
            {isSoundApprentice && (
              <label className="flex items-start gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  id="vol-parental"
                  required
                  aria-required="true"
                  checked={parentalConsent}
                  onChange={(e) => setParentalConsent(e.target.checked)}
                  className="mt-0.5 accent-cyan-400"
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  If under 18, I confirm that a parent or guardian has consented to my participation.
                </span>
              </label>
            )}

            {/* GDPR checkbox */}
            <label className="flex items-start gap-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                id="vol-gdpr"
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
              {formState === "submitting" ? "Sending…" : "Express interest"}
            </button>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}
