// src/components/landingpage/InfoSection.tsx
import React from "react";

const InfoSection: React.FC = () => {
  return (
    <section id="what-is-insurance" className="py-24 px-6 md:px-16 bg-gray-50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-tpl-orange mb-6">
          What is Insurance?
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Insurance provides protection against financial loss. With TPL, you're
          empowered to manage policies, streamline claims, and utilize AI tools — all
          in one secure platform.
        </p>
      </div>
    </section>
  );
};

export default InfoSection;
