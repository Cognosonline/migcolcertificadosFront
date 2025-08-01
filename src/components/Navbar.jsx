"use client"

import { useState } from "react"
import PropTypes from "prop-types"
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  alpha,
  Avatar,
  Fade,
} from "@mui/material"
import {
  LibraryBooks as LibraryBooksIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"

const drawerWidth = 280

const navItemsData = [
  {
    label: "Cursos",
    path: "/home",
    icon: <LibraryBooksIcon />,
    color: "#2196f3",
  },
]

const footerNavData = [
  {
    label: "Cerrar Sesión",
    path: "/",
    icon: <LogoutIcon />,
    color: "#f44336",
  },
]

function NavBar({ window }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()
  const container = window !== undefined ? () => window().document.body : undefined

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const handleNavigation = (label, path) => {
    if (label === "Cerrar Sesión") {
      localStorage.clear()
      sessionStorage.clear()
      navigate(path)
    } else {
      localStorage.removeItem("cetificate_data")
      localStorage.removeItem("cetificate_data_image")
      localStorage.removeItem("course_data")
      navigate(path)
    }
    // Cerrar drawer móvil después de navegar
    setMobileOpen(false)
  }

  const drawer = (
    <Box
      sx={{
        height: "100%",
        background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header del Sidebar */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderBottom: `1px solid ${alpha("#ffffff", 0.2)}`,
          p: 2,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Logo Portal de Certificados"
          sx={{
            width: "100%",
            height: "auto",
            maxHeight: 100,
            objectFit: "contain",
            display: "block",
          }}
        />
      </Box>

      {/* Lista de navegación */}
      <Box sx={{ flex: 1, px: 1, py: 2 }}>
        <List sx={{ padding: 0 }}>
          {navItemsData.map(({ label, path, icon, color }) => (
            <ListItem key={label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(label, path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  py: 1.5,
                  px: 2,
                  color: "#ffffff",
                  minHeight: 48,
                  // Fondo sutil para que se vea como botón
                  background: alpha("#ffffff", 0.08),
                  border: `1px solid ${alpha("#ffffff", 0.15)}`,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    background: alpha("#ffffff", 0.15),
                    borderColor: alpha("#ffffff", 0.25),
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: color,
                    "& svg": {
                      fontSize: 22,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    },
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      color: "#ffffff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer del Sidebar */}
      <Box
        sx={{
          borderTop: `1px solid ${alpha("#ffffff", 0.2)}`,
          mt: "auto",
        }}
      >
        {/* Botón de Cerrar Sesión */}
        <List sx={{ padding: 0 }}>
          {footerNavData.map(({ label, path, icon, color }) => (
            <ListItem key={label} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(label, path)}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  my: 1,
                  py: 1.5,
                  px: 2,
                  color: "#ffffff",
                  minHeight: 48,
                  "&:hover": {
                    background: alpha("#ffffff", 0.1),
                  },
                  transition: "background-color 0.2s ease-in-out",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: color,
                    "& svg": {
                      fontSize: 22,
                      filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                    },
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  sx={{
                    "& .MuiTypography-root": {
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      color: "#ffffff",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Sidebar permanente para desktop con línea separadora */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            borderRadius: 0,
            borderRight: `3px solid ${alpha(theme.palette.grey[300], 0.3)}`,
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
            overflow: "hidden",
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* AppBar solo para móvil */}
      <AppBar
        position="fixed"
        sx={{
          display: { sm: "none" },
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          zIndex: mobileOpen ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1,
          transition: "z-index 0.3s ease",
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important" }}>
          <IconButton
            color="inherit"
            aria-label={mobileOpen ? "cerrar menú" : "abrir menú"}
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              "&:hover": {
                background: alpha("#ffffff", 0.1),
              },
              transition: "transform 0.3s ease",
              transform: mobileOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 24,
                height: 24,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Fade in={!mobileOpen} timeout={200}>
                <MenuIcon
                  sx={{
                    position: "absolute",
                    fontSize: 24,
                  }}
                />
              </Fade>
              <Fade in={mobileOpen} timeout={200}>
                <CloseIcon
                  sx={{
                    position: "absolute",
                    fontSize: 24,
                  }}
                />
              </Fade>
            </Box>
          </IconButton>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              ml: 2,
              overflow: "hidden",
              flex: 1,
            }}
          >
            <Avatar
              src={logo}
              sx={{
                width: 35,
                height: 35,
                border: `2px solid ${alpha("#ffffff", 0.2)}`,
                flexShrink: 0,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "#ffffff",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Portal Académico
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Botón de cerrar flotante en la esquina superior derecha (solo móvil) */}
      {mobileOpen && (
        <Fade in={mobileOpen} timeout={300}>
          <IconButton
            onClick={handleDrawerToggle}
            sx={{
              position: "fixed",
              top: 16,
              right: 16,
              zIndex: theme.zIndex.drawer + 2,
              background: alpha("#ffffff", 0.9),
              color: theme.palette.primary.main,
              width: 48,
              height: 48,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              backdropFilter: "blur(10px)",
              border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              display: { xs: "flex", sm: "none" },
              "&:hover": {
                background: "#ffffff",
                transform: "scale(1.1)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
        </Fade>
      )}

      {/* Drawer temporal para móvil */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          sx: {
            "& .MuiBackdrop-root": {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            border: "none",
            borderRadius: 0,
            overflow: "hidden",
            zIndex: theme.zIndex.drawer,
            marginTop: "64px",
            height: "calc(100% - 64px)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Espaciador para el contenido principal en móvil */}
      <Box
        sx={{
          display: { xs: "block", sm: "none" },
          height: "64px",
          width: "100%",
        }}
      />
    </Box>
  )
}

NavBar.propTypes = {
  window: PropTypes.func,
}

export default NavBar