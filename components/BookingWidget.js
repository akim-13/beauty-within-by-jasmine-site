'use client';
import { useEffect, useState } from 'react';
import { ArrowRight, Check, CheckCircle, Clock, Mail, Star } from './icons';

/* Frontend-only demo. Availability is mocked deterministically so the flow
   looks real without a backend. In production this is wired to a scheduling
   engine (e.g. self-hosted Cal.com) that returns live free/busy slots. */

const SERVICES = [
  { id: 'micro', title: 'Microblading', dur: '2h 30m', price: 'from £250' },
  { id: 'combi', title: 'Combination Brows', dur: '2h 45m', price: 'from £290' },
  { id: 'lip', title: 'Lip Blush', dur: '2h 30m', price: 'from £270' },
  { id: 'lash', title: 'Lash Lift & Tint', dur: '1h 00m', price: 'from £55' },
  { id: 'consult', title: 'Free Consultation', dur: '30m', price: 'complimentary' },
];

const SLOTS = ['09:30', '11:00', '12:30', '14:00', '15:30'];

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MO = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* deterministic "is this slot already booked" so availability looks lived-in */
const isBooked = (dayKey, slotIdx) => {
  let h = slotIdx + 7;
  for (const c of dayKey) h = (h * 31 + c.charCodeAt(0)) % 97;
  return h % 10 < 4; // ~40% taken
};

export default function BookingWidget() {
  const [days, setDays] = useState([]);
  const [service, setService] = useState(null);
  const [day, setDay] = useState(null);
  const [slot, setSlot] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [done, setDone] = useState(false);

  // build the next open days on the client to avoid SSG/hydration date drift
  useEffect(() => {
    const out = [];
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    while (out.length < 12) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) continue; // closed Sundays
      out.push({
        key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
        wd: WD[d.getDay()],
        dnum: d.getDate(),
        mo: MO[d.getMonth()],
      });
    }
    setDays(out);
  }, []);

  const svc = SERVICES.find((s) => s.id === service);
  const dayObj = days.find((x) => x.key === day);

  if (done) {
    return (
      <div className="bk-card">
        <div className="bk-done">
          <CheckCircle />
          <h3 className="font-display">You&rsquo;re booked in</h3>
          <p className="bk-done-sum">
            <b>{svc.title}</b> · {dayObj.wd} {dayObj.dnum} {dayObj.mo} · {slot}
          </p>
          <div className="bk-auto">
            <div className="bk-auto-row">
              <Mail />
              <div>
                <b>Confirmation &amp; reminder</b>
                <span>Sent to {email} now, with a reminder 24h before your appointment.</span>
              </div>
            </div>
            <div className="bk-auto-row">
              <Star style={{ color: 'var(--gold)' }} />
              <div>
                <b>A little follow-up</b>
                <span>The day after, you&rsquo;ll get a friendly note inviting you to leave a Google review.</span>
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => { setDone(false); setService(null); setDay(null); setSlot(null); }}>
            Make another booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bk-card">
      {/* Step 1 — service */}
      <div className="bk-step">
        <span className="bk-step-n">1 · Choose a treatment</span>
        <div className="bk-services">
          {SERVICES.map((s) => (
            <button
              key={s.id}
              className={`bk-svc ${service === s.id ? 'on' : ''}`}
              onClick={() => { setService(s.id); setSlot(null); }}
            >
              <span className="bk-svc-t">{s.title}</span>
              <span className="bk-svc-m"><Clock /> {s.dur} · {s.price}</span>
              {service === s.id && <span className="bk-tick"><Check /></span>}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2 — date */}
      <div className={`bk-step ${!service ? 'bk-locked' : ''}`}>
        <span className="bk-step-n">2 · Pick a date</span>
        <div className="bk-days">
          {days.map((d) => (
            <button
              key={d.key}
              className={`bk-day ${day === d.key ? 'on' : ''}`}
              onClick={() => { setDay(d.key); setSlot(null); }}
            >
              <span className="wd">{d.wd}</span>
              <span className="dn">{d.dnum}</span>
              <span className="mo">{d.mo}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3 — time */}
      <div className={`bk-step ${!day ? 'bk-locked' : ''}`}>
        <span className="bk-step-n">3 · Available times {dayObj && <em>· live availability</em>}</span>
        <div className="bk-slots">
          {SLOTS.map((t, i) => {
            const taken = day ? isBooked(day, i) : false;
            return (
              <button
                key={t}
                className={`bk-slot ${slot === t ? 'on' : ''}`}
                disabled={taken}
                onClick={() => setSlot(t)}
              >
                {t}{taken && <span className="bk-slot-x">booked</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 4 — details */}
      <div className={`bk-step ${!slot ? 'bk-locked' : ''}`}>
        <span className="bk-step-n">4 · Your details</span>
        <div className="bk-fields">
          <input
            className="bk-input" type="text" placeholder="Full name"
            value={name} onChange={(e) => setName(e.target.value)}
          />
          <input
            className="bk-input" type="email" placeholder="Email address"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button
          className="btn btn-dark bk-confirm"
          disabled={!name || !email}
          onClick={() => setDone(true)}
        >
          Confirm Booking <ArrowRight />
        </button>
        <p className="bk-note">No deposit needed for this demo. You&rsquo;ll receive an email confirmation instantly.</p>
      </div>
    </div>
  );
}
