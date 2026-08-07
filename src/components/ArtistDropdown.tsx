/* Expandable artist note — sits next to the artist name in the release section.
 * The name is display type (not a link); a dedicated Instagram icon opens the
 * profile. An "About the artist" toggle with a chevron expands the bio + photo.
 */
import { useState } from "react";

import { useI18n } from "../i18n";

const RADI_IMG = "/media/artist/radi.jpg";

function InstagramIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={open ? "fpmc-artist-drop-arrow is-open" : "fpmc-artist-drop-arrow"}
      width="11"
      height="7"
      viewBox="0 0 11 7"
      fill="none"
      aria-hidden
    >
      <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

type Props = {
  name: string;
  href: string;
  intro: string;
};

export function ArtistDropdown({ name, href, intro }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <div className="fpmc-artist-drop">
      <div className="fpmc-artist-drop-row">
        <span className="fpmc-artist-drop-name">{name}</span>
        <a
          className="fpmc-artist-drop-icon"
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={t("artist.note.ig")}
        >
          <InstagramIcon />
        </a>
        <button
          type="button"
          className="fpmc-artist-drop-toggle"
          aria-expanded={open}
          aria-label={t("artist.note.toggle")}
          onClick={() => setOpen((o) => !o)}
        >
          <span>{t("artist.note.toggle")}</span>
          <Chevron open={open} />
        </button>
      </div>

      {open ? (
        <div className="fpmc-artist-drop-body">
          <img src={RADI_IMG} alt={name} loading="lazy" decoding="async" />
          <div className="fpmc-artist-drop-text">
            {intro
              .split("\n\n")
              .filter(Boolean)
              .map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}