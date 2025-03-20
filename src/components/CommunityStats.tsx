
import React, { useEffect, useState } from 'react';
import { getDeeds } from '@/utils/deedUtils';
import { DeedStats, Deed } from '@/types/deed';
import { HandHeart, TrendingUp, Calendar, Users } from 'lucide-react';
import { sub } from 'date-fns';
import { calculateStats, createMockCommunityDeeds } from '@/utils/communityUtils';

// Import our new components
import StatCard from './community/StatCard';
import ActivityChart from './community/ActivityChart';
import CategoryChart from './community/CategoryChart';
import DeedsTable from './community/DeedsTable';

interface CommunityStatsProps {
  initialStatusFilter?: 'all' | 'completed' | 'pending';
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ initialStatusFilter = 'all' }) => {
  // Stats state
  const [stats, setStats] = useState<DeedStats>({
    total: 0,
    byCategory: {},
    byMonth: {},
    byImpact: { small: 0, medium: 0, large: 0 }
  });
  
  const [deeds, setDeeds] = useState<Deed[]>([]);
  
  // Status filter state - use the initialStatusFilter
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending'>(initialStatusFilter);
  
  // Date range state
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: sub(new Date(), { months: 6 }),
    to: new Date()
  });
  
  // Selected range state
  const [selectedRange, setSelectedRange] = useState<string>("6months");
  
  useEffect(() => {
    // Update status filter when initialStatusFilter changes
    setStatusFilter(initialStatusFilter);
  }, [initialStatusFilter]);
  
  useEffect(() => {
    // Mock additional community deeds by duplicating existing deeds with new IDs
    const userDeeds = getDeeds();
    
    // Create a larger dataset for the community view
    const mockCommunityDeeds = createMockCommunityDeeds(userDeeds);
    
    setDeeds(mockCommunityDeeds);
    
    // Filter stats based on status
    let filteredDeedsForStats = mockCommunityDeeds;
    if (statusFilter !== 'all') {
      filteredDeedsForStats = mockCommunityDeeds.filter(deed => 
        statusFilter === 'completed' ? deed.completed : !deed.completed
      );
    }
    
    // Calculate stats using filtered deeds
    const filteredStats = calculateStats(filteredDeedsForStats);
    setStats(filteredStats);
  }, [statusFilter]);
  
  return (
    <div className="space-y-6">
      {/* Activity Chart with Date Range Selector. Status Filter removed */}
      <ActivityChart 
        deeds={deeds} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedRange={selectedRange}
        setSelectedRange={setSelectedRange}
        hideStatusFilter={true} // New prop to hide status filter
      />
      
      {/* Stat cards for community metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Community Deeds"
          value={stats.total}
          icon={<HandHeart className="h-6 w-6" />}
        />
        
        <StatCard
          title="Active Categories"
          value={Object.keys(stats.byCategory).length}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        
        <StatCard
          title="Monthly Community Average"
          value={Object.keys(stats.byMonth).length > 0 
            ? Math.round(stats.total / Object.keys(stats.byMonth).length) 
            : 0}
          icon={<Calendar className="h-6 w-6" />}
        />
        
        <StatCard
          title="Community Members"
          value={Math.floor(stats.total / 3)} // Approximating number of members
          icon={<Users className="h-6 w-6" />}
        />
      </div>
      
      {/* Category Chart */}
      <CategoryChart stats={stats} />
      
      {/* Deeds Table */}
      <DeedsTable deeds={deeds} statusFilter={statusFilter} />
    </div>
  );
};

export default CommunityStats;
