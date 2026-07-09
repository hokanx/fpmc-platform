import { LegalPage } from "./legal/LegalPage";
import { IMPRESSUM } from "./legal/legalContent";

export function Impressum() {
  return <LegalPage doc={IMPRESSUM} />;
}
