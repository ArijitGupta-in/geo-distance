# @arijitgupta/geo-distance

[![npm version](https://img.shields.io/npm/v/@arijitgupta/geo-distance)](https://www.npmjs.com/package/@arijitgupta/geo-distance)
[![license](https://img.shields.io/npm/l/@arijitgupta/geo-distance)](https://opensource.org/licenses/MIT)

A lightweight, dependency-free TypeScript utility for estimating the great-circle distance between two
geographic coordinates using the Haversine formula.

## Installation

```bash
npm install @arijitgupta/geo-distance
```

## Usage

### JavaScript

```js
import { distanceBetween } from "@arijitgupta/geo-distance";

const kolkata = { latitude: 22.5726, longitude: 88.3639 };
const nearbyPoint = { latitude: 22.5736, longitude: 88.3649 };

const distanceInMeters = distanceBetween(kolkata, nearbyPoint);
console.log(distanceInMeters); // ~151 meters
```

### TypeScript

```ts
import {
    distanceBetween,
    type Coordinate,
} from "@arijitgupta/geo-distance";

const from: Coordinate = { latitude: 0, longitude: 0 };
const to: Coordinate = { latitude: 0, longitude: 1 };

const distanceInMeters: number = distanceBetween(from, to);
console.log(distanceInMeters); // ~111,195 meters
```

## API

### `distanceBetween(from, to)`

Returns the estimated great-circle distance between two coordinates in meters.

| Parameter | Type | Description |
| --- | --- | --- |
| `from` | `Coordinate` | Starting coordinate |
| `to` | `Coordinate` | Destination coordinate |

**Returns:** `number` — distance in meters.

### `Coordinate`

```ts
interface Coordinate {
    latitude: number;   // -90 to 90
    longitude: number;  // -180 to 180
}
```

## Behavior

- Uses the Haversine formula to compute the great-circle distance between two points on Earth.
- Returns a result in meters, using a fixed Earth radius of `6,371,000` meters.
- Accurate to within ~0.5% for most distances. Error increases at high latitudes due to Earth's oblate shape.
- Does not perform input validation or unit conversion.
- Has no runtime dependencies.

## Development

```bash
npm install       # install dev dependencies
npm test          # run tests with Vitest
npm run check     # type-check without emitting output
npm run build     # compile TypeScript to dist/
```

## License

MIT
