
import React from 'react';
import { BarChart as RechartsBarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: Array<Record<string, any>>;
  index: string;
  categories: string[];
  colors?: string[];
  yAxisWidth?: number;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  showAnimation?: boolean;
  className?: string;
}

export function BarChart({
  data,
  index,
  categories,
  colors = ['#3b82f6', '#10b981', '#6366f1'],
  yAxisWidth = 40,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  showAnimation = false,
  className,
}: BarChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          {showXAxis && <XAxis dataKey={index} />}
          {showYAxis && <YAxis width={yAxisWidth} />}
          <Tooltip />
          {showLegend && <Legend />}
          {categories.map((category, i) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[i % colors.length]}
              isAnimationActive={showAnimation}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
