
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Upload } from 'lucide-react';

const StickyCta: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show the sticky CTA when scrolled past 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 transition-transform duration-300 z-50 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="text-lg mb-4 md:mb-0 font-medium">
          Start your AI-powered claim journey with IntelliClaim.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-tpl-orange hover:bg-tpl-orange-dark text-white cta-button">
            <Upload className="mr-2 h-4 w-4" /> Start a Claim
          </Button>
          <Button variant="outline" className="border-2 border-tpl-orange text-tpl-orange hover:bg-tpl-orange/10">
            <Calendar className="mr-2 h-4 w-4" /> Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyCta;
