
import React from 'react';
import Navbar from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import CommunityStats from '@/components/CommunityStats';
import GlobalMap from '@/components/GlobalMap';

const Community: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ProtectedRoute>
        <div className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
          <h1 className="text-4xl font-bold mb-8 animate-fade-in">Good Deeds Community</h1>
          <GlobalMap />
          <div className="mt-10">
            <CommunityStats />
          </div>
        </div>
      </ProtectedRoute>
    </div>
  );
};

export default Community;
