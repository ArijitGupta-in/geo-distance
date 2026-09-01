export function distanceBetween(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
): number {
    const earthRadius = 6_371_000;

    const latitudeDifference = (to.latitude - from.latitude) * (Math.PI / 180);

    const longitudeDifference =
        (to.longitude - from.longitude) * (Math.PI / 180);

    const fromLatitude = from.latitude * (Math.PI / 180);
    const toLatitude = to.latitude * (Math.PI / 180);

    const a =
        Math.sin(latitudeDifference / 2) ** 2 +
        Math.cos(fromLatitude) *
            Math.cos(toLatitude) *
            Math.sin(longitudeDifference / 2) ** 2;

    const angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * angularDistance;
}
