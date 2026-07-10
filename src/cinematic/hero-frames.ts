/* Hero frame-sequence manifest (extracted from the Seedance projector clip). */
export const HERO_FRAME_COUNT = 120;

export function heroFramePath(i: number): string {
  return `/media/cinematic/hero-frames/f${String(i + 1).padStart(4, "0")}.jpg`;
}

export const HERO_POSTER = "/media/cinematic/hero-poster.jpg";
