
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqSection: React.FC = () => {
  const faqs = [
    {
      question: "How does the AI detect damage?",
      answer: "Our AI system uses computer vision and machine learning models trained on millions of vehicle damage images. It identifies the make and model of the vehicle, recognizes damaged components, and assesses the severity of damage by comparing against its extensive database of similar cases."
    },
    {
      question: "Can I override AI suggestions?",
      answer: "Absolutely. While our AI provides accurate assessments in most cases, human expertise is still valuable. Claims adjusters can review AI recommendations and make modifications based on their experience or additional information not available to the AI system."
    },
    {
      question: "Is my data safe and private?",
      answer: "Yes, we prioritize data security and privacy. All images and claim information are encrypted both in transit and at rest. Our system complies with industry security standards, and we regularly conduct security audits to ensure your data remains protected."
    },
    {
      question: "How accurate is the cost estimation?",
      answer: "Our cost estimation is highly accurate, typically within 90-95% of final repair costs. The system regularly updates its pricing database with current market rates for parts and labor across different regions to maintain accuracy."
    },
    {
      question: "How long does the AI assessment take?",
      answer: "The AI assessment typically takes 30-60 seconds to analyze uploaded images and generate a comprehensive damage report with cost estimates. This is significantly faster than traditional manual assessments which can take hours or days."
    }
  ];

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about IntelliClaim and the TPL CRM system.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold text-lg py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 py-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
