import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  alpha,
  Fade,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ErrorScreen = ({ 
  error, 
  onClose, 
  onRetry, 
  showRetry = true, 
  title = "¡Ups! Algo salió mal",
  subtitle = "Ha ocurrido un error inesperado"
}) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleGoHome = () => {
    onClose && onClose();
    navigate('/home');
  };

  const handleRetry = () => {
    onRetry && onRetry();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: `linear-gradient(135deg, ${alpha(theme.palette.error.dark, 0.1)} 0%, ${alpha(theme.palette.error.light, 0.05)} 100%)`,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ff5722" fillOpacity="0.03"%3E%3Cpath d="M50 50c0-13.8-11.2-25-25-25s-25 11.2-25 25 11.2 25 25 25 25-11.2 25-25zm25 0c0-13.8-11.2-25-25-25s-25 11.2-25 25 11.2 25 25 25 25-11.2 25-25z"/%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 0,
          },
        }}
      >
        {/* Botón de cerrar en la esquina superior derecha */}
        {onClose && (
          <Tooltip title="Cerrar" arrow placement="left">
            <IconButton
              onClick={handleClose}
              sx={{
                position: 'absolute',
                top: 24,
                right: 24,
                zIndex: 10000,
                width: 56,
                height: 56,
                background: alpha('#ffffff', 0.9),
                color: theme.palette.text.primary,
                border: `2px solid ${alpha(theme.palette.grey[300], 0.5)}`,
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                '&:hover': {
                  background: alpha('#ffffff', 1),
                  borderColor: theme.palette.error.main,
                  color: theme.palette.error.main,
                  transform: 'scale(1.1) rotate(90deg)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <CloseIcon sx={{ fontSize: 24 }} />
            </IconButton>
          </Tooltip>
        )}

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper
            elevation={24}
            sx={{
              padding: { xs: 4, md: 6 },
              textAlign: 'center',
              background: alpha('#ffffff', 0.95),
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              boxShadow: `0 24px 80px ${alpha(theme.palette.error.main, 0.15)}`,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 100%)`,
              },
            }}
          >
            {/* Icono de error animado */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.light, 0.05)} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    borderRadius: '50%',
                    background: `conic-gradient(from 0deg, ${theme.palette.error.main}, ${theme.palette.error.light}, ${theme.palette.error.main})`,
                    opacity: 0.3,
                    animation: 'rotate 3s linear infinite',
                    zIndex: -1,
                  },
                  '@keyframes rotate': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                <ErrorIcon 
                  sx={{ 
                    fontSize: 64, 
                    color: theme.palette.error.main,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  }} 
                />
              </Box>
            </Box>

            {/* Título */}
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
                fontSize: { xs: '1.8rem', md: '2.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              {title}
            </Typography>

            {/* Subtítulo */}
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                mb: 4,
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontWeight: 500,
              }}
            >
              {subtitle}
            </Typography>

            {/* Mensaje de error */}
            {error && (
              <Paper
                sx={{
                  padding: 3,
                  mb: 4,
                  background: alpha(theme.palette.error.main, 0.05),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  borderRadius: 2,
                  maxHeight: 200,
                  overflow: 'auto',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.palette.error.dark,
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    wordBreak: 'break-word',
                  }}
                >
                  {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
                </Typography>
              </Paper>
            )}

            {/* Botones de acción */}
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                justifyContent: 'center',
                flexWrap: 'wrap',
                mt: 4,
              }}
            >
              {/* Botón de ir al home */}
              <Button
                variant="contained"
                size="large"
                startIcon={<HomeIcon />}
                onClick={handleGoHome}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: '#ffffff',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  borderRadius: 3,
                  minWidth: 160,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                Ir al Inicio
              </Button>

              {/* Botón de reintentar */}
              {showRetry && onRetry && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetry}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    fontSize: '1rem',
                    borderWidth: 2,
                    borderRadius: 3,
                    minWidth: 160,
                    background: alpha('#ffffff', 0.8),
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      color: theme.palette.primary.dark,
                      background: alpha(theme.palette.primary.main, 0.05),
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                      borderWidth: 2,
                    },
                    transition: 'all 0.3s ease-in-out',
                  }}
                >
                  Reintentar
                </Button>
              )}
            </Box>

            {/* Información adicional */}
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                mt: 4,
                fontSize: '0.85rem',
                opacity: 0.8,
              }}
            >
              Si el problema persiste, por favor contacta al administrador del sistema.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Fade>
  );
};

export default ErrorScreen;
