# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

## [2.1.0] — 2026-10-30

### Added

- `"nauticalMiles"` distance unit (1 nautical mile = 1852 m), added to `DistanceUnit`.
- `pathLength(path, unit?)`: total length of a path of coordinates.
- `distanceMatrix(from, to, unit?)`: distances from every coordinate in `from` to every coordinate in `to`.
  Both batch helpers validate each coordinate once instead of once per pair.
- `lint:md` and `test:coverage` scripts, `tsconfig.test.json`, and `vitest.config.ts` with an 80% coverage threshold,
  all run in CI.
- `publishConfig.access: "public"` in `package.json`.

### Fixed

- `distanceBetween` no longer returns `NaN` for some antipodal and near-antipodal points, where floating-point
  rounding pushed the intermediate Haversine value slightly above 1. It now returns about half the Earth's circumference.

### Changed

- Coordinate handling uses `normalizeCoordinate` from `@arijitgupta/geo-core`, so `null` and other malformed
  coordinates now throw geo-core's specific `TypeError` messages, consistent with the other packages.
  Longitude `-180` is treated as `180`, which does not change distances.
- `npm run check` now also type-checks the tests.
- Source maps and declaration maps are no longer generated, because the published package does not include `src`.
- CI uses `actions/checkout@v6` and `actions/setup-node@v6` with read-only `contents` permissions.

### Internal

- The Haversine calculation lives in an internal module shared by `distanceBetween` and the batch helpers, with the
  latitude cosine computed once per coordinate.
- The re-export tests were reduced to a smoke test; validation and conversion behavior is tested in geo-core.
- Added the `Publish to npm` workflow for trusted publishing.

## [2.0.0] — 2026-10-30

### Breaking changes

- DMS degrees and minutes must now be integers; values with fractional degrees or
  minutes that were accepted by 1.x are rejected. Fractional seconds remain valid.
- Invalid DMS directions now throw `TypeError`.
- Non-finite decimal coordinate values now throw `TypeError` instead of `RangeError`.
- DMS values representing zero now convert to positive zero, including south/west zero.

### Changed

- Use `@arijitgupta/geo-core` v1.0.0 for shared coordinate types, conversion,
  validation, and geographic constants.

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
[2.0.0]: https://github.com/ArijitGupta-in/geo-distance/releases/tag/v2.0.0
