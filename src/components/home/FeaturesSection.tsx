
import React from 'react';
import { Sparkles, HandHeart, BarChart4 } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-10 w-10" />,
    title: "Good Deeds Ideas",
    description: "Get inspiration for acts of kindness with our suggestions and guidance.",
  },
  {
    icon: <HandHeart className="h-10 w-10" />,
    title: "Plan Your Good Deeds",
    description: "Document each act of kindness with details, categories, and impact levels.",
  },
  {
    icon: <BarChart4 className="h-10 w-10" />,
    title: "Good Deeds Impact",
    description: "Gain perspective on your impact with beautiful visualizations and trends.",
  }
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="relative py-20 md:py-32 bg-muted/30 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10"></div>
      
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-12 md:gap-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Simple. Meaningful. Impactful.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-xl border border-border/50 shadow-sm p-6 flex flex-col items-center text-center space-y-4 hover:shadow-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-2 bg-primary/10 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-medium">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
