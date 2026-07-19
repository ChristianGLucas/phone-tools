import { ParseInput, PhoneNumber } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  parsePhoneNumberFromString,
  asCountryCode,
  newPhoneNumber,
  errorPhoneNumber,
  lengthReason,
  MAX_SINGLE_LEN,
} from './lib';

/**
 * Parse a phone number string into its canonical parts: +E.164, national and
 * international display forms, RFC 3966 URI, detected region, country calling
 * code, number type (MOBILE, FIXED_LINE, and so on), and any extension. Sets
 * `valid` and `possible` per libphonenumber's region rules. A number that parses
 * but is not valid for its region is still returned with `valid=false`; input
 * that cannot be parsed at all returns a reason in `error` (NOT_A_NUMBER,
 * TOO_SHORT, and similar) with `valid=false`. Deterministic and fully offline.
 * `default_country` (ISO alpha-2) interprets national-format numbers.
 */
export function parse(ax: AxiomContext, input: ParseInput): PhoneNumber {
  const text = input.getText() || '';
  if (text.length === 0) return errorPhoneNumber('NOT_A_NUMBER');
  if (text.length > MAX_SINGLE_LEN) return errorPhoneNumber('INPUT_TOO_LONG');

  const country = asCountryCode(input.getDefaultCountry());
  const p = parsePhoneNumberFromString(text, country);
  if (!p) return errorPhoneNumber(lengthReason(text, country));
  return newPhoneNumber(p);
}
