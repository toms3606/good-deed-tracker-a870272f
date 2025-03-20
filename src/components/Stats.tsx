
import React, { useEffect, useState } from 'react';
import { getDeedStats, getDeeds } from '@/utils/deedUtils';
import { DeedStats, Deed } from '@/types/deed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart } from '@/components/ui/line-chart';
import { HandHeart, TrendingUp, Calendar, Award, CalendarRange, Search } from 'lucide-react';
import { format, sub, isAfter, isBefore, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarUI } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<DeedStats>({
    total: 0,
    byCategory: {},
    byMonth: {},
    byImpact: { small: 0, medium: 0, large: 0 }
  });
  
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [filteredDeeds, setFilteredDeeds] = useState<Deed[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
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
    setDeeds(getDeeds());
  }, []);
  
  // Filter deeds when search query changes
  useEffect(() => {
    const filtered = deeds.filter(deed => 
      deed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deed.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deed.impact.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDeeds(filtered);
    setCurrentPage(1);
  }, [searchQuery, deeds]);
  
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
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredDeeds.length / itemsPerPage);
  const currentDeeds = filteredDeeds.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  const getImpactBadgeClass = (impact: string) => {
    switch (impact) {
      case 'small':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'large':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return '';
    }
  };
  
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
                        setDateRange({ from: range.from, to: range.to });
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
      </div>
      
      {/* Deeds Table */}
      <Card className="glass-card animate-fade-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Good Deeds List</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search deeds..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Impact Level</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDeeds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      {deeds.length === 0 ? "No good deeds recorded yet." : "No deeds match your search."}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentDeeds.map((deed) => (
                    <TableRow key={deed.id}>
                      <TableCell className="font-medium">{deed.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{deed.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getImpactBadgeClass(deed.impact)}>
                          {deed.impact}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={deed.completed ? "default" : "secondary"}>
                          {deed.completed ? "Completed" : "Pending"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink 
                      isActive={currentPage === index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
