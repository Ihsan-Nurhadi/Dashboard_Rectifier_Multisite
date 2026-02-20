import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Plus, Minus } from 'lucide-react';

// Fix for default marker icon missing in Leaflet with Webpack/Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  popupText?: string;
}

function CustomZoomControl() {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.zoomIn()}
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-100 text-gray-700"
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors border border-gray-100 text-gray-700"
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function Map({ lat, lng, zoom = 13, popupText }: MapProps) {
  return (
    <MapContainer 
      center={[lat, lng]} 
      zoom={zoom} 
      scrollWheelZoom={false} 
      className="w-full h-full rounded-xl z-0"
      style={{ minHeight: '100%', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        {popupText && <Popup>{popupText}</Popup>}
      </Marker>
      <CustomZoomControl />
    </MapContainer>
  );
}
