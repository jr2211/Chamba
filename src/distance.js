import zipData from './zipcodes.json';

const zipMap = {};
zipData.forEach(entry => {
    zipMap[entry.zip_code] = {
        lat: parseFloat(entry.latitude),
        lng: parseFloat(entry.longitude),
    };
});

export function getCoords(zip) {
    return zipMap[zip] || null;
}

export function distanceMiles(zip1, zip2) {
    const a = getCoords(zip1);
    const b = getCoords(zip2);
    if (!a || !b) return null;

    const R = 3958.8;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;

    const x =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
    return R * c;
}