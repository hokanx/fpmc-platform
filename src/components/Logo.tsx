import logoUrl from "../../assets/FPMC_LOGO_vector_white.svg";

// The web wordmark: white vector on void. Achromatic, crisp at any size.
export function Logo({ className }: { className?: string }) {
  return (
    <img
      src={logoUrl}
      alt="FPMC"
      className={className}
      draggable={false}
      decoding="async"
    />
  );
}
