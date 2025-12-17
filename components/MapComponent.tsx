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

const startIcon = createIcon('#3b82f6'); // Blue
const endIcon = createIcon('#ef4444');   // Red
const poiIcon = createIcon('#f97316');   // Orange
const farmIcon = createIcon('#16a34a');  // Green for Farms

interface MapProps {
  pois: Poi[];
  onSelectPoi: (poi: Poi) => void;
}

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

// Precise Route Path: Châtillon-sur-Cher -> Gièvres
// Extracted from official trace data
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
  { lat: 47.274628, lng: 1.51387 },
  { lat: 47.274616, lng: 1.513969 },
  { lat: 47.274257, lng: 1.514772 },
  { lat: 47.274061, lng: 1.516167 },
  { lat: 47.273813, lng: 1.5196 },
  { lat: 47.273548, lng: 1.522894 },
  { lat: 47.273431, lng: 1.523811 },
  { lat: 47.273287, lng: 1.524511 },
  { lat: 47.273376, lng: 1.524507 },
  { lat: 47.273464, lng: 1.524327 },
  { lat: 47.273559, lng: 1.524295 },
  { lat: 47.27364, lng: 1.52433 },
  { lat: 47.273708, lng: 1.524418 },
  { lat: 47.273731, lng: 1.524531 },
  { lat: 47.273721, lng: 1.524724 },
  { lat: 47.273653, lng: 1.524907 },
  { lat: 47.273553, lng: 1.525467 },
  { lat: 47.273506, lng: 1.526441 },
  { lat: 47.273526, lng: 1.526559 },
  { lat: 47.273699, lng: 1.526849 },
  { lat: 47.273742, lng: 1.52702 },
  { lat: 47.273799, lng: 1.527717 },
  { lat: 47.273606, lng: 1.528513 },
  { lat: 47.273595, lng: 1.52887 },
  { lat: 47.273611, lng: 1.529168 },
  { lat: 47.273693, lng: 1.529627 },
  { lat: 47.274099, lng: 1.532806 },
  { lat: 47.274165, lng: 1.533035 },
  { lat: 47.274339, lng: 1.533407 },
  { lat: 47.274372, lng: 1.533553 },
  { lat: 47.274368, lng: 1.534031 },
  { lat: 47.274387, lng: 1.53415 },
  { lat: 47.274822, lng: 1.535219 },
  { lat: 47.274978, lng: 1.53595 },
  { lat: 47.275036, lng: 1.53655 },
  { lat: 47.275038, lng: 1.53725 },
  { lat: 47.275072, lng: 1.537479 },
  { lat: 47.275097, lng: 1.537518 },
  { lat: 47.275047, lng: 1.537666 },
  { lat: 47.274946, lng: 1.537849 },
  { lat: 47.27506, lng: 1.538019 },
  { lat: 47.275262, lng: 1.538461 },
  { lat: 47.275317, lng: 1.538834 },
  { lat: 47.275306, lng: 1.539196 },
  { lat: 47.275244, lng: 1.539682 },
  { lat: 47.275262, lng: 1.539964 },
  { lat: 47.275322, lng: 1.540369 },
  { lat: 47.275495, lng: 1.540774 },
  { lat: 47.275666, lng: 1.541082 },
  { lat: 47.275884, lng: 1.54131 },
  { lat: 47.276172, lng: 1.541466 },
  { lat: 47.276478, lng: 1.541549 },
  { lat: 47.276745, lng: 1.541534 },
  { lat: 47.277415, lng: 1.541224 },
  { lat: 47.277542, lng: 1.5412 },
  { lat: 47.277713, lng: 1.541224 },
  { lat: 47.277992, lng: 1.541374 },
  { lat: 47.278225, lng: 1.541629 },
  { lat: 47.278414, lng: 1.541989 },
  { lat: 47.27847, lng: 1.542337 },
  { lat: 47.278494, lng: 1.54274 },
  { lat: 47.278241, lng: 1.544259 },
  { lat: 47.27818, lng: 1.544342 },
  { lat: 47.277901, lng: 1.545889 },
  { lat: 47.277893, lng: 1.546323 },
  { lat: 47.277961, lng: 1.546908 },
  { lat: 47.27807, lng: 1.547313 },
  { lat: 47.278212, lng: 1.54767 },
  { lat: 47.278496, lng: 1.548101 },
  { lat: 47.278632, lng: 1.548402 },
  { lat: 47.278752, lng: 1.548873 },
  { lat: 47.278589, lng: 1.549154 },
  { lat: 47.278648, lng: 1.549208 },
  { lat: 47.279347, lng: 1.550075 },
  { lat: 47.279495, lng: 1.550163 },
  { lat: 47.279628, lng: 1.550137 },
  { lat: 47.280095, lng: 1.5501 },
  { lat: 47.280543, lng: 1.550512 },
  { lat: 47.281281, lng: 1.551006 },
  { lat: 47.281734, lng: 1.551341 },
  { lat: 47.281892, lng: 1.55155 },
  { lat: 47.281992, lng: 1.551725 },
  { lat: 47.282111, lng: 1.552034 },
  { lat: 47.282163, lng: 1.552222 },
  { lat: 47.282198, lng: 1.552441 },
  { lat: 47.282195, lng: 1.552875 },
  { lat: 47.282097, lng: 1.553289 },
  { lat: 47.281902, lng: 1.553726 },
  { lat: 47.281054, lng: 1.554439 },
  { lat: 47.280723, lng: 1.554917 },
  { lat: 47.280585, lng: 1.555461 },
  { lat: 47.280512, lng: 1.556081 },
  { lat: 47.280701, lng: 1.557022 },
  { lat: 47.281029, lng: 1.557969 },
  { lat: 47.281178, lng: 1.55835 },
  { lat: 47.281234, lng: 1.558648 },
  { lat: 47.281445, lng: 1.5593 },
  { lat: 47.282011, lng: 1.560421 },
  { lat: 47.282135, lng: 1.560751 },
  { lat: 47.282286, lng: 1.561528 },
  { lat: 47.282312, lng: 1.562033 },
  { lat: 47.282281, lng: 1.562542 },
  { lat: 47.282243, lng: 1.562788 },
  { lat: 47.282089, lng: 1.563342 },
  { lat: 47.281928, lng: 1.563717 },
  { lat: 47.28172, lng: 1.564098 },
  { lat: 47.281215, lng: 1.564549 },
  { lat: 47.280727, lng: 1.565125 },
  { lat: 47.28067, lng: 1.565333 },
  { lat: 47.280584, lng: 1.565417 },
  { lat: 47.280638, lng: 1.565587 },
  { lat: 47.280388, lng: 1.5657 },
  { lat: 47.279849, lng: 1.566166 },
  { lat: 47.279991, lng: 1.566811 },
  { lat: 47.280084, lng: 1.567385 },
  { lat: 47.280135, lng: 1.567865 },
  { lat: 47.280197, lng: 1.568958 },
  { lat: 47.28019, lng: 1.569532 },
  { lat: 47.280139, lng: 1.570211 },
  { lat: 47.280026, lng: 1.571316 },
  { lat: 47.279966, lng: 1.571461 },
  { lat: 47.279944, lng: 1.572294 },
  { lat: 47.279981, lng: 1.573032 },
  { lat: 47.280292, lng: 1.57465 },
  { lat: 47.280406, lng: 1.575079 },
  { lat: 47.280852, lng: 1.576141 },
  { lat: 47.281001, lng: 1.576632 },
  { lat: 47.281427, lng: 1.578405 },
  { lat: 47.281569, lng: 1.579092 },
  { lat: 47.281594, lng: 1.579714 },
  { lat: 47.281556, lng: 1.580352 },
  { lat: 47.281471, lng: 1.580899 },
  { lat: 47.281236, lng: 1.581801 },
  { lat: 47.281171, lng: 1.582262 },
  { lat: 47.281171, lng: 1.582662 },
  { lat: 47.281243, lng: 1.58323 },
  { lat: 47.281407, lng: 1.583828 },
  { lat: 47.281727, lng: 1.584539 },
  { lat: 47.281811, lng: 1.584941 },
  { lat: 47.281822, lng: 1.585271 },
  { lat: 47.281795, lng: 1.58562 },
  { lat: 47.281693, lng: 1.585961 },
  { lat: 47.281478, lng: 1.586342 },
  { lat: 47.281152, lng: 1.586594 },
  { lat: 47.280786, lng: 1.586658 },
  { lat: 47.280527, lng: 1.587035 },
  { lat: 47.280345, lng: 1.587379 },
  { lat: 47.280233, lng: 1.587655 },
  { lat: 47.280171, lng: 1.587885 },
  { lat: 47.280132, lng: 1.588426 },
  { lat: 47.280233, lng: 1.590227 },
  { lat: 47.280357, lng: 1.590933 },
  { lat: 47.28043, lng: 1.591079 },
  { lat: 47.2805, lng: 1.591281 },
  { lat: 47.280453, lng: 1.591721 },
  { lat: 47.280385, lng: 1.592028 },
  { lat: 47.280301, lng: 1.59263 },
  { lat: 47.280282, lng: 1.593034 },
  { lat: 47.280271, lng: 1.593558 },
  { lat: 47.280302, lng: 1.593985 },
  { lat: 47.280421, lng: 1.594921 },
  { lat: 47.280381, lng: 1.595093 },
  { lat: 47.280252, lng: 1.595442 },
  { lat: 47.280241, lng: 1.595584 },
  { lat: 47.280104, lng: 1.595992 },
  { lat: 47.280026, lng: 1.596378 },
  { lat: 47.280013, lng: 1.59681 },
  { lat: 47.280048, lng: 1.597221 },
  { lat: 47.280015, lng: 1.597543 },
  { lat: 47.27985, lng: 1.598108 },
  { lat: 47.279642, lng: 1.598524 },
  { lat: 47.279411, lng: 1.598787 },
  { lat: 47.279211, lng: 1.598935 },
  { lat: 47.278883, lng: 1.59913 },
  { lat: 47.278645, lng: 1.599391 },
  { lat: 47.278441, lng: 1.599723 },
  { lat: 47.278306, lng: 1.600088 },
  { lat: 47.278177, lng: 1.600646 },
  { lat: 47.278152, lng: 1.60118 },
  { lat: 47.278183, lng: 1.601697 },
  { lat: 47.278538, lng: 1.603886 },
  { lat: 47.278796, lng: 1.60667 },
  { lat: 47.279071, lng: 1.610141 },
  { lat: 47.279033, lng: 1.610522 },
  { lat: 47.278956, lng: 1.610876 },
  { lat: 47.278867, lng: 1.611123 },
  { lat: 47.278441, lng: 1.611798 },
  { lat: 47.278319, lng: 1.612107 },
  { lat: 47.278235, lng: 1.612499 },
  { lat: 47.278015, lng: 1.615516 },
  { lat: 47.277952, lng: 1.615816 },
  { lat: 47.277775, lng: 1.616436 },
  { lat: 47.277684, lng: 1.616908 },
  { lat: 47.277586, lng: 1.617962 },
  { lat: 47.277429, lng: 1.618737 },
  { lat: 47.277413, lng: 1.619236 },
  { lat: 47.277453, lng: 1.619652 },
  { lat: 47.277773, lng: 1.622109 },
  { lat: 47.278299, lng: 1.624273 },
  { lat: 47.27833, lng: 1.624783 },
  { lat: 47.278325, lng: 1.625123 },
  { lat: 47.278288, lng: 1.625606 },
  { lat: 47.278148, lng: 1.626073 },
  { lat: 47.277973, lng: 1.626352 },
  { lat: 47.277651, lng: 1.626647 },
  { lat: 47.277531, lng: 1.626702 },
  { lat: 47.277426, lng: 1.626709 },
  { lat: 47.277182, lng: 1.626808 },
  { lat: 47.276812, lng: 1.627146 },
  { lat: 47.276563, lng: 1.627597 },
  { lat: 47.276463, lng: 1.627945 },
  { lat: 47.276421, lng: 1.628444 },
  { lat: 47.276434, lng: 1.628809 },
  { lat: 47.276592, lng: 1.629726 },
  { lat: 47.276618, lng: 1.630174 },
  { lat: 47.276558, lng: 1.632795 },
  { lat: 47.276083, lng: 1.635155 },
  { lat: 47.276068, lng: 1.635646 },
  { lat: 47.276115, lng: 1.636161 },
  { lat: 47.276248, lng: 1.636858 },
  { lat: 47.276243, lng: 1.638041 },
  { lat: 47.276181, lng: 1.638449 },
  { lat: 47.275196, lng: 1.641796 },
  { lat: 47.275126, lng: 1.64214 },
  { lat: 47.27512, lng: 1.643108 },
  { lat: 47.275049, lng: 1.643548 },
  { lat: 47.274893, lng: 1.64395 },
  { lat: 47.274656, lng: 1.644454 },
  { lat: 47.274521, lng: 1.644961 },
  { lat: 47.27446, lng: 1.646103 },
  { lat: 47.274682, lng: 1.64612 },
  { lat: 47.27468, lng: 1.648754 },
  { lat: 47.274365, lng: 1.651095 },
  { lat: 47.274228, lng: 1.652273 },
  { lat: 47.274065, lng: 1.65451 },
  { lat: 47.274072, lng: 1.655205 },
  { lat: 47.274179, lng: 1.658683 },
  { lat: 47.274722, lng: 1.66301 },
  { lat: 47.275291, lng: 1.663164 },
  { lat: 47.2753, lng: 1.663002 },
  { lat: 47.27552, lng: 1.663018 },
  { lat: 47.275627, lng: 1.662983 },
  { lat: 47.275837, lng: 1.663005 },
  { lat: 47.275904, lng: 1.663101 },
  { lat: 47.275879, lng: 1.663573 },
  { lat: 47.27651, lng: 1.663638 },
  { lat: 47.276548, lng: 1.66367 },
  { lat: 47.276594, lng: 1.663803 },
  { lat: 47.276509, lng: 1.664001 },
  { lat: 47.276494, lng: 1.664121 },
  { lat: 47.276446, lng: 1.665158 },
  { lat: 47.276556, lng: 1.66521 },
  { lat: 47.276404, lng: 1.666035 },
  { lat: 47.276437, lng: 1.669049 },
  { lat: 47.276476, lng: 1.670844 },
  { lat: 47.275851, lng: 1.671826 },
  { lat: 47.275767, lng: 1.671884 },
  { lat: 47.275723, lng: 1.671882 },
  { lat: 47.275704, lng: 1.673009 },
  { lat: 47.275044, lng: 1.672727 },
  { lat: 47.274331, lng: 1.672346 },
  { lat: 47.274276, lng: 1.672348 },
  { lat: 47.274216, lng: 1.672378 },
  { lat: 47.273978, lng: 1.672665 },
  { lat: 47.273965, lng: 1.672732 },
  { lat: 47.274018, lng: 1.674738 },
  { lat: 47.2741, lng: 1.676356 },
  { lat: 47.274031, lng: 1.677104 },
  { lat: 47.274055, lng: 1.677367 },
  { lat: 47.274089, lng: 1.677496 },
  { lat: 47.274588, lng: 1.678751 },
  { lat: 47.27464, lng: 1.678942 },
  { lat: 47.274732, lng: 1.679468 },
  { lat: 47.274758, lng: 1.679787 },
  { lat: 47.27478, lng: 1.680512 },
  { lat: 47.27469, lng: 1.681554 },
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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsInfo points={routeCoordinates} />

        {/* The Route Line */}
        <Polyline 
          positions={routeCoordinates.map(c => [c.lat, c.lng])}
          pathOptions={{ color: '#0052cc', weight: 6, opacity: 0.8 }} // Darker Blue for accuracy
        />

        {/* Start Marker */}
        <Marker position={routeCoordinates[0]} icon={startIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-blue-600 block">Départ</strong>
              <span>Châtillon-sur-Cher</span>
            </div>
          </Popup>
        </Marker>

        {/* End Marker */}
        <Marker position={routeCoordinates[routeCoordinates.length - 1]} icon={endIcon}>
          <Popup>
            <div className="text-center">
              <strong className="text-red-600 block">Arrivée</strong>
              <span>Gièvres</span>
            </div>
          </Popup>
        </Marker>

        {/* POIs */}
        {pois.map(poi => (
          <Marker 
            key={poi.id} 
            position={[poi.position.lat, poi.position.lng]}
            icon={poi.type === 'farm' ? farmIcon : poiIcon}
            eventHandlers={{
              click: () => onSelectPoi(poi),
            }}
          >
          </Marker>
        ))}

      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg z-[400] text-xs space-y-2 border border-gray-200">
        <div className="font-bold text-gray-700 mb-1">Légende</div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-blue-500 border border-white mr-2 shadow-sm"></span> Départ (Châtillon)
        </div>
        <div className="flex items-center">
          <span className="w-3 h-1 bg-[#0052cc] mr-2"></span> Parcours Vélo
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-orange-500 border border-white mr-2 shadow-sm"></span> Site Touristique
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-green-600 border border-white mr-2 shadow-sm"></span> Producteur Local
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white mr-2 shadow-sm"></span> Arrivée (Gièvres)
        </div>
      </div>
    </div>
  );
};

export default MapComponent;