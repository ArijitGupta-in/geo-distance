# @arijitgupta/geo-distance

A small TypeScript utility for calculating the distance between two geographic coordinates.

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
```

## API

### `distanceBetween(from, to)`

Calculates the distance between two coordinates and returns the result in meters.

- `from: Coordinate` — starting coordinate.
- `to: Coordinate` — destination coordinate.
- Returns `number` — distance in meters.

### `Coordinate`

An object with geographic coordinates expressed in degrees:

```ts
interface Coordinate {
    latitude: number;
    longitude: number;
}
```

Latitude is expected to range from `-90` to `90`, and longitude from `-180` to `180`.

## Units and behavior

`distanceBetween` returns meters. It uses the Haversine formula to estimate great-circle distance on Earth, using a fixed Earth radius of 6,371,000 meters. The package does not provide unit-conversion options or runtime coordinate validation.

## Development

```bash
npm install
npm test
npm run check
npm run build
```

## License

MIT License.
