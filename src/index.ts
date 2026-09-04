/**
 * @arijitgupta/geo-distance — public API surface.
 *
 * Exports the {@link distanceBetween} function and both coordinate types:
 * {@link Coordinate} (decimal degrees) and {@link DMSCoordinate} (DMS format).
 */
export type { Coordinate } from "./Coordinate.js";
export type {
    DMSCoordinate,
    LatitudeDMS,
    LongitudeDMS,
    LatitudeDirection,
    LongitudeDirection,
} from "./DMSCoordinate.js";
export { distanceBetween } from "./distanceBetween.js";
export { dmsToDecimal } from "./DMSCoordinate.js";
