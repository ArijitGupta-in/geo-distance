import type { Coordinate } from "./Coordinate.js";

/**
 * Calculates the distance between two geographic coordinates in meters.
 *
 * Uses the haversine formula to estimate the great-circle distance on Earth.
 *
 * @param from - The starting coordinate.
 * @param to - The destination coordinate.
 * @returns The distance between the coordinates in meters.
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
