import React, { useEffect, useRef, useState } from 'react';

const MapSection = ({ address }) => {
  const mapRef = useRef(null);
  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const geocoder = new google.maps.Geocoder();

    if (address) {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          setCoordinates({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          });
        }
      });
    }
  }, [address]);

  useEffect(() => {
    if (coordinates && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: coordinates,
        zoom: 19,
        mapTypeId: 'satellite',
        tilt: 0
      });

      // Draw roof outline
      const roofOutline = new google.maps.Polygon({
        paths: [
          { lat: coordinates.lat + 0.0001, lng: coordinates.lng + 0.0001 },
          { lat: coordinates.lat + 0.0001, lng: coordinates.lng - 0.0001 },
          { lat: coordinates.lat - 0.0001, lng: coordinates.lng - 0.0001 },
          { lat: coordinates.lat - 0.0001, lng: coordinates.lng + 0.0001 }
        ],
        strokeColor: '#4CAF50',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4CAF50',
        fillOpacity: 0.35
      });

      roofOutline.setMap(map);

      // Add markers for solar panels
      const panelLocations = calculatePanelLocations(coordinates, 5); // 5 panels as example
      panelLocations.forEach(location => {
        new google.maps.Marker({
          position: location,
          map: map,
          icon: {
            path: google.maps.SymbolPath.RECTANGLE,
            scale: 8,
            fillColor: '#2196F3',
            fillOpacity: 0.9,
            strokeWeight: 1,
            rotation: 45
          }
        });
      });
    }
  }, [coordinates]);

  // Helper function to calculate panel locations
  const calculatePanelLocations = (center, count) => {
    const locations = [];
    const offset = 0.00002;

    for (let i = 0; i < count; i++) {
      locations.push({
        lat: center.lat + (offset * i),
        lng: center.lng + (offset * i)
      });
    }

    return locations;
  };

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-64 bg-gray-100"
        style={{ minHeight: '400px' }}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white">
        <h3 className="font-semibold">Optimal Panel Placement</h3>
        <p className="text-sm">South-facing roof area highlighted</p>
      </div>
    </div>
  );
};

export default MapSection;