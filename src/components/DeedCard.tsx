
import React from 'react';
import { Deed } from '@/types/deed';
import { formatDate } from '@/utils/deedUtils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Check, Heart, Star, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface DeedCardProps {
  deed: Deed;
  onComplete?: (id: string) => void;
  onEdit?: (deed: Deed) => void;
  onMarkPending?: (id: string) => void;
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

const DeedCard: React.FC<DeedCardProps> = ({ deed, onComplete, onEdit, onMarkPending }) => {
  return (
    <Card className="glass-card card-hover overflow-hidden animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            {/* Checkbox for pending deeds */}
            {onComplete && !deed.completed && (
              <div className="pt-1">
                <Checkbox 
                  id={`complete-${deed.id}`}
                  checked={deed.completed}
                  onCheckedChange={() => onComplete(deed.id)}
                />
              </div>
            )}
            <CardTitle 
              className={`text-lg ${!deed.completed && onEdit ? "cursor-pointer hover:text-primary transition-colors" : ""}`}
              onClick={() => !deed.completed && onEdit && onEdit(deed)}
            >
              {deed.title}
            </CardTitle>
          </div>
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
        {/* Show completed badge for completed deeds */}
        {deed.completed && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
              <Check className="h-4 w-4 text-green-800 dark:text-green-200" />
              Completed
            </Badge>
            {/* Add Mark as Pending button */}
            {onMarkPending && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 flex items-center gap-1"
                onClick={() => onMarkPending(deed.id)}
              >
                <RefreshCw className="h-3 w-3" />
                Mark Pending
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default DeedCard;
