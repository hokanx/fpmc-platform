import { LegalPage } from "./legal/LegalPage";
import { DATENSCHUTZ } from "./legal/legalContent";

export function Datenschutz() {
  return <LegalPage doc={DATENSCHUTZ} />;
}
