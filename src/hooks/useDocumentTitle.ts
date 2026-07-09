import { useEffect } from "react";

// Sets <title> per page; restores nothing (SPA, next page overwrites).
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · FPMC` : "FPMC — Film · Music · AI";
  }, [title]);
}
