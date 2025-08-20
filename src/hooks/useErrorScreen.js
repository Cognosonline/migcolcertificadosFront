import { useStateValue } from '../context/GlobalContext';

export const useErrorScreen = () => {
  const { showErrorScreen, hideErrorScreen } = useStateValue();

  const showError = (error, options = {}) => {
    const {
      title = "¡Ups! Algo salió mal",
      subtitle = "Ha ocurrido un error inesperado",
      type = 'general',
      canRetry = false,
      retryAction = null
    } = options;

    showErrorScreen({
      message: title,
      details: typeof error === 'string' ? error : error.message || 'Error desconocido',
      type,
      canRetry,
      retryAction
    });
  };

  const showNetworkError = (retryAction) => {
    showError('Error al obtener el certificado del usuario', {
      title: 'Error de conexión',
      subtitle: 'Problema de conectividad',
      type: 'network',
      canRetry: true,
      retryAction
    });
  };

  const showServerError = (error, retryAction) => {
    const errorMessage = typeof error === 'string' ? error : error.message || 'Error interno del servidor';
    showError(errorMessage, {
      title: 'Error del servidor',
      subtitle: 'El servidor está experimentando problemas',
      type: 'server',
      canRetry: true,
      retryAction
    });
  };

  const showAuthError = () => {
    showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', {
      title: 'Sesión expirada',
      subtitle: 'Necesitas volver a autenticarte',
      type: 'auth',
      canRetry: false
    });
  };

  return {
    showError,
    showNetworkError,
    showServerError,
    showAuthError,
    hideError: hideErrorScreen
  };
};
