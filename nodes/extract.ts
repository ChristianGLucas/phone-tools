import { ExtractInput, Extracted } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  findPhoneNumbersInText,
  asCountryCode,
  newPhoneNumber,
  MAX_EXTRACT_LEN,
  MAX_EXTRACT_RESULTS,
} from './lib';

/**
 * Scan free text and return every phone number found, in order of appearance,
 * each as a full parsed PhoneNumber (E.164, region, type, validity). Useful for
 * pulling numbers out of emails, documents, or model output. `default_country`
 * interprets national-format numbers written without a leading "+". Empty text
 * yields zero results; text over the scan cap or more matches than the result
 * cap set `error` (INPUT_TOO_LONG / RESULT_LIMIT) rather than truncating
 * silently. Deterministic and fully offline.
 */
export function extract(ax: AxiomContext, input: ExtractInput): Extracted {
  const out = new Extracted();
  const text = input.getText() || '';
  if (text.length === 0) {
    out.setCount(0);
    return out;
  }
  if (text.length > MAX_EXTRACT_LEN) {
    out.setError('INPUT_TOO_LONG');
    out.setCount(0);
    return out;
  }

  const country = asCountryCode(input.getDefaultCountry());
  const matches = findPhoneNumbersInText(text, country);
  for (const m of matches) {
    if (out.getNumbersList().length >= MAX_EXTRACT_RESULTS) {
      out.setError('RESULT_LIMIT');
      break;
    }
    out.addNumbers(newPhoneNumber(m.number));
  }
  out.setCount(out.getNumbersList().length);
  return out;
}
