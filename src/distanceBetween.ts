import type { Coordinate, DMSCoordinate } from "./types.js";
import { dmsToDecimal } from "./dms.js";

function isDMSCoordinate(coord: Coordinate | DMSCoordinate): coord is DMSCoordinate {
    return typeof coord.latitude === "object";
}

function normalize(coord: Coordinate | DMSCoordinate): Coordinate {
    return isDMSCoordinate(coord) ? dmsToDecimal(coord) : coord;
}

/**
 * Estimates the great-circle distance between two geographic coordinates in meters.
 *
 * Accepts coordinates in either decimal-degree ({@link Coordinate}) or
 * DMS ({@link DMSCoordinate}) format. Mixed formats are supported.
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
 * // Decimal degrees
 * const from: Coordinate = { latitude: 0, longitude: 0 };
 * const to: Coordinate = { latitude: 0, longitude: 1 };
 * distanceBetween(from, to); // ~111,195 meters
 * ```
 *
 * @example
 * ```ts
 * // DMS coordinates
 * const kolkata: DMSCoordinate = {
 *     latitude:  { degrees: 22, minutes: 34, seconds: 21.36, direction: "N" },
 *     longitude: { degrees: 88, minutes: 21, seconds: 50.04, direction: "E" },
 * };
 * distanceBetween(kolkata, kolkata); // 0
 * ```
 */
export function distanceBetween(
    from: Coordinate | DMSCoordinate,
    to: Coordinate | DMSCoordinate
): number {
    const a = normalize(from);
    const b = normalize(to);

    const earthRadius = 6_371_000;

    const latitudeDifference = (b.latitude - a.latitude) * (Math.PI / 180);
    const longitudeDifference = (b.longitude - a.longitude) * (Math.PI / 180);

    const fromLatitude = a.latitude * (Math.PI / 180);
    const toLatitude = b.latitude * (Math.PI / 180);

    const haversine =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(fromLatitude) *
            Math.cos(toLatitude) *
            Math.sin(longitudeDifference / 2) ** 2;

    const angularDistance =
        2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return earthRadius * angularDistance;
}
