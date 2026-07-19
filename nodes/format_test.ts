import { FormatInput } from '../gen/messages_pb';
import { format } from './format';
import { ctx } from './testkit';

function mk(text: string, fmt = '', country = ''): FormatInput {
  const i = new FormatInput();
  i.setText(text);
  if (fmt) i.setFormat(fmt);
  if (country) i.setDefaultCountry(country);
  return i;
}

describe('Format', () => {
  it('defaults to E.164 when no format given', () => {
    const r = format(ctx, mk('020 7946 0958', '', 'GB'));
    expect(r.getFormat()).toBe('E.164');
    expect(r.getText()).toBe('+442079460958');
    expect(r.getValid()).toBe(true);
    expect(r.getError()).toBe('');
  });

  it('formats NATIONAL', () => {
    const r = format(ctx, mk('+442079460958', 'national'));
    expect(r.getFormat()).toBe('NATIONAL');
    expect(r.getText()).toBe('020 7946 0958');
  });

  it('formats INTERNATIONAL', () => {
    const r = format(ctx, mk('+442079460958', 'INTERNATIONAL'));
    expect(r.getText()).toBe('+44 20 7946 0958');
  });

  it('formats RFC3966', () => {
    const r = format(ctx, mk('+14155552671', 'rfc3966'));
    expect(r.getText()).toBe('tel:+14155552671');
  });

  it('accepts E164 as a synonym for E.164', () => {
    const r = format(ctx, mk('+14155552671', 'e164'));
    expect(r.getFormat()).toBe('E.164');
    expect(r.getText()).toBe('+14155552671');
  });

  it('rejects an unknown format with a machine token and empty format', () => {
    const r = format(ctx, mk('+14155552671', 'morse'));
    expect(r.getText()).toBe('');
    expect(r.getFormat()).toBe('');
    expect(r.getError()).toBe('UNKNOWN_FORMAT');
  });

  it('reports a parse error for unparseable input', () => {
    const r = format(ctx, mk('nope', 'E.164'));
    expect(r.getText()).toBe('');
    expect(r.getError()).toBe('NOT_A_NUMBER');
  });

  it('flags a parseable-but-invalid number with best-effort text and error INVALID', () => {
    const r = format(ctx, mk('+15555555555', 'NATIONAL'));
    expect(r.getValid()).toBe(false);
    expect(r.getError()).toBe('INVALID');
    expect(r.getText().length).toBeGreaterThan(0); // best-effort formatting still returned
  });

  it('rejects prose that merely contains a number (strict parse)', () => {
    const r = format(ctx, mk('call me at 415 555 2671 ok?', 'E.164', 'US'));
    expect(r.getText()).toBe('');
    expect(r.getError()).not.toBe('');
    expect(r.getError()).not.toBe('INVALID');
  });

  it('rejects over-long input deterministically', () => {
    const r = format(ctx, mk('9'.repeat(500), 'E.164'));
    expect(r.getError()).toBe('INPUT_TOO_LONG');
  });
});
