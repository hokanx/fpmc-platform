/* Expandable artist note — sits next to the artist name in the release section.
 * A small toggle reveals a one-line introduction and the artist's photo.
 */
import { useState } from "react";

import { useI18n } from "../i18n";

const RADI_IMG = "/media/artist/radi.jpg";

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
        <a href={href} target="_blank" rel="noreferrer noopener">
          {name}
        </a>
        <button
          type="button"
          className="fpmc-artist-drop-toggle"
          aria-expanded={open}
          aria-label={open ? t("artist.note.hide") : t("artist.note.show")}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "−" : "+"}
        </button>
      </div>

      {open ? (
        <div className="fpmc-artist-drop-body">
          <img src={RADI_IMG} alt={name} loading="lazy" decoding="async" />
          <p>{intro}</p>
        </div>
      ) : null}
    </div>
  );
}