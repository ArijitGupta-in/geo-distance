# @arijitgupta/geo-distance

[![npm version](https://img.shields.io/npm/v/@arijitgupta/geo-distance)](https://www.npmjs.com/package/@arijitgupta/geo-distance)
[![license](https://img.shields.io/npm/l/@arijitgupta/geo-distance)](https://opensource.org/licenses/MIT)

A lightweight TypeScript utility for estimating the great-circle distance between two
geographic coordinates using the Haversine formula. Shared coordinate types,
conversion, validation, and geographic constants are provided by
[`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core).

Accepts coordinates in **decimal degrees** or **Degrees, Minutes, Seconds (DMS)** format.

## Installation

```bash
npm install @arijitgupta/geo-distance
```

## Usage

### Decimal degrees

```ts
import {
    distanceBetween,
    type Coordinate,
} from "@arijitgupta/geo-distance";

const from: Coordinate = { latitude: 0, longitude: 0 };
const to: Coordinate = { latitude: 0, longitude: 1 };

distanceBetween(from, to);               // ~111,195 meters (default)
distanceBetween(from, to, "kilometers"); // ~111.195 km
distanceBetween(from, to, "miles");      // ~69.09 miles
distanceBetween(from, to, "feet");       // ~364,813 feet
```

### DMS coordinates

```ts
import {
    distanceBetween,
    type DMSCoordinate,
} from "@arijitgupta/geo-distance";

const kolkata: DMSCoordinate = {
    latitude:  { degrees: 22, minutes: 34, seconds: 21.36, direction: "N" },
    longitude: { degrees: 88, minutes: 21, seconds: 50.04, direction: "E" },
};

const newDelhi: DMSCoordinate = {
    latitude:  { degrees: 28, minutes: 38, seconds: 12,   direction: "N" },
    longitude: { degrees: 77, minutes: 12, seconds: 36,   direction: "E" },
};

const distanceInMeters: number = distanceBetween(kolkata, newDelhi);
console.log(distanceInMeters); // ~1,306,000 meters
```

Mixed formats are supported — `from` and `to` can each be either type independently.

### Converting DMS to decimal degrees

```ts
import { dmsToDecimal, type DMSCoordinate } from "@arijitgupta/geo-distance";

const dms: DMSCoordinate = {
    latitude:  { degrees: 22, minutes: 34, seconds: 21.36, direction: "N" },
    longitude: { degrees: 88, minutes: 21, seconds: 50.04, direction: "E" },
};

const decimal = dmsToDecimal(dms);
// { latitude: 22.5726, longitude: 88.3639 }
```

## API

### `distanceBetween(from, to, unit?)`

Returns the estimated great-circle distance between two coordinates.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `from` | `Coordinate \| DMSCoordinate` | — | Starting coordinate |
| `to` | `Coordinate \| DMSCoordinate` | — | Destination coordinate |
| `unit` | `DistanceUnit` | `"meters"` | Output unit |

**`DistanceUnit`:** `"meters"` \| `"kilometers"` \| `"miles"` \| `"feet"`

**Returns:** `number` — distance in the requested unit.

**Throws:** `RangeError` if coordinate values are outside their valid geographic
ranges, or if DMS degrees/minutes are not integers.

**Throws:** `TypeError` if coordinate fields or DMS directions have invalid types,
or if a decimal coordinate value is not finite.

**Throws:** `TypeError` if `unit` is not a supported `DistanceUnit`.

### `validateCoordinate(coord)`

Validates a decimal-degree `Coordinate`. Useful for checking inputs before passing them to `distanceBetween`.

**Throws:** `RangeError` if `latitude` or `longitude` is outside its valid range.
**Throws:** `TypeError` if the coordinate or either value has an invalid type, or
if either value is not finite.

### `dmsToDecimal(dms)`

Converts a `DMSCoordinate` to a decimal-degree `Coordinate`.

**Throws:** `RangeError` if any DMS component is out of range or degrees/minutes
are not integers.
**Throws:** `TypeError` if the DMS coordinate or a component has an invalid type,
or if a direction is invalid.

### `Coordinate`

```ts
interface Coordinate {
    latitude: number;   // -90 to 90
    longitude: number;  // -180 to 180
}
```

### `DMSCoordinate`

```ts
interface DMSCoordinate {
    latitude:  LatitudeDMS;
    longitude: LongitudeDMS;
}

interface LatitudeDMS {
    degrees:   number;             // 0–90
    minutes:   number;             // 0–59
    seconds:   number;             // 0–<60
    direction: "N" | "S";
}

interface LongitudeDMS {
    degrees:   number;             // 0–180
    minutes:   number;             // 0–59
    seconds:   number;             // 0–<60
    direction: "E" | "W";
}
```

**Validation rules:**

- `degrees` and `minutes` must be integers.
- `minutes` must be in `[0, 60)`.
- `seconds` must be in `[0, 60)`.
- `latitude.degrees` must be in `[0, 90]`; combined value must not exceed 90°.
- `longitude.degrees` must be in `[0, 180]`; combined value must not exceed 180°.

## Upgrading from 1.x

Version 2.0.0 uses [`@arijitgupta/geo-core`](https://www.npmjs.com/package/@arijitgupta/geo-core)
for coordinate types, conversion, and validation. Review these behavior changes when upgrading:

- DMS degrees and minutes must be integers; fractional seconds are still supported.
- Invalid DMS directions and non-finite decimal coordinate values throw `TypeError`.
- Converting a south/west DMS coordinate whose magnitude is zero now returns positive zero.

## Behavior

- Uses the Haversine formula to compute the great-circle distance between two points on Earth.
- Returns a result in the requested unit, using meters by default and a fixed Earth
    radius of `6,371,000` meters.
- Accurate to within ~0.5% for most distances. Error increases at high latitudes due to Earth's oblate shape.
- DMS coordinates are normalized to decimal degrees before the distance calculation.
- Uses `@arijitgupta/geo-core` for shared coordinate types, validation, conversion,
  and geographic constants.

## Development

```bash
npm install       # install dev dependencies
npm test          # run tests with Vitest
npm run check     # type-check without emitting output
npm run build     # compile TypeScript to dist/
```

## License

MIT
