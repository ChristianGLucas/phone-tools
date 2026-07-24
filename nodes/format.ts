import { FormatInput, Formatted } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parseStrict,
  asCountryCode,
  lengthReason,
  up,
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
 * INTERNATIONAL, or RFC3966. Parses the input strictly (optionally with
 * `default_country` for national-format numbers) and re-emits it in the
 * requested `format`. Sets `valid` per region rules; formatting is best-effort
 * for a parseable-but-invalid number, in which case `error` carries the
 * invalidity reason so a caller is not misled into treating it as clean.
 * Unparseable input returns `error`; an unknown format returns
 * `error=UNKNOWN_FORMAT`. Deterministic and fully offline.
 */
export function format(ax: AxiomContext, input: FormatInput): Formatted {
  const out = new Formatted();

  const requested = up(input.getFormat()) || 'E.164';
  const fmt = FORMATS[requested];
  if (!fmt) {
    // Nothing applied — leave `format` empty and report a machine token.
    out.setError('UNKNOWN_FORMAT');
    return out;
  }
  out.setFormat(fmt);

  const text = input.getText() || '';
  if (text.length === 0) {
    out.setError('NOT_A_NUMBER');
    return out;
  }

  const country = asCountryCode(input.getDefaultCountry());
  const p = parseStrict(text, country);
  if (!p) {
    out.setError(lengthReason(text, country));
    return out;
  }

  const valid = p.isValid();
  out.setValid(valid);
  out.setText(p.format(fmt));
  // Best-effort text is still returned, but flag invalidity so an error-only
  // consumer is not misled into treating an invalid number as clean.
  if (!valid) out.setError(p.isPossible() ? 'INVALID' : lengthReason(p.number));
  return out;
}
