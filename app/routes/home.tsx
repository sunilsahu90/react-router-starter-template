import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent, PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import "../landing.css";

// ============================================================
//  EDIT ONLY THIS TOP SECTION to change content, contacts and lists
// ============================================================
const cfg = {
  brand: "Ask Dr. Lokesh",
  owner: "Dr. Lokesh Raut",
  tagline: "Honest medical admission counselling for India, Russia and Kyrgyzstan.",
  whatsapp: "918698599702",
  phoneDisplay: "+91 86985 99702",
  email: "info@askdrlokesh.com",
  instagram: "ask_dr.lokesh",
  address: "Nagpur, Maharashtra, India",
};

const russia = [
  { name: "Ural State Medical University", city: "Yekaterinburg", short: "USMU" },
  { name: "Samara State Medical University", city: "Samara", short: "SamSMU" },
  { name: "Amur State Medical University", city: "Blagoveshchensk", short: "ASMU" },
  { name: "Kabardino-Balkarian State Medical University", city: "Nalchik", short: "KBSMU" },
];
const kyrgyz = [{ name: "Jalalabad International University", city: "Jalal-Abad", short: "JIU" }];

// ===== INSTAGRAM BILLBOARD =====
// Mode A (manual): put your own images in /public/insta/ and list them here, e.g.
//   { img: '/insta/1.jpg', caption: 'Welcome to MBBS in Russia' }
// Mode B (auto): set feedUrl to '/api/instagram' (see api.instagram.ts) or a feed URL from a service like Behold.
// If both are empty, the billboard shows the default highlight slides below.
type Slide = { img?: string; title?: string; caption?: string };
const ig: { slides: Slide[]; feedUrl: string; autoplayMs: number } = {
  slides: [
    // { img: '/insta/1.jpg', caption: 'Your caption here' },
    // { img: '/insta/2.jpg', caption: 'Another post' },
  ],
  feedUrl: "", // '/api/instagram'
  autoplayMs: 4500,
};
const fallbackSlides: Slide[] = [
  { title: "MBBS in Russia · Kyrgyzstan · India", caption: "Honest counselling from first call to graduation" },
  { title: "One call. Clear answers.", caption: "Reach us on WhatsApp or phone anytime" },
  { title: "Support through your entire course", caption: "Parents kept in the loop at every step" },
  { title: "FMGE / NExT guidance", caption: "Prepare to practise medicine in India" },
];
const manualSlides = ig.slides.length > 0;
const initialSlides: Slide[] = manualSlides ? ig.slides : fallbackSlides;

const indiaCourses = [
  { i: "🩺", t: "MBBS", d: "5.5 yrs (incl. internship)", e: "Entry: NEET-UG" },
  { i: "🦷", t: "BDS", d: "5 yrs (incl. internship)", e: "Entry: NEET-UG" },
  { i: "🌿", t: "BAMS", d: "5.5 yrs (incl. internship)", e: "Entry: NEET-UG" },
  { i: "💧", t: "BHMS", d: "5.5 yrs (incl. internship)", e: "Entry: NEET-UG" },
  { i: "📿", t: "BUMS", d: "5.5 yrs (incl. internship)", e: "Entry: NEET-UG" },
  { i: "💉", t: "B.Sc Nursing", d: "4 yrs", e: "Entry: as per state rules" },
  { i: "🦴", t: "BPT (Physiotherapy)", d: "4.5 yrs", e: "Entry: as per state rules" },
  { i: "💊", t: "B.Pharm / D.Pharm", d: "4 yrs / 2 yrs", e: "Entry: as per state rules" },
  { i: "🔬", t: "BMLT / Paramedical", d: "3 to 4 yrs", e: "Entry: as per state rules" },
  { i: "👁️", t: "Optometry & Allied", d: "3 to 4 yrs", e: "Entry: as per state rules" },
];

const features = [
  { i: "📞", t: "One-Call Response", d: "Call or message us and get a clear answer fast. No chasing, no waiting for days." },
  { i: "🤝", t: "Support Through Your Entire Course", d: "A dedicated team stays with your child from admission to graduation, not just until the fees are paid." },
  { i: "🎓", t: "Honest University Shortlisting", d: "Options matched to NEET score, budget and goals, with pros and cons explained plainly." },
  { i: "📂", t: "Documents & Admission Process", d: "Complete checklist, attestation guidance, application and admission letter handled step by step." },
  { i: "✈️", t: "Visa, Travel & Arrival Help", d: "Invitation letter, visa guidance, flight planning and airport pickup coordination." },
  { i: "🏠", t: "Hostel & Food Guidance", d: "Guidance on hostels, Indian food options and settling into a new country safely." },
  { i: "🧑‍⚕️", t: "FMGE / NExT Preparation Help", d: "Guidance and study planning to clear the licensing exam needed to practise in India." },
  { i: "👨‍👩‍👧", t: "Parents Kept in the Loop", d: "Regular updates and a direct line to our team for every family concern." },
];

