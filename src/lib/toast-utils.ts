
import toast from 'react-hot-toast';

// Extend toast with additional methods
const enhancedToast = {
  ...toast,
  info: (message: string, options?: any) => {
    return toast(message, {
      ...options,
      icon: '📋',
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  }
};

export default enhancedToast;
