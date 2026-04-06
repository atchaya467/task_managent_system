import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    // Start hide animation after 3 seconds
    const timer = setTimeout(() => {
      setIsHiding(true);
    }, 3000);

    // Physically remove component after animation finishes (400ms)
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3400);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div className={`toast ${type} ${isHiding ? 'hiding' : ''}`}>
      {type === 'success' ? (
        <CheckCircle2 color="var(--accent-cyan)" size={24} />
      ) : (
        <XCircle color="var(--danger)" size={24} />
      )}
      <span>{message}</span>
    </div>
  );
};

// A simple hook to manage toasts from any component
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const ToastContainer = () => (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast 
          key={t.id} 
          message={t.message} 
          type={t.type} 
          onClose={() => removeToast(t.id)} 
        />
      ))}
    </div>
  );

  return { showToast, ToastContainer };
};

export default Toast;