const steps = [
  { t: "Free Counselling Call", d: "Talk to Dr. Lokesh about your NEET score, budget, goals and doubts." },
  { t: "Course & University Shortlist", d: "Compare India, Russia and Kyrgyzstan options side by side." },
  { t: "Documents & Application", d: "We guide every document, form and deadline so nothing is missed." },
  { t: "Admission Letter & Fees", d: "Official admission confirmation with transparent communication." },
  { t: "Visa, Travel & Arrival", d: "Visa support, travel planning and a smooth landing at the university." },
  { t: "Support Through the Course", d: "Our team stays available for the whole tenure of the course." },
  { t: "FMGE / NExT & Career", d: "Preparation guidance for licensing exams and practice in India." },
];

const faqs = [
  { q: "Is NEET compulsory to study MBBS abroad?", a: "As per current NMC rules, Indian students need to qualify NEET to be eligible for primary medical qualification abroad. Rules can change, so we confirm the latest requirement for you on the first call." },
  { q: "Can I practise in India after studying MBBS in Russia or Kyrgyzstan?", a: "Yes, after clearing the licensing/screening exam prescribed by NMC (currently FMGE, with NExT as per NMC notifications) and completing the required registration formalities. We guide you on preparation throughout your course." },
  { q: "How do I know a university is recognised?", a: "We help you check recognition and listing status with the relevant authorities before you pay anything. Please always verify recognition yourself on official websites as well." },
  { q: "What does the counselling cost?", a: "Ask us on the first call. We explain our process and any fees openly before you decide to proceed." },
  { q: "Do you provide support after admission?", a: "Yes. Our team stays available during the whole course tenure for documents, visa renewal, hostel, travel and exam guidance." },
  { q: "Which language is the course taught in?", a: "Many universities offer an English-medium programme for international students, along with Russian or Kyrgyz language learning for clinical work. We confirm the current details for each university." },
  { q: "Can parents speak to the team directly?", a: "Of course. Parents can call or WhatsApp us any time and we keep families informed at every step." },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: cfg.brand,
  founder: cfg.owner,
  email: cfg.email,
  telephone: "+" + cfg.whatsapp,
  address: { "@type": "PostalAddress", addressLocality: "Nagpur", addressRegion: "Maharashtra", addressCountry: "IN" },
  sameAs: ["https://www.instagram.com/" + cfg.instagram],
  description: cfg.tagline,
};

// ============================================================
//  Page head (title, description, favicon)
// ============================================================
export function meta() {
  return [
    { title: `${cfg.brand} | MBBS in Russia, Kyrgyzstan & India | Medical Counselling Nagpur` },
    { name: "description", content: "Medical admission counselling by Dr. Lokesh Raut, Nagpur. MBBS in Russia and Kyrgyzstan, MBBS/BDS/BAMS/BHMS in India, paramedical courses and FMGE/NExT guidance with one-call response." },
    { name: "theme-color", content: "#06b6d4" },
    { property: "og:title", content: `${cfg.brand} | Medical Counselling` },
    { property: "og:description", content: cfg.tagline },
    { property: "og:type", content: "website" },
  ];
}

export function links() {
  return [
    { rel: "icon", href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🩺</text></svg>" },
    { rel: "preconnect", href: "https://flagcdn.com", crossOrigin: "anonymous" as const },
  ];
}

// ============================================================
//  Small helpers and icons
// ============================================================
const vars = (v: Record<string, string | number>) => v as unknown as CSSProperties;

const svgBase = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const IconPhone = () => (
  <svg {...svgBase}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);
const IconChat = () => (
  <svg {...svgBase}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
);
const IconMail = () => (
  <svg {...svgBase}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
);
const IconInsta = () => (
  <svg {...svgBase}><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);
const IconPin = () => (
  <svg {...svgBase}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IconUp = () => (
  <svg {...svgBase} strokeWidth={2.4}><polyline points="18 15 12 9 6 15" /></svg>
);

const Flag = ({ code }: { code: string }) => (
  <img src={`https://flagcdn.com/w40/${code}.png`} width={22} height={16} alt="" loading="lazy" onError={(e) => { e.currentTarget.style.display = "none"; }} />
);

function Word({ text, offset = 0, className = "" }: { text: string; offset?: number; className?: string }) {
  return (
    <span className={`w ${className}`.trim()} aria-hidden="true">
      {[...text].map((c, i) => (
        <span key={i} className="ch" style={vars({ "--i": i + offset })}>{c}</span>
      ))}
    </span>
  );
}

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLElement>(null);
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      if (reduce) { setVal(end); return; }
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / 1400);
        setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [end]);
  return <b ref={ref}>{val}{suffix}</b>;
}

