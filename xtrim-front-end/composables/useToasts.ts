export const useToasts = () => {
  const toasts = useState('toasts', () => []);

  const addToast = (title, message, type = 'info') => {
    const id = Date.now();
    toasts.value.push({ id, title, message, type });
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    toasts,
    addToast,
    removeToast
  };
};
