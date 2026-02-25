import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Target } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks and view updates
const MapController = ({ position, setPosition, onLocationSelect, setAddress }) => {
    const map = useMap();

    const reverseGeocode = async (lat, lng) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
            const data = await response.json();
            if (data && data.display_name) {
                const addr = data.display_name;
                setAddress(addr);
                onLocationSelect({ latitude: lat, longitude: lng }, addr);
            } else {
                const addr = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setAddress(addr);
                onLocationSelect({ latitude: lat, longitude: lng }, addr);
            }
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            const addr = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
            setAddress(addr);
            onLocationSelect({ latitude: lat, longitude: lng }, addr);
        }
    };

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            onLocationSelect({ latitude: lat, longitude: lng }, address);
            reverseGeocode(lat, lng);
            map.flyTo([lat, lng], map.getZoom());
        },
    });

    // Move map when position changes from outside (like "My Location" button)
    useEffect(() => {
        if (position) {
            map.setView(position, map.getZoom());
            reverseGeocode(position[0], position[1]);
        }
    }, [position, map]);

    return null;
};

const LocationPicker = ({ onLocationSelect }) => {
    const [position, setPosition] = useState(null);
    const [center] = useState([28.7041, 77.1025]); // Default center
    const [detecting, setDetecting] = useState(false);
    const [address, setAddress] = useState('');

    const handleCurrentLocation = (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        setDetecting(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = [pos.coords.latitude, pos.coords.longitude];
                    setPosition(coords);
                    // onLocationSelect will be called by reverseGeocode in useEffect
                    setDetecting(false);
                },
                () => {
                    alert("Could not get your location. Please select it manually on the map.");
                    setDetecting(false);
                },
                { timeout: 10000 }
            );
        } else {
            setDetecting(false);
        }
    };

    return (
        <div style={{ marginBottom: '25px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={18} color="#6366f1" />
                    Drop a pin on the issue location
                </label>
                <button
                    type="button"
                    onClick={handleCurrentLocation}
                    disabled={detecting}
                    style={{
                        background: 'rgba(99, 102, 241, 0.1)',
                        color: '#6366f1',
                        border: '1px solid #6366f1',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        cursor: detecting ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    <Target size={14} className={detecting ? 'animate-pulse' : ''} />
                    {detecting ? 'Locating...' : 'My Location'}
                </button>
            </div>

            <div style={{
                height: '350px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                background: '#0f172a'
            }}>
                <MapContainer
                    center={center}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OSM' />
                    <MapController position={position} setPosition={setPosition} onLocationSelect={onLocationSelect} setAddress={setAddress} />
                    {position && (
                        <Marker position={position}>
                            <Popup>Issue Location</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>

            {position && (
                <div style={{
                    marginTop: '10px',
                    fontSize: '0.8rem',
                    color: '#6366f1',
                    background: 'rgba(99, 102, 241, 0.05)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <div>📍 {position[0].toFixed(6)}, {position[1].toFixed(6)}</div>
                    {address && <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{address}</div>}
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
