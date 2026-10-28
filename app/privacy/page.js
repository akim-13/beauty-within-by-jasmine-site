import Nav from '@/components/Nav';

/*
  PRIVACY NOTICE (UK GDPR) — website only. Facts are limited to what the site
  actually does: Netlify Forms enquiry form, Google Analytics 4, embedded Google
  Map, phone/email contact. No consent banner exists: do not claim one. No
  prices. Update "Last updated" whenever the content changes.
*/

export const metadata = {
  title: 'Privacy Notice | Beauty Within by Jasmine',
  description:
    'How Beauty Within by Jasmine in Crowthorne, Berkshire handles personal data from website enquiries, Google Analytics and the embedded Google Map, and your rights under UK GDPR.',
  alternates: { canonical: '/privacy/', types: { 'text/markdown': '/privacy/index.md' } },
};

export default function Privacy() {
  return (
    <main id="top" className="page-sub">
      <Nav />

      <section className="section" style={{ paddingTop: 'clamp(130px, 16vw, 190px)' }}>
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Legal</span>
            <h1 className="section-title">Privacy notice</h1>
            <p className="lead">
              How I look after the personal information you share through this website, and the
              choices and rights you have over it.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="prose">
            <p><strong>Last updated: 28 October 2026</strong></p>

            <h2>Who I am</h2>
            <p>
              This website belongs to Jasmine Crean, trading as Beauty Within by Jasmine, 58 Duke&rsquo;s
              Ride, Crowthorne, Berkshire, RG45 6NY. I am the data controller for the personal
              information collected through it. If you have any question about this notice or about
              your information, please email{' '}
              <a href="mailto:jasmine.crean@mail.com">jasmine.crean@mail.com</a> or call{' '}
              <a href="tel:07501838484">07501 838484</a>.
            </p>

            <h2>What this notice covers</h2>
            <p>
              This notice covers this website only. Consultation forms completed before a treatment
              are handled in the studio, and I explain how that information is used and kept at your
              appointment.
            </p>

            <h2>Enquiries through the contact form</h2>
            <p>
              When you send an enquiry, the form collects your first name, your last name (optional),
              your email address, your phone number (optional) and your message. Submissions are
              captured and stored by Netlify, the company that hosts this website (through its
              Netlify Forms service), and are emailed to me.
            </p>
            <p>
              I use these details to answer your enquiry and to arrange a treatment consultation or
              training. The lawful bases are taking steps at your request before entering into a
              contract with you, and my legitimate interest in responding to the enquiries I receive.
            </p>

            <h2>Phone and email</h2>
            <p>
              If you call, message or email me, I use your number or email address to reply to you,
              and I keep your details together with your enquiry.
            </p>

            <h2>Google Analytics</h2>
            <p>
              This website uses Google Analytics 4 to understand how the site is used. It sets
              cookies (such as <code>_ga</code>) and measures things like the pages visited, your
              device and browser type and your approximate location. Google may process this data on
              servers outside the UK.
            </p>
            <p>
              You can block cookies in your browser settings, or install Google&rsquo;s opt-out browser
              add-on (
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
                tools.google.com/dlpage/gaoptout
              </a>
              ) to stop Google Analytics collecting data about your visits.
            </p>

            <h2>The embedded Google Map</h2>
            <p>
              The contact section of the homepage includes an embedded Google Map so you can find the
              studio. When the map loads, Google may set its own cookies in your browser.
            </p>

            <h2>How long information is kept</h2>
            <ul>
              <li>
                Enquiries are kept for as long as needed to deal with them. If you go on to become a
                client or a student, your details are kept for the duration of that relationship and
                for as long as the law requires.
              </li>
              <li>Netlify form records are deleted when they are no longer needed.</li>
              <li>Analytics data is kept according to Google Analytics&rsquo; default retention settings.</li>
            </ul>

            <h2>Your rights</h2>
            <p>Under UK data protection law (UK GDPR) you have the right to:</p>
            <ul>
              <li>ask for a copy of the personal information I hold about you (access);</li>
              <li>ask me to correct information that is wrong or incomplete (rectification);</li>
              <li>ask me to delete your information (erasure);</li>
              <li>ask me to limit how your information is used (restriction);</li>
              <li>object to my using your information on the basis of legitimate interests (objection);</li>
              <li>receive your information in a portable format (portability);</li>
              <li>withdraw your consent at any time, where I rely on consent.</li>
            </ul>
            <p>
              To exercise any of these rights, simply email{' '}
              <a href="mailto:jasmine.crean@mail.com">jasmine.crean@mail.com</a>.
            </p>

            <h2>Making a complaint</h2>
            <p>
              If you are unhappy with how your information has been handled, please contact me first
              and I will do my best to put things right. You also have the right to complain to the
              Information Commissioner&rsquo;s Office (ICO), the UK data protection regulator, at{' '}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a> or
              on 0303 123 1113.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
