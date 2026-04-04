import { WebMercatorViewport } from "@deck.gl/core";

export const EARTH_RADIUS_METERS = 6378137;
export const MEASURE_CLOSE_PX = 16;

export const getPointLabel = (index) => {
  if (index >= 0 && index < 26) return String.fromCharCode(65 + index);
  return `P${index + 1}`;
};

export const haversineDistanceMeters = (start, end) => {
  const lat1 = (start.latitude * Math.PI) / 180;
  const lat2 = (end.latitude * Math.PI) / 180;
  const dLat = ((end.latitude - start.latitude) * Math.PI) / 180;
  const dLng = ((end.longitude - start.longitude) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const formatDistance = (meters) => {
  if (!Number.isFinite(meters)) return "";
  if (meters >= 10000000) return `${(meters / 1609.344).toFixed(1)} mi`;
  if (meters >= 1000) return `${(meters / 1000).toFixed(meters >= 10000 ? 1 : 2)} km`;
  return `${Math.round(meters)} m`;
};

export const formatArea = (squareMeters) => {
  if (!Number.isFinite(squareMeters) || squareMeters <= 0) return "";
  if (squareMeters >= 1_000_000) return `${(squareMeters / 1_000_000).toFixed(2)} km²`;
  return `${Math.round(squareMeters)} m²`;
};

export const buildSegments = (points, closed = false) => {
  const segments = [];
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1];
    const end = points[index];
    segments.push({
      start,
      end,
      distance: haversineDistanceMeters(start, end),
      midpoint: {
        longitude: (start.longitude + end.longitude) / 2,
        latitude: (start.latitude + end.latitude) / 2,
      },
      label: `${getPointLabel(index - 1)}-${getPointLabel(index)}`,
    });
  }

  if (closed && points.length >= 3) {
    const start = points[points.length - 1];
    const end = points[0];
    segments.push({
      start,
      end,
      distance: haversineDistanceMeters(start, end),
      midpoint: {
        longitude: (start.longitude + end.longitude) / 2,
        latitude: (start.latitude + end.latitude) / 2,
      },
      label: `${getPointLabel(points.length - 1)}-${getPointLabel(0)}`,
    });
  }

  return segments;
};

export const polygonAreaSquareMeters = (points) => {
  if (!Array.isArray(points) || points.length < 3) return 0;
  const avgLat = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
  const cosLat = Math.cos((avgLat * Math.PI) / 180);

  const projected = points.map((point) => ({
    x: ((point.longitude * Math.PI) / 180) * EARTH_RADIUS_METERS * cosLat,
    y: ((point.latitude * Math.PI) / 180) * EARTH_RADIUS_METERS,
  }));

  let area = 0;
  for (let index = 0; index < projected.length; index += 1) {
    const current = projected[index];
    const next = projected[(index + 1) % projected.length];
    area += current.x * next.y - next.x * current.y;
  }

  return Math.abs(area / 2);
};

export const polygonCentroid = (points) => {
  if (!Array.isArray(points) || !points.length) return null;
  const longitude = points.reduce((sum, point) => sum + point.longitude, 0) / points.length;
  const latitude = points.reduce((sum, point) => sum + point.latitude, 0) / points.length;
  return { longitude, latitude };
};

/** Screen-space proximity to first vertex (matches Next.js map.project behaviour). */
export const isCloseToFirstPointScreen = (points, screenX, screenY, viewState, width, height) => {
  if (!Array.isArray(points) || points.length < 3 || !viewState || !width || !height) return false;
  const viewport = new WebMercatorViewport({
    width,
    height,
    longitude: viewState.longitude,
    latitude: viewState.latitude,
    zoom: viewState.zoom,
    pitch: viewState.pitch ?? 0,
    bearing: viewState.bearing ?? 0,
  });
  const projectedFirst = viewport.project([points[0].longitude, points[0].latitude]);
  const deltaX = projectedFirst[0] - screenX;
  const deltaY = projectedFirst[1] - screenY;
  return Math.sqrt(deltaX ** 2 + deltaY ** 2) <= MEASURE_CLOSE_PX;
};

export const buildPointReadings = (points) => {
  let cumulative = 0;
  return points.map((point, index) => {
    if (index > 0) {
      cumulative += haversineDistanceMeters(points[index - 1], point);
    }
    return cumulative;
  });
};

