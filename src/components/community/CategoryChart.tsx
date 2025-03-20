
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from '@/components/ui/bar-chart';
import { DeedStats } from '@/types/deed';

interface CategoryChartProps {
  stats: DeedStats;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ stats }) => {
  // Generate data for the category bar chart
  const generateCategoryData = () => {
    const categories = Object.entries(stats.byCategory)
      .map(([category, count]) => ({
        category,
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6); // Top 6 categories
    
    return categories;
  };

  const categoryData = generateCategoryData();

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle>Most Active Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          data={categoryData}
          index="category"
          categories={["count"]}
          colors={["primary"]}
          yAxisWidth={30}
          showXAxis
          showYAxis
          showLegend={false}
          showAnimation
          className="aspect-[3/1] h-80"
        />
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
