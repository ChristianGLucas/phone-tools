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
`valid`/`possible`/`known` as `false`.

## Correctness

Golden values in the test suite are cross-checked against Google's **independent**
libphonenumber port (`google-libphonenumber`), a different codebase: E.164,
national form, region, number type, and validity agree across both
implementations. (International-form *styling* differs between the two libraries;
this package follows libphonenumber-js conventions for that field, while `e164` —
the interoperable representation — is oracle-verified.) `google-libphonenumber`
is a **dev-only** check and is not a runtime dependency.

## Composability

The nodes chain by field adapters. A runnable proof flow lives at
`flows/phone-countryinfo-parse.flow.yaml`: `CountryInfo → Parse` — look up a
region's example mobile number, then parse it into the full `PhoneNumber`
breakdown. It compiles and runs end to end.

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
