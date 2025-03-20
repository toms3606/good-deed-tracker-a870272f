
import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDeedsForDate, getDeeds } from '@/utils/deedUtils';
import DeedCard from './DeedCard';
import { Deed } from '@/types/deed';
import { Badge } from '@/components/ui/badge';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddDeedForm from './AddDeedForm';

const CalendarView: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7)
  });
  
  const [deedsInRange, setDeedsInRange] = useState<Deed[]>([]);
  const [addDeedOpen, setAddDeedOpen] = useState(false);
  
  // Helper function to get dates with deeds
  const getDatesWithDeeds = (): Date[] => {
    const deedsFromStorage = localStorage.getItem('deeds');
    if (!deedsFromStorage) return [];
    
    const deeds: any[] = JSON.parse(deedsFromStorage);
    return deeds.map(deed => new Date(deed.date));
  };
  
  // Filter deeds that fall within the selected date range
  useEffect(() => {
    if (!dateRange?.from) return;
    
    const allDeeds = getDeeds();
    let filteredDeeds: Deed[] = [];
    
    if (dateRange.to) {
      // Filter deeds between from and to dates
      filteredDeeds = allDeeds.filter(deed => {
        const deedDate = new Date(deed.date);
        return deedDate >= dateRange.from! && deedDate <= dateRange.to!;
      });
    } else {
      // If only from date is selected, show deeds for that day
      filteredDeeds = getDeedsForDate(dateRange.from);
    }
    
    setDeedsInRange(filteredDeeds);
  }, [dateRange]);
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="glass-card lg:col-span-1 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select a date range to view your good deeds</CardDescription>
          </div>
          <Button 
            onClick={() => setAddDeedOpen(true)} 
            className="h-10 w-10 rounded-full shadow-sm"
            size="icon"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={setDateRange}
            className="rounded-md border pointer-events-auto"
            modifiers={{
              hasDeeds: getDatesWithDeeds(),
            }}
            modifiersStyles={{
              hasDeeds: {
                backgroundColor: 'hsl(var(--primary) / 0.15)',
                fontWeight: 'bold',
              },
            }}
            numberOfMonths={1}
          />
        </CardContent>
      </Card>
      
      <Card className="glass-card lg:col-span-2 animate-slide-up">
        <CardHeader>
          <CardTitle>
            {dateRange?.from ? (
              <span>
                {dateRange.to ? (
                  <>
                    {new Intl.DateTimeFormat('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    }).format(dateRange.from)} - {new Intl.DateTimeFormat('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    }).format(dateRange.to)}
                  </>
                ) : (
                  new Intl.DateTimeFormat('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  }).format(dateRange.from)
                )}
              </span>
            ) : 'No date selected'}
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <span>Good Deeds</span>
            <Badge variant="outline">{deedsInRange.length}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {deedsInRange.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No good deeds recorded for this period.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {deedsInRange.map((deed) => (
                <DeedCard key={deed.id} deed={deed} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addDeedOpen} onOpenChange={setAddDeedOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a New Good Deed</DialogTitle>
          </DialogHeader>
          <AddDeedForm onClose={() => setAddDeedOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
