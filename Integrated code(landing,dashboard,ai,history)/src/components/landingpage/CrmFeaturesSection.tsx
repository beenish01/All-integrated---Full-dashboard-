
import React from 'react';
import { Search, Upload, FileCheck } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 feature-card transition-all duration-300">
      <div className="mb-4 text-tpl-orange">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const CrmFeaturesSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What is TPL CRM?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Your all-in-one solution for managing insurance claims and customer data.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div data-aos="fade-up" data-aos-delay="0" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <FeatureCard
              icon={<Search className="h-8 w-8" />}
              title="Policy & Customer Lookup"
              description="Quickly retrieve customer information and policy data with our advanced search functionality."
            />
          </div>
          <div data-aos="fade-up" data-aos-delay="200" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <FeatureCard
              icon={<Upload className="h-8 w-8" />}
              title="IntelliClaim Module"
              description="Upload images, detect damage, and estimate costs with our AI-powered assessment engine."
            />
          </div>
          <div data-aos="fade-up" data-aos-delay="400" className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <FeatureCard
              icon={<FileCheck className="h-8 w-8" />}
              title="Approval & Reporting"
              description="Track, approve, and review claims with ease through our streamlined workflow system."
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CrmFeaturesSection;
