const generateSectorPolygon = (
  lat,
  lng,
  azimuth,
  beamWidth,
  radiusMeters,
  scale = 1
) => {

  const points = [];
  const steps = 18;

  const earthRadius = 6378137;
  const radius = radiusMeters * scale;

  const startAngle = azimuth - beamWidth / 2;
  const endAngle = azimuth + beamWidth / 2;

  points.push([lng, lat]);

  for (let i = 0; i <= steps; i++) {

    const angle = startAngle + (i / steps) * (endAngle - startAngle);
    const rad = angle * Math.PI / 180;

    const dx = radius * Math.sin(rad);
    const dy = radius * Math.cos(rad);

    const newLat = lat + (dy / earthRadius) * (180 / Math.PI);
    const newLng =
      lng +
      (dx / earthRadius) *
        (180 / Math.PI) /
        Math.cos(lat * Math.PI / 180);

    points.push([newLng, newLat]);
  }

  return points;
};

export default generateSectorPolygon;