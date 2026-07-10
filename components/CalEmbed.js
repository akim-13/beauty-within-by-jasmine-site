'use client';
import { useEffect } from 'react';

/* Real Cal.com inline embed, pointed at the account root so it lists all
   treatments to choose from. In production this becomes the client's own
   handle. Branded to the site's rose accent to show the limit of embed
   theming. */

export default function CalEmbed() {
  useEffect(() => {
    (function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments;
        if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1]; api.q = api.q || [];
          if (typeof namespace === 'string') { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ['initNamespace', namespace]); }
          else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, 'https://app.cal.com/embed/embed.js', 'init');

    const Cal = window.Cal;
    Cal('init', { origin: 'https://cal.com' });
    Cal('inline', {
      elementOrSelector: '#cal-inline',
      calLink: 'akim-zzz85b',
      layout: 'month_view',
    });
    Cal('ui', {
      hideEventTypeDetails: false,
      layout: 'month_view',
      cssVarsPerTheme: { light: { 'cal-brand': '#9c6f67' } },
    });
  }, []);

  return <div className="cal-embed" id="cal-inline" />;
}
