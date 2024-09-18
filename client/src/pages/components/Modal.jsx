import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, imageUrl }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg relative max-w-4xl max-h-screen overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
        >
          &times;
        </button>
        <img src={imageUrl} alt="Modal" className="w-full h-auto max-h-screen object-contain" />
      </div>
    </div>,
    document.body
  );
};

export default Modal;
