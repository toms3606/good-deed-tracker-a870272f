
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Map } from 'lucide-react';
import { Deed } from '@/types/deed';
import { getDeeds } from '@/utils/deedUtils';
import { useToast } from '@/hooks/use-toast';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface GlobalMapProps {
  statusFilter: 'all' | 'completed' | 'pending';
}

const GlobalMap: React.FC<GlobalMapProps> = ({ statusFilter }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapToken, setMapToken] = useState<string>('');
  const [deedLocations, setDeedLocations] = useState<Array<{deed: Deed, lat: number, lng: number}>>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // Load token from localStorage on initial render
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapToken(savedToken);
    }
  }, []);

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

  // Get impact color
  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'small': return '#10b981'; // green
      case 'medium': return '#3b82f6'; // blue
      case 'large': return '#8b5cf6'; // purple
      default: return '#f97316'; // orange
    }
  };

  // Handle Mapbox token input
  const handleTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapToken(e.target.value);
  };

  // Save token to localStorage when user submits
  const handleSaveToken = () => {
    if (mapToken.trim()) {
      localStorage.setItem('mapbox_token', mapToken);
      toast({
        title: "Token Saved",
        description: "Your Mapbox token has been saved for future sessions.",
      });
    }
  };

  // Initialize map when token is available
  useEffect(() => {
    if (!mapToken || !mapRef.current || mapLoaded) return;
    
    try {
      // Initialize Mapbox
      mapboxgl.accessToken = mapToken;
      
      // Create map instance
      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1.5,
        projection: 'globe'
      });

      // Add navigation controls
      mapInstance.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add fog effect
      mapInstance.current.on('style.load', () => {
        mapInstance.current?.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });
      });

      // Get deeds data
      const deeds = getDeeds();
      
      // Filter deeds based on status filter
      const filteredDeeds = statusFilter === 'all' 
        ? deeds 
        : deeds.filter(deed => statusFilter === 'completed' ? deed.completed : !deed.completed);
      
      // Add markers for each deed location
      const deedWithLocations = filteredDeeds.map((deed, index) => {
        // Assign a mock location to each deed (in a real app, use actual locations)
        const location = mockLocations[index % mockLocations.length];
        return { deed, ...location };
      });
      
      setDeedLocations(deedWithLocations);

      // Add markers when map loads
      mapInstance.current.on('load', () => {
        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        // Add markers to map
        deedWithLocations.forEach(({ deed, lat, lng }) => {
          // Create custom marker element
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.backgroundColor = getImpactColor(deed.impact);
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid #fff';
          
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <strong>${deed.title}</strong>
                <p>Category: ${deed.category}</p>
                <p>Impact: ${deed.impact}</p>
              </div>
            `);
          
          // Create and store marker
          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(mapInstance.current!);
            
          markersRef.current.push(marker);
        });
        
        setMapLoaded(true);
      });
      
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "Could not load the map. Please try again later.",
        variant: "destructive",
      });
    }
  }, [mapToken, statusFilter]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  // Update markers when status filter changes
  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    
    try {
      // Get deeds data
      const deeds = getDeeds();
      
      // Filter deeds based on status filter
      const filteredDeeds = statusFilter === 'all' 
        ? deeds 
        : deeds.filter(deed => statusFilter === 'completed' ? deed.completed : !deed.completed);
      
      // Add markers for each deed location
      const deedWithLocations = filteredDeeds.map((deed, index) => {
        // Assign a mock location to each deed (in a real app, use actual locations)
        const location = mockLocations[index % mockLocations.length];
        return { deed, ...location };
      });
      
      setDeedLocations(deedWithLocations);
      
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      // Add markers to map
      deedWithLocations.forEach(({ deed, lat, lng }) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = getImpactColor(deed.impact);
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid #fff';
        
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 8px;">
              <strong>${deed.title}</strong>
              <p>Category: ${deed.category}</p>
              <p>Impact: ${deed.impact}</p>
            </div>
          `);
        
        // Create and store marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(mapInstance.current!);
          
        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error("Error updating markers:", error);
    }
  }, [statusFilter, mapLoaded]);

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5" />
          Global Good Deeds Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!mapToken ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please enter your Mapbox access token to view the map. You can get a free token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>.
            </p>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={mapToken} 
                onChange={handleTokenInput}
                placeholder="Enter your Mapbox token" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button 
                onClick={handleSaveToken}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md bg-primary text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
            <div ref={mapRef} className="h-[400px] rounded-md w-full" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Map showing good deeds from community members around the world
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GlobalMap;