// ============================================================
//  University flip card
// ============================================================
function FlipCard({ u, country, delay, onEnquire }: { u: { name: string; city: string; short: string }; country: string; delay?: number; onEnquire: (name: string) => void }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="reveal" data-a="flip" style={vars({ "--d": `${delay ?? 0}ms` })}>
      <article
        className={`flip${flipped ? " flipped" : ""}`}
        tabIndex={0}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e: KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped((f) => !f); } }}
      >
        <div className="flip-in">
          <div className="face front">
            <div className="crest">{u.short}</div>
            <h3>{u.name}</h3>
            <p className="loc"><span className="i"><IconPin /></span>{u.city}, {country}</p>
            <span className="tag">MBBS · General Medicine</span>
            <small className="hint">Tap / hover for details ↻</small>
          </div>
          <div className="face back">
            <h4>{u.short}</h4>
            <ul>
              <li>✔ Fee &amp; intake details</li>
              <li>✔ Recognition status check</li>
              <li>✔ Admission, visa &amp; travel</li>
              <li>✔ Hostel &amp; food guidance</li>
              <li>✔ FMGE / NExT prep help</li>
            </ul>
            <button className="btn btn-sm" type="button" onClick={(e) => { e.stopPropagation(); onEnquire(u.name); }}>Enquire now</button>
          </div>
        </div>
      </article>
    </div>
  );
}

// ============================================================
//  Instagram billboard (auto-play, no login, no redirect)
// ============================================================
function normalizeFeed(j: any): Slide[] {
  const arr: any[] = Array.isArray(j) ? j : j?.posts || j?.data || [];
  const clean = (t: unknown) => String(t || "").replace(/\s+/g, " ").trim().slice(0, 140);
  return arr
    .map((p) => {
      const type = String(p.mediaType || p.media_type || p.type || "").toUpperCase();
      const sized = p.sizes?.large?.mediaUrl;
      const img = p.image || sized || (type === "VIDEO" ? p.thumbnailUrl || p.thumbnail_url : p.mediaUrl || p.media_url) || p.thumbnailUrl || p.thumbnail_url;
      return { img: img as string | undefined, caption: clean(p.caption) };
    })
    .filter((p) => p.img)
    .slice(0, 12);
}

