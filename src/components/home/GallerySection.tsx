
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

const galleryImages = [
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
];

const GallerySection: React.FC = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-blue-50 via-blue-100/50 to-green-50">
      <div className="container px-4 md:px-6 relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Start with a Simple Deed</h2>
        <h3 className="text-xl md:text-2xl font-medium text-center mb-8 text-muted-foreground">Everyday Acts of Kindness Make a World of Difference</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-lg shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <AspectRatio ratio={3/2}>
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                />
              </AspectRatio>
              <div className="p-3 text-center">
                <h3 className="font-medium text-sm">{image.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Decorative elements with more visible colors */}
      <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-primary/20 blur-2xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-secondary/20 blur-3xl -z-10"></div>
    </section>
  );
};

export default GallerySection;
