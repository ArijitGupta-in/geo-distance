import {
    MEAN_EARTH_RADIUS_METERS,
    RADIANS_PER_DEGREE,
    normalizeCoordinate,
} from "@arijitgupta/geo-core";
import type { Coordinate, DMSCoordinate, DistanceUnit } from "./types.js";

const UNITS_PER_METER: Record<DistanceUnit, number> = {
    meters: 1,
    kilometers: 1e-3,
    miles: 1 / 1609.344,
    feet: 1 / 0.3048,
    nauticalMiles: 1 / 1852,
};

/** A validated decimal coordinate with its latitude terms precomputed for repeated use. */
export interface PreparedPoint {
    latitude: number;
    longitude: number;
    cosLatitude: number;
}

/** Returns the multiplier from meters to `unit`, or throws for an unsupported unit. */
export function unitsPerMeter(unit: DistanceUnit): number {
    if (!Object.hasOwn(UNITS_PER_METER, unit)) {
        throw new TypeError(`Unsupported distance unit: "${unit}"`);
    }
    return UNITS_PER_METER[unit];
}

/** Validates a decimal or DMS coordinate once and precomputes its latitude terms. */
export function preparePoint(input: Coordinate | DMSCoordinate): PreparedPoint {
    const { latitude, longitude } = normalizeCoordinate(input);
    return {
        latitude,
        longitude,
        cosLatitude: Math.cos(latitude * RADIANS_PER_DEGREE),
    };
}

/** Haversine great-circle distance in meters between two prepared points. */
export function metersBetween(a: PreparedPoint, b: PreparedPoint): number {
    const latitudeDifference = (b.latitude - a.latitude) * RADIANS_PER_DEGREE;
    const longitudeDifference =
        (b.longitude - a.longitude) * RADIANS_PER_DEGREE;

    // Rounding can push the sum just outside [0, 1] for near-antipodal points,
    // which would make a square root below NaN.
    const haversine = Math.min(
        1,
        Math.max(
            0,
            Math.sin(latitudeDifference / 2) ** 2 +
                a.cosLatitude *
                    b.cosLatitude *
                    Math.sin(longitudeDifference / 2) ** 2
        )
    );

    const angularDistance =
        2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

    return MEAN_EARTH_RADIUS_METERS * angularDistance;
}
