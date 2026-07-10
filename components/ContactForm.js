'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle } from './icons';

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
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
      <form className="form" onSubmit={onSubmit}>
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
        <button type="submit" className="btn btn-dark">Send Enquiry <ArrowRight /></button>
        <p className="form-note">Prefer to talk? Call or message <a href="tel:07501838484" style={{ color: 'var(--rose-deep)' }}>07501 838484</a>. Treatment pricing is available on enquiry.</p>
      </form>
    </div>
  );
}
