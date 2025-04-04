
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AddDeedForm from './AddDeedForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLocation } from 'react-router-dom';

const AddDeedButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  // Don't render the button on the deeds, schedule, or community page
  if (location.pathname === '/deeds' || location.pathname === '/schedule' || location.pathname === '/community') {
    return null;
  }
  
  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a New Good Deed</DialogTitle>
          </DialogHeader>
          <AddDeedForm onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDeedButton;
