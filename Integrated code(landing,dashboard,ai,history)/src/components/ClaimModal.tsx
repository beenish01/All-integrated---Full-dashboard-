import React from "react";

interface ClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  confirmIfDirty?: boolean;
  isFormDirty?: () => boolean;
  children: React.ReactNode;
}

const ClaimModal: React.FC<ClaimModalProps> = ({
  isOpen,
  onClose,
  confirmIfDirty = false,
  isFormDirty,
  children,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    if (confirmIfDirty && isFormDirty && isFormDirty()) {
      if (!window.confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
        return;
      }
    }
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close only if the user clicked on the backdrop, not the inner modal
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-md p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          &#x2715;
        </button>
        {children}
      </div>
    </div>
  );
};

export default ClaimModal;
