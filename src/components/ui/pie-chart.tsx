
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface PieChartProps {
  data: Array<Record<string, any>>;
  index: string;
  category: string;
  colors?: string[];
  showAnimation?: boolean;
  className?: string;
}

export function PieChart({
  data,
  index,
  category,
  colors = ['#3b82f6', '#10b981', '#6366f1', '#f59e0b', '#ef4444'],
  showAnimation = false,
  className,
}: PieChartProps) {
  return (
    <div className={className}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            nameKey={index}
            dataKey={category}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            isAnimationActive={showAnimation}
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
