# @arijitgupta/geo-distance

A lightweight TypeScript utility for estimating the distance between two geographic coordinates using the Haversine formula.

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
console.log(distanceInMeters);
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

Returns the estimated distance between two coordinates in meters.

Parameters:

- `from: Coordinate` — starting coordinate.
- `to: Coordinate` — destination coordinate.

Returns:

- `number` — the distance in meters.

### `Coordinate`

```ts
interface Coordinate {
    latitude: number;
    longitude: number;
}
```

Latitude should be in the range `-90` to `90`, and longitude should be in the range `-180` to `180`.

## Behavior

- Uses the Haversine formula to calculate the great-circle distance between two points on Earth.
- Returns a result in meters.
- Uses a fixed Earth radius of `6_371_000` meters.
- Does not perform runtime validation or convert between units.

## Notes

This package is intentionally small and dependency-free. It is designed for straightforward geographic distance calculations in JavaScript and TypeScript applications.

## Development

```bash
npm install
npm test
npm run check
npm run build
```

## License

MIT
