/**
 * @arijitgupta/geo-distance — public API surface.
 *
 * Exports the {@link distanceBetween} function and both coordinate types:
 * {@link Coordinate} (decimal degrees) and {@link DMSCoordinate} (DMS format).
 */
export type {
    Coordinate,
    DMSCoordinate,
    LatitudeDMS,
    LongitudeDMS,
    LatitudeDirection,
    LongitudeDirection,
    DistanceUnit,
} from "./types.js";
export { distanceBetween } from "./distanceBetween.js";
export { dmsToDecimal } from "./coordinate.js";
