
import React from 'react';
import { Link } from 'react-router-dom';
import { HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/40">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <HandHeart className="h-6 w-6 text-primary group-hover:animate-float transition-transform" />
          <span className="font-medium text-xl tracking-tight">GoodDeedTracker</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/dashboard" className="text-foreground/80 hover:text-foreground transition-colors">
            Dashboard
          </Link>
          <Link to="/calendar" className="text-foreground/80 hover:text-foreground transition-colors">
            Calendar
          </Link>
          <Link to="/stats" className="text-foreground/80 hover:text-foreground transition-colors">
            Stats
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild className="animate-fade-in rounded-full shadow-sm" size="sm">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
