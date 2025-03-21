
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import CommunityStats from '@/components/CommunityStats';
import GlobalMap from '@/components/GlobalMap';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const Community: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>('all');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProtectedRoute>
        <div className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-8 animate-fade-in">Good Deeds Community</h1>
          
          {/* Status filter moved above the map and left-justified */}
          <div className="mb-6 flex justify-start">
            <ToggleGroup 
              type="single" 
              value={statusFilter} 
              onValueChange={(value) => value && setStatusFilter(value as 'all' | 'completed' | 'pending')}
              className="flex"
            >
              <ToggleGroupItem 
                value="all" 
                aria-label="Show all deeds"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                All
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="completed" 
                aria-label="Show completed deeds"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Completed
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="pending" 
                aria-label="Show pending deeds"
                className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                Pending
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          
          <GlobalMap statusFilter={statusFilter} />
          <div className="mt-10">
            <CommunityStats initialStatusFilter={statusFilter} />
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default Community;
