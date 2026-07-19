import { ParseInput } from '../gen/messages_pb';
import { parse } from './parse';
import { ctx } from './testkit';

function mk(text: string, country = ''): ParseInput {
  const i = new ParseInput();
  i.setText(text);
  if (country) i.setDefaultCountry(country);
  return i;
}

describe('Parse', () => {
  // Golden values below are cross-checked against Google's independent
  // libphonenumber port (google-libphonenumber): E.164, national form, country,
  // type and validity agree across both implementations.
  it('parses a US number in +E.164 with full breakdown', () => {
    const r = parse(ctx, mk('+14155552671'));
    expect(r.getValid()).toBe(true);
    expect(r.getPossible()).toBe(true);
    expect(r.getE164()).toBe('+14155552671');
    expect(r.getNational()).toBe('(415) 555-2671');
    expect(r.getInternational()).toBe('+1 415 555 2671');
    expect(r.getRfc3966()).toBe('tel:+14155552671');
    expect(r.getCountry()).toBe('US');
    expect(r.getCountryCallingCode()).toBe('1');
    expect(r.getType()).toBe('FIXED_LINE_OR_MOBILE');
    expect(r.getError()).toBe('');
  });

  it('parses a national-format number with default_country', () => {
    const r = parse(ctx, mk('020 7946 0958', 'GB'));
    expect(r.getValid()).toBe(true);
    expect(r.getE164()).toBe('+442079460958');
    expect(r.getNational()).toBe('020 7946 0958');
    expect(r.getCountry()).toBe('GB');
    expect(r.getCountryCallingCode()).toBe('44');
    expect(r.getType()).toBe('FIXED_LINE');
  });

  it('detects a GB mobile number type', () => {
    const r = parse(ctx, mk('+447400123456'));
    expect(r.getValid()).toBe(true);
    expect(r.getType()).toBe('MOBILE');
    expect(r.getCountry()).toBe('GB');
  });

  it('captures an extension', () => {
    const r = parse(ctx, mk('+1 415 555 2671 ext. 1234'));
    expect(r.getE164()).toBe('+14155552671');
    expect(r.getExt()).toBe('1234');
  });

  it('returns a parsed-but-invalid number with valid=false and error INVALID', () => {
    // Right length for US, but 555-555-5555 is not an assignable number.
    const r = parse(ctx, mk('+15555555555'));
    expect(r.getValid()).toBe(false);
    expect(r.getPossible()).toBe(true);
    expect(r.getE164()).toBe('+15555555555');
    expect(r.getError()).toBe('INVALID');
  });

  it('reports NOT_A_NUMBER on empty input', () => {
    const r = parse(ctx, mk(''));
    expect(r.getValid()).toBe(false);
    expect(r.getError()).toBe('NOT_A_NUMBER');
  });

  it('reports TOO_SHORT on a too-short number', () => {
    const r = parse(ctx, mk('+1 234'));
    expect(r.getValid()).toBe(false);
    expect(r.getError()).toBe('TOO_SHORT');
  });

  it('reports NOT_A_NUMBER on non-numeric text', () => {
    const r = parse(ctx, mk('not a phone'));
    expect(r.getValid()).toBe(false);
    expect(r.getError()).toBe('NOT_A_NUMBER');
  });

  it('rejects over-long input deterministically', () => {
    const r = parse(ctx, mk('+' + '1'.repeat(500)));
    expect(r.getError()).toBe('INPUT_TOO_LONG');
  });

  it('is deterministic across repeated calls', () => {
    const a = parse(ctx, mk('+14155552671')).getE164();
    const b = parse(ctx, mk('+14155552671')).getE164();
    expect(a).toBe(b);
  });
});
