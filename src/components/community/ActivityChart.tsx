
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/ui/line-chart';
import { CalendarRange } from 'lucide-react';
import { format, parseISO, sub, isAfter, isBefore } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Deed } from '@/types/deed';

interface ActivityChartProps {
  deeds: Deed[];
  statusFilter: 'all' | 'completed' | 'pending';
  setStatusFilter: (value: 'all' | 'completed' | 'pending') => void;
  dateRange: {
    from: Date;
    to: Date;
  };
  setDateRange: (range: { from: Date; to: Date }) => void;
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}

const ActivityChart: React.FC<ActivityChartProps> = ({
  deeds,
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  selectedRange,
  setSelectedRange
}) => {
  // Handle preset range selection
  const handleRangeSelection = (range: string) => {
    setSelectedRange(range);
    const now = new Date();
    
    let from = now;
    switch (range) {
      case "30days":
        from = sub(now, { days: 30 });
        break;
      case "3months":
        from = sub(now, { months: 3 });
        break;
      case "6months":
        from = sub(now, { months: 6 });
        break;
      case "year":
        from = sub(now, { years: 1 });
        break;
      case "all":
        from = new Date(2000, 0, 1); // Very old date to include all
        break;
    }
    
    setDateRange({ from, to: now });
  };

  // Generate time series data for the line chart based on status filter
  const generateTimeSeriesData = () => {
    const startDate = dateRange.from;
    
    // Filter deeds based on status
    const filteredDeedsForChart = statusFilter === 'all' 
      ? deeds 
      : deeds.filter(deed => statusFilter === 'completed' ? deed.completed : !deed.completed);
    
    // Create a Map to store deeds count by date
    const deedsByDate = new Map<string, number>();
    
    // Get all months between start date and now
    const endDate = dateRange.to;
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd');
      deedsByDate.set(dateKey, 0);
      currentDate.setDate(currentDate.getDate() + 10); // Skip by 10 days for readable chart
    }
    
    // Count deeds for each date
    filteredDeedsForChart.forEach(deed => {
      // Assuming deed.date is ISO string
      if (deed.date) {
        const deedDate = new Date(deed.date);
        if (isAfter(deedDate, startDate) && isBefore(deedDate, endDate)) {
          const dateKey = format(deedDate, 'yyyy-MM-dd');
          const existing = deedsByDate.get(dateKey) || 0;
          deedsByDate.set(dateKey, existing + 1);
        }
      }
    });
    
    // Convert to array and sort by date
    return Array.from(deedsByDate.entries())
      .map(([date, count]) => ({
        date: parseISO(date),
        count: count
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const timeSeriesData = generateTimeSeriesData();

  return (
    <Card className="glass-card mb-8 animate-fade-in">
      <CardHeader className="flex flex-col space-y-4">
        <CardTitle>Community Good Deeds Activity</CardTitle>
        
        {/* Status filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ToggleGroup 
            type="single" 
            value={statusFilter} 
            onValueChange={(value) => value && setStatusFilter(value as 'all' | 'completed' | 'pending')}
            className="flex"
          >
            <ToggleGroupItem value="all" aria-label="Show all deeds">All</ToggleGroupItem>
            <ToggleGroupItem value="completed" aria-label="Show completed deeds">Completed</ToggleGroupItem>
            <ToggleGroupItem value="pending" aria-label="Show pending deeds">Pending</ToggleGroupItem>
          </ToggleGroup>
          
          <div className="ml-auto">
            <Select
              value={selectedRange}
              onValueChange={handleRangeSelection}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>
            
            {selectedRange === "custom" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 mt-2 sm:mt-0 sm:ml-2">
                    <CalendarRange className="h-4 w-4" />
                    <span>
                      {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
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
  );
};

export default ActivityChart;
