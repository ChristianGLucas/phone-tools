import { ValidateInput, Validation } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parseStrict,
  asCountryCode,
  mapType,
  lengthReason,
  up,
} from './lib';

/**
 * Validate a phone number and return a compact verdict: `valid` (passes region
 * length and prefix rules), `possible` (plausible length), the detected region
 * and number type, and a machine-readable `reason` — VALID, TOO_SHORT, TOO_LONG,
 * INVALID_LENGTH, INVALID_COUNTRY, NOT_A_NUMBER, or INVALID (correct length but
 * fails region rules). Use this for a yes/no gate; use Parse for the full
 * breakdown. Parses strictly — the whole string must be one phone number, so
 * prose that merely contains a number does not validate. Deterministic and
 * fully offline.
 */
export function validate(ax: AxiomContext, input: ValidateInput): Validation {
  const out = new Validation();
  const text = input.getText() || '';
  if (text.length === 0) {
    out.setReason('NOT_A_NUMBER');
    return out;
  }

  const raw = up(input.getDefaultCountry());
  const country = asCountryCode(input.getDefaultCountry());
  // A supplied-but-unknown region is only fatal for a national-format number;
  // an already-+E.164 number ignores the default region.
  if (raw && !country && !text.trim().startsWith('+')) {
    out.setReason('INVALID_COUNTRY');
    return out;
  }

  const p = parseStrict(text, country);
  if (!p) {
    // Could not parse the whole string as one number: report the reason.
    out.setReason(lengthReason(text, country));
    return out;
  }

  const valid = p.isValid();
  const possible = p.isPossible();
  out.setValid(valid);
  out.setPossible(possible);
  out.setCountry(p.country || '');
  out.setType(mapType(p));
  if (valid) {
    out.setReason('VALID');
  } else if (possible) {
    // Plausible length but fails the region's prefix/format rules.
    out.setReason('INVALID');
  } else {
    // Parsed but implausible length: TOO_SHORT / TOO_LONG / INVALID_LENGTH.
    out.setReason(lengthReason(text, country));
  }
  return out;
}
