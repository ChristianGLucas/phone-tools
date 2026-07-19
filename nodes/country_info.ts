import { CountryInfoInput, CountryInfo } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import {
  isKnownCountry,
  getCountryCallingCode,
  getExampleNumber,
  examples,
  up,
  CountryCode,
} from './lib';

/**
 * Look up dialing metadata for a region: its country calling code (e.g. "44" for
 * GB) and a valid example mobile number in +E.164 form, sourced from bundled
 * libphonenumber metadata. `country` is an ISO 3166-1 alpha-2 code. An unknown
 * region returns `known=false` with `error`. Deterministic and fully offline.
 */
export function countryInfo(ax: AxiomContext, input: CountryInfoInput): CountryInfo {
  const out = new CountryInfo();
  const cc = up(input.getCountry());
  out.setCountry(cc);

  if (!isKnownCountry(cc)) {
    // The requested value is echoed in `country`; `error` is a machine token.
    out.setKnown(false);
    out.setError('UNKNOWN_REGION');
    return out;
  }

  out.setKnown(true);
  out.setCallingCode(getCountryCallingCode(cc as CountryCode));
  const ex = getExampleNumber(cc as CountryCode, examples);
  out.setExampleMobileE164(ex ? ex.number : '');
  return out;
}
