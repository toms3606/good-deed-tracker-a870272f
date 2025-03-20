
import { Deed, DeedStats } from '@/types/deed';

// Sample deed categories
export const DEED_CATEGORIES = [
  'Family',
  'Friends',
  'Strangers',
  'Community',
  'Environment',
  'Animals',
  'Other'
];

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

// Get deeds from local storage
export const getDeeds = (): Deed[] => {
  const storedDeeds = localStorage.getItem('deeds');
  if (!storedDeeds) return [];
  return JSON.parse(storedDeeds).map((deed: any) => ({
    ...deed,
    date: new Date(deed.date)
  }));
};

// Save deeds to local storage
export const saveDeeds = (deeds: Deed[]): void => {
  localStorage.setItem('deeds', JSON.stringify(deeds));
};

// Add a new deed
export const addDeed = (deed: Omit<Deed, 'id'>): Deed => {
  const newDeed = {
    ...deed,
    id: generateId()
  };
  
  const deeds = getDeeds();
  saveDeeds([...deeds, newDeed]);
  
  return newDeed;
};

// Update a deed
export const updateDeed = (updatedDeed: Deed): Deed => {
  const deeds = getDeeds();
  const updatedDeeds = deeds.map(deed => 
    deed.id === updatedDeed.id ? updatedDeed : deed
  );
  
  saveDeeds(updatedDeeds);
  return updatedDeed;
};

// Delete a deed
export const deleteDeed = (id: string): void => {
  const deeds = getDeeds();
  saveDeeds(deeds.filter(deed => deed.id !== id));
};

// Get deed stats
export const getDeedStats = (): DeedStats => {
  const deeds = getDeeds();
  
  // Initialize stats
  const stats: DeedStats = {
    total: deeds.length,
    byCategory: {},
    byMonth: {},
    byImpact: {
      small: 0,
      medium: 0,
      large: 0
    }
  };
  
  // Calculate stats
  deeds.forEach(deed => {
    // By category
    if (!stats.byCategory[deed.category]) {
      stats.byCategory[deed.category] = 0;
    }
    stats.byCategory[deed.category]++;
    
    // By month
    const monthYear = `${deed.date.getMonth() + 1}/${deed.date.getFullYear()}`;
    if (!stats.byMonth[monthYear]) {
      stats.byMonth[monthYear] = 0;
    }
    stats.byMonth[monthYear]++;
    
    // By impact
    stats.byImpact[deed.impact]++;
  });
  
  return stats;
};

// Format date to display 
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).format(date);
};

// Get deeds for a specific date
export const getDeedsForDate = (date: Date): Deed[] => {
  const deeds = getDeeds();
  return deeds.filter(deed => 
    deed.date.getDate() === date.getDate() &&
    deed.date.getMonth() === date.getMonth() &&
    deed.date.getFullYear() === date.getFullYear()
  );
};
