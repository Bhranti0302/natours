const displayMap = (locations) => {
  const map = L.map('map', {
    scrollWheelZoom: true,
    minZoom: 5,
    maxZoom: 5,
  });

  // CARTO base tiles
  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Garmin, USGS, etc.',
    }
  ).addTo(map);

  const points = [];

  // Add markers
  locations.forEach((loc, i) => {
    const [lng, lat] = loc.coordinates;

    points.push([lat, lng]);

    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<p>Day ${i + 1}: ${loc.description}</p>`, { autoClose: false });
  });

  map.fitBounds(points, { padding: [60, 60] });
};

document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('map');

  if (mapEl) {
    const locations = JSON.parse(mapEl.dataset.locations);
    displayMap(locations);
  }
});
