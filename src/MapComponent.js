import React, { useEffect, useRef } from 'react';

const MapComponent = ({ address }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script');
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current) return;

      const defaultCenter = { lat: 32.7767, lng: -96.7970 }; // Dallas

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 20,
        center: defaultCenter,
        mapTypeId: 'satellite',
        tilt: 0,
        draggable: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false,
        scrollwheel: false,
        disableDoubleClickZoom: true,
        keyboardShortcuts: false
      });

      if (address) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK') {
            const location = results[0].geometry.location;
            mapInstanceRef.current.setCenter(location);

            new window.google.maps.Marker({
              map: mapInstanceRef.current,
              position: location
            });
          }
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        // Clean up map instance if needed
      }
    };
  }, [address]);

  return (
    <div className="w-full h-80 relative rounded-t-xl overflow-hidden">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default MapComponent;