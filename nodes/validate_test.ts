import { ValidateInput } from '../gen/messages_pb';
import { validate } from './validate';
import { ctx } from './testkit';

function mk(text: string, country = ''): ValidateInput {
  const i = new ValidateInput();
  i.setText(text);
  if (country) i.setDefaultCountry(country);
  return i;
}

describe('Validate', () => {
  it('accepts a valid number with reason VALID', () => {
    const r = validate(ctx, mk('+14155552671'));
    expect(r.getValid()).toBe(true);
    expect(r.getPossible()).toBe(true);
    expect(r.getCountry()).toBe('US');
    expect(r.getType()).toBe('FIXED_LINE_OR_MOBILE');
    expect(r.getReason()).toBe('VALID');
  });

  it('validates a national number with default_country', () => {
    const r = validate(ctx, mk('020 7946 0958', 'GB'));
    expect(r.getValid()).toBe(true);
    expect(r.getReason()).toBe('VALID');
    expect(r.getCountry()).toBe('GB');
  });

  it('flags a plausible-length but non-assignable number as INVALID', () => {
    const r = validate(ctx, mk('+15555555555'));
    expect(r.getValid()).toBe(false);
    expect(r.getPossible()).toBe(true);
    expect(r.getReason()).toBe('INVALID');
  });

  it('reports TOO_SHORT', () => {
    const r = validate(ctx, mk('+1 234'));
    expect(r.getValid()).toBe(false);
    expect(r.getReason()).toBe('TOO_SHORT');
  });

  it('reports NOT_A_NUMBER on empty and non-numeric input', () => {
    expect(validate(ctx, mk('')).getReason()).toBe('NOT_A_NUMBER');
    expect(validate(ctx, mk('hello world')).getReason()).toBe('NOT_A_NUMBER');
  });

  it('does not validate prose that merely contains a number (strict gate)', () => {
    const r = validate(ctx, mk('my cell is 415 555 2671 thanks!', 'US'));
    expect(r.getValid()).toBe(false);
    expect(r.getReason()).not.toBe('VALID');
  });

  it('does not validate a number with trailing junk', () => {
    const r = validate(ctx, mk('+14155552671 call me maybe'));
    expect(r.getValid()).toBe(false);
    expect(r.getReason()).not.toBe('VALID');
  });

  it('reports INVALID_COUNTRY for a national number with an unknown region', () => {
    const r = validate(ctx, mk('020 7946 0958', 'ZZ'));
    expect(r.getValid()).toBe(false);
    expect(r.getReason()).toBe('INVALID_COUNTRY');
  });

  it('ignores an unknown default region for an +E.164 number', () => {
    const r = validate(ctx, mk('+442079460958', 'ZZ'));
    expect(r.getValid()).toBe(true);
    expect(r.getReason()).toBe('VALID');
  });

  it('handles a very long (well over the old length cap) input without crashing', () => {
    const r = validate(ctx, mk('9'.repeat(500)));
    expect(r.getReason().length).toBeGreaterThan(0);
    expect(r.getValid()).toBe(false);
  });
});
