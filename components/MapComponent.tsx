import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Poi, Coordinate } from '../types';

// Fix Leaflet's default icon path issues
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (color: string) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10]
});

const startIcon = createIcon('#3b82f6');
const endIcon = createIcon('#ef4444');
const poiIcon = createIcon('#f97316');
const farmIcon = createIcon('#16a34a');

interface MapProps {
  pois: Poi[];
  onSelectPoi: (poi: Poi) => void;
  layoutTrigger?: boolean;
}


// Force Leaflet to recalculate map size (fixes grey areas)
const MapResizeFix = () => {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => clearTimeout(t);
  }, [map]);

  return null;
};

// Helper to fit bounds
const MapBoundsInfo = ({ points }: { points: Coordinate[] }) => {
  const map = useMap();

  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, points]);

  return null;
};

// Route coordinates (segment Châtillon-sur-Cher → Gièvres uniquement)
const routeCoordinates: Coordinate[] = [
  { lat: 47.271956, lng: 1.492724 },
  { lat: 47.27222, lng: 1.49465 },
  { lat: 47.272509, lng: 1.49547 },
  { lat: 47.273174, lng: 1.497042 },
  { lat: 47.273386, lng: 1.497669 },
  { lat: 47.273448, lng: 1.497933 },
  { lat: 47.273561, lng: 1.498535 },
  { lat: 47.273605, lng: 1.499857 },
  { lat: 47.273688, lng: 1.500821 },
  { lat: 47.27406, lng: 1.504097 },
  { lat: 47.274177, lng: 1.504844 },
  { lat: 47.274461, lng: 1.506524 },
  { lat: 47.274577, lng: 1.506986 },
  { lat: 47.275443, lng: 1.509893 },
  { lat: 47.275605, lng: 1.510503 },
  { lat: 47.275641, lng: 1.510909 },
  { lat: 47.275654, lng: 1.511384 },
  { lat: 47.275589, lng: 1.51191 },
  { lat: 47.275502, lng: 1.512274 },
  { lat: 47.275339, lng: 1.512716 },
  { lat: 47.275133, lng: 1.513095 },
  { lat: 47.274929, lng: 1.5133 },
  { lat: 47.274671, lng: 1.513753 },
  { lat: 47.274616, lng: 1.513969 },
  { lat: 47.274257, lng: 1.514772 },
  { lat: 47.274061, lng: 1.516167 },
  { lat: 47.273813, lng: 1.5196 },
  { lat: 47.273548, lng: 1.522894 },
  { lat: 47.273431, lng: 1.523811 },
  { lat: 47.273287, lng: 1.524511 }
];

const MapComponent: React.FC<MapProps> = ({ pois, onSelectPoi }) => {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={[47.277, 1.58]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >
       <MapResizeFix trigger={layoutTrigger} />


        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsInfo points={routeCoordinates} />

        <Polyline
          positions={routeCoordinates.map(c => [c.lat, c.lng])}
          pathOptions={{ color: '#0052cc', weight: 6, opacity: 0.8 }}
        />

        <Marker position={routeCoordinates[0]} icon={startIcon}>
          <Popup>
            <strong>Départ</strong>
          </Popup>
        </Marker>

        <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={endIcon}>
          <Popup>
            <strong>Arrivée</strong>
          </Popup>
        </Marker>

        {pois.map(poi => (
          <Marker
            key={poi.id}
            position={[poi.position.lat, poi.position.lng]}
            icon={poi.type === 'farm' ? farmIcon : poiIcon}
            eventHandlers={{
              click: () => onSelectPoi(poi),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
