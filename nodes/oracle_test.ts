// Independent-oracle test. The package under test wraps `libphonenumber-js`; a
// suite that checks its output against `libphonenumber-js` alone would use the
// implementation as its own oracle and could never catch a library-level bug.
// This test cross-checks the LIVE Parse node against Google's separate
// libphonenumber port (`google-libphonenumber`, a different codebase) and
// asserts they agree on the interoperable, unambiguous fields: E.164, region,
// number type, and validity. (International-form *styling* differs between the
// two libraries by design and is deliberately not asserted here.)
//
// google-libphonenumber is a devDependency only — it is never a runtime
// dependency of the published package.
import { ParseInput } from '../gen/messages_pb';
import { parse } from './parse';
import { ctx } from './testkit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gl = require('google-libphonenumber');

const util = gl.PhoneNumberUtil.getInstance();
const PNF = gl.PhoneNumberFormat;
const TYPE_NAME: Record<number, string> = {
  0: 'FIXED_LINE',
  1: 'MOBILE',
  2: 'FIXED_LINE_OR_MOBILE',
  3: 'TOLL_FREE',
  4: 'PREMIUM_RATE',
  5: 'SHARED_COST',
  6: 'VOIP',
  7: 'PERSONAL_NUMBER',
  8: 'PAGER',
  9: 'UAN',
  10: 'VOICEMAIL',
  [-1]: 'UNKNOWN',
};

// Numeric E.164 numbers spanning several regions and types. Each is a real,
// valid number that both implementations independently accept.
const NUMBERS = [
  '+14155552671', // US fixed-line-or-mobile
  '+442079460958', // GB fixed line
  '+447400123456', // GB mobile
  '+81312345678', // JP fixed line
  '+4930901820', // DE fixed line
  '+33142685300', // FR fixed line
  '+61293744000', // AU fixed line
  '+18002677539', // US toll-free
  '+911126177000', // IN fixed line
];

function ours(text: string) {
  const i = new ParseInput();
  i.setText(text);
  const r = parse(ctx, i);
  return { e164: r.getE164(), country: r.getCountry(), type: r.getType(), valid: r.getValid() };
}

function oracle(text: string) {
  const g = util.parseAndKeepRawInput(text, undefined);
  return {
    e164: util.format(g, PNF.E164),
    country: util.getRegionCodeForNumber(g),
    type: TYPE_NAME[util.getNumberType(g)],
    valid: util.isValidNumber(g),
  };
}

describe('Parse vs independent oracle (google-libphonenumber)', () => {
  it.each(NUMBERS)('agrees with the oracle on %s', (num) => {
    const a = ours(num);
    const b = oracle(num);
    expect(a.e164).toBe(b.e164);
    expect(a.country).toBe(b.country);
    expect(a.type).toBe(b.type);
    expect(a.valid).toBe(b.valid);
  });
});
