import { metersBetween, preparePoint, unitsPerMeter } from "./haversine.js";
import type { PreparedPoint } from "./haversine.js";
import type { Coordinate, DMSCoordinate, DistanceUnit } from "./types.js";

type CoordinateInput = Coordinate | DMSCoordinate;

function preparePoints(
    points: readonly CoordinateInput[],
    name: string
): PreparedPoint[] {
    if (!Array.isArray(points)) {
        throw new TypeError(`${name} must be an array of coordinates`);
    }
    return points.map(preparePoint);
}

/**
 * Sums the great-circle distances between consecutive coordinates of a path.
 *
 * Each coordinate is validated once, so an invalid coordinate anywhere in the
 * path throws even when it would not affect the sum. A path with fewer than two
 * coordinates has length 0.
 *
 * @param path - Ordered coordinates, in decimal degrees or DMS (formats may be mixed).
 * @param unit - The unit for the returned length. Defaults to `"meters"`.
 * @throws {RangeError} If a coordinate is out of range.
 * @throws {TypeError} If `path` is not an array, a coordinate is invalid, or `unit` is unsupported.
 *
 * @example
 * ```ts
 * pathLength(
 *     [{ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 }, { latitude: 1, longitude: 1 }],
 *     "kilometers"
 * ); // ~222.39
 * ```
 */
export function pathLength(
    path: readonly CoordinateInput[],
    unit: DistanceUnit = "meters"
): number {
    const factor = unitsPerMeter(unit);
    const points = preparePoints(path, "Path");

    let meters = 0;
    for (let i = 1; i < points.length; i++) {
        meters += metersBetween(
            points[i - 1] as PreparedPoint,
            points[i] as PreparedPoint
        );
    }
    return meters * factor;
}

/**
 * Computes the distance from every coordinate in `from` to every coordinate in `to`.
 *
 * Each coordinate is validated once. The result has one row per `from`
 * coordinate and one column per `to` coordinate: `result[i][j]` is the distance
 * from `from[i]` to `to[j]`.
 *
 * @param from - Origin coordinates, in decimal degrees or DMS (formats may be mixed).
 * @param to - Destination coordinates, in decimal degrees or DMS.
 * @param unit - The unit for the returned distances. Defaults to `"meters"`.
 * @throws {RangeError} If a coordinate is out of range.
 * @throws {TypeError} If an argument is not an array, a coordinate is invalid, or `unit` is unsupported.
 *
 * @example
 * ```ts
 * const matrix = distanceMatrix(
 *     [{ latitude: 0, longitude: 0 }],
 *     [{ latitude: 0, longitude: 1 }, { latitude: 1, longitude: 0 }],
 *     "kilometers"
 * ); // [[~111.19, ~111.19]]
 * ```
 */
export function distanceMatrix(
    from: readonly CoordinateInput[],
    to: readonly CoordinateInput[],
    unit: DistanceUnit = "meters"
): number[][] {
    const factor = unitsPerMeter(unit);
    const origins = preparePoints(from, "From");
    const destinations = preparePoints(to, "To");

    return origins.map((origin) =>
        destinations.map(
            (destination) => metersBetween(origin, destination) * factor
        )
    );
}
