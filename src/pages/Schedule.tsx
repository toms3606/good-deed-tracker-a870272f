
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Deed } from '@/types/deed';
import { getDeeds } from '@/utils/deedUtils';
import CalendarView from '@/components/CalendarView';

const Schedule: React.FC = () => {
  const [deeds, setDeeds] = useState<Deed[]>([]);
  
  useEffect(() => {
    const loadDeeds = () => {
      const storedDeeds = getDeeds();
      setDeeds(storedDeeds);
    };
    
    loadDeeds();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadDeeds);
    
    return () => {
      window.removeEventListener('storage', loadDeeds);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold animate-fade-in">Schedule Your Good Deeds</h1>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <CalendarView />
        </div>
      </main>
    </div>
  );
};

export default Schedule;
