import { ImageIcon } from '@/components/icons';

/*
  Labelled image placeholder. Fills its (positioned, sized) parent — e.g. an
  .img-frame, .hero-media, .service-media or .pf slot. Every slot carries a
  unique `id` (shown large) so real photos can be dropped in later: just swap
  <Placeholder id="HOME-HERO" .../> back to <Image src="..." ... />.

    id    — unique slot code, e.g. "HOME-HERO" (also set as data-ph for search)
    label — short note on what image belongs here
    ratio — optional "w:h" hint shown to the side (purely informational)
*/
export default function Placeholder({ id, label, ratio, className = '' }) {
  return (
    <div className={`ph ${className}`} data-ph={id} role="img" aria-label={`Image placeholder: ${label || id}`}>
      <span className="ph-inner">
        <ImageIcon className="ph-icon" />
        <span className="ph-id">{id}</span>
        {label && <span className="ph-label">{label}</span>}
        {ratio && <span className="ph-ratio">{ratio}</span>}
      </span>
    </div>
  );
}
