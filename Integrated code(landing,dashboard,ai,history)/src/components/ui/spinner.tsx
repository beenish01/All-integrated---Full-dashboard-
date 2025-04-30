// src/components/ui/spinner.tsx
import React from "react";

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

export { Spinner };
export default Spinner;
