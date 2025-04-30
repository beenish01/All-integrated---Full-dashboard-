
import React, { useState } from 'react';
import { Camera, Brain, FileText, PieChart, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FeatureTabProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

const FeatureTab: React.FC<FeatureTabProps> = ({ icon, title, content }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-start gap-6 animate-slide-in-right">
      <div className="flex-shrink-0 mb-4 md:mb-0">
        <div className="h-16 w-16 rounded-full bg-tpl-orange/10 flex items-center justify-center text-tpl-orange">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
};

const FeaturesTabsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upload");

  const features = [
    {
      id: "upload",
      icon: <Camera className="h-8 w-8" />,
      title: "Smart Upload",
      content: "Easily upload multiple photos using our drag-and-drop interface or capture images directly through the CRM. Our system automatically detects image quality and prompts for better photos if needed to ensure accurate damage assessment."
    },
    {
      id: "assessment",
      icon: <Brain className="h-8 w-8" />,
      title: "AI Assessment Engine",
      content: "Our advanced AI model recognizes vehicle makes and models, identifies damaged parts, analyzes the severity of damage, and provides detailed cost estimates based on current market rates for parts and labor."
    },
    {
      id: "checklist",
      icon: <FileText className="h-8 w-8" />,
      title: "Document Checklist",
      content: "Stay organized with an automated document checklist that adapts to the specific claim type. The system tracks which documents have been submitted and what's still needed, sending timely reminders to complete the claim package."
    },
    {
      id: "workflow",
      icon: <PieChart className="h-8 w-8" />,
      title: "Approval Workflow",
      content: "Streamlined approval processes with automated routing based on claim amount and type. Managers receive instant notifications for claims requiring review, with the ability to approve, reject, or request additional information in one click."
    },
    {
      id: "status",
      icon: <Clock className="h-8 w-8" />,
      title: "Real-Time Claim Status",
      content: "Track every claim's progress in real-time with a visual progress indicator. The system provides estimated completion times based on historical data and alerts staff when action is needed to move a claim forward."
    }
  ];

  return (
    <section className="py-20 bg-white" id="features-tabs">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">IntelliClaim Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore the powerful features that make IntelliClaim the most advanced claims processing system.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
              {features.map((feature) => (
                <TabsTrigger 
                  key={feature.id} 
                  value={feature.id}
                  className="data-[state=active]:bg-tpl-orange data-[state=active]:text-white"
                >
                  {feature.title}
                </TabsTrigger>
              ))}
            </TabsList>
            {features.map((feature) => (
              <TabsContent key={feature.id} value={feature.id} className="pt-4">
                <FeatureTab
                  icon={feature.icon}
                  title={feature.title}
                  content={feature.content}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FeaturesTabsSection;
