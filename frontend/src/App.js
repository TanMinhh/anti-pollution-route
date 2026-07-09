import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Polyline, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './styles.css';

function App() {
  const [formData, setFormData] = useState({
    userId: 'user123',
    startLat: '',
    startLng: '',
    endLat: '',
    endLng: '',
    email: '',
    phone: '',
    notifyWhenClean: true
  });

  const [routePath, setRoutePath] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [pollutionScore, setPollutionScore] = useState(null);

  const fetchScore = async (lat, lng) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/score?lat=${lat}&lng=${lng}`);
      setPollutionScore(response.data.score);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    let interval;
    if (mapCenter) {
      interval = setInterval(() => {
        fetchScore(formData.startLat, formData.startLng);
      }, 900000);
    }
    return () => clearInterval(interval);
  }, [mapCenter, formData.startLat, formData.startLng]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      userId: formData.userId,
      startLocation: { lat: parseFloat(formData.startLat), lng: parseFloat(formData.startLng) },
      endLocation: { lat: parseFloat(formData.endLat), lng: parseFloat(formData.endLng) },
      preferences: {
        email: formData.email,
        phone: formData.phone,
        notifyWhenClean: formData.notifyWhenClean
      }
    };

    await axios.post('http://localhost:5000/api/route', payload);

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${formData.startLng},${formData.startLat};${formData.endLng},${formData.endLat}?geometries=geojson`;

    try {
      const response = await axios.get(osrmUrl);
      const coordinates = response.data.routes[0].geometry.coordinates;
      const leafletCoords = coordinates.map(coord => [coord[1], coord[0]]);

      setRoutePath(leafletCoords);
      setMapCenter([parseFloat(formData.startLat), parseFloat(formData.startLng)]);
      fetchScore(formData.startLat, formData.startLng);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-container">
      <h1>Anti-Pollution Routes</h1>
      <form className="route-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Start Latitude" onChange={e => setFormData({ ...formData, startLat: e.target.value })} />
        <input type="text" placeholder="Start Longitude" onChange={e => setFormData({ ...formData, startLng: e.target.value })} />
        <input type="text" placeholder="End Latitude" onChange={e => setFormData({ ...formData, endLat: e.target.value })} />
        <input type="text" placeholder="End Longitude" onChange={e => setFormData({ ...formData, endLng: e.target.value })} />
        <input type="email" placeholder="Email for Alerts" onChange={e => setFormData({ ...formData, email: e.target.value })} />
        <input type="text" placeholder="WhatsApp Phone" onChange={e => setFormData({ ...formData, phone: e.target.value })} />
        <button type="submit">Track Route</button>
      </form>

      {routePath && mapCenter && (
        <div className="map-wrapper">
          <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <CircleMarker center={[parseFloat(formData.startLat), parseFloat(formData.startLng)]} color="green" />
            <CircleMarker center={[parseFloat(formData.endLat), parseFloat(formData.endLng)]} color="red" />
            <Polyline positions={routePath} color="#4ade80" weight={5} />
          </MapContainer>

          {pollutionScore !== null && (
            <div className="score-overlay">
              <div className="score-label">POLLUTION SCORE</div>
              <div className="score-value">{pollutionScore}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;