
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, className }) => (
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

export default StatCard;
