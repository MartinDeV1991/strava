
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map = ({ polyline, activity }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [centerLat, setCenterLat] = useState(null);
    const [centerLng, setCenterLng] = useState(null);
    const [activityName, setActivityName] = useState("loop");

    useEffect(() => {
        if (!polyline) return;
        const decodedCoordinates = decodePolyline(polyline);
        setCoordinates(decodedCoordinates);
        if (activity !== undefined) {
            setActivityName(activity.name)
        }
    }, [polyline]);

    useEffect(() => {
        if (coordinates.length === 0) return;
        const bounds = coordinates.reduce((bounds, coord) => {
            return bounds.extend(coord);
        }, new window.L.LatLngBounds());

        const newCenter = bounds.getCenter();
        setCenterLat(newCenter.lat);
        setCenterLng(newCenter.lng);
    }, [coordinates]);

    useEffect(() => {
    }, [centerLat]);

    function decodePolyline(polylineString) {
        let index = 0;
        let lat = 0;
        let lng = 0;
        const coordinates = [];

        while (index < polylineString.length) {
            let shift = 0;
            let result = 0;

            let byte;
            do {
                byte = polylineString.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
            lat += dlat;

            shift = 0;
            result = 0;
            do {
                byte = polylineString.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
            lng += dlng;

            coordinates.push([lat * 1e-5, lng * 1e-5]);
        }

        return coordinates;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>{activityName}</div>
            {centerLat !== null && centerLng !== null && (

                <MapContainer
                    key={`${centerLat}-${centerLng}`}
                    center={[centerLat, centerLng]}
                    zoom={14}
                    style={{ height: '400px', width: '700px' }}
                    attributionControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline positions={coordinates} />
                </MapContainer>
            )
            }
        </div>
    );
};
export default Map;