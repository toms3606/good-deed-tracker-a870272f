
import React from 'react';
import { Deed } from '@/types/deed';
import { formatDate } from '@/utils/deedUtils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Heart, Star } from 'lucide-react';

interface DeedCardProps {
  deed: Deed;
  onComplete?: (id: string) => void;
}

const impactIcons = {
  small: <Heart className="h-4 w-4" />,
  medium: <Heart className="h-4 w-4" />,
  large: <Star className="h-4 w-4" />
};

const impactColors = {
  small: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  large: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
};

const DeedCard: React.FC<DeedCardProps> = ({ deed, onComplete }) => {
  return (
    <Card className="glass-card card-hover overflow-hidden animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{deed.title}</CardTitle>
          <Badge className={`${impactColors[deed.impact]} flex items-center gap-1`}>
            {impactIcons[deed.impact]} {deed.impact}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-muted-foreground mb-2">{deed.description}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="bg-background/50">
            {deed.category}
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            For: {deed.recipient}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="text-sm text-muted-foreground">
          {formatDate(deed.date)}
        </div>
        {onComplete && !deed.completed && (
          <button 
            onClick={() => onComplete(deed.id)}
            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Check className="h-4 w-4" />
            <span>Complete</span>
          </button>
        )}
        {deed.completed && (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Completed
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeedCard;
