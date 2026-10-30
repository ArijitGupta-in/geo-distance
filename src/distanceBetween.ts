import { metersBetween, preparePoint, unitsPerMeter } from "./haversine.js";
import type { Coordinate, DMSCoordinate, DistanceUnit } from "./types.js";

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
 * @param unit - The unit for the returned distance. Defaults to `"meters"`.
 * @returns The estimated distance between the two coordinates in the requested unit.
 * @throws {RangeError} If coordinate values are out of range or DMS degrees/minutes are not integers.
 * @throws {TypeError} If coordinate fields are invalid or `unit` is unsupported.
 *
 * @example
 * ```ts
 * // Decimal degrees — default meters
 * const from: Coordinate = { latitude: 0, longitude: 0 };
 * const to: Coordinate = { latitude: 0, longitude: 1 };
 * distanceBetween(from, to);               // ~111,195 meters
 * distanceBetween(from, to, "kilometers"); // ~111.195 km
 * distanceBetween(from, to, "miles");      // ~69.11 miles
 * distanceBetween(from, to, "feet");       // ~364,879 feet
 * distanceBetween(from, to, "nauticalMiles"); // ~60.04 nautical miles
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
    to: Coordinate | DMSCoordinate,
    unit: DistanceUnit = "meters"
): number {
    const factor = unitsPerMeter(unit);
    return metersBetween(preparePoint(from), preparePoint(to)) * factor;
}