export const createMeasurement = (points, closed = false) => {
  const normalizedPoints = points.map((point, index) => ({
    ...point,
    index,
    label: getPointLabel(index),
  }));
  const segments = buildSegments(normalizedPoints, closed);
  const pointReadings = buildPointReadings(normalizedPoints);
  return {
    id: `measure-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    points: normalizedPoints,
    pointReadings,
    closed,
    segments,
    totalDistance: segments.reduce((sum, segment) => sum + segment.distance, 0),
    area: closed ? polygonAreaSquareMeters(normalizedPoints) : 0,
  };
};

export const buildDraftMeasurement = (points) => ({
  id: `draft-${Date.now()}`,
  points: points.map((point, index) => ({
    ...point,
    index,
    label: getPointLabel(index),
  })),
  pointReadings: buildPointReadings(points),
});

export const buildMeasurementLineCollection = (measurements) => ({
  type: "FeatureCollection",
  features: measurements
    .filter((measurement) => measurement.points.length >= 2)
    .map((measurement) => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          ...measurement.points.map((point) => [point.longitude, point.latitude]),
          ...(measurement.closed ? [[measurement.points[0].longitude, measurement.points[0].latitude]] : []),
        ],
      },
      properties: {
        id: measurement.id,
        closed: measurement.closed,
      },
    })),
});

export const buildMeasurementPolygonCollection = (measurements) => ({
  type: "FeatureCollection",
  features: measurements
    .filter((measurement) => measurement.closed && measurement.points.length >= 3)
    .map((measurement) => ({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            ...measurement.points.map((point) => [point.longitude, point.latitude]),
            [measurement.points[0].longitude, measurement.points[0].latitude],
          ],
        ],
      },
      properties: {
        id: measurement.id,
      },
    })),
});

export const buildDraftMeasurementLineCollection = (draftMeasurement, cursorPoint) => {
  const points = draftMeasurement?.points || [];
  const coordinates = points.map((point) => [point.longitude, point.latitude]);

  if (cursorPoint && points.length) {
    coordinates.push([cursorPoint.longitude, cursorPoint.latitude]);
  }

  if (coordinates.length < 2) {
    return { type: "FeatureCollection", features: [] };
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates,
        },
        properties: {
          id: draftMeasurement?.id || "draft",
        },
      },
    ],
  };
};

export const buildMeasurementPointMarkers = (measurements, draftMeasurement, cursorPoint) => {
  const completedPoints = measurements.flatMap((measurement) => {
    const pts = measurement.points;
    const n = pts.length;
    const closed = Boolean(measurement.closed && n >= 3);
    const centroid = closed ? polygonCentroid(pts) : null;
    return pts.map((point, index) => {
      const prev =
        index > 0 ? pts[index - 1] : closed ? pts[n - 1] : null;
      const next =
        index < n - 1 ? pts[index + 1] : closed ? pts[0] : null;
      return {
        ...point,
        id: `${measurement.id}-${point.label}`,
        draft: false,
        reading: measurement.pointReadings?.[index] ?? 0,
        text: `${point.label} ${formatDistance(measurement.pointReadings?.[index] ?? 0)}`,
        measureMeta: { closed, centroid, prev, next },
      };
    });
  });

  const draftReadings = draftMeasurement?.pointReadings || [];
  const dPts = draftMeasurement?.points || [];
  const dn = dPts.length;
  const draftPoints = dPts.map((point, index) => {
    const prev = index > 0 ? dPts[index - 1] : null;
    const next =
      index < dn - 1 ? dPts[index + 1] : cursorPoint || null;
    return {
      ...point,
      label: getPointLabel(index),
      id: `${draftMeasurement.id || "draft"}-${index}`,
      draft: true,
      reading: draftReadings[index] ?? 0,
      text: `${getPointLabel(index)} ${formatDistance(draftReadings[index] ?? 0)}`,
      measureMeta: { closed: false, centroid: null, prev, next },
    };
  });

  return [...completedPoints, ...draftPoints];
};

export const buildMeasurementAreaLabels = (measurements) =>
  measurements
    .filter((measurement) => measurement.closed && measurement.area > 0)
    .map((measurement) => {
      const centroid = polygonCentroid(measurement.points);
      if (!centroid) return null;
      return {
        id: `${measurement.id}-area`,
        longitude: centroid.longitude,
        latitude: centroid.latitude,
        text: formatArea(measurement.area),
        perimeter: `Perimeter ${formatDistance(measurement.totalDistance)}`,
      };
    })
    .filter(Boolean);
