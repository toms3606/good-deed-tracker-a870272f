
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/ui/line-chart';

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
  
  // Generate data for line chart
  const generateTimeSeriesData = () => {
    const startDate = date?.from || new Date(new Date().setDate(new Date().getDate() - 30));
    const endDate = date?.to || new Date();
    
    // Create a Map to store deeds count by date
    const deedsByDate = new Map<string, number>();
    
    // Initialize all dates in the range with 0 count
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      deedsByDate.set(dateKey, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Count deeds for each date
    deeds.forEach(deed => {
      const deedDate = new Date(deed.date);
      if (deedDate >= startDate && deedDate <= endDate) {
        const dateKey = format(deedDate, 'yyyy-MM-dd');
        deedsByDate.set(dateKey, (deedsByDate.get(dateKey) || 0) + 1);
      }
    });
    
    // Convert to array and sort by date
    const chartData = Array.from(deedsByDate.entries())
      .map(([date, count]) => ({
        date: date,
        count: count
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return chartData;
  };
  
  const timeSeriesData = generateTimeSeriesData();
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold animate-fade-in">Your Good Deeds Dashboard</h1>
          
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
        
        <Card className="glass-card mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle>Good Deeds Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={timeSeriesData}
              index="date"
              categories={["count"]}
              colors={["primary"]}
              yAxisWidth={30}
              showXAxis
              showYAxis
              showLegend={false}
              showAnimation
              valueFormatter={(value) => `${value} deeds`}
              className="aspect-[3/1]"
            />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="deeds" className="animate-fade-in">
          <TabsList className="mb-8">
            <TabsTrigger value="deeds">Deeds</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deeds" className="animate-fade-in">
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
