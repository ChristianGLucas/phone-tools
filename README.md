# phone-tools

Composable **phone-number** nodes for the [Axiom](https://axiomide.com)
marketplace, published as `christiangeorgelucas/phone-tools`. Parse, validate,
format, extract, and look up phone numbers for any country — entirely offline
and deterministically.

Written in **TypeScript**, wrapping one battle-tested, permissively-licensed
library:

| Concern | Library | License |
|---|---|---|
| Phone parsing / validation / formatting | [`libphonenumber-js`](https://github.com/catamphetamine/libphonenumber-js) (a zero-dependency rewrite of Google's [libphonenumber](https://github.com/google/libphonenumber)) | MIT |

Every node is **stateless**, **offline** (region metadata is bundled — no
network calls, no API keys, no signup), and **deterministic**: the same input
always yields the same output. The package imports `libphonenumber-js/max` (full
metadata) so number-type detection is accurate.

## Nodes

| Node | Input → Output | Purpose |
|---|---|---|
| `Parse` | `ParseInput` → `PhoneNumber` | Full breakdown: E.164, national/international/RFC3966 forms, region, calling code, type, extension, validity |
| `Validate` | `ValidateInput` → `Validation` | Compact yes/no verdict with a machine-readable reason |
| `Format` | `FormatInput` → `Formatted` | Reformat into E.164 / NATIONAL / INTERNATIONAL / RFC3966 |
| `Extract` | `ExtractInput` → `Extracted` | Find every phone number in free text |
| `CountryInfo` | `CountryInfoInput` → `CountryInfo` | Region calling code + an example mobile number |

`default_country` (ISO 3166-1 alpha-2, e.g. `US`, `GB`, `JP`) interprets
national-format numbers written without a leading `+`; it is ignored for numbers
already in `+E.164` form.

`Parse`, `Validate`, and `Format` parse **strictly**: the whole string must be a
single phone number, so prose that merely contains a number (`"call me at 415
555 2671 ok?"`) does not parse — use `Extract` to pull numbers out of free text.
Alphabetic vanity numbers (e.g. `1-800-FLOWERS`) are not supported.

### The canonical `PhoneNumber` envelope

`Parse` emits it and `Extract` repeats it. Key fields:

- `valid` — passes the region's length **and** prefix rules.
- `possible` — plausible length (weaker than `valid`).
- `e164` — canonical `+E.164`, the interoperable form, e.g. `+14155552671`.
- `national` / `international` / `rfc3966` — display forms.
- `country`, `country_calling_code`, `type` (`MOBILE`, `FIXED_LINE`, …), `ext`.
- `error` — why the number is not valid (`NOT_A_NUMBER`, `TOO_SHORT`, `INVALID`,
  …); empty when valid.

**proto3 JSON note:** default scalar values (`false`, `""`, `0`) are omitted from
the JSON emitted over the HTTP bridge, so a consumer must treat a missing
`valid`/`possible`/`known` as `false`. In particular, a successful `Extract` scan
that finds nothing returns `{}` — treat a missing `count` as `0` and a missing
`numbers` as `[]`.

## Correctness

The test suite includes an **independent-oracle** test (`nodes/oracle_test.ts`)
that runs the live `Parse` node against Google's separate libphonenumber port
(`google-libphonenumber`, a different codebase) over numbers spanning several
regions and types, asserting they agree on the interoperable fields: **E.164,
region, number type, and validity**. This catches library-level bugs that a
suite checking `libphonenumber-js` against itself never could. (International-form
*styling* differs between the two libraries by design; this package follows
libphonenumber-js conventions for that field, and it is not asserted against the
oracle.) `google-libphonenumber` is a **dev-only** dependency, never shipped at
runtime.

## Composability

The nodes chain by field adapters. A runnable proof flow ships with this package
at `flows/phone-countryinfo-parse.flow.yaml`: `CountryInfo → Parse` — look up a
region's example mobile number, then parse it into the full `PhoneNumber`
breakdown. It compiles and runs end to end (`axiom flow compile` then
`axiom flow run <artifact> -d '{"country":"GB"}'`).

## Development

```bash
axiom validate     # static checks
axiom test         # unit tests (goldens + error/boundary paths)
axiom dev          # local HTTP bridge (prints the port it binds)
```

## License

MIT — © 2026 Christian George Lucas. Built for the Axiom marketplace.
`libphonenumber-js` is MIT-licensed; it is a rewrite of Google's libphonenumber
(Apache-2.0). See `THIRD_PARTY_NOTICES.md`.
