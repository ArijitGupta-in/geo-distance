import { describe, expect, it } from "vitest";
import type { Coordinate, DMSCoordinate } from "./index.js";
import { distanceBetween, distanceMatrix, pathLength } from "./index.js";

const origin: Coordinate = { latitude: 0, longitude: 0 };
const east: Coordinate = { latitude: 0, longitude: 1 };
const northEast: Coordinate = { latitude: 1, longitude: 1 };

describe("pathLength", () => {
    it("sums the distances between consecutive coordinates", () => {
        const expected =
            distanceBetween(origin, east) + distanceBetween(east, northEast);
        expect(pathLength([origin, east, northEast])).toBeCloseTo(expected, 6);
    });

    it("returns 0 for empty and single-coordinate paths", () => {
        expect(pathLength([])).toBe(0);
        expect(pathLength([origin])).toBe(0);
    });

    it("converts the total to the requested unit", () => {
        const meters = pathLength([origin, east, northEast]);
        expect(pathLength([origin, east, northEast], "kilometers")).toBeCloseTo(
            meters / 1000,
            10
        );
        expect(
            pathLength([origin, east, northEast], "nauticalMiles")
        ).toBeCloseTo(meters / 1852, 10);
    });

    it("accepts mixed decimal and DMS coordinates", () => {
        const dmsEast: DMSCoordinate = {
            latitude: { degrees: 0, minutes: 0, seconds: 0, direction: "N" },
            longitude: { degrees: 1, minutes: 0, seconds: 0, direction: "E" },
        };
        expect(pathLength([origin, dmsEast])).toBeCloseTo(
            distanceBetween(origin, east),
            6
        );
    });

    it("validates every coordinate, even a lone one", () => {
        expect(() => pathLength([{ latitude: 91, longitude: 0 }])).toThrow(
            RangeError
        );
        expect(() => pathLength([origin, null as never, east])).toThrow(
            TypeError
        );
    });

    it("rejects a non-array path and an unsupported unit", () => {
        expect(() => pathLength(origin as never)).toThrow(TypeError);
        expect(() => pathLength([origin, east], "yards" as never)).toThrow(
            /yards/
        );
    });
});

describe("distanceMatrix", () => {
    it("returns one row per origin and one column per destination", () => {
        const matrix = distanceMatrix(
            [origin, east],
            [east, northEast, origin]
        );
        expect(matrix).toHaveLength(2);
        expect(matrix.every((row) => row.length === 3)).toBe(true);
    });

    it("matches distanceBetween for every pair", () => {
        const from = [origin, east];
        const to = [east, northEast];
        const matrix = distanceMatrix(from, to);
        from.forEach((a, i) =>
            to.forEach((b, j) =>
                expect(matrix[i]?.[j]).toBe(distanceBetween(a, b))
            )
        );
    });

    it("applies the unit", () => {
        const [[km]] = distanceMatrix([origin], [east], "kilometers") as [
            [number],
        ];
        expect(km).toBeCloseTo(distanceBetween(origin, east, "kilometers"), 10);
    });

    it("handles empty inputs", () => {
        expect(distanceMatrix([], [origin])).toEqual([]);
        expect(distanceMatrix([origin], [])).toEqual([[]]);
    });

    it("rejects non-arrays, invalid coordinates, and unsupported units", () => {
        expect(() => distanceMatrix(origin as never, [origin])).toThrow(/From/);
        expect(() => distanceMatrix([origin], "x" as never)).toThrow(/To/);
        expect(() =>
            distanceMatrix([origin], [{ latitude: 0, longitude: 181 }])
        ).toThrow(RangeError);
        expect(() =>
            distanceMatrix([origin], [east], "yards" as never)
        ).toThrow(TypeError);
    });
});