function Billboard() {
  const ms = ig.autoplayMs || 4500;
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [idx, setIdx] = useState(0);
  const [bad, setBad] = useState<Record<number, boolean>>({});
  const [paused, setPaused] = useState(true); // starts paused until visible
  const [reduce, setReduce] = useState(false);
  const reasons = useRef(new Set<string>());
  const stage = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);
  const len = slides.length;

  const hold = useCallback((r: string, on: boolean) => {
    if (on) reasons.current.add(r); else reasons.current.delete(r);
    setPaused(reasons.current.size > 0);
  }, []);
  const go = (n: number) => setIdx(((n % len) + len) % len);

  useEffect(() => {
    setReduce(matchMedia("(prefers-reduced-motion: reduce)").matches);
    reasons.current.add("offscreen");
    const io = new IntersectionObserver(([e]) => hold("offscreen", !e.isIntersecting), { threshold: 0.3 });
    if (stage.current) io.observe(stage.current);
    const vis = () => hold("hidden", document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", vis); };
  }, [hold]);

  useEffect(() => {
    if (manualSlides || !ig.feedUrl) return;
    let alive = true;
    fetch(ig.feedUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        const list = normalizeFeed(j);
        if (alive && list.length) { setSlides(list); setIdx(0); setBad({}); }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <div className="bb reveal" data-a="zoom">
      <div className="bb-top">
        <span className="live"><i></i>LIVE</span>
        <b>@{cfg.instagram}</b>
        <span className="bb-n">{idx + 1} / {len}</span>
      </div>
      <div className="bulbs" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i}></i>)}</div>

      <div
        ref={stage}
        className={`bb-stage${paused ? " paused" : ""}${len < 2 ? " single" : ""}`}
        style={vars({ "--ms": `${ms}ms` })}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Instagram posts"
        onKeyDown={(e: KeyboardEvent) => { if (e.key === "ArrowLeft") go(idx - 1); if (e.key === "ArrowRight") go(idx + 1); }}
        onPointerEnter={(e: ReactPointerEvent) => { if (e.pointerType === "mouse") hold("hover", true); }}
        onPointerLeave={(e: ReactPointerEvent) => { if (e.pointerType === "mouse") hold("hover", false); }}
        onTouchStart={(e: ReactTouchEvent) => { touchX.current = e.touches[0].clientX; hold("touch", true); }}
        onTouchEnd={(e: ReactTouchEvent) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
          setTimeout(() => hold("touch", false), 1200);
        }}
      >
        {slides.map((s, i) => {
          const big = s.title ?? (bad[i] ? s.caption : undefined);
          return (
            <figure key={i} className={`bb-slide g${i % 4}${i === idx ? " on" : ""}`}>
              {s.img && !bad[i] ? (
                <img
                  src={s.img}
                  alt={s.caption || "Instagram post"}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={() => setBad((b) => ({ ...b, [i]: true }))}
                />
              ) : (
                <div className="bb-big">{big}</div>
              )}
              {s.caption && big !== s.caption && <figcaption className="bb-cap">{s.caption}</figcaption>}
            </figure>
          );
        })}
        <button type="button" className="bb-arrow prev" aria-label="Previous post" onClick={() => go(idx - 1)}>‹</button>
        <button type="button" className="bb-arrow next" aria-label="Next post" onClick={() => go(idx + 1)}>›</button>
        <div className="bb-dots">
          {slides.map((_, i) => (
            <button key={i} type="button" className={i === idx ? "on" : ""} aria-label={`Go to post ${i + 1}`} onClick={() => go(i)} />
          ))}
        </div>
        <div className="bb-prog">
          {/* the key restarts the animation on every slide; when it ends, move to the next slide */}
          <i key={`${idx}-${len}`} onAnimationEnd={() => { if (!reduce) go(idx + 1); }}></i>
        </div>
      </div>

      <div className="bulbs" aria-hidden="true">{Array.from({ length: 30 }, (_, i) => <i key={i}></i>)}</div>
    </div>
  );
}

