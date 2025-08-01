import React from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  useTheme,
  alpha,
  Fade,
  Zoom
} from '@mui/material';
import {
  School as SchoolIcon,
  Login as LoginIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate('/blackboardLogin');
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.secondary.main} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="sm">
        <Fade in={true} timeout={1000}>
          <Paper
            elevation={24}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Logo con animación */}
            <Zoom in={true} timeout={1500}>
              <Box
                sx={{
                  mb: 4,
                  display: 'flex',
                  justifyContent: 'center',
                  '& img': {
                    width: { xs: 120, sm: 150 },
                    height: 'auto',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }
                }}
              >
                <img src={logo} alt="Logo Institucional" />
              </Box>
            </Zoom>

            {/* Título Principal */}
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.75rem', sm: '2.125rem' }
              }}
            >
              Portal de Certificados
            </Typography>

            {/* Subtítulo */}
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: theme.palette.text.secondary,
                fontWeight: 400,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Accede con tu cuenta institucional
            </Typography>

            {/* Ícono de seguridad */}
            <Box
              sx={{
                mb: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              }}
            >
              <SecurityIcon
                sx={{
                  color: theme.palette.primary.main,
                  fontSize: 24
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  fontSize: '0.9rem'
                }}
              >
                Acceso seguro y encriptado
              </Typography>
            </Box>

            {/* Botón Principal */}
            <Button
              fullWidth
              size="large"
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 600,
                borderRadius: 3,
                textTransform: 'none',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.6)}`,
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              Ingresa con tu cuenta institucional
            </Button>

            {/* Información adicional */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.disabled,
                  fontSize: '0.85rem',
                  mb: 2
                }}
              >
                ¿Problemas para acceder? Contacta al administrador del sistema
              </Typography>

              {/* Características del sistema */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 3,
                  flexWrap: 'wrap',
                  mt: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                    Certificados académicos
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SecurityIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                  <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                    Acceso seguro
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>

      {/* Elementos decorativos animados */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: alpha(theme.palette.common.white, 0.1),
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': {
              transform: 'translateY(0px) rotate(0deg)',
            },
            '50%': {
              transform: 'translateY(-20px) rotate(180deg)',
            },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '8%',
          width: 120,
          height: 120,
          borderRadius: '50%',
          background: alpha(theme.palette.common.white, 0.08),
          animation: 'float 8s ease-in-out infinite reverse',
        }}
      />
    </Box>
  );
}
