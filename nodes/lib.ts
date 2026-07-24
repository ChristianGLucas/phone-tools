// Shared helpers for phone-tools nodes. All logic is a thin, deterministic wrapper
// around libphonenumber-js/max (full metadata → accurate number-type detection).
// Everything here is pure: no network, no state, no filesystem.

import {
  parsePhoneNumberFromString,
  validatePhoneNumberLength,
  findPhoneNumbersInText,
  getCountries,
  getCountryCallingCode,
  getExampleNumber,
  PhoneNumber as LibPhoneNumber,
  CountryCode,
} from 'libphonenumber-js/max';
import examples from 'libphonenumber-js/mobile/examples';
import { PhoneNumber } from '../gen/messages_pb';

const KNOWN_COUNTRIES = new Set<string>(getCountries());

export function up(raw: string): string {
  return (raw || '').trim().toUpperCase();
}

// A valid ISO 3166-1 alpha-2 CountryCode, or undefined when absent/unknown.
export function asCountryCode(raw: string): CountryCode | undefined {
  const c = up(raw);
  return c && KNOWN_COUNTRIES.has(c) ? (c as CountryCode) : undefined;
}

export function isKnownCountry(raw: string): boolean {
  return KNOWN_COUNTRIES.has(up(raw));
}

export function mapType(p: LibPhoneNumber): string {
  return p.getType() || 'UNKNOWN';
}

// Strict single-number parse: the WHOLE (trimmed) string must be one phone
// number. `extract: false` disables libphonenumber-js's default behavior of
// pulling a number out of surrounding prose, so "call me at 415 555 2671 ok?"
// is rejected rather than silently accepted. Used by Parse/Validate/Format;
// Extract deliberately keeps the extract-from-text behavior via
// findPhoneNumbersInText.
export function parseStrict(text: string, country?: CountryCode): LibPhoneNumber | undefined {
  const t = text.trim();
  return country
    ? parsePhoneNumberFromString(t, { defaultCountry: country, extract: false })
    : parsePhoneNumberFromString(t, { extract: false });
}

// Fill a canonical PhoneNumber message from a parsed libphonenumber-js number.
// `error` consistently explains why the number is not valid — empty when valid,
// INVALID when the length is plausible but the number fails region rules, or a
// length reason (TOO_SHORT / TOO_LONG / INVALID_LENGTH) otherwise — so a consumer
// never needs a second call to learn why `valid` is false.
export function newPhoneNumber(p: LibPhoneNumber): PhoneNumber {
  const m = new PhoneNumber();
  const valid = p.isValid();
  const possible = p.isPossible();
  m.setValid(valid);
  m.setPossible(possible);
  m.setE164(p.number); // already +E.164
  m.setNational(p.formatNational());
  m.setInternational(p.formatInternational());
  m.setRfc3966(p.format('RFC3966'));
  m.setCountry(p.country || '');
  m.setCountryCallingCode(String(p.countryCallingCode || ''));
  m.setType(mapType(p));
  m.setExt(p.ext || '');
  if (valid) m.setError('');
  else if (possible) m.setError('INVALID');
  else m.setError(lengthReason(p.number));
  return m;
}

// A failed-parse PhoneNumber carrying only a reason.
export function errorPhoneNumber(reason: string): PhoneNumber {
  const m = new PhoneNumber();
  m.setValid(false);
  m.setPossible(false);
  m.setError(reason);
  return m;
}

// Machine reason for a single input that failed to parse.
// validatePhoneNumberLength returns one of TOO_SHORT / TOO_LONG / INVALID_LENGTH /
// INVALID_COUNTRY / NOT_A_NUMBER, or undefined when the length is plausible but the
// number is still unparseable (treated as NOT_A_NUMBER).
export function lengthReason(text: string, country?: CountryCode): string {
  try {
    return validatePhoneNumberLength(text.trim(), country) || 'NOT_A_NUMBER';
  } catch {
    return 'NOT_A_NUMBER';
  }
}

export {
  parsePhoneNumberFromString,
  findPhoneNumbersInText,
  getCountryCallingCode,
  getExampleNumber,
  examples,
  CountryCode,
};