// ============================================================
//  The page
// ============================================================
export default function Home() {
  const [preGone, setPreGone] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUp, setShowUp] = useState(false);
  const [tab, setTab] = useState<"ru" | "kg">("ru");
  const [interest, setInterest] = useState("");
  const [formMsg, setFormMsg] = useState<{ t: string; ok: boolean } | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<HTMLOListElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // preloader auto-removal
  useEffect(() => {
    const t = setTimeout(() => setPreGone(true), 2400);
    return () => clearTimeout(t);
  }, []);

  // scroll progress, nav state, timeline, reveal-on-scroll, tilt, magnetic buttons, hero parallax
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
        setScrolled(y > 10);
        setShowUp(y > 700);
        const tl = tlRef.current;
        if (tl) {
          const r = tl.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (window.innerHeight * 0.65 - r.top) / r.height));
          tl.style.setProperty("--tl", (p * 100).toFixed(1) + "%");
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    const cleanups: Array<() => void> = [];
    if (fine && !reduce) {
      document.querySelectorAll<HTMLElement>(".tilt").forEach((c) => {
        const move = (e: PointerEvent) => {
          const r = c.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          c.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
        };
        const leave = () => { c.style.transform = ""; };
        c.addEventListener("pointermove", move);
        c.addEventListener("pointerleave", leave);
        cleanups.push(() => { c.removeEventListener("pointermove", move); c.removeEventListener("pointerleave", leave); });
      });
      document.querySelectorAll<HTMLElement>(".mag").forEach((b) => {
        const move = (e: PointerEvent) => {
          const r = b.getBoundingClientRect();
          b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${(e.clientY - r.top - r.height / 2) * 0.25}px)`;
        };
        const leave = () => { b.style.transform = ""; };
        b.addEventListener("pointermove", move);
        b.addEventListener("pointerleave", leave);
        cleanups.push(() => { b.removeEventListener("pointermove", move); b.removeEventListener("pointerleave", leave); });
      });
      const hero = document.querySelector<HTMLElement>(".hero");
      const chips = document.querySelectorAll<HTMLElement>(".chipf");
      if (hero) {
        const move = (e: PointerEvent) => {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          chips.forEach((c) => {
            const d = Number(c.dataset.depth) || 20;
            c.style.translate = `${x * d}px ${y * d}px`;
          });
        };
        hero.addEventListener("pointermove", move);
        cleanups.push(() => hero.removeEventListener("pointermove", move));
      }
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
      cleanups.forEach((f) => f());
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const pickUni = (name: string) => {
    setInterest(name);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  // ----- contact form: validate, then open WhatsApp / email -----
  function collect() {
    const f = new FormData(formRef.current!);
    const v = (k: string) => String(f.get(k) || "").trim();
    const d = { name: v("name"), phone: v("phone"), email: v("email"), city: v("city"), neet: v("neet"), interest: v("interest"), msg: v("msg") };
    if (d.name.length < 2) return { error: "Please enter your name." };
    if (!/^[0-9+\-\s]{10,15}$/.test(d.phone)) return { error: "Please enter a valid phone number." };
    if (d.email && !/^\S+@\S+\.\S+$/.test(d.email)) return { error: "Please enter a valid email or leave it blank." };
    if (!d.neet) return { error: "Please select your NEET status." };
    if (!d.interest) return { error: "Please select what you are interested in." };
    const text =
      `Hello Dr. Lokesh,\n\nName: ${d.name}\nPhone: ${d.phone}\n` +
      (d.email ? `Email: ${d.email}\n` : "") +
      (d.city ? `City: ${d.city}\n` : "") +
      `NEET status: ${d.neet}\nInterested in: ${d.interest}\nMessage: ${d.msg || "(not provided)"}`;
    return { d, text };
  }
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const r = collect();
    if ("error" in r) return setFormMsg({ t: r.error as string, ok: false });
    setFormMsg({ t: "Opening WhatsApp… press send to reach us.", ok: true });
    window.open(`https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(r.text as string)}`, "_blank", "noopener");
  }
  function onEmail() {
    const r = collect();
    if ("error" in r) return setFormMsg({ t: r.error as string, ok: false });
    setFormMsg({ t: "Opening your email app…", ok: true });
    window.location.href = `mailto:${cfg.email}?subject=${encodeURIComponent("Counselling enquiry from " + (r.d as { name: string }).name)}&body=${encodeURIComponent(r.text as string)}`;
  }

  const waLink = `https://wa.me/${cfg.whatsapp}`;
  const igLink = `https://www.instagram.com/${cfg.instagram}`;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Preloader: pure CSS fade, then removed from the page */}
      {!preGone && (
        <div id="pre" aria-hidden="true">
          <div className="pre-in">
            <div className="pre-name" style={vars({ "--base": ".1s" })}>
              {["Dr.", "Lokesh", "Raut"].map((w, wi) => <Word key={w} text={w} offset={wi * 4} />)}
            </div>
            <svg className="pre-ecg" viewBox="0 0 300 50"><path d="M0 25 H95 L110 6 L130 44 L148 14 L160 25 H300" /></svg>
            <p>Medical Counselling</p>
          </div>
        </div>
      )}

      <div ref={barRef} className="bar"></div>
      <div className="bg" aria-hidden="true">
        <span className="blob b1"></span><span className="blob b2"></span><span className="blob b3"></span>
        <span className="float f1">✚</span><span className="float f2">💊</span><span className="float f3">✚</span>
        <span className="float f4">🧬</span><span className="float f5">✚</span><span className="float f6">🩺</span>
      </div>

      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <a href="#home" className="logo"><span className="logo-mark">✚</span><span>{cfg.brand}</span></a>
        <nav id="menu" className={`menu${menuOpen ? " open" : ""}`} aria-label="Main">
          <a href="#abroad" onClick={closeMenu}>MBBS Abroad</a>
          <a href="#india" onClick={closeMenu}>India Courses</a>
          <a href="#why" onClick={closeMenu}>Why Us</a>
          <a href="#process" onClick={closeMenu}>Process</a>
          <a href="#billboard" onClick={closeMenu}>Instagram</a>
          <a href="#faq" onClick={closeMenu}>FAQ</a>
          <a href="#contact" className="btn btn-sm mag" onClick={closeMenu}>Free Counselling</a>
        </nav>
        <button className={`burger${menuOpen ? " x" : ""}`} aria-label="Toggle menu" aria-expanded={menuOpen} aria-controls="menu" onClick={() => setMenuOpen((o) => !o)}>
          <span></span><span></span><span></span>
        </button>
      </header>

      <main>
        {/* HERO */}
        <section id="home" className="hero">
          <div className="hero-text">
            <span className="pill reveal">🩺 Medical admission counselling · Nagpur</span>
            <h1 style={vars({ "--base": "1.25s" })} aria-label="Ask Dr. Lokesh">
              <Word text="Ask" offset={0} />
              <Word text="Dr." offset={3} />
              <br />
              <Word text="Lokesh" offset={7} className="name" />
            </h1>
            <p className="lead reveal" style={vars({ "--d": "1.5s" })}>
              Your MBBS dream, guided honestly. <b>Russia · Kyrgyzstan · India</b>, plus support through every year of your course and FMGE / NExT preparation help.
            </p>
            <div className="cta reveal" style={vars({ "--d": "1.65s" })}>
              <a href="#contact" className="btn mag">Book Free Counselling</a>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-wa mag"><span className="i"><IconChat /></span>WhatsApp Now</a>
            </div>
            <ul className="trust reveal" style={vars({ "--d": "1.8s" })}>
              <li>⚡ One-call response</li>
              <li>🤝 Support till graduation</li>
              <li>🧑‍⚕️ FMGE / NExT guidance</li>
            </ul>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="dna-wrap">
              <div className="dna">
                {Array.from({ length: 18 }, (_, i) => (
                  <div key={i} className="rung" style={vars({ "--i": i })}><i></i><b></b><i></i></div>
                ))}
              </div>
              <div className="chipf cf1" data-depth="26"><Flag code="ru" /> MBBS Russia</div>
              <div className="chipf cf2" data-depth="-20"><Flag code="kg" /> MBBS Kyrgyzstan</div>
              <div className="chipf cf3" data-depth="32"><Flag code="in" /> India Courses</div>
              <div className="chipf cf4" data-depth="-28">🧑‍⚕️ FMGE / NExT</div>
            </div>
            <svg className="ecg" viewBox="0 0 400 70" preserveAspectRatio="none"><path d="M0 35 H120 L145 8 L172 62 L196 20 L214 35 H400" /></svg>
          </div>
          <a href="#abroad" className="scroll-cue" aria-label="Scroll down"><span></span></a>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="track">
            {[...russia, ...kyrgyz, ...russia, ...kyrgyz].map((u, i) => <span key={i}>{u.name}</span>)}
          </div>
        </div>

        {/* STATS */}
        <section className="stats">
          <div className="stat reveal" data-a="zoom"><Counter end={6} /><span>Universities featured</span></div>
          <div className="stat reveal" data-a="zoom" style={vars({ "--d": "90ms" })}><Counter end={2} /><span>Countries abroad</span></div>
          <div className="stat reveal" data-a="zoom" style={vars({ "--d": "180ms" })}><Counter end={indiaCourses.length} /><span>Course options in India</span></div>
          <div className="stat reveal" data-a="zoom" style={vars({ "--d": "270ms" })}><Counter end={1} suffix=" Call" /><span>is all it takes to reach us</span></div>
        </section>

        {/* STUDY ABROAD */}
        <section id="abroad" className="section">
          <div className="head reveal">
            <span className="eyebrow">MBBS Abroad</span>
            <h2>Study medicine at trusted <span className="grad">universities abroad</span></h2>
            <p className="sub">Tap a card to see what we help with. Fees, intake dates and recognition status are shared openly during counselling.</p>
          </div>

          <div className="tabs reveal" role="tablist">
            <button className={`tab${tab === "ru" ? " on" : ""}`} role="tab" aria-selected={tab === "ru"} onClick={() => setTab("ru")}><Flag code="ru" /> Russia</button>
            <button className={`tab${tab === "kg" ? " on" : ""}`} role="tab" aria-selected={tab === "kg"} onClick={() => setTab("kg")}><Flag code="kg" /> Kyrgyzstan</button>
          </div>

          <div className={`panel${tab === "ru" ? " on" : ""}`}>
            <div className="ugrid">
              {russia.map((u, i) => <FlipCard key={u.name} u={u} country="Russia" delay={i * 100} onEnquire={pickUni} />)}
            </div>
            <p className="note">Typical MBBS (General Medicine) duration in Russia is about 6 years. Confirm current details for each university with us.</p>
          </div>

          <div className={`panel${tab === "kg" ? " on" : ""}`}>
            <div className="ugrid single">
              {kyrgyz.map((u) => <FlipCard key={u.name} u={u} country="Kyrgyzstan" onEnquire={pickUni} />)}
              <div className="kg-info">
                <h3>Why students consider Kyrgyzstan</h3>
                <p>Kyrgyzstan is a popular, budget-conscious destination for Indian medical aspirants. We will walk you through the programme, living costs and recognition checks so you can compare it honestly with Russia and India.</p>
                <a href="#contact" className="btn btn-sm mag">Ask about Kyrgyzstan</a>
              </div>
            </div>
          </div>
        </section>

        {/* INDIA COURSES */}
        <section id="india" className="section alt">
          <div className="head reveal">
            <span className="eyebrow">Studying in India</span>
            <h2>Medical, dental, AYUSH &amp; <span className="grad">paramedical courses</span></h2>
            <p className="sub">Guidance on counselling rounds, college selection, documents and choice filling for domestic admissions.</p>
          </div>
          <div className="cgrid">
            {indiaCourses.map((c, i) => (
              <article key={c.t} className="ccard tilt reveal" data-a="zoom" style={vars({ "--d": `${(i % 5) * 70}ms` })}>
                <div className="cicon">{c.i}</div>
                <h3>{c.t}</h3>
                <p className="dur">⏱ {c.d}</p>
                <p className="ent">{c.e}</p>
              </article>
            ))}
          </div>
          <p className="note">Durations and eligibility are typical and may vary by state and institution. We confirm the latest rules for you.</p>
        </section>

        {/* WHY US */}
        <section id="why" className="section">
          <div className="head reveal">
            <span className="eyebrow">Why families choose us</span>
            <h2>Counselling that doesn't end <span className="grad">after admission</span></h2>
          </div>
          <div className="fgrid">
            {features.map((f, i) => (
              <article key={f.t} className="fcard tilt reveal" data-a={i % 2 ? "right" : "left"} style={vars({ "--d": `${(i % 4) * 80}ms` })}>
                <div className="ficon">{f.i}</div>
                <div>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* FMGE BAND */}
        <section className="band">
          <div className="band-in reveal" data-a="zoom">
            <div>
              <span className="eyebrow light">After your degree</span>
              <h2>Practise in India with <span className="u">FMGE / NExT</span> guidance</h2>
              <p>Graduates of foreign medical universities must clear the licensing exam prescribed by NMC to practise in India. From year one, we guide you on study planning, mock tests and updates, so you are exam-ready by the time you graduate.</p>
            </div>
            <a href="#contact" className="btn btn-white mag">Talk to Dr. Lokesh</a>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="section">
          <div className="head reveal">
            <span className="eyebrow">How it works</span>
            <h2>From first call to <span className="grad">graduation</span>, step by step</h2>
          </div>
          <ol className="tl" ref={tlRef}>
            {steps.map((s, i) => (
              <li key={s.t} className="tl-item reveal" data-a={i % 2 ? "right" : "left"}>
                <span className="tl-dot">{i + 1}</span>
                <div className="tl-card">
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ABOUT / PROMISE */}
        <section className="section alt">
          <div className="about">
            <div className="about-card reveal" data-a="left">
              <div className="avatar">DL</div>
              <h3>{cfg.owner}</h3>
              <p className="muted">Medical admission counsellor · Nagpur, Maharashtra</p>
              <div className="soc">
                <a href={igLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><span className="i"><IconInsta /></span></a>
                <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><span className="i"><IconChat /></span></a>
                <a href={`mailto:${cfg.email}`} aria-label="Email"><span className="i"><IconMail /></span></a>
                <a href={`tel:+${cfg.whatsapp}`} aria-label="Call"><span className="i"><IconPhone /></span></a>
              </div>
            </div>
            <div className="reveal" data-a="right">
              <span className="eyebrow">Our promise</span>
              <h2 className="h2s">Truthful advice. Clear communication. Support that lasts.</h2>
              <ul className="promise">
                <li>✔ We tell you the pros and cons of every option, even when it isn't the easy sale.</li>
                <li>✔ We never promise guaranteed seats or exam results.</li>
                <li>✔ You and your parents get a direct line to our team, always.</li>
                <li>✔ We stay with you across the full tenure of your course.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <div className="head reveal">
            <span className="eyebrow">Good to know</span>
            <h2>Frequently asked <span className="grad">questions</span></h2>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q} className="reveal">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section alt">
          <div className="head reveal">
            <span className="eyebrow">Get in touch</span>
            <h2>Book your <span className="grad">free counselling call</span></h2>
            <p className="sub">Share a few details and we will respond on WhatsApp. Prefer to talk? Call us directly.</p>
          </div>
          <div className="cwrap">
            <div className="cinfo reveal" data-a="left">
              <a className="crow" href={`tel:+${cfg.whatsapp}`}><span className="cic"><IconPhone /></span><div><small>Call / WhatsApp</small><b>{cfg.phoneDisplay}</b></div></a>
              <a className="crow" href={`mailto:${cfg.email}`}><span className="cic"><IconMail /></span><div><small>Email</small><b>{cfg.email}</b></div></a>
              <a className="crow" href={igLink} target="_blank" rel="noopener noreferrer"><span className="cic"><IconInsta /></span><div><small>Instagram</small><b>@{cfg.instagram}</b></div></a>
              <div className="crow"><span className="cic"><IconPin /></span><div><small>Office</small><b>{cfg.address}</b></div></div>
              <div className="map">
                <iframe title="Nagpur map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=Nagpur%2C%20Maharashtra&z=11&output=embed"></iframe>
              </div>
            </div>

            <form ref={formRef} className="form reveal" data-a="right" onSubmit={onSubmit} noValidate>
              <div className="row">
                <label>Student / Parent name
                  <input name="name" type="text" placeholder="Full name" required autoComplete="name" />
                </label>
                <label>Phone / WhatsApp
                  <input name="phone" type="tel" placeholder="10-digit mobile" required inputMode="numeric" autoComplete="tel" />
                </label>
              </div>
              <div className="row">
                <label>Email (optional)
                  <input name="email" type="email" placeholder="you@example.com" autoComplete="email" />
                </label>
                <label>City
                  <input name="city" type="text" placeholder="Your city" autoComplete="address-level2" />
                </label>
              </div>
              <div className="row">
                <label>NEET status
                  <select name="neet" required defaultValue="">
                    <option value="">Select</option>
                    <option>NEET qualified</option>
                    <option>Appearing in NEET</option>
                    <option>NEET result awaited</option>
                    <option>NEET not qualified</option>
                    <option>12th student</option>
                    <option>Paramedical / other course</option>
                  </select>
                </label>
                <label>Interested in
                  <select name="interest" required value={interest} onChange={(e) => setInterest(e.target.value)}>
                    <option value="">Select</option>
                    <optgroup label="Russia">
                      {russia.map((u) => <option key={u.name}>{u.name}</option>)}
                    </optgroup>
                    <optgroup label="Kyrgyzstan">
                      {kyrgyz.map((u) => <option key={u.name}>{u.name}</option>)}
                    </optgroup>
                    <optgroup label="India">
                      {indiaCourses.map((c) => <option key={c.t}>{c.t} (India)</option>)}
                    </optgroup>
                    <optgroup label="Other">
                      <option>FMGE / NExT guidance</option>
                      <option>Not sure, need advice</option>
                    </optgroup>
                  </select>
                </label>
              </div>
              <label>Your message
                <textarea name="msg" rows={4} placeholder="NEET score, category, budget, doubts..."></textarea>
              </label>
              <p className={`form-msg${formMsg ? (formMsg.ok ? " ok" : " err") : ""}`} role="alert" aria-live="polite">{formMsg?.t}</p>
              <button type="submit" className="btn btn-wa btn-block mag"><span className="i"><IconChat /></span>Send on WhatsApp</button>
              <button type="button" className="btn btn-ghost btn-block" onClick={onEmail}>Send by email instead</button>
            </form>
          </div>
        </section>

        {/* INSTAGRAM BILLBOARD */}
        <section id="billboard" className="section">
          <div className="head reveal">
            <span className="eyebrow">Instagram billboard</span>
            <h2>Updates from <span className="grad">@{cfg.instagram}</span></h2>
            <p className="sub">Our latest posts, playing right here. Hover or touch to pause.</p>
          </div>
          <Billboard />
        </section>
      </main>

      <footer className="footer">
        <div className="foot">
          <div>
            <a href="#home" className="logo"><span className="logo-mark">✚</span><span>{cfg.brand}</span></a>
            <p className="muted">{cfg.tagline}</p>
            <p className="muted">📍 {cfg.address}</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#abroad">MBBS Abroad</a>
            <a href="#india">India Courses</a>
            <a href="#why">Why Us</a>
            <a href="#process">Process</a>
            <a href="#faq">FAQ</a>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`tel:+${cfg.whatsapp}`}>{cfg.phoneDisplay}</a>
            <a href={`mailto:${cfg.email}`}>{cfg.email}</a>
            <a href={igLink} target="_blank" rel="noopener noreferrer">@{cfg.instagram}</a>
          </div>
        </div>
        <p className="disc">Disclaimer: {cfg.brand} provides independent admission guidance and is not an official government or university body. No admission, seat or exam result is guaranteed. University names are as commonly known; fees, intake, eligibility and recognition status can change, so please verify on official NMC and university websites.</p>
        <p className="copy">© {new Date().getFullYear()} {cfg.brand} · {cfg.owner}. All rights reserved.</p>
      </footer>

      <a className={`up${showUp ? " show" : ""}`} href="#home" aria-label="Back to top"><span className="i"><IconUp /></span></a>
      <a className="wa-float" href={`${waLink}?text=${encodeURIComponent("Hello Dr. Lokesh, I need medical admission counselling.")}`} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp"><span className="i"><IconChat /></span></a>
      <a className="call-float" href={`tel:+${cfg.whatsapp}`} aria-label="Call now"><span className="i"><IconPhone /></span></a>
    </>
  );
}
