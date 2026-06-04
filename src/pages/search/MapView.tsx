import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Hotel } from '@/types/search';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  hotels: Hotel[];
  activeHotelId: number | null;
  onHotelHover: (id: number | null) => void;
  onHotelSelect: (hotel: Hotel) => void;
}

/* Fix default Leaflet icon paths */
delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─── Custom Price Pin ─── */
function createPriceIcon(price: number, isActive: boolean) {
  const color = isActive ? '#E85D4A' : '#0F1B2E';
  const size = isActive ? 44 : 40;
  return L.divIcon({
    className: 'custom-price-marker',
    html: `
      <div style="
        background: ${color};
        color: white;
        font-weight: 700;
        font-size: 13px;
        font-family: Inter, sans-serif;
        padding: 6px 10px;
        border-radius: 20px;
        box-shadow: 0 2px 12px rgba(15,27,46,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: ${size}px;
        height: ${size}px;
        transition: all 0.2s ease;
        border: ${isActive ? '3px solid white' : '2px solid white'};
        white-space: nowrap;
      ">
        $${price}
      </div>
      <div style="
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid ${color};
        margin: -1px auto 0;
      "></div>
    `,
    iconSize: [size + 10, size + 16],
    iconAnchor: [(size + 10) / 2, size + 16],
    popupAnchor: [0, -(size + 16)],
  });
}

/* ─── Map Bounds Fitter ─── */
function BoundsFitter({ hotels }: { hotels: Hotel[] }) {
  const map = useMap();
  useEffect(() => {
    if (hotels.length === 0) return;
    const group = new L.featureGroup(
      hotels.map((h) => L.marker([h.coordinates[0], h.coordinates[1]]))
    );
    map.fitBounds(group.getBounds().pad(0.1), { animate: true, duration: 0.5 });
  }, [map, hotels]);
  return null;
}

export default function MapView({ hotels, activeHotelId, onHotelHover, onHotelSelect }: MapViewProps) {
  const center: LatLngExpression = useMemo(
    () => (hotels.length > 0 ? [hotels[0].coordinates[0], hotels[0].coordinates[1]] : [48.8566, 2.3522]),
    [hotels]
  );

  const [mapReady, setMapReady] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <BoundsFitter hotels={hotels} />
        {hotels.map((hotel) => {
          const isActive = activeHotelId === hotel.id;
          return (
            <Marker
              key={hotel.id}
              position={[hotel.coordinates[0], hotel.coordinates[1]]}
              icon={createPriceIcon(hotel.price, isActive)}
              eventHandlers={{
                mouseover: () => onHotelHover(hotel.id),
                mouseout: () => onHotelHover(null),
                click: () => onHotelSelect(hotel),
              }}
            >
              <Popup>
                <div className="p-1 min-w-[180px]">
                  <img
                    src={hotel.images[0]}
                    alt={hotel.name}
                    className="w-full h-20 object-cover rounded-lg mb-2"
                  />
                  <h4 className="font-body text-sm font-semibold text-[#1A2B47] mb-0.5">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-[#0F1B2E] text-white font-body text-xs font-bold px-1.5 py-0.5 rounded">
                      {hotel.rating}
                    </span>
                    <span className="font-body text-xs text-[#7A8494]">{hotel.ratingLabel}</span>
                  </div>
                  <p className="font-body text-sm font-bold text-[#E85D4A] mt-1">
                    ${hotel.price}
                    <span className="text-[11px] font-normal text-[#7A8494]">/night</span>
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
