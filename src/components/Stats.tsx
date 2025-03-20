
import React, { useEffect, useState } from 'react';
import { getDeedStats } from '@/utils/deedUtils';
import { DeedStats } from '@/types/deed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/bar-chart';
import { PieChart } from '@/components/ui/pie-chart';
import { LineChart } from '@/components/ui/line-chart';
import { HandHeart, TrendingUp, Calendar, Award, CalendarRange } from 'lucide-react';
import { format, sub, isAfter, isBefore, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<DeedStats>({
    total: 0,
    byCategory: {},
    byMonth: {},
    byImpact: { small: 0, medium: 0, large: 0 }
  });
  
  // Add date range state
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: sub(new Date(), { months: 6 }),
    to: new Date()
  });
  
  // Add preset range selector state
  const [selectedRange, setSelectedRange] = useState<string>("6months");
  
  useEffect(() => {
    setStats(getDeedStats());
  }, []);
  
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
  
  // Generate time series data for the line chart
  const generateTimeSeriesData = () => {
    const startDate = dateRange.from;
    
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
    
    // Count deeds for each date from stats.byMonth
    Object.entries(stats.byMonth).forEach(([monthYear, count]) => {
      const [month, year] = monthYear.split('/').map(Number);
      const dateObj = new Date(year, month - 1, 15); // Middle of month
      if (isAfter(dateObj, startDate) && isBefore(dateObj, endDate)) {
        const dateKey = format(dateObj, 'yyyy-MM-dd');
        deedsByDate.set(dateKey, count);
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
  
  const categoryChartData = Object.entries(stats.byCategory).map(([category, count]) => ({
    name: category,
    value: count,
  }));
  
  const monthlyChartData = Object.entries(stats.byMonth)
    .sort((a, b) => {
      const [aMonth, aYear] = a[0].split('/').map(Number);
      const [bMonth, bYear] = b[0].split('/').map(Number);
      return aYear === bYear ? aMonth - bMonth : aYear - bYear;
    })
    .map(([monthYear, count]) => {
      const [month, year] = monthYear.split('/');
      return {
        name: `${new Intl.DateTimeFormat('en-US', { month: 'short' }).format(new Date(Number(year), Number(month) - 1))}`,
        value: count,
      };
    });
  
  const impactChartData = Object.entries(stats.byImpact).map(([impact, count]) => ({
    name: impact,
    value: count,
  }));
  
  const StatCard = ({ title, value, icon, className }: { title: string; value: number; icon: React.ReactNode; className?: string }) => (
    <Card className={`glass-card animate-scale-in ${className}`}>
      <CardContent className="flex justify-between items-center p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h2 className="text-3xl font-bold">{value}</h2>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6">
      {/* Line Chart at the top with Date Range Selector */}
      <Card className="glass-card mb-8 animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Good Deeds Activity</CardTitle>
          
          <div className="flex items-center gap-2">
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <CalendarRange className="h-4 w-4" />
                    <span>
                      {format(dateRange.from, "MMM d, yyyy")} - {format(dateRange.to, "MMM d, yyyy")}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <CalendarUI
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange(range);
                      }
                    }}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            )}
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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Good Deeds"
          value={stats.total}
          icon={<HandHeart className="h-6 w-6" />}
        />
        
        <StatCard
          title="Categories"
          value={Object.keys(stats.byCategory).length}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        
        <StatCard
          title="Monthly Average"
          value={Object.keys(stats.byMonth).length > 0 
            ? Math.round(stats.total / Object.keys(stats.byMonth).length) 
            : 0}
          icon={<Calendar className="h-6 w-6" />}
        />
        
        <StatCard
          title="Large Impact Deeds"
          value={stats.byImpact.large}
          icon={<Award className="h-6 w-6" />}
        />
        
        <Card className="glass-card md:col-span-2 animate-slide-up">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={monthlyChartData}
              index="name"
              categories={['value']}
              colors={['blue']}
              yAxisWidth={30}
              showXAxis
              showYAxis
              showLegend={false}
              showAnimation
              className="aspect-[4/3] lg:aspect-[2/1]"
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={categoryChartData}
              index="name"
              category="value"
              showAnimation
              className="aspect-square"
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card animate-slide-up">
          <CardHeader>
            <CardTitle>Impact Level</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={impactChartData}
              index="name"
              category="value"
              colors={['#10B981', '#3B82F6', '#8B5CF6']}
              showAnimation
              className="aspect-square"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Stats;
