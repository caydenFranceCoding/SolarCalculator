import React, { useEffect, useRef, useState } from 'react';

const MapComponent = ({ address, systemSize }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapHeight, setMapHeight] = useState('16rem');
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Update map height based on screen width
  useEffect(() => {
    const updateMapHeight = () => {
      const currentWidth = window.innerWidth;
      setIsMobile(currentWidth <= 640);

      if (currentWidth < 640) {
        setMapHeight('14rem');
      } else if (currentWidth < 1024) {
        setMapHeight('18rem');
      } else {
        setMapHeight('20rem');
      }
    };

    // Initial height setting
    updateMapHeight();

    // Update height on resize
    window.addEventListener('resize', updateMapHeight);

    return () => {
      window.removeEventListener('resize', updateMapHeight);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setMapError(null);

    if (!window.google) {
      const script = document.createElement('script');

      // Get API key and log availability without revealing the key itself
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
      console.log("API Key available:", !!apiKey);

      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log("Google Maps script loaded successfully");
        initMap();
      };

      script.onerror = () => {
        console.error("Failed to load Google Maps script - check your API key");
        setMapError("Failed to load map");
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } else {
      console.log("Google Maps already loaded");
      initMap();
    }

    function initMap() {
      try {
        if (!mapRef.current) {
          console.error("Map container ref not available");
          return;
        }

        console.log("Initializing map...");
        const defaultCenter = { lat: 32.7767, lng: -96.7970 }; // Dallas

        // Create map with responsive options based on screen size
        const mapOptions = {
          zoom: isMobile ? 19 : 20,
          center: defaultCenter,
          mapTypeId: 'satellite',
          tilt: 0,
          draggable: true,
          zoomControl: !isMobile,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: !isMobile,
          scrollwheel: !isMobile,
          disableDoubleClickZoom: isMobile,
          gestureHandling: isMobile ? 'cooperative' : 'greedy',
          keyboardShortcuts: false
        };

        mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);

        console.log("Map instance created");

        if (address) {
          console.log("Geocoding address:", address);
          const geocoder = new window.google.maps.Geocoder();

          geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
              const location = results[0].geometry.location;
              console.log("Geocoding successful");

              mapInstanceRef.current.setCenter(location);

              // Add a marker with animation for better UX
              new window.google.maps.Marker({
                map: mapInstanceRef.current,
                position: location,
                animation: window.google.maps.Animation.DROP
              });

              // Add system size indicator if provided
              if (systemSize) {
                // Calculate polygon size based on system size (just for visualization)
                const scale = Math.min(Math.max(systemSize / 10, 0.5), 1.5) * 0.0001;

                const roofOutline = new window.google.maps.Polygon({
                  paths: [
                    { lat: location.lat() + scale, lng: location.lng() + scale },
                    { lat: location.lat() + scale, lng: location.lng() - scale },
                    { lat: location.lat() - scale, lng: location.lng() - scale },
                    { lat: location.lat() - scale, lng: location.lng() + scale }
                  ],
                  strokeColor: '#4CAF50',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#4CAF50',
                  fillOpacity: 0.35
                });

                roofOutline.setMap(mapInstanceRef.current);
              }
            } else {
              console.warn("Geocoding failed:", status);
            }

            setIsLoading(false);
          });
        } else {
          console.log("No address provided, using default location");
          setIsLoading(false);
        }

        // Handle window resize for responsive controls
        const handleResize = () => {
          const mobile = window.innerWidth <= 640;

          if (mapInstanceRef.current) {
            mapInstanceRef.current.setOptions({
              zoomControl: !mobile,
              fullscreenControl: !mobile,
              gestureHandling: mobile ? 'cooperative' : 'greedy'
            });
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Error displaying map");
        setIsLoading(false);
      }
    }

    return () => {
      // Clean up if needed
    };
  }, [address, isMobile, systemSize]);

  return (
    <div
      className="w-full relative rounded-t-xl overflow-hidden"
      style={{ height: mapHeight }}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4 text-center">
          <div className="text-red-500">{mapError}</div>
        </div>
      )}

      <div ref={mapRef} className="absolute inset-0" />

      {/* Mobile help overlay */}
      {!isLoading && !mapError && isMobile && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-30 text-white text-xs p-2 text-center">
          Use two fingers to navigate map
        </div>
      )}
    </div>
  );
};

export default MapComponent;