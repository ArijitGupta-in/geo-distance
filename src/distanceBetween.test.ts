import { describe, expect, it } from "vitest";
import type { DMSCoordinate } from "./index.js";
import { distanceBetween } from "./index.js";

describe("distanceBetween", () => {
    it("returns zero for identical coordinates", () => {
        const coordinate = {
            latitude: 22.5726,
            longitude: 88.3639,
        };

        expect(distanceBetween(coordinate, coordinate)).toBe(0);
    });

    it("calculates the distance between two coordinates", () => {
        const kolkata = {
            latitude: 22.5726,
            longitude: 88.3639,
        };

        const nearbyPoint = {
            latitude: 22.5736,
            longitude: 88.3649,
        };

        const distance = distanceBetween(kolkata, nearbyPoint);

        expect(distance).toBeGreaterThan(0);
    });

    it("returns a result in meters", () => {
        const equatorPointA = {
            latitude: 0,
            longitude: 0,
        };

        const equatorPointB = {
            latitude: 0,
            longitude: 1,
        };

        const distance = distanceBetween(equatorPointA, equatorPointB);

        expect(distance).toBeCloseTo(111_195, -1);
    });
});

describe("distanceBetween with DMS coordinates", () => {
    const kolkataDMS: DMSCoordinate = {
        latitude: { degrees: 22, minutes: 34, seconds: 21.36, direction: "N" },
        longitude: { degrees: 88, minutes: 21, seconds: 50.04, direction: "E" },
    };

    const kolkataDecimal = { latitude: 22.5726, longitude: 88.3639 };

    it("returns zero for identical DMS coordinates", () => {
        expect(distanceBetween(kolkataDMS, kolkataDMS)).toBe(0);
    });

    it("calculates a positive distance between two DMS coordinates", () => {
        const nearbyDMS: DMSCoordinate = {
            latitude: { degrees: 22, minutes: 34, seconds: 57.6, direction: "N" },
            longitude: { degrees: 88, minutes: 21, seconds: 53.64, direction: "E" },
        };

        expect(distanceBetween(kolkataDMS, nearbyDMS)).toBeGreaterThan(0);
    });

    it("produces equivalent results for the same location in DMS and decimal formats", () => {
        const dmsResult = distanceBetween(kolkataDMS, kolkataDMS);
        const decimalResult = distanceBetween(kolkataDecimal, kolkataDecimal);

        expect(dmsResult).toBeCloseTo(decimalResult, 5);
    });

    it("produces equivalent distances when mixing DMS and decimal formats for the same locations", () => {
        const destination: DMSCoordinate = {
            latitude: { degrees: 28, minutes: 38, seconds: 12, direction: "N" },
            longitude: { degrees: 77, minutes: 13, seconds: 8.04, direction: "E" },
        };
        const destinationDecimal = { latitude: 28.6367, longitude: 77.2189 };

        const distanceDMS = distanceBetween(kolkataDMS, destination);
        const distanceDecimal = distanceBetween(kolkataDecimal, destinationDecimal);

        expect(distanceDMS).toBeCloseTo(distanceDecimal, -1);
    });

    it("handles coordinates in the southern hemisphere", () => {
        const sydney: DMSCoordinate = {
            latitude: { degrees: 33, minutes: 51, seconds: 54, direction: "S" },
            longitude: { degrees: 151, minutes: 12, seconds: 34, direction: "E" },
        };
        const melbourne: DMSCoordinate = {
            latitude: { degrees: 37, minutes: 48, seconds: 49, direction: "S" },
            longitude: { degrees: 144, minutes: 57, seconds: 47, direction: "E" },
        };

        expect(distanceBetween(sydney, melbourne)).toBeGreaterThan(0);
    });

    it("handles coordinates in the western hemisphere", () => {
        const newYork: DMSCoordinate = {
            latitude: { degrees: 40, minutes: 42, seconds: 46, direction: "N" },
            longitude: { degrees: 74, minutes: 0, seconds: 21, direction: "W" },
        };
        const losAngeles: DMSCoordinate = {
            latitude: { degrees: 34, minutes: 3, seconds: 8, direction: "N" },
            longitude: { degrees: 118, minutes: 14, seconds: 37, direction: "W" },
        };

        expect(distanceBetween(newYork, losAngeles)).toBeGreaterThan(3_000_000);
    });

    it("throws when given invalid DMS coordinates", () => {
        const invalid = {
            latitude: { degrees: 91, minutes: 0, seconds: 0, direction: "N" as const },
            longitude: { degrees: 0, minutes: 0, seconds: 0, direction: "E" as const },
        };

        expect(() => distanceBetween(invalid, kolkataDMS)).toThrow(RangeError);
    });
});
