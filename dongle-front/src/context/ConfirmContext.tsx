'use client'

// ConfirmContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ConfirmContextType {
  isOpen: boolean;
  confirm: (options: ConfirmOptions) => void;
  close: () => void;
}

interface ConfirmOptions {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  titleClass?: string;
  messageClass?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  closeButtonClass?: string;
  boxClass?: string;
  overlayColor?: string;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return context;
};

export const ConfirmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setOptions(null);
  };

  const handleConfirm = () => {
    if (options?.onConfirm) {
      options.onConfirm();
    }
    close();
  };

  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel();
    }
    close();
  };

  return (
    <ConfirmContext.Provider value={{ isOpen, confirm, close }}>
      {children}
      {isOpen && options && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${options.overlayColor || 'bg-black bg-opacity-50'}`}>
          <div className={`bg-white rounded-lg shadow-xl p-6 max-w-sm w-full animate-bounce ${options.boxClass || ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-bold ${options.titleClass || ''}`}>{options.title}</h2>
              <button
                onClick={close}
                className={`text-gray-500 hover:text-gray-700 ${options.closeButtonClass || ''}`}
              >
                <IoMdClose size={24} />
              </button>
            </div>
            <p className={`mb-6 ${options.messageClass || ''}`}>{options.message}</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className={`px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 ${options.cancelButtonClass || ''}`}
              >
                {options.cancelLabel || 'Cancel'}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${options.confirmButtonClass || ''}`}
              >
                {options.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};