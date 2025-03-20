
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DeedCard from '@/components/DeedCard';
import AddDeedButton from '@/components/AddDeedButton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Deed } from '@/types/deed';
import { getDeeds, updateDeed } from '@/utils/deedUtils';
import { toast } from 'sonner';
import Stats from '@/components/Stats';
import CalendarView from '@/components/CalendarView';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

const Dashboard: React.FC = () => {
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  
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
  
  const handleCompleteDeed = (id: string) => {
    const deed = deeds.find(d => d.id === id);
    if (!deed) return;
    
    const updatedDeed = { ...deed, completed: true };
    updateDeed(updatedDeed);
    
    setDeeds(deeds.map(d => d.id === id ? updatedDeed : d));
    toast.success('Deed marked as complete!');
  };
  
  // Filter deeds
  const pendingDeeds = deeds.filter(deed => !deed.completed);
  const completedDeeds = deeds.filter(deed => deed.completed);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold animate-fade-in">Your Good Deeds Tracker</h1>
          
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <Tabs defaultValue="deeds" className="animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="deeds">Deeds</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deeds" className="animate-fade-in">
            {/* Calendar View above Deed Lists */}
            <div className="mb-8">
              <CalendarView />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Pending Deeds ({pendingDeeds.length})</h2>
                {pendingDeeds.length === 0 ? (
                  <div className="glass-card p-6 text-center text-muted-foreground">
                    <p>You don't have any pending good deeds.</p>
                    <p className="mt-2">Add a new deed to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingDeeds.map((deed) => (
                      <DeedCard
                        key={deed.id}
                        deed={deed}
                        onComplete={handleCompleteDeed}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Completed Deeds ({completedDeeds.length})</h2>
                {completedDeeds.length === 0 ? (
                  <div className="glass-card p-6 text-center text-muted-foreground">
                    <p>You haven't completed any good deeds yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedDeeds.map((deed) => (
                      <DeedCard key={deed.id} deed={deed} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar" className="animate-fade-in">
            <CalendarView />
          </TabsContent>
          
          <TabsContent value="stats" className="animate-fade-in">
            <Stats />
          </TabsContent>
        </Tabs>
      </main>
      
      <AddDeedButton />
    </div>
  );
};

export default Dashboard;
