
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Deed } from '@/types/deed';
import { getDeeds } from '@/utils/deedUtils';
import { useToast } from '@/hooks/use-toast';

interface GlobalMapProps {
  statusFilter: 'all' | 'completed' | 'pending';
}

const GlobalMap: React.FC<GlobalMapProps> = ({ statusFilter }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [deedLocations, setDeedLocations] = useState<Array<{deed: Deed, lat: number, lng: number}>>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    // Initialize Google Maps
    const initializeMap = async () => {
      try {
        // Check if Google Maps API is already loaded
        if (!window.google) {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initMap`;
          script.async = true;
          script.defer = true;
          
          // Define the callback function
          window.initMap = () => {
            loadMap();
          };
          
          document.head.appendChild(script);
        } else {
          loadMap();
        }
      } catch (error) {
        console.error("Error initializing map:", error);
        toast({
          title: "Map Error",
          description: "Could not load the map. Please try again later.",
          variant: "destructive",
        });
      }
    };

    // Function to actually create the map
    const loadMap = () => {
      if (mapRef.current && window.google) {
        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          mapTypeId: 'terrain',
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          styles: [
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [
                { color: "#e9e9e9" },
                { lightness: 17 }
              ]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [
                { color: "#f5f5f5" },
                { lightness: 20 }
              ]
            }
          ]
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
        
        // Add markers to map
        deedWithLocations.forEach(({ deed, lat, lng }) => {
          const marker = new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: deed.title,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: getImpactColor(deed.impact),
              fillOpacity: 0.9,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 10,
            }
          });
          
          // Add info window with deed info
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px;">
                <strong>${deed.title}</strong>
                <p>Category: ${deed.category}</p>
                <p>Impact: ${deed.impact}</p>
              </div>
            `
          });
          
          marker.addListener("click", () => {
            infoWindow.open(map, marker);
          });
        });
        
        setMapLoaded(true);
      }
    };
    
    initializeMap();
  }, [statusFilter]); // Add statusFilter as a dependency
  
  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'small': return '#10b981'; // green
      case 'medium': return '#3b82f6'; // blue
      case 'large': return '#8b5cf6'; // purple
      default: return '#f97316'; // orange
    }
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
        <div ref={mapRef} className="h-[400px] rounded-md w-full" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Map showing good deeds from community members around the world
        </p>
      </CardContent>
    </Card>
  );
};

// Add type definition for the global initMap function
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default GlobalMap;
