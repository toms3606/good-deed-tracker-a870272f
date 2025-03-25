
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
  const [mapToken, setMapToken] = useState<string>("pk.eyJ1Ijoid2VzdHdhcmRtYXJrZXRpbmdsYWIiLCJhIjoiY204b210dGtnMDF6cDJubXp6eWsxdnp2ZSJ9.FpVok5j0vR8lLFqgt4cEIA");
  const [deedLocations, setDeedLocations] = useState<Array<{deed: Deed, lat: number, lng: number}>>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapToken(savedToken);
    }
  }, []);

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

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'small': return '#10b981'; // green
      case 'medium': return '#3b82f6'; // blue
      case 'large': return '#8b5cf6'; // purple
      default: return '#f97316'; // orange
    }
  };

  const handleTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapToken(e.target.value);
  };

  const handleSaveToken = () => {
    if (mapToken.trim()) {
      localStorage.setItem('mapbox_token', mapToken);
      toast({
        title: "Token Saved",
        description: "Your Mapbox token has been saved for future sessions.",
      });
    }
  };

  useEffect(() => {
    if (!mapToken || !mapRef.current || mapLoaded) return;
    
    try {
      mapboxgl.accessToken = mapToken;
      
      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 1.5,
        projection: 'globe'
      });

      mapInstance.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      mapInstance.current.on('style.load', () => {
        mapInstance.current?.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });
      });

      const deeds = getDeeds();
      
      const filteredDeeds = statusFilter === 'all' 
        ? deeds 
        : deeds.filter(deed => statusFilter === 'completed' ? deed.completed : !deed.completed);
      
      const deedWithLocations = filteredDeeds.map((deed, index) => {
        const location = mockLocations[index % mockLocations.length];
        return { deed, ...location };
      });
      
      setDeedLocations(deedWithLocations);

      mapInstance.current.on('load', () => {
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        
        deedWithLocations.forEach(({ deed, lat, lng }) => {
          const el = document.createElement('div');
          el.className = 'custom-marker';
          el.style.backgroundColor = getImpactColor(deed.impact);
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid #fff';
          
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <strong>${deed.title}</strong>
                <p>Category: ${deed.category}</p>
                <p>Impact: ${deed.impact}</p>
              </div>
            `);
          
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

  useEffect(() => {
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapInstance.current) return;
    
    try {
      const deeds = getDeeds();
      
      const filteredDeeds = statusFilter === 'all' 
        ? deeds 
        : deeds.filter(deed => statusFilter === 'completed' ? deed.completed : !deed.completed);
      
      const deedWithLocations = filteredDeeds.map((deed, index) => {
        const location = mockLocations[index % mockLocations.length];
        return { deed, ...location };
      });
      
      setDeedLocations(deedWithLocations);
      
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      deedWithLocations.forEach(({ deed, lat, lng }) => {
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.style.backgroundColor = getImpactColor(deed.impact);
        el.style.width = '20px';
        el.style.height = '20px';
        el.style.borderRadius = '50%';
        el.style.border = '2px solid #fff';
        
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 8px;">
              <strong>${deed.title}</strong>
              <p>Category: ${deed.category}</p>
              <p>Impact: ${deed.impact}</p>
            </div>
          `);
        
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
        <div ref={mapRef} className="h-[400px] rounded-md w-full" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Changing the world for good
        </p>
      </CardContent>
    </Card>
  );
};

export default GlobalMap;
