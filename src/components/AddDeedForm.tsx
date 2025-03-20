
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Deed } from '@/types/deed';
import { addDeed, updateDeed, DEED_CATEGORIES } from '@/utils/deedUtils';

type FormData = Omit<Deed, 'id' | 'date'> & { 
  date: string;
  repeatDaily?: boolean;
  repeatWeekly?: boolean;
  repeatMonthly?: boolean;
};

interface AddDeedFormProps {
  onClose: () => void;
  initialDeed?: Deed;
  isEditing?: boolean;
  onUpdate?: (deed: Deed) => void;
}

const AddDeedForm: React.FC<AddDeedFormProps> = ({ onClose, initialDeed, isEditing = false, onUpdate }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      recipient: '',
      category: '',
      impact: 'small',
      completed: false,
      repeatDaily: false,
      repeatWeekly: false,
      repeatMonthly: false,
    }
  });
  
  // Set form values when editing
  useEffect(() => {
    if (initialDeed && isEditing) {
      reset({
        title: initialDeed.title,
        description: initialDeed.description || '',
        date: initialDeed.date.toISOString().split('T')[0],
        recipient: initialDeed.recipient,
        category: initialDeed.category,
        impact: initialDeed.impact,
        completed: initialDeed.completed,
        // Repeat options would be set here if they were part of the Deed type
      });
    }
  }, [initialDeed, isEditing, reset]);
  
  const selectedCategory = watch('category');
  const selectedImpact = watch('impact');
  
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Extract repeat options before sending
      const { repeatDaily, repeatWeekly, repeatMonthly, ...deedData } = data;
      
      const deedWithDate = {
        ...deedData,
        date: new Date(data.date),
      };
      
      if (isEditing && initialDeed && onUpdate) {
        // Update existing deed
        const updatedDeed = {
          ...deedWithDate,
          id: initialDeed.id,
        };
        
        updateDeed(updatedDeed);
        onUpdate(updatedDeed);
      } else {
        // Add new deed
        addDeed(deedWithDate);
        toast.success('Good deed added successfully!');
        onClose();
      }
    } catch (error) {
      toast.error(isEditing ? 'Failed to update good deed' : 'Failed to add good deed');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What will you do? What did you do?"
          {...register('title', { required: 'Title is required' })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your good deed..."
          rows={3}
          {...register('description')}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient</Label>
        <Input
          id="recipient"
          placeholder="Who did you help?"
          {...register('recipient', { required: 'Recipient is required' })}
        />
        {errors.recipient && (
          <p className="text-sm text-destructive">{errors.recipient.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          {...register('date', { required: 'Date is required' })}
        />
        {errors.date && (
          <p className="text-sm text-destructive">{errors.date.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label className="block mb-2">This Deed repeats</Label>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="repeatDaily" 
              {...register('repeatDaily')}
            />
            <Label htmlFor="repeatDaily" className="font-normal">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="repeatWeekly" 
              {...register('repeatWeekly')}
            />
            <Label htmlFor="repeatWeekly" className="font-normal">Weekly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="repeatMonthly" 
              {...register('repeatMonthly')}
            />
            <Label htmlFor="repeatMonthly" className="font-normal">Monthly</Label>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          onValueChange={(value) => setValue('category', value)} 
          defaultValue={selectedCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {DEED_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label>Impact Level</Label>
        <RadioGroup 
          defaultValue={selectedImpact}
          onValueChange={(value) => setValue('impact', value as 'small' | 'medium' | 'large')}
          className="flex space-x-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="small" id="impact-small" />
            <Label htmlFor="impact-small">Small</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="impact-medium" />
            <Label htmlFor="impact-medium">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="large" id="impact-large" />
            <Label htmlFor="impact-large">Large</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? (isEditing ? 'Updating...' : 'Adding...') 
            : (isEditing ? 'Update Deed' : 'Add Deed')}
        </Button>
      </div>
    </form>
  );
};

export default AddDeedForm;
