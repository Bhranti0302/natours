const displayMap = (locations) => {
  const map = L.map('map', {
    scrollWheelZoom: true,
    minZoom: 5,
    maxZoom: 5,
  });

  // Base tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const points = [];

  // Add markers
  locations.forEach((loc, i) => {
    const [lng, lat] = loc.coordinates; // Make sure your data matches [lng, lat] order
    points.push([lat, lng]);
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`<p>Day ${i + 1}: ${loc.description}</p>`, { autoClose: false });
  });

  // Fit to points
  map.fitBounds(points, { padding: [60, 60] });
};

document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('map');
  if (mapEl) {
    const locations = JSON.parse(mapEl.dataset.locations);
    displayMap(locations);
  }
});
