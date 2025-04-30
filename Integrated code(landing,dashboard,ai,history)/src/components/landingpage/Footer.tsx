
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">TPL Insurance CRM</h3>
            <p className="text-gray-600 mb-4 max-w-md">
              An integrated platform for managing insurance policies, 
              processing claims, and providing exceptional customer service.
            </p>
            <p className="text-gray-500 text-sm">
              IntelliClaim Beta v1.0
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-tpl-orange transition-colors">Features</a></li>
              <li><a href="#intelliclaim" className="text-gray-600 hover:text-tpl-orange transition-colors">IntelliClaim</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-tpl-orange transition-colors">How It Works</a></li>
              <li><a href="#faq" className="text-gray-600 hover:text-tpl-orange transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-tpl-orange transition-colors">About TPL</a></li>
              <li><a href="#" className="text-gray-600 hover:text-tpl-orange transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-tpl-orange transition-colors">TPL Insurance Labs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-tpl-orange transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} TPL Insurance. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-4 md:mt-0 flex items-center">
            Powered by TPL Insurance AI Labs <Heart className="h-4 w-4 text-tpl-orange ml-1" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
