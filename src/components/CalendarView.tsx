
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDeedsForDate } from '@/utils/deedUtils';
import DeedCard from './DeedCard';
import { Deed } from '@/types/deed';
import { Badge } from '@/components/ui/badge';

const CalendarView: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [deedsForDate, setDeedsForDate] = useState<Deed[]>(getDeedsForDate(new Date()));
  
  // Helper function to get dates with deeds
  const getDatesWithDeeds = (): Date[] => {
    const deedsFromStorage = localStorage.getItem('deeds');
    if (!deedsFromStorage) return [];
    
    const deeds: any[] = JSON.parse(deedsFromStorage);
    return deeds.map(deed => new Date(deed.date));
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    setDeedsForDate(getDeedsForDate(date));
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-card lg:col-span-1 animate-fade-in">
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>View your good deeds by date</CardDescription>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            modifiers={{
              hasDeeds: getDatesWithDeeds(),
            }}
            modifiersStyles={{
              hasDeeds: {
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                fontWeight: 'bold',
              },
            }}
          />
        </CardContent>
      </Card>
      
      <Card className="glass-card lg:col-span-2 animate-slide-up">
        <CardHeader>
          <CardTitle>
            {selectedDate ? (
              <span>
                {new Intl.DateTimeFormat('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                }).format(selectedDate)}
              </span>
            ) : 'No date selected'}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>Good Deeds</span>
            <Badge variant="outline">{deedsForDate.length}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deedsForDate.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No good deeds recorded for this date.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deedsForDate.map((deed) => (
                <DeedCard key={deed.id} deed={deed} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CalendarView;
