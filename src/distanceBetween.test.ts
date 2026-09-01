import { describe, expect, it } from "vitest";
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
