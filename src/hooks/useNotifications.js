import { useSnackbar } from 'notistack';

export const useNotifications = () => {
  const { enqueueSnackbar } = useSnackbar();

  const showSuccess = (message) => {
    enqueueSnackbar(message, { 
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
  };

  const showError = (message) => {
    enqueueSnackbar(message, { 
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
  };

  const showWarning = (message) => {
    enqueueSnackbar(message, { 
      variant: 'warning',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
  };

  const showInfo = (message) => {
    enqueueSnackbar(message, { 
      variant: 'info',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right',
      }
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
