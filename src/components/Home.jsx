"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  InputAdornment,
  Chip,
  Skeleton,
  useTheme,
  alpha,
  Fade,
  Zoom,
  Card,
  CardContent,
} from "@mui/material"
import {
  Search as SearchIcon,
  School as SchoolIcon,
  FindInPage as FindInPageIcon,
  Person as PersonIcon,
  Class as ClassIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material"

import CardCourse from "./CardCourse"
import NavBar from "../components/Navbar"
import Profile from "./Profile"
import { useStateValue } from "../context/GlobalContext"
import { useNotifications } from "../hooks/useNotifications";

const Home = () => {
  const [searchInput, setSearchInput] = useState("")
  const [myCourse, setMyCourse] = useState(21)
  const [showCourses, setShowCourses] = useState(false)
  const theme = useTheme()

  const { user, dataCourses, getCourses } = useStateValue()

  //const [toolView, setToolView] = useState(true);
  const { showSuccess, showError, showWarning, showInfo } = useNotifications();

  const handleChange = (event) => {
    setMyCourse(event.target.value)
  }

  const handleSearch = (value) => {
    setSearchInput(value)
  }

  const filteredCourses =
    dataCourses
      ?.filter((course) => {
        // Filtro por tipo de curso
        if (myCourse === 10) {
          return course.role === "Instructor" || course.role === "A"
        } else if (myCourse === 21) {
          return course.role === "Student"
        }
        return true // myCourse === 0 → todos
      })
      .filter((course) => {
        // Filtro por búsqueda
        const query = searchInput.toLowerCase()
        const id = course.courseInfo?.id?.toLowerCase() || ""
        const name = course.courseInfo?.name?.toLowerCase() || ""
        return id.includes(query) || name.includes(query)
      }) || []

  const courseTypes = [
    { value: 0, label: "Todos los cursos", icon: <ClassIcon />, color: theme.palette.info.main },
    { value: 10, label: "Cursos - Profesor", icon: <PersonIcon />, color: theme.palette.success.main },
    { value: 21, label: "Cursos - Estudiante", icon: <SchoolIcon />, color: theme.palette.primary.main },
  ]

  useEffect(() => {
    try {
      const fetchData = async () => {
        try {
          if (dataCourses == null) {
            const res = await getCourses(user.cedula)
            setShowCourses(true)
          }
        } catch (error) {
          console.error("Error al obtener los cursos:", error)
          showError( error?.response?.data?.error ||'Error al obtener los cursos');
        } finally {
          setShowCourses(true)
        }
      }
      fetchData()
    } catch (error) {
      console.log(error)
    }
  }, [])

  const SkeletonLoader = () => (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      {[...Array(6)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card sx={{ overflow: "hidden" }}>
            <Skeleton variant="rectangular" height={180} />
            <CardContent>
              <Skeleton variant="text" sx={{ fontSize: "1.1rem", mb: 1 }} />
              <Skeleton variant="text" sx={{ fontSize: "0.9rem", width: "70%" }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Box sx={{ minHeight: "100vh", background: theme.palette.background.default }}>
      <NavBar />

      {/* Contenido principal para el navbar */}
      <Box
        sx={{
          marginLeft: { xs: 0, sm: "280px" }, // Espacio para el sidebar en desktop
          marginTop: { xs: "64px", sm: 0 }, // Espacio para el AppBar en móvil
          width: { xs: "100%", sm: "calc(100% - 280px)" }, // Ancho
          minHeight: "100vh",
        }}
      >
        {/* Perfil del usuario sin margin ni padding extra */}
        <Fade in={true} timeout={800}>
          <Box>
            <Profile />
          </Box>
        </Fade>

        {/* Sección de cursos */}
        <Box
          sx={{
            overflow: "hidden",
            background: `linear-gradient(135deg, ${theme.palette.home.main} 0%, ${theme.palette.home.dark} 100%)`,
            color: `${theme.palette.home.text}`,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fillOpacity="0.05"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")',
              zIndex: 0,
            },
          }}
        >
          <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 }, position: "relative", zIndex: 1 }}>
            {/* Título de la sección */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                mb: 1,
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  backdropFilter: "blur(10px)",
                }}
              >
                <ClassIcon sx={{ fontSize: 28, color: `${theme.palette.home.text}` }} />
              </Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                  color: `${theme.palette.home.text}`,
                  textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
              >
                Cursos
              </Typography>
            </Box>

            {/* Controles de búsqueda y filtro */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 3,
                alignItems: { xs: "stretch", md: "flex-end" },
                mb: 1,
              }}
            >
              {/* Campo de búsqueda */}
              <Box sx={{ flex: 1, maxWidth: { md: 400 } }}>
                {/* <Typography
                  variant="body2"
                  sx={{
										display: "flex",
                    color: alpha(`${theme.palette.home.text}`, 0.9),
                    mb: 1,
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  Buscar cursos
                </Typography> */}
                <TextField
                  placeholder="Buscar por ID o nombre del curso..."
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  size="medium"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 22 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: `${theme.palette.home.text}`,
                      fontSize: "0.95rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                        transform: "translateY(-1px)",
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(theme.palette.home.main, 0.3),
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                        transform: "translateY(-2px)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.home.main,
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>

              {/* Selector de tipo de curso */}
              <Box sx={{ minWidth: { xs: "100%", md: 220 } }}>
                {/* <Typography
                  variant="body2"
                  sx={{
										display: "flex",
                    color: alpha(`${theme.palette.home.text}`, 0.9),
                    mb: 1,
                    fontWeight: 500,
                    fontSize: "0.85rem",
                  }}
                >
                  Filtrar por tipo
                </Typography> */}
                <FormControl
                  fullWidth
                  size="medium"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      background: `${theme.palette.home.text}`,
                      fontSize: "0.95rem",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      "& fieldset": {
                        borderColor: "transparent",
                      },
                      "&:hover": {
                        boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                        transform: "translateY(-1px)",
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(theme.palette.home.main, 0.3),
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                        transform: "translateY(-2px)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: theme.palette.home.main,
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: theme.palette.text.secondary,
                      "&.Mui-focused": {
                        color: theme.palette.home.main,
                      },
                    },
                  }}
                >
                  {/* <InputLabel>Tipo de curso</InputLabel> */}
                  <Select
                    value={myCourse}
                    onChange={handleChange}
                    // label="Tipo de curso"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          mt: 1,
                          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                          "& .MuiMenuItem-root": {
                            mx: 1,
                            my: 0.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              background: alpha(theme.palette.home.main, 0.1),
                              transform: "translateX(4px)",
                            },
                          },
                        },
                      },
                    }}
                  >
                    {courseTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, fontSize: "0.95rem" }}>
                          <Box
                            sx={{
                              color: type.color,
                              display: "flex",
                              alignItems: "center",
                              // p: 0.5,
                              background: alpha(type.color, 0.1),
                            }}
                          >
                            {type.icon}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {type.label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Información adicional */}
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", alignItems: "center" }}>
              <Chip
                icon={<FilterListIcon sx={{ fontSize: 16 }} />}
                label={`${filteredCourses.length} curso${filteredCourses.length !== 1 ? "s" : ""} encontrado${filteredCourses.length !== 1 ? "s" : ""}`}
                sx={{
                  background: alpha(`${theme.palette.home.text}`, 0.2),
                  color: `${theme.palette.home.text}`,
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(`${theme.palette.home.text}`, 0.3)}`,
                  "& .MuiChip-icon": {
                    color: `${theme.palette.home.text}`,
                  },
                }}
              />
              {searchInput && (
                <Chip
                  label={`Búsqueda: "${searchInput}"`}
                  onDelete={() => setSearchInput("")}
                  sx={{
                    background: alpha(`${theme.palette.home.text}`, 0.2),
                    color: `${theme.palette.home.text}`,
                    fontSize: "0.8rem",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(`${theme.palette.home.text}`, 0.3)}`,
                    "& .MuiChip-deleteIcon": {
                      color: `${theme.palette.home.text}`,
                      "&:hover": {
                        color: alpha(`${theme.palette.home.text}`, 0.8),
                      },
                    },
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Grid de cursos sin border radius */}
        <Box sx={{ px: { xs: 3, sm: 4 }, py: { xs: 3, sm: 4 } }}>
          <Zoom in={showCourses} timeout={1000}>
            <Box>
              {!showCourses ? (
                <SkeletonLoader />
              ) : filteredCourses.length > 0 ? (
                <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
                  {filteredCourses.map((course, index) => (
                    <Fade key={course.courseInfo.id} in={true} timeout={300 + index * 100}>
                      <Grid item xs={12} sm={6} md={4} lg={3}>
                        <CardCourse course={course} />
                      </Grid>
                    </Fade>
                  ))}
                </Grid>
              ) : (
                <Card
                  sx={{
                    p: 6,
                    textAlign: "center",
                    background: alpha(theme.palette.grey[50], 0.8),
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(theme.palette.grey[200], 0.5)}`,
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      background: alpha(theme.palette.grey[100], 0.5),
                      display: "inline-block",
                      mb: 1,
                    }}
                  >
                    <FindInPageIcon
                      sx={{
                        fontSize: 64,
                        color: theme.palette.grey[400],
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: theme.palette.text.primary,
                      mb: 1,
                      fontWeight: 600,
                      fontSize: "1.2rem",
                    }}
                  >
                    No se encontraron certificados
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontSize: "0.95rem",
                      maxWidth: 400,
                      mx: "auto",
                    }}
                  >
                    {searchInput
                      ? "Intenta con otros términos de búsqueda o cambia el filtro de tipo de certificado"
                      : "No tienes certificados disponibles"}
                  </Typography>
                </Card>
              )}
            </Box>
          </Zoom>
        </Box>
      </Box>
    </Box>
  )
}

export default Home