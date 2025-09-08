// В вашем компоненте modal.tsx
import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-sidebar rounded-lg p-6 w-1/2 max-h-[80%] overflow-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-xl">X</button>
                {children}
            </div>
        </div>
    );
};

export const ModalHeader = ({ children }: { children: ReactNode }) => (
    <div className="text-lg font-semibold mb-4">{children}</div>
);

export const ModalBody = ({ children }: { children: ReactNode }) => (
    <div className="mb-4">{children}</div>
);

export const ModalFooter = ({ children }: { children: ReactNode }) => (
    <div className="flex justify-end">{children}</div>
);
