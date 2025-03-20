
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-t from-background to-primary/5 overflow-hidden">
      {/* Wave pattern at the top with increased opacity, rotated 180 degrees */}
      <div className="absolute bottom-0 left-0 right-0 h-16 -z-10 rotate-180">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full text-green-300/50 fill-current">
          <path d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      
      <div className="container px-4 md:px-6">
        <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-xl border border-primary/20 p-8 md:p-12 flex flex-col items-center text-center space-y-6 shadow-lg animate-scale-in">
          <div className="inline-flex gap-1">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i} 
                className="h-8 w-8 text-yellow-400 animate-float" 
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Build Your Legacy of Kindness?</h2>
          <p className="text-muted-foreground max-w-[600px]">
            Make the world a better place, one good deed at a time.
          </p>
          <Button asChild size="lg" className="mt-4 rounded-full px-8">
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </div>
      
      {/* Hero-styled background elements, rotated */}
      <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl -z-10" />
      <div className="absolute top-0 left-0 right-0 h-24 bg-background" style={{ borderRadius: '0 0 50% 50% / 0 0 100% 100%' }}></div>
    </section>
  );
};

export default CTASection;
