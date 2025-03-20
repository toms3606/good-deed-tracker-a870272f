
import React, { useEffect, useState } from 'react';
import { getDeedStats } from '@/utils/deedUtils';
import { DeedStats } from '@/types/deed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/bar-chart';
import { PieChart } from '@/components/ui/pie-chart';
import { LineChart } from '@/components/ui/line-chart';
import { HandHeart, TrendingUp, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<DeedStats>({
    total: 0,
    byCategory: {},
    byMonth: {},
    byImpact: { small: 0, medium: 0, large: 0 }
  });
  
  useEffect(() => {
    setStats(getDeedStats());
  }, []);
  
  // Generate time series data for the line chart
  const generateTimeSeriesData = () => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6); // Last 6 months
    
    // Create a Map to store deeds count by date
    const deedsByDate = new Map<string, number>();
    
    // Get all months between start date and now
    const endDate = new Date();
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
      if (dateObj >= startDate && dateObj <= endDate) {
        const dateKey = format(dateObj, 'yyyy-MM-dd');
        deedsByDate.set(dateKey, count);
      }
    });
    
    // Convert to array and sort by date
    return Array.from(deedsByDate.entries())
      .map(([date, count]) => ({
        date: new Date(date),
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
      {/* Line Chart at the top */}
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
