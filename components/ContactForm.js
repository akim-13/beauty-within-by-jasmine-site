'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle } from './icons';

// Netlify Forms: the <form> is tagged data-netlify so Netlify captures it at deploy
// time (from the static HTML), and we POST the fields back to Netlify on submit so a
// JS-controlled form still records a real submission. Submissions show in the Netlify
// dashboard and trigger the email notification configured on the "contact" form.
const FORM_NAME = 'contact';

const encode = (data) =>
  Object.keys(data)
    .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
    .join('&');

export default function ContactForm() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({ 'form-name': FORM_NAME, ...data }),
      });
      if (!res.ok) throw new Error(`Bad status ${res.status}`);
      setStatus('sent');
      if (typeof window.gtag === 'function') window.gtag('event', 'generate_lead', { method: 'enquiry_form' });
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'sent') {
    return (
      <div className="form-card">
        <div className="form-success">
          <CheckCircle />
          <h3 className="font-display">Thank you</h3>
          <p>Your enquiry has been received. Jasmine will be in touch as soon as possible to talk through your treatment or training.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card" id="enquire">
      <h3 className="font-display">Send an Enquiry</h3>
      <p>Whether you are interested in booking a treatment, enquiring about training or simply have a question, Jasmine would love to hear from you.</p>
      <form
        className="form"
        name={FORM_NAME}
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={onSubmit}
      >
        {/* Netlify needs these in the static HTML to record + route the submission. */}
        <input type="hidden" name="form-name" value={FORM_NAME} />
        <p className="hidden" hidden>
          <label>Do not fill this out if you are human: <input name="bot-field" /></label>
        </p>
        <div className="form-row">
          <div className="field">
            <label htmlFor="first">First name <span className="req">*</span></label>
            <input id="first" name="first" type="text" autoComplete="given-name" required />
          </div>
          <div className="field">
            <label htmlFor="last">Last name</label>
            <input id="last" name="last" type="text" autoComplete="family-name" />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="email">Email <span className="req">*</span></label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="message">Tell me about your enquiry</label>
          <textarea id="message" name="message" rows={4} placeholder="Which treatment or training are you interested in?" />
        </div>
        <button type="submit" className="btn btn-dark" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : <>Send Enquiry <ArrowRight /></>}
        </button>
        {status === 'error' && (
          <p className="form-note" role="alert" style={{ color: 'var(--rose-deep)' }}>
            Something went wrong sending your enquiry. Please try again, or call/message <a href="tel:07501838484" style={{ color: 'var(--rose-deep)' }}>07501 838484</a>.
          </p>
        )}
        <p className="form-note">Prefer to talk? Call or message <a href="tel:07501838484" style={{ color: 'var(--rose-deep)' }}>07501 838484</a>. Treatment pricing is available on enquiry.</p>
      </form>
    </div>
  );
}
