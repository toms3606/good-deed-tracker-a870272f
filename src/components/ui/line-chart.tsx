
import * as React from "react";
import { Line, LineChart as RechartsLineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface LineChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: string[];
  valueFormatter?: (value: number) => string;
  yAxisWidth?: number;
  showAnimation?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  className?: string;
}

export function LineChart({
  data,
  index,
  categories,
  colors = ["primary", "secondary", "accent"],
  valueFormatter,
  yAxisWidth = 40,
  showAnimation = true,
  showXAxis = true,
  showYAxis = true,
  showLegend = true,
  className,
}: LineChartProps) {
  const formatValue = React.useCallback(
    (value: number) => {
      if (valueFormatter) {
        return valueFormatter(value);
      }
      return value.toString();
    },
    [valueFormatter]
  );

  // Build colors config for the chart
  const colorConfig = React.useMemo(() => {
    return categories.reduce(
      (acc, category, i) => {
        const colorKey = colors[i % colors.length];
        let color: string;

        // Handle tailwind color names
        if (colorKey === "primary") {
          color = "hsl(var(--primary))";
        } else if (colorKey === "secondary") {
          color = "hsl(var(--secondary))";
        } else if (colorKey === "accent") {
          color = "hsl(var(--accent))";
        } else if (colorKey === "muted") {
          color = "hsl(var(--muted))";
        } else {
          color = colorKey;
        }

        acc[category] = { 
          color,
          label: category.charAt(0).toUpperCase() + category.slice(1)
        };
        return acc;
      },
      {} as Record<string, { color: string; label: string }>
    );
  }, [categories, colors]);

  return (
    <ChartContainer className={className} config={colorConfig}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          
          {showXAxis && (
            <XAxis
              dataKey={index}
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={10}
              tickFormatter={(value) => {
                // Format the date for better readability
                const date = new Date(value);
                return new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric'
                }).format(date);
              }}
            />
          )}
          
          {showYAxis && (
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              width={yAxisWidth}
              tickFormatter={(value) => formatValue(value)}
            />
          )}
          
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value: number) => formatValue(value)}
              />
            }
          />
          
          {categories.map((category, i) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={`var(--color-${category})`}
              strokeWidth={2}
              dot={{
                r: 4,
                strokeWidth: 1,
              }}
              activeDot={{
                r: 6,
                strokeWidth: 1,
              }}
              isAnimationActive={showAnimation}
            />
          ))}
          
          {showLegend && <Legend />}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
