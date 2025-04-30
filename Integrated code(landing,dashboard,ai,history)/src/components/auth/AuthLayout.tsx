import React from "react";
import illustration from "./illustration.png"; // Ensure this is the correct relative path

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* LEFT SECTION */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-[#F2671E]">
        <img
          src={illustration}
          alt="Intelliclaim illustration"
          className="
            object-contain 
            max-w-[90%]    /* Limits how wide the image can get */
            max-h-[90%]    /* Limits how tall the image can get */
          "
        />
      </div>

      {/* RIGHT SECTION (FORM) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
