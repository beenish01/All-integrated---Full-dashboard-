import React from "react";
import Navbar from "@/components/landingpage/Navbar";
import HeroSection from "@/components/landingpage/HeroSection"; // What should be done
import BenefitsSection from "@/components/landingpage/BenefitsSection"; // Why it matters
import IntelliClaimSection from "@/components/landingpage/IntelliClaimSection"; // Why IntelliClaims
import HowItWorksSection from "@/components/landingpage/HowItWorksSection"; // How it works
import FeaturesTabsSection from "@/components/landingpage/FeaturesTabsSection"; // IntelliClaim features
import TestimonialsSection from "@/components/landingpage/TestimonialsSection"; // What our team says
import FaqSection from "@/components/landingpage/FaqSection"; // FAQs
import InfoSection from "@/components/landingpage/InfoSection"; // Extra info or contact
import StickyCta from "@/components/landingpage/StickyCta"; // Call to action
import Footer from "@/components/landingpage/Footer";

const Index = () => {
  return (
    <div className="scroll-smooth">
      <Navbar />
      <HeroSection />                    {/* What should be done */}
      <BenefitsSection />               {/* Why it matters */}
      <IntelliClaimSection />           {/* Why IntelliClaims */}
      <HowItWorksSection />             {/* How it works */}
      <FeaturesTabsSection />           {/* IntelliClaim features */}
      <TestimonialsSection />           {/* What our team says */}
      <FaqSection />                    {/* FAQs */}
                         {/* Optional extra info */}
      <StickyCta />                     {/* Always-visible call to action */}
      <Footer />
    </div>
  );
};

export default Index;
