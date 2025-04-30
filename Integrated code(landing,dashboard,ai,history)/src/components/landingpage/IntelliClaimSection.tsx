
import React from 'react';
import { Zap, Brain, Lock } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="mb-4 text-tpl-orange">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

const IntelliClaimSection: React.FC = () => {
  return (
    <section className="py-20 bg-tpl-orange" id="intelliclaim">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Why IntelliClaim</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Our AI-powered damage assessment module transforms how you process claims.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="Speed You Can Count On"
            description="AI reduces claim processing time from days to minutes, getting customers back on the road faster."
          />
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="Smarter Evaluations"
            description="Real-time damage analysis from uploaded images provides accurate assessments with detailed reports."
          />
          <FeatureCard
            icon={<Lock className="h-8 w-8" />}
            title="Security First"
            description="Privacy-first design and encrypted processing ensures customer data remains secure at all times."
          />
        </div>
      </div>
    </section>
  );
};

export default IntelliClaimSection;
