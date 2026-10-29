import {
    MEAN_EARTH_RADIUS_METERS,
    RADIANS_PER_DEGREE,
    dmsToDecimal,
    validateCoordinate,
} from "@arijitgupta/geo-core";
import type { Coordinate, DMSCoordinate, DistanceUnit } from "./types.js";

const METERS_PER: Record<DistanceUnit, number> = {
    meters: 1,
    kilometers: 1e-3,
    miles: 1 / 1609.344,
    feet: 1 / 0.3048,
};

function isDMSCoordinate(
    coord: Coordinate | DMSCoordinate
): coord is DMSCoordinate {
    return typeof coord.latitude !== "number";
}

function normalize(coord: Coordinate | DMSCoordinate): Coordinate {
    if (isDMSCoordinate(coord)) {
        return dmsToDecimal(coord);
    }
    validateCoordinate(coord);
    return coord;
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
    if (!Object.hasOwn(METERS_PER, unit)) {
        throw new TypeError(`Unsupported distance unit: "${unit}"`);
    }

    const a = normalize(from);
    const b = normalize(to);

    const latitudeDifference = (b.latitude - a.latitude) * RADIANS_PER_DEGREE;
    const longitudeDifference =
        (b.longitude - a.longitude) * RADIANS_PER_DEGREE;

    const fromLatitude = a.latitude * RADIANS_PER_DEGREE;
    const toLatitude = b.latitude * RADIANS_PER_DEGREE;

    const haversine =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(fromLatitude) *
            Math.cos(toLatitude) *
            Math.sin(longitudeDifference / 2) ** 2;

    const angularDistance =
        2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return MEAN_EARTH_RADIUS_METERS * angularDistance * METERS_PER[unit];
}
