
import { Deed, DeedStats } from '@/types/deed';

// Calculate stats based on filtered deeds
export const calculateStats = (deedsToCalculate: Deed[]): DeedStats => {
  const statResult: DeedStats = {
    total: deedsToCalculate.length,
    byCategory: {},
    byMonth: {},
    byImpact: { small: 0, medium: 0, large: 0 }
  };
  
  // Calculate categories, months, and impact stats
  deedsToCalculate.forEach(deed => {
    // Categories
    if (deed.category) {
      statResult.byCategory[deed.category] = (statResult.byCategory[deed.category] || 0) + 1;
    }
    
    // Months
    if (deed.date) {
      const monthKey = new Date(deed.date).toISOString().slice(0, 7); // YYYY-MM format
      statResult.byMonth[monthKey] = (statResult.byMonth[monthKey] || 0) + 1;
    }
    
    // Impact
    if (deed.impact) {
      statResult.byImpact[deed.impact as keyof typeof statResult.byImpact] += 1;
    }
  });
  
  return statResult;
};

// Create mock community deeds by duplicating user deeds
export const createMockCommunityDeeds = (userDeeds: Deed[]): Deed[] => {
  return [
    ...userDeeds,
    ...userDeeds.map(deed => ({
      ...deed,
      id: `community-${deed.id}`,
      title: `${deed.title} by Community Member`,
    })),
    ...userDeeds.map(deed => ({
      ...deed,
      id: `global-${deed.id}`,
      title: `Global ${deed.title}`,
      category: deed.category === 'Other' ? 'Global' : deed.category,
      date: new Date(new Date(deed.date).setDate(new Date(deed.date).getDate() - Math.floor(Math.random() * 30))),
    })),
  ];
};
