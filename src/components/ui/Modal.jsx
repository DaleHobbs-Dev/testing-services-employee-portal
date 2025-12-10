export function Modal({ isOpen, onClose, children, className = "" }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal Content */}
      <div
        className={`relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6 ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ children, onClose, className = "" }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none ml-4"
        >
          ×
        </button>
      )}
    </div>
  );
}

export function ModalBody({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function ModalFooter({ children, className = "" }) {
  return (
    <div className={`flex justify-end gap-3 ${className}`}>{children}</div>
  );
}
