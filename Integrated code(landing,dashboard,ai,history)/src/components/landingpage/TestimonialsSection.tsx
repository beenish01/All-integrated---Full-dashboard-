
import React, { useState, useEffect } from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  isActive: boolean;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, isActive }) => {
  return (
    <div className={`testimonial-card p-6 rounded-xl shadow-md bg-white max-w-xl mx-auto transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 absolute'}`}>
      <div className="mb-4 text-tpl-orange">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11 6V14H5V6H11ZM11 4H5C3.9 4 3 4.9 3 6V14C3 15.1 3.9 16 5 16H11C12.1 16 13 15.1 13 14V6C13 4.9 12.1 4 11 4ZM21 6V14H15V6H21ZM21 4H15C13.9 4 13 4.9 13 6V14C13 15.1 13.9 16 15 16H21C22.1 16 23 15.1 23 14V6C23 4.9 22.1 4 21 4Z" fill="currentColor"/>
        </svg>
      </div>
      <p className="text-lg italic mb-4">{quote}</p>
      <div className="flex flex-col">
        <span className="font-semibold">{author}</span>
        <span className="text-gray-600 text-sm">{role}</span>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "Claims that took hours now take minutes — IntelliClaim is a game-changer for our entire department.",
      author: "Sarah Johnson",
      role: "Claims Manager, TPL Insurance"
    },
    {
      quote: "The AI assessment tool has dramatically improved our accuracy rates and customer satisfaction scores.",
      author: "Michael Chen",
      role: "Senior Adjuster, TPL Insurance"
    },
    {
      quote: "Since implementing IntelliClaim, our processing time has decreased by 70% while improving accuracy.",
      author: "Anita Patel",
      role: "Regional Director, TPL Insurance"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-20 bg-gray-50" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Team Says</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from the people who use TPL CRM and IntelliClaim every day.
          </p>
        </div>
        <div className="relative">
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              isActive={index === activeIndex}
            />
          ))}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-3 w-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-tpl-orange' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
