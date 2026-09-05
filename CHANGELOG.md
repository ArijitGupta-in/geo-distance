# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] — 2026-09-05

### Added

- `unit` parameter on `distanceBetween` — choose the output unit: `"meters"` (default), `"kilometers"`, `"miles"`, or `"feet"`. Existing callers are unaffected.
- `DistanceUnit` type exported from the public API.
- `validateCoordinate` function for validating decimal-degree coordinates. Throws `RangeError` if latitude is outside `[-90, 90]` or longitude is outside `[-180, 180]`. Also exported from the public API so consumers can guard inputs independently.
- DMS (Degrees, Minutes, Seconds) coordinate support:
  - `DMSCoordinate`, `LatitudeDMS`, `LongitudeDMS`, `LatitudeDirection`, `LongitudeDirection` types.
  - `dmsToDecimal` — converts a `DMSCoordinate` to decimal degrees.
  - `latitudeDMSToDecimal` / `longitudeDMSToDecimal` — convert individual DMS components.
  - `distanceBetween` now accepts `DMSCoordinate` for either or both arguments; mixed formats are supported.

### Changed

- `distanceBetween` now validates decimal-degree inputs and throws `RangeError` for out-of-range values, consistent with DMS validation.
- `distanceBetween` throws `TypeError` (with the unit name in the message) when an unsupported `unit` value is passed.

### Internal

- All types and interfaces consolidated into `src/types.ts`.
- All coordinate logic (validation and DMS conversion) moved into `src/coordinate.ts`.

---

## [1.0.1] — 2026-09-01

### Added

- `distanceBetween(from, to)` — estimates the great-circle distance between two decimal-degree coordinates in meters using the Haversine formula.
- `Coordinate` interface (`latitude`, `longitude` in decimal degrees).
- ESM-only package with full TypeScript declarations.
- `exports` field in `package.json` for subpath resolution.
- `prepublishOnly` script to type-check, test, and build before publishing.

[1.1.0]: https://github.com/ArijitGupta-in/geo-distance/releases/tag/v1.1.0
[1.0.1]: https://github.com/ArijitGupta-in/geo-distance/releases/tag/v1.0.1
