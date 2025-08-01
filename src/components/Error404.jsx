import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  Home as HomeIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            maxWidth: 600,
            width: '100%',
          }}
        >
          {/* Ícono de Error Animado */}
          <Box
            sx={{
              mb: 4,
              '& .error-icon': {
                fontSize: 120,
                color: theme.palette.error.main,
                animation: 'pulse 2s ease-in-out infinite',
                filter: 'drop-shadow(0 4px 8px rgba(244, 67, 54, 0.3))',
              },
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'scale(1.05)',
                  opacity: 0.8,
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
              },
            }}
          >
            <ErrorIcon className="error-icon" />
          </Box>

          {/* Número 404 Grande */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '4rem', sm: '6rem', md: '8rem' },
              fontWeight: 'bold',
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              mb: 2,
              lineHeight: 1,
            }}
          >
            404
          </Typography>

          {/* Título */}
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            ¡Oops! Página no encontrada
          </Typography>

          {/* Descripción */}
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: theme.palette.text.secondary,
              fontSize: '1.1rem',
              lineHeight: 1.6,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            La página que estás buscando no existe o ha sido movida. 
            No te preocupes, puedes volver al inicio o regresar a la página anterior.
          </Typography>

          {/* Botones de Acción */}
          {/* <Box
            sx={{
              display: 'flex',
              gap: 2,
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Ir al Inicio
            </Button>

            <Button
              variant="outlined"
              size="large"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
                transition: 'all 0.3s ease',
              }}
            >
              Regresar
            </Button>
          </Box> */}

          {/* Decoración adicional */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.disabled,
                fontSize: '0.9rem',
              }}
            >
              Si crees que esto es un error, contacta al administrador del sistema
            </Typography>
          </Box>
        </Paper>

        {/* Elementos decorativos de fondo */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: -1,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '10%',
              left: '10%',
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: alpha(theme.palette.primary.main, 0.1),
              animation: 'float 6s ease-in-out infinite',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: alpha(theme.palette.secondary.main, 0.1),
              animation: 'float 8s ease-in-out infinite reverse',
            },
            '@keyframes float': {
              '0%, 100%': {
                transform: 'translateY(0px)',
              },
              '50%': {
                transform: 'translateY(-20px)',
              },
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default Error404;
