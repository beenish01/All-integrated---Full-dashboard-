
import React from 'react';
import { Clock, CheckCircle, FolderOpen } from 'lucide-react';

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 text-center">
      <div className="inline-flex items-center justify-center rounded-full bg-tpl-orange/10 p-3 mb-4 text-tpl-orange">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const BenefitsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white" id="benefits">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why It Matters</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Our CRM provides tangible benefits for every team member.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <BenefitCard
            icon={<Clock className="h-6 w-6" />}
            title="Save Time"
            description="Boost efficiency 5x with smart tools that automate manual processes."
          />
          <BenefitCard
            icon={<CheckCircle className="h-6 w-6" />}
            title="Accurate Results"
            description="Reduce errors through automation and AI-powered damage assessment."
          />
          <BenefitCard
            icon={<FolderOpen className="h-6 w-6" />}
            title="Stay Organized"
            description="Keep all claims in one place with our intuitive organization system."
          />
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
