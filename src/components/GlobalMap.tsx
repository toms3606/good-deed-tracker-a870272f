
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Deed } from '@/types/deed';
import { getDeeds } from '@/utils/deedUtils';

const GlobalMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapApiKey, setMapApiKey] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [showKeyInput, setShowKeyInput] = useState(!mapApiKey);
  const [deedLocations, setDeedLocations] = useState<Array<{deed: Deed, lat: number, lng: number}>>([]);

  // Mock locations for demonstration
  // In a real app, these would come from user profiles or geocoding the deed locations
  const mockLocations = [
    { lat: 40.7128, lng: -74.0060 }, // New York
    { lat: 34.0522, lng: -118.2437 }, // Los Angeles
    { lat: 51.5074, lng: -0.1278 }, // London
    { lat: 48.8566, lng: 2.3522 }, // Paris
    { lat: 35.6762, lng: 139.6503 }, // Tokyo
    { lat: -33.8688, lng: 151.2093 }, // Sydney
    { lat: 55.7558, lng: 37.6173 }, // Moscow
    { lat: 19.4326, lng: -99.1332 }, // Mexico City
    { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro
    { lat: 37.7749, lng: -122.4194 }, // San Francisco
  ];

  // Initialize map when API key is available
  useEffect(() => {
    if (!mapApiKey || !mapRef.current) return;

    const initializeMap = async () => {
      try {
        // Load Mapbox GL JS
        const mapboxgl = (await import('mapbox-gl')).default;
        import('mapbox-gl/dist/mapbox-gl.css');

        // Set access token
        mapboxgl.accessToken = mapApiKey;

        // Create map instance
        const map = new mapboxgl.Map({
          container: mapRef.current!,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [0, 20],
          zoom: 1.5,
        });

        // Get deeds data
        const deeds = getDeeds();
        
        // Add markers for each deed location
        const deedWithLocations = deeds.map((deed, index) => {
          // Assign a mock location to each deed (in a real app, use actual locations)
          const location = mockLocations[index % mockLocations.length];
          return { deed, ...location };
        });
        
        setDeedLocations(deedWithLocations);
        
        // Add markers to map
        deedWithLocations.forEach(({ deed, lat, lng }) => {
          // Create a DOM element for the marker
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = getImpactColor(deed.impact);
          el.style.boxShadow = '0 0 0 2px white';
          el.style.cursor = 'pointer';
          
          // Add popup with deed info
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <strong>${deed.title}</strong>
              <p>${deed.category}</p>
              <p>Impact: ${deed.impact}</p>
            `);
          
          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map);
        });
        
        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Clean up on unmount
        return () => map.remove();
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };
    
    initializeMap();
  }, [mapApiKey]);
  
  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'small': return '#10b981'; // green
      case 'medium': return '#3b82f6'; // blue
      case 'large': return '#8b5cf6'; // purple
      default: return '#f97316'; // orange
    }
  };
  
  const handleSaveApiKey = () => {
    localStorage.setItem('mapbox_token', mapApiKey);
    setShowKeyInput(false);
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Global Good Deeds Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showKeyInput ? (
          <div className="mb-4 p-4 border rounded-md bg-muted/50">
            <p className="mb-2 text-sm">To display the map, you need a Mapbox access token. Get one at <a href="https://www.mapbox.com/signup/" target="_blank" rel="noreferrer" className="text-primary underline">mapbox.com</a></p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter your Mapbox access token"
                value={mapApiKey}
                onChange={(e) => setMapApiKey(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSaveApiKey}>Save</Button>
            </div>
          </div>
        ) : (
          <div ref={mapRef} className="h-[400px] rounded-md w-full" />
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalMap;
