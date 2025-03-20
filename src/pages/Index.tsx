import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HandHeart, Star, Calendar, BarChart4, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24">
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
        
        {/* Background decor */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-primary/5 to-secondary/5 blur-3xl -z-10" />
      </section>
      
      {/* Image Gallery Section */}
      <section className="py-12 md:py-16 overflow-hidden">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Start with a Simple Deed</h2>
          <h3 className="text-xl md:text-2xl font-medium text-center mb-8 text-muted-foreground">Everyday Acts of Kindness Make a World of Difference</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { 
                src: "/lovable-uploads/a731bacd-848d-4f12-8df4-e1b18a8cfa45.png",
                alt: "Person holding elderly person's hands in wheelchair",
                title: "Helping the Elderly"
              },
              { 
                src: "/lovable-uploads/4a849889-78ca-4ff0-ba90-4d8044a973c3.png", 
                alt: "French bulldog being bathed in sink",
                title: "Pet Care"
              },
              { 
                src: "/lovable-uploads/d54a1438-a809-429e-acb5-dd408e2aab66.png",
                alt: "Person mowing lawn in sunny backyard",
                title: "Yard Work" 
              },
              { 
                src: "/lovable-uploads/c380d9b3-e0e1-45cf-8dd3-e2991ba4e4b8.png",
                alt: "Person cleaning kitchen with spray bottle and cloth",
                title: "Cleaning" 
              },
              { 
                src: "/lovable-uploads/d6e0db37-3612-4f69-8f7b-87f0e599b63e.png",
                alt: "Person shopping for groceries",
                title: "Shopping" 
              },
              { 
                src: "/lovable-uploads/330ddd6c-98dc-4fdc-a5c5-e60a59393c0e.png",
                alt: "Two people collecting trash by a lake",
                title: "Cleanup" 
              },
              { 
                src: "/lovable-uploads/2c16b136-81e9-4134-abf1-5b726a5e343b.png",
                alt: "Person fixing window with power tool",
                title: "Household Repairs" 
              },
              { 
                src: "/lovable-uploads/410d6197-7d6a-482c-bedb-103b03bad321.png",
                alt: "Group of diverse volunteers with donation boxes and clothing",
                title: "Volunteer" 
              }
            ].map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <AspectRatio ratio={3/2}>
                  <img 
                    src={image.src} 
                    alt={image.alt} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </AspectRatio>
                <div className="p-3 text-center bg-card">
                  <h3 className="font-medium text-sm">{image.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-12 md:gap-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Simple. Meaningful. Impactful.</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
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
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className="glass-card p-6 flex flex-col items-center text-center space-y-4 animate-slide-up"
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
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="glass-card p-8 md:p-12 flex flex-col items-center text-center space-y-6 animate-scale-in">
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
      
      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <HandHeart className="h-6 w-6 text-primary" />
              <span className="font-medium">Good Deeds</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Good Deeds. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
