
import React from 'react';
import { Camera, Database, CheckSquare } from 'lucide-react';

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}

const Step: React.FC<StepProps> = ({ number, icon, title, description, delay }) => {
  return (
    <div className={`flex items-start space-x-4 opacity-0 animate-fade-in-up`} style={{ animationDelay: delay }}>
      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-tpl-orange text-white flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div>
        <div className="flex items-center mb-2">
          <div className="mr-2 text-tpl-orange">{icon}</div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            IntelliClaim simplifies the claims process with just a few steps.
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-12">
          <Step
            number={1}
            icon={<Camera className="h-6 w-6" />}
            title="Upload Vehicle Photos"
            description="Snap and send photos directly from the CRM interface or upload existing images of the damaged vehicle."
            delay="0.1s"
          />
          <Step
            number={2}
            icon={<Database className="h-6 w-6" />}
            title="Let AI Analyze"
            description="Our advanced AI detects damage, assesses severity, and estimates repair costs instantly with high accuracy."
            delay="0.3s"
          />
          <Step
            number={3}
            icon={<CheckSquare className="h-6 w-6" />}
            title="Submit & Track"
            description="Approvals and claim progress are updated in real time, allowing you to track the entire process effortlessly."
            delay="0.5s"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
