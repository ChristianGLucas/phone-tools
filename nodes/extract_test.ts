import { ExtractInput } from '../gen/messages_pb';
import { extract } from './extract';
import { ctx } from './testkit';

function mk(text: string, country = ''): ExtractInput {
  const i = new ExtractInput();
  i.setText(text);
  if (country) i.setDefaultCountry(country);
  return i;
}

describe('Extract', () => {
  it('finds multiple numbers in free text, in order', () => {
    const r = extract(ctx, mk('Call +1 415 555 2671 or +44 20 7946 0958 today', 'US'));
    expect(r.getCount()).toBe(2);
    const e164 = r.getNumbersList().map((n) => n.getE164());
    expect(e164).toEqual(['+14155552671', '+442079460958']);
    expect(r.getNumbersList()[0].getCountry()).toBe('US');
    expect(r.getNumbersList()[1].getCountry()).toBe('GB');
    expect(r.getError()).toBe('');
  });

  it('returns zero results (no error) when no number is present', () => {
    const r = extract(ctx, mk('there is no phone number here'));
    expect(r.getCount()).toBe(0);
    expect(r.getNumbersList().length).toBe(0);
    expect(r.getError()).toBe('');
  });

  it('returns zero results on empty input', () => {
    const r = extract(ctx, mk(''));
    expect(r.getCount()).toBe(0);
  });

  it('marks each found number valid', () => {
    const r = extract(ctx, mk('reach me at +1 415 555 2671'));
    expect(r.getCount()).toBe(1);
    expect(r.getNumbersList()[0].getValid()).toBe(true);
    expect(r.getNumbersList()[0].getType()).toBe('FIXED_LINE_OR_MOBILE');
  });

  it('handles a large (well over the old scan-length cap) input without crashing', () => {
    const r = extract(ctx, mk('x'.repeat(60_000)));
    expect(r.getError()).toBe('');
    expect(r.getCount()).toBe(0);
  });

  it('is deterministic across repeated calls', () => {
    const t = 'nums: +14155552671, +442079460958';
    const a = extract(ctx, mk(t, 'US')).getNumbersList().map((n) => n.getE164());
    const b = extract(ctx, mk(t, 'US')).getNumbersList().map((n) => n.getE164());
    expect(a).toEqual(b);
  });
});
