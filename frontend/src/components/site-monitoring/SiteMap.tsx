import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Plus, Minus, Move, Maximize2, PanelLeft, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';

// Custom Icons
const createStatusIcon = (color: string) => L.divIcon({
    className: "bg-transparent",
    html: `<div class="w-4 h-4 rounded-full ${color} border-2 border-white shadow-[0_2px_4px_rgba(0,0,0,0.3)]"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});



const greenIcon = createStatusIcon("bg-emerald-500");
const redIcon = createStatusIcon("bg-red-500");

// Sample Data
import { SITES } from "../../data/sites";



interface OverlayControlsProps {
    map: L.Map | null;
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
}

function OverlayControls({ map, isSidebarOpen, onToggleSidebar }: OverlayControlsProps) {
    if (!map) return null;

    return (
        <div className="absolute inset-0 pointer-events-none z-[1000] p-4 flex flex-col justify-between">
            {/* Top Row */}
            <div className="flex justify-between items-start">
                {/* Top Left - Show Sites / Directions */}
                <div className="pointer-events-auto">
                    <div className="bg-white rounded shadow-md overflow-hidden flex flex-col w-[200px]">
                        <div className="p-3 border-b border-gray-100 flex justify-between items-center bg-gray-800 text-white">
                            <button
                                onClick={onToggleSidebar}
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full text-left"
                            >
                                <PanelLeft className="w-4 h-4" />
                                <span className="text-sm font-medium">{isSidebarOpen ? 'Hide Sites' : 'Show Sites'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Top Right - Zoom Controls */}
                <div className="pointer-events-auto flex flex-col gap-2">
                    <div className="bg-[#1e293b] rounded-lg shadow-xl border border-gray-700 overflow-hidden flex flex-col">
                        <button
                            onClick={() => map.zoomIn()}
                            className="p-3 hover:bg-gray-700 text-gray-300 transition-colors border-b border-gray-700"
                            aria-label="Zoom in"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => map.zoomOut()}
                            className="p-3 hover:bg-gray-700 text-gray-300 transition-colors"
                            aria-label="Zoom out"
                        >
                            <Minus className="w-5 h-5" />
                        </button>
                    </div>

                    <button className="bg-[#1e293b] p-3 rounded-lg shadow-xl border border-gray-700 text-gray-300 hover:bg-gray-700 transition-colors mt-2">
                        <Maximize2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex justify-between items-end">
                {/* Bottom Left - Legend */}
                <div className="pointer-events-auto mb-4">
                    <div className="bg-[#1e293b] text-white p-4 rounded-lg shadow-xl border border-gray-700 min-w-[180px]">
                        <h3 className="font-bold mb-3 text-sm">Legend</h3>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                <span className="text-xs text-gray-300">Online Sites</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-xs text-gray-300">Offline Sites</span>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Bottom Right - Google Attribution Mock */}
                <div className="pointer-events-auto bg-white/80 px-2 py-0.5 text-[10px] text-gray-600">
                    map data ©2026 Google
                </div>
            </div>
        </div>
    );
}

// Side Effect component to handle map invalidation on sidebar toggle
function SidebarResizeHandler({ map, isSidebarOpen }: { map: L.Map | null, isSidebarOpen: boolean }) {
    useEffect(() => {
        if (!map) return;
        setTimeout(() => {
            map.invalidateSize();
        }, 300);
    }, [isSidebarOpen, map]);
    return null;
}

// Side Effect to fly to selected site
function MapFlyTo({ map, site }: { map: L.Map | null, site: any }) {
    useEffect(() => {
        if (!map || !site) return;
        map.flyTo([site.lat, site.lng], 13, {
            duration: 1.5
        });
    }, [map, site]);
    return null;
}

import { SitePreviewCard } from './SitePreviewCard';

interface SiteMapProps {
    isSidebarOpen?: boolean;
    onToggleSidebar?: () => void;
    selectedSite?: any;
    onCloseSite?: () => void;
    onSelectSite?: (site: any) => void;
}

export default function SiteMap({
    isSidebarOpen = false,
    onToggleSidebar = () => { },
    selectedSite = null,
    onCloseSite = () => { },
    onSelectSite = () => { }
}: SiteMapProps) {
    const [map, setMap] = useState<L.Map | null>(null);

    return (
        <div className="relative w-full h-full">
            <style jsx global>{`
                .leaflet-tooltip-bottom {
                    margin-top: 6px;
                }
                .custom-map-tooltip {
                    background-color: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    font-size: 10px;
                    font-weight: bold;
                    color: #0f172a;
                    text-shadow: 0 0 2px white, 0 0 4px white;
                }
                .custom-map-tooltip::before {
                    display: none !important;
                }
            `}</style>
            <MapContainer
                center={[-6.5, 107.2]} // Java, Indonesia
                zoom={9}
                minZoom={5}
                maxZoom={18}
                scrollWheelZoom={true}
                className="w-full h-full z-0 bg-blue-50"
                zoomControl={false}
                attributionControl={false}
                ref={setMap}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />

                {SITES.map(site => (
                    <Marker
                        key={site.id}
                        position={[site.lat, site.lng]}
                        icon={site.status === 'online' ? greenIcon : redIcon}
                        eventHandlers={{
                            click: () => onSelectSite(site),
                        }}
                    >
                        <Tooltip
                            permanent
                            direction="bottom"
                            offset={[0, 5]}
                            className="custom-map-tooltip"
                        >
                            {site.name}
                        </Tooltip>
                        <Popup className="custom-popup">
                            <div className="font-sans">
                                <h3 className="font-bold text-gray-900">{site.name}</h3>
                                <p className={`text-xs font-bold ${site.status === 'online' ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {site.status.toUpperCase()}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}


                <MapFlyTo map={map} site={selectedSite} />
            </MapContainer>

            {/* Overlay UI Controls */}
            <OverlayControls map={map} isSidebarOpen={isSidebarOpen} onToggleSidebar={onToggleSidebar} />

            {/* Site Preview Card Overlay */}
            {selectedSite && (
                <SitePreviewCard
                    site={selectedSite}
                    onClose={onCloseSite}
                    onLocate={() => {
                        if (map && selectedSite) {
                            map.flyTo([selectedSite.lat, selectedSite.lng], 13, {
                                duration: 1.5
                            });
                        }
                    }}
                />
            )}

            {/* Helper to handle map resize events */}
            <SidebarResizeHandler map={map} isSidebarOpen={isSidebarOpen} />
        </div>
    );
}
