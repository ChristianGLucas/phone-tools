import { ValidateInput, Validation } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePhoneNumberFromString,
  asCountryCode,
  mapType,
  lengthReason,
  up,
  MAX_SINGLE_LEN,
} from './lib';

/**
 * Validate a phone number and return a compact verdict: `valid` (passes region
 * length and prefix rules), `possible` (plausible length), the detected region
 * and number type, and a machine-readable `reason` — VALID, TOO_SHORT, TOO_LONG,
 * INVALID_LENGTH, INVALID_COUNTRY, NOT_A_NUMBER, or INVALID (correct length but
 * fails region rules). Use this for a yes/no gate; use Parse for the full
 * breakdown. Deterministic and fully offline.
 */
export function validate(ax: AxiomContext, input: ValidateInput): Validation {
  const out = new Validation();
  const text = input.getText() || '';
  if (text.length === 0) {
    out.setReason('NOT_A_NUMBER');
    return out;
  }
  if (text.length > MAX_SINGLE_LEN) {
    out.setReason('INPUT_TOO_LONG');
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

  const p = parsePhoneNumberFromString(text, country);
  if (!p) {
    // Could not parse at all: report the length-based reason.
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
