
import React from 'react';
import { HandHeart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 border-t bg-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <HandHeart className="h-5 w-5 text-primary" />
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
