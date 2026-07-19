import { CountryInfoInput } from '../gen/messages_pb';
import { countryInfo } from './country_info';
import { ctx } from './testkit';

function mk(country: string): CountryInfoInput {
  const i = new CountryInfoInput();
  i.setCountry(country);
  return i;
}

describe('CountryInfo', () => {
  it('returns the calling code and an example mobile for GB', () => {
    const r = countryInfo(ctx, mk('GB'));
    expect(r.getKnown()).toBe(true);
    expect(r.getCountry()).toBe('GB');
    expect(r.getCallingCode()).toBe('44');
    // Example mobile is a real +E.164 number for the region.
    expect(r.getExampleMobileE164()).toBe('+447400123456');
    expect(r.getError()).toBe('');
  });

  it('handles JP and US calling codes', () => {
    expect(countryInfo(ctx, mk('JP')).getCallingCode()).toBe('81');
    expect(countryInfo(ctx, mk('US')).getCallingCode()).toBe('1');
  });

  it('lower-cases input is normalized', () => {
    const r = countryInfo(ctx, mk('gb'));
    expect(r.getKnown()).toBe(true);
    expect(r.getCountry()).toBe('GB');
    expect(r.getCallingCode()).toBe('44');
  });

  it('reports an unknown region without throwing', () => {
    const r = countryInfo(ctx, mk('ZZ'));
    expect(r.getKnown()).toBe(false);
    expect(r.getCallingCode()).toBe('');
    expect(r.getError()).toBe('UNKNOWN_REGION');
    expect(r.getCountry()).toBe('ZZ'); // requested value echoed
  });

  it('reports empty input as unknown', () => {
    const r = countryInfo(ctx, mk(''));
    expect(r.getKnown()).toBe(false);
    expect(r.getError()).toBe('UNKNOWN_REGION');
  });
});
