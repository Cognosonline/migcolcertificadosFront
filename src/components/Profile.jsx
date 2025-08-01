"use client"
import { Box, Typography, Avatar, Chip, useTheme, alpha, Fade } from "@mui/material"
import {
  Person as PersonIcon,
  Fingerprint as FingerPrintIcon,
  // Verified as VerifiedIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material"
import { useStateValue } from "../context/GlobalContext"

const Profile = () => {
  const { user } = useStateValue()
  const theme = useTheme()

  if (!user) {
    return null
  }

  const initials = user.nombre?.given?.charAt(0) + user.nombre?.family?.charAt(0) || "U"
  const fullName = `${user.nombre?.given || ""} ${user.nombre?.family || ""}`.trim()

  return (
    <Fade in={true} timeout={1000}>
      <Box
        sx={{
					mb: 0.5,
          background: `linear-gradient(135deg, ${theme.palette.profile.main} 0%, ${theme.palette.profile.dark} 100%)`,
          color: `${theme.palette.profile.text}`,
          overflow: "hidden",
          position: "relative",
          boxShadow: `0 8px 32px ${alpha(theme.palette.profile.main, 0.3)}`,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fillRule="evenodd"%3E%3Cg fill="%23ffffff" fillOpacity="0.04"%3E%3Cpath d="M30 30c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15zm15 0c0-8.3-6.7-15-15-15s-15 6.7-15 15 6.7 15 15 15 15-6.7 15-15z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 0,
          },
        }}
      >
        <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 }, position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 2, sm: 3 },
              flexDirection: { xs: "column", sm: "row" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            {/* Avatar del usuario */}
            <Box sx={{ position: "relative" }}>
              <Avatar
                sx={{
                  width: { xs: 80, sm: 90, md: 100 },
                  height: { xs: 80, sm: 90, md: 100 },
                  background: `linear-gradient(135deg, ${alpha(`${theme.palette.profile.text}`, 0.25)}, ${alpha(`${theme.palette.profile.text}`, 0.15)})`,
                  color: `${theme.palette.profile.text}`,
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                  fontWeight: 700,
                  border: `3px solid ${alpha(`${theme.palette.profile.text}`, 0.3)}`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  backdropFilter: "blur(20px)",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: -2,
                    left: -2,
                    right: -2,
                    bottom: -2,
                    background: `linear-gradient(45deg, ${alpha(`${theme.palette.profile.text}`, 0.4)}, transparent, ${alpha(`${theme.palette.profile.text}`, 0.2)})`,
                    zIndex: -1,
                  },
                }}
              >
                {initials}
              </Avatar>

              {/* Indicador de estado activo */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: { xs: 8, sm: 10 },
                  right: { xs: 8, sm: 10 },
                  width: { xs: 16, sm: 20 },
                  height: { xs: 16, sm: 20 },
                  background: "#4caf50",
                  border: `2px solid #ffffff`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
									borderRadius: "50%",
                }}
              />
            </Box>

            {/* Información del usuario */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Nombre completo */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  fontSize: { xs: "1.4rem", sm: "1.6rem", md: "1.8rem" },
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  wordBreak: "break-word",
                }}
              >
                {fullName || "Usuario"}
              </Typography>

              {/* Cédula */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 2,
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <Box
                  sx={{
                    p: 0.5,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FingerPrintIcon sx={{ fontSize: 18, opacity: 0.9 }} />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    opacity: 0.95,
                    fontSize: { xs: "1rem", sm: "1.1rem" },
                    letterSpacing: "0.5px",
                  }}
                >
                  {user.cedula || "Sin cédula"}
                </Typography>
              </Box>

              {/* Estado del usuario */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", sm: "flex-start" },
                }}
              >
                <Chip
                  icon={<PersonIcon sx={{ fontSize: 16 }} />}
                  label={user.rol[0] || "Usuario sin rol"}
                  sx={{
                    background: alpha(`${theme.palette.profile.text}`, 0.2),
                    color: `${theme.palette.profile.text}`,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    border: `1px solid ${alpha(`${theme.palette.profile.text}`, 0.3)}`,
                    backdropFilter: "blur(10px)",
                    px: 1,
                    "& .MuiChip-icon": {
                      color: `${theme.palette.profile.text}`,
                    },
                  }}
                />
                {/* <Chip
                  icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                  label="Verificado"
                  sx={{
                    background: alpha("#4caf50", 0.2),
                    color: `${theme.palette.profile.text}`,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    border: `1px solid ${alpha("#4caf50", 0.3)}`,
                    backdropFilter: "blur(10px)",
                    px: 1,
                    "& .MuiChip-icon": {
                      color: "#4caf50",
                    },
                  }}
                /> */}
              </Box>
            </Box>
          </Box>

          {/* Línea divisoria decorativa */}
          <Box
            sx={{
              mt: 1,
              mb: 1,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${alpha(`${theme.palette.profile.text}`, 0.3)}, transparent)`,
            }}
          />

          {/* Información adicional */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 18, opacity: 0.8 }} />
            <Typography
              variant="body2"
              sx={{
                opacity: 0.85,
                fontSize: "0.85rem",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              Acceso autorizado al portal de certificados académicos
            </Typography>
          </Box>
        </Box>

        {/* Elementos decorativos de fondo */}
        <Box
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            width: 40,
            height: 40,
            background: alpha(`${theme.palette.profile.text}`, 0.08),
            animation: "pulse 4s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": {
                opacity: 0.4,
                transform: "scale(1)",
              },
              "50%": {
                opacity: 0.8,
                transform: "scale(1.2)",
              },
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            left: 20,
            width: 60,
            height: 60,
            background: alpha(`${theme.palette.profile.text}`, 0.06),
            animation: "pulse 6s ease-in-out infinite reverse",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: 10,
            width: 20,
            height: 20,
            background: alpha(`${theme.palette.profile.text}`, 0.1),
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
      </Box>
    </Fade>
  )
}

export default Profile