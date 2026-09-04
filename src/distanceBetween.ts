import type { Coordinate } from "./Coordinate.js";

/**
 * Estimates the great-circle distance between two geographic coordinates in meters.
 *
 * Uses the Haversine formula with a fixed Earth radius of 6,371,000 m (mean spherical radius).
 * Accurate to within ~0.5% for most distances; error increases at high latitudes due to
 * Earth's oblate shape.
 *
 * @param from - The starting coordinate.
 * @param to - The destination coordinate.
 * @returns The estimated distance between the two coordinates, in meters.
 *
 * @example
 * ```ts
 * const from: Coordinate = { latitude: 0, longitude: 0 };
 * const to: Coordinate = { latitude: 0, longitude: 1 };
 * distanceBetween(from, to); // ~111,195 meters
 * ```
 */
export function distanceBetween(from: Coordinate, to: Coordinate): number {
    const earthRadius = 6_371_000;

    const latitudeDifference = (to.latitude - from.latitude) * (Math.PI / 180);

    const longitudeDifference =
        (to.longitude - from.longitude) * (Math.PI / 180);

    const fromLatitude = from.latitude * (Math.PI / 180);
    const toLatitude = to.latitude * (Math.PI / 180);

    const a =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(fromLatitude) *
            Math.cos(toLatitude) *
            Math.sin(longitudeDifference / 2) ** 2;

    const angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * angularDistance;
}
