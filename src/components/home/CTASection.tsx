
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CTASection: React.FC = () => {
  React.useEffect(() => {
    console.log("CTA Section mounted, checking image loading");
  }, []);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-transparent">
      {/* Background image with improved visibility properties */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
        style={{ 
          backgroundImage: 'url("/lovable-uploads/68ac219a-306e-4158-938f-4d3fb4ff400f.png")',
          backgroundRepeat: 'no-repeat',
          zIndex: -1
        }}
      />
      
      <div className="container relative z-10 px-4 md:px-6">
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
    </section>
  );
};

export default CTASection;
