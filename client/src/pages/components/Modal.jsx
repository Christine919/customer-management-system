import React from 'react';

const Modal = ({ isOpen, onClose, imageUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-lg relative">
                <button
                    className="absolute top-2 right-2 bg-gray-600 text-white p-2 rounded-full"
                    onClick={onClose}
                >
                    &times;
                </button>
                <img
                    src={imageUrl}
                    alt="Enlarged view"
                    className="max-w-full max-h-screen"
                />
            </div>
        </div>
    );
};

export default Modal;
