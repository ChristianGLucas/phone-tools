import { FormatInput, Formatted } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePhoneNumberFromString,
  asCountryCode,
  lengthReason,
  up,
  MAX_SINGLE_LEN,
} from './lib';

// Accepted target notations (input is case-insensitive; "E164" is accepted as
// a synonym for "E.164").
const FORMATS: Record<string, 'E.164' | 'NATIONAL' | 'INTERNATIONAL' | 'RFC3966'> = {
  'E.164': 'E.164',
  E164: 'E.164',
  NATIONAL: 'NATIONAL',
  INTERNATIONAL: 'INTERNATIONAL',
  RFC3966: 'RFC3966',
};

/**
 * Reformat a phone number into a chosen notation: E.164 (default), NATIONAL,
 * INTERNATIONAL, or RFC3966. Parses the input (optionally with `default_country`
 * for national-format numbers) and re-emits it in the requested `format`. Sets
 * `valid` per region rules; formatting is best-effort for a parseable-but-invalid
 * number. Unparseable input or an unknown format returns `error`. Deterministic
 * and fully offline.
 */
export function format(ax: AxiomContext, input: FormatInput): Formatted {
  const out = new Formatted();

  const requested = up(input.getFormat()) || 'E.164';
  const fmt = FORMATS[requested];
  if (!fmt) {
    out.setFormat(requested);
    out.setError(`unknown format: ${input.getFormat()}`);
    return out;
  }
  out.setFormat(fmt);

  const text = input.getText() || '';
  if (text.length === 0) {
    out.setError('NOT_A_NUMBER');
    return out;
  }
  if (text.length > MAX_SINGLE_LEN) {
    out.setError('INPUT_TOO_LONG');
    return out;
  }

  const country = asCountryCode(input.getDefaultCountry());
  const p = parsePhoneNumberFromString(text, country);
  if (!p) {
    out.setError(lengthReason(text, country));
    return out;
  }

  out.setValid(p.isValid());
  out.setText(p.format(fmt));
  return out;
}
