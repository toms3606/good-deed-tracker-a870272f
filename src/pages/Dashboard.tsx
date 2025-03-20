
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import DeedCard from '@/components/DeedCard';
import AddDeedButton from '@/components/AddDeedButton';
import { Deed } from '@/types/deed';
import { getDeeds, updateDeed } from '@/utils/deedUtils';
import { toast } from 'sonner';
import CalendarView from '@/components/CalendarView';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddDeedForm from '@/components/AddDeedForm';

const Dashboard: React.FC = () => {
  const [deeds, setDeeds] = useState<Deed[]>([]);
  const [addDeedDialogOpen, setAddDeedDialogOpen] = useState(false);
  const [editDeedDialogOpen, setEditDeedDialogOpen] = useState(false);
  const [currentDeed, setCurrentDeed] = useState<Deed | null>(null);
  
  useEffect(() => {
    const loadDeeds = () => {
      const storedDeeds = getDeeds();
      setDeeds(storedDeeds);
    };
    
    loadDeeds();
    
    // Add event listener for storage changes
    window.addEventListener('storage', loadDeeds);
    
    return () => {
      window.removeEventListener('storage', loadDeeds);
    };
  }, []);
  
  const handleCompleteDeed = (id: string) => {
    const deed = deeds.find(d => d.id === id);
    if (!deed) return;
    
    const updatedDeed = { ...deed, completed: true };
    updateDeed(updatedDeed);
    
    setDeeds(deeds.map(d => d.id === id ? updatedDeed : d));
    toast.success('Deed marked as complete!');
  };
  
  const handleMarkPending = (id: string) => {
    const deed = deeds.find(d => d.id === id);
    if (!deed) return;
    
    const updatedDeed = { ...deed, completed: false };
    updateDeed(updatedDeed);
    
    setDeeds(deeds.map(d => d.id === id ? updatedDeed : d));
    toast.success('Deed moved back to pending!');
  };
  
  const handleEditDeed = (deed: Deed) => {
    setCurrentDeed(deed);
    setEditDeedDialogOpen(true);
  };
  
  const handleDeedUpdated = (updatedDeed: Deed) => {
    setDeeds(deeds.map(d => d.id === updatedDeed.id ? updatedDeed : d));
    setEditDeedDialogOpen(false);
    setCurrentDeed(null);
    toast.success('Deed updated successfully!');
  };
  
  const pendingDeeds = deeds.filter(deed => !deed.completed);
  const completedDeeds = deeds.filter(deed => deed.completed);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container max-w-7xl pt-24 pb-16 px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold animate-fade-in">Your Good Deeds</h1>
        </div>
        
        <div className="mb-8 animate-fade-in">
          <CalendarView />
        </div>
        
        <div className="flex flex-col gap-8 animate-fade-in">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Pending Deeds ({pendingDeeds.length})</h2>
              <Button 
                onClick={() => setAddDeedDialogOpen(true)} 
                size="sm" 
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Deed
              </Button>
            </div>
            {pendingDeeds.length === 0 ? (
              <div className="glass-card p-6 text-center text-muted-foreground">
                <p>You don't have any pending good deeds.</p>
                <p className="mt-2">Add a new deed to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDeeds.map((deed) => (
                  <DeedCard
                    key={deed.id}
                    deed={deed}
                    onComplete={handleCompleteDeed}
                    onEdit={handleEditDeed}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4">Completed Deeds ({completedDeeds.length})</h2>
            {completedDeeds.length === 0 ? (
              <div className="glass-card p-6 text-center text-muted-foreground">
                <p>You haven't completed any good deeds yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedDeeds.map((deed) => (
                  <DeedCard 
                    key={deed.id} 
                    deed={deed} 
                    onMarkPending={handleMarkPending}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <AddDeedButton />
      
      <Dialog open={addDeedDialogOpen} onOpenChange={setAddDeedDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a New Good Deed</DialogTitle>
          </DialogHeader>
          <AddDeedForm onClose={() => setAddDeedDialogOpen(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={editDeedDialogOpen} onOpenChange={setEditDeedDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Good Deed</DialogTitle>
          </DialogHeader>
          {currentDeed && (
            <AddDeedForm 
              onClose={() => setEditDeedDialogOpen(false)} 
              initialDeed={currentDeed}
              isEditing={true}
              onUpdate={handleDeedUpdated}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
