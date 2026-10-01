'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Langar } from '@/lib/supabase';
import { MapPin, Clock, BadgeCheck } from 'lucide-react';
import { getLangarTimingText } from '@/lib/langar-utils';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/language-context';

// Custom icons
const createCustomIcon = (isVerified: boolean) => {
  const bgColor = isVerified ? 'bg-primary-500' : 'bg-accent-400';
  const borderColor = isVerified ? 'border-primary-500' : 'border-accent-400';

  return L.divIcon({
    className: 'custom-icon bg-transparent border-0',
    html: `<div class="flex flex-col items-center">
             <div class="flex h-9 w-9 items-center justify-center rounded-full shadow-lg border-2 ${bgColor} ${borderColor} text-white">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 15 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
             </div>
             <div class="w-0.5 h-2 ${bgColor}"></div>
           </div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
};

const userIcon = L.divIcon({
  className: 'user-icon bg-transparent border-0',
  html: `<div class="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30 animate-pulse"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface MapViewProps {
  langars: Langar[];
  userLocation: { lat: number; lng: number } | null;
  selectedLangar: Langar | null;
  setSelectedLangar: (langar: Langar | null) => void;
  center?: [number, number];
  zoom?: number;
}

function MapUpdater({ center, zoom, langars, hasUserLocation }: { center: [number, number], zoom: number, langars: Langar[], hasUserLocation: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (!hasUserLocation && langars.length > 0) {
      // Auto-fit all pins worldwide if no explicit user location was requested
      const bounds = L.latLngBounds(langars.map(l => [l.latitude, l.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, map, langars, hasUserLocation]);
  return null;
}

export default function MapView({ langars, userLocation, selectedLangar, setSelectedLangar, center = [31.1471, 75.3412], zoom = 8 }: MapViewProps) {
  const { t } = useLanguage();
  
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 10 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomright" />
      
      <MapUpdater center={center} zoom={zoom} langars={langars} hasUserLocation={!!userLocation} />
      
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
      )}
      
      {langars.map((langar) => (
        <Marker
          key={langar.id}
          position={[langar.latitude, langar.longitude]}
          icon={createCustomIcon(langar.is_verified)}
          eventHandlers={{
            click: () => setSelectedLangar(langar),
          }}
        >
          <Popup>
            <div className="p-1 min-w-[200px]">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  {langar.is_verified && (
                    <BadgeCheck className="h-4 w-4 text-primary-500" />
                  )}
                  <h3 className="font-semibold text-sm m-0 leading-tight">{langar.name}</h3>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{langar.address}</span>
                </div>
                {getLangarTimingText(langar) && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3 w-3" />
                    <span>{getLangarTimingText(langar)}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-1 mt-3">
                <Button asChild size="sm" className="w-full h-7 text-xs">
                  <a href={`/langar/${langar.id}`}>{t('langar.viewDetails')}</a>
                </Button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
