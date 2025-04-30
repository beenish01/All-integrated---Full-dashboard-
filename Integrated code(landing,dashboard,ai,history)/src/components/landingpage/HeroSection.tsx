import React, { useEffect, useState } from 'react';

const cyclingWords = [
  "WORKFLOW",
  "INSIGHTS",
  "PROCESS",
  "ASSESSMENT",
  "DECISIONS",
  "DETECTION"
];


const HeroSection: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % cyclingWords.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-white to-orange-50 overflow-hidden flex items-center justify-center text-center px-6">
      {/* Glow background */}
      <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(255,107,53,0.3)_0%,_transparent_70%)] blur-3xl rounded-full z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute inset-0 radial-glow animate-pulse-glow" />

      {/* Clouds with orange glow */}
      <div className="absolute top-20 left-1/4 opacity-20 animate-float cloud-glow">
        <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
          <path d="M10 40C10 29 19 20 30 20C41 20 50 29 50 40H90C101 40 110 31 110 20C110 9 101 0 90 0H30C13.4 0 0 13.4 0 30V40H10Z" fill="#CCCCCC" />
        </svg>
      </div>

      <div className="absolute top-40 right-1/4 opacity-30 animate-float animation-delay-1000 cloud-glow">
        <svg width="160" height="80" viewBox="0 0 160 80" fill="none">
          <path d="M20 60C20 45 32 35 48 35C64 35 75 45 75 60H120C135 60 148 48 148 35C148 20 135 10 120 10H48C25 10 10 25 10 45V60H20Z" fill="#DDDDDD" />
        </svg>
      </div>

      <div className="absolute left-20 right-1/4 opacity-30 animate-float animation-delay-1000 cloud-glow">
        <svg width="120" height="80" viewBox="0 0 160 80" fill="none">
          <path d="M20 60C20 45 32 35 48 35C64 35 75 45 75 60H120C135 60 148 48 148 35C148 20 135 10 120 10H48C25 10 10 25 10 45V60H20Z" fill="#DDDDDD" />
        </svg>
      </div>

      {/* Airplane */}
      <div className="absolute top-10 left-[-100px] animate-fly-across rotate-[-10deg] z-30">
        <svg width="100" height="100" viewBox="0 0 640 512" fill="#F47B20">
          <path d="M480 192H365.3L260.6 8.1c-2.7-4.7-7.6-7.6-13-7.6s-10.3 2.9-13 7.6L192 88H64c-35.3 0-64 28.7-64 64v32c0 8.8 7.2 16 16 16h163.7l56 96H80v48h80l48 80h64l-48-80h70.3l56 96H416l-57.4-98.9c-2.6-4.4-2.6-9.8 0-14.2L416 192H480c17.7 0 32-14.3 32-32v-32c0-17.7-14.3-32-32-32z" />
        </svg>
      </div>

      {/* Looping crash car */}
      <div className="absolute bottom-10 left-0 z-20 animate-car-crash-loop">
        <svg width="140" height="60" viewBox="0 0 90 40" fill="none">
          <path d="M85 25H80V20C80 15 75 10 70 10H30C25 10 20 15 20 20V25H5C2.5 25 0 27.5 0 30C0 32.5 2.5 35 5 35H20V30C20 27.5 22.5 25 25 25C27.5 25 30 27.5 30 30C30 32.5 27.5 35 25 35H65C62.5 35 60 32.5 60 30C60 27.5 62.5 25 65 25C67.5 25 70 27.5 70 30C70 32.5 67.5 35 65 35H85C87.5 35 90 32.5 90 30C90 27.5 87.5 25 85 25Z" fill="#F47B20" />
        </svg>
      </div>

      {/* Vibrating parked car */}
      <div className="absolute bottom-[12px] left-1/3 animate-car-vibrate z-20">
        <svg width="140" height="60" viewBox="0 0 90 40" fill="none">
          <path d="M85 25H80V20C80 15 75 10 70 10H30C25 10 20 15 20 20V25H5C2.5 25 0 27.5 0 30C0 32.5 2.5 35 5 35H20V30C20 27.5 22.5 25 25 25C27.5 25 30 27.5 30 30C30 32.5 27.5 35 25 35H65C62.5 35 60 32.5 60 30C60 27.5 62.5 25 65 25C67.5 25 70 27.5 70 30C70 32.5 67.5 35 65 35H85C87.5 35 90 32.5 90 30C90 27.5 87.5 25 85 25Z" fill="#F47B20" />
        </svg>
      </div>

      {/* Tree on the right side of the road */}
{/* Tree on the right side of the road */}
<div className="absolute bottom-[10px] left-4 z-20">
  <svg width="80" height="120" viewBox="0 0 64 64" fill="none">
    {/* Tree Trunk */}
    <rect x="28" y="42" width="8" height="22" fill="#8B5A2B" rx="2" />
    
    {/* Layered Leafy Canopy */}
    <circle cx="32" cy="30" r="14" fill="#4CAF50" />
    <circle cx="24" cy="26" r="10" fill="#66BB6A" />
    <circle cx="40" cy="26" r="10" fill="#66BB6A" />
    <circle cx="32" cy="22" r="9" fill="#81C784" />
  </svg>
</div>

      <div className="absolute bottom-0 left-0 w-full h-10 bg-gray-400 animate-road-scroll z-0 rounded-t-md" />

      {/* Text Content */}
      <div className="relative z-40 max-w-3xl">
        <h1 className="text-3xl md:text-5xl font-light leading-tight mb-6">
          Every claim starts with a photo. <br />
          <h2 className="text-3xl md:text-5xl font-light leading-tight mb-6">
          That’s why we’re here to {" "}
          <h3 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
           accelerate your{" "}


          <span className="text-tpl-orange text-glow-orange transition-all duration-500">
             {cyclingWords[index]}
          </span>
          </h3>
          </h2>

        </h1>
        
      </div>
    </div>
  );
};

export default HeroSection;
