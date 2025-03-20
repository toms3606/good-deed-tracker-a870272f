
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HandHeart } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-background to-primary/5 overflow-hidden">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 animate-fade-in">
          <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
            <HandHeart className="h-10 w-10 text-primary animate-pulse-gentle" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Your Kindness Matters
          </h1>
          <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
            Make your community a better place, one good deed at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button asChild size="lg" className="animate-slide-up rounded-full px-8">
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Hero background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -z-10" />
      {/* Removed the curved bottom div */}
    </section>
  );
};

export default HeroSection;
