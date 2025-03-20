
import React from 'react';
import { HandHeart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
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
  );
};

export default Footer;
