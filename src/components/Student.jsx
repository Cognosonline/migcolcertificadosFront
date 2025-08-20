"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Button, IconButton, useTheme, alpha, Fade, Tooltip, CircularProgress } from "@mui/material"
import { Close as CloseIcon, Download as DownloadIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import { useStateValue } from "../context/GlobalContext"
import style from "../modulesCss/Student.module.css"
import { useNavigate } from "react-router-dom"
import api from "../../axiosConfig.js"
import Loader from "./Loader.jsx"
import ErrorScreen from "./ErrorScreen.jsx"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

const Student = () => {
  const { course, user, certificate } = useStateValue()
  
  // Estado para los datos del certificado
  const [certificateData, setCertificateData] = useState(null)
  
  // Estado para manejar errores localmente
  const [errorState, setErrorState] = useState({
    show: false,
    message: '',
    details: '',
    canRetry: false,
    retryAction: null
  })
  
  // Propiedades del nombre
  const [nameProperties, setNameProperties] = useState({
    fontSize: 20,
    fontFamily: "Arial",
    color: "#000000",
    isItalic: false,
    isBold: false,
  })
  
  // Propiedades de la cédula
  const [idProperties, setIdProperties] = useState({
    fontSize: 16,
    fontFamily: "Arial", 
    color: "#000000",
    isItalic: false,
    isBold: false,
  })
  
  // Propiedades de la firma
  const [courseNameProperties, setcourseNameProperties] = useState({
    fontSize: 16,
    fontFamily: "Arial",
    color: "#000000",
    isItalic: false,
    isBold: false,
  })
  
  // Propiedades de la fecha
  const [createdAtProperties, setCreatedAtProperties] = useState({
    fontSize: 16,
    fontFamily: "Arial",
    color: "#000000",
    isItalic: false,
    isBold: false,
  })
  
  // Posiciones
  const [namePosition, setNamePosition] = useState({ top: 100, left: 100 })
  const [idPosition, setIdPosition] = useState({ top: 200, left: 100 })
  const [courseNamePosition, setcourseNamePosition] = useState({ top: 300, left: 100 })
  const [createdAtPosition, setCreatedAtPosition] = useState({ top: 350, left: 100 })
  const [imageCert, setImageCert] = useState(null)
  const [imageLoad, setImageLoad] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const navigate = useNavigate()
  const theme = useTheme()

  // Funciones para manejar errores
  const showError = (error, retryAction = null) => {
    let errorInfo = {
      show: true,
      message: 'Error inesperado',
      details: 'Ha ocurrido un error al cargar el certificado',
      canRetry: false,
      retryAction: null
    }

    if (error.response) {
      const status = error.response.status
      const serverMessage = error.response.data?.message || error.response.data?.error

      if (status >= 500) {
        errorInfo = {
          show: true,
          message: 'Error del servidor',
          details: `Error ${status}: ${serverMessage || 'El servidor está experimentando problemas. Por favor, intenta nuevamente más tarde.'}`,
          canRetry: true,
          retryAction
        }
      } else if (status === 401) {
        errorInfo = {
          show: true,
          message: 'Sesión expirada',
          details: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          canRetry: false,
          retryAction: null
        }
      } else if (status === 404) {
        errorInfo = {
          show: true,
          message: 'Certificado no encontrado',
          details: 'No se pudo encontrar el certificado para este usuario y curso.',
          canRetry: false,
          retryAction: null
        }
      }
    } else if (error.request) {
      errorInfo = {
        show: true,
        message: 'Error de conexión',
        details: 'Error al obtener el certificado del usuario',
        canRetry: true,
        retryAction
      }
    }

    setErrorState(errorInfo)
  }

  const hideError = () => {
    setErrorState({
      show: false,
      message: '',
      details: '',
      canRetry: false,
      retryAction: null
    })
  }

  const handleRetry = () => {
    hideError()
    if (errorState.retryAction && typeof errorState.retryAction === 'function') {
      errorState.retryAction()
    }
  }

  const handleCloseModal = (e) => {
    e.preventDefault()
    localStorage.removeItem("certificate_student_data")
    localStorage.removeItem("cetificate_data")
    localStorage.removeItem("cetificate_data_image")
    localStorage.removeItem("course_data")
    navigate("/home")
  }

  const DownloadButton = () => {
    const downloadPDF = async () => {
      setIsDownloading(true)
      try {
        const imageContainer = document.querySelector(`.${style.imageContainer}`)
        const canvas = await html2canvas(imageContainer, { scale: 4 })
        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF("l", "mm", "a4")
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        
        // SIN MÁRGENES - certificado ocupa toda la hoja
        const imgWidth = pageWidth  // Ancho completo de la página
        const imgHeight = pageHeight // Alto completo de la página

        // Agregar imagen ocupando toda la página (sin márgenes)
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
        
        // Eliminar el rectángulo de borde para exportación limpia
        pdf.save(`Certificado_${certificateData?.courseName || 'Curso'}_${certificateData?.studentDocument || 'Estudiante'}.pdf`)
      } catch (error) {
        console.error("Error al descargar PDF:", error)
      } finally {
        setIsDownloading(false)
      }
    }

    return (
      <Button
        onClick={downloadPDF}
        disabled={isDownloading}
        variant="contained"
        size="large"
        startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
          color: "#ffffff",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          backdropFilter: "blur(20px)",
          border: `1px solid ${alpha("#ffffff", 0.2)}`,
          borderRadius: 3,
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
          },
          "&:disabled": {
            background: alpha(theme.palette.grey[400], 0.8),
            transform: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          },
          transition: "all 0.3s ease-in-out",
        }}
      >
        {isDownloading ? "Generando..." : "Descargar"}
      </Button>
    )
  }

  // Simplificado - usar el mismo sistema que InfoCourse y Gradebook
  const positionDataCertificate = () => {
    const name = document.getElementById("name")
    const cedula = document.getElementById("cedula")
    const courseName = document.getElementById("courseName")
    const createdAt = document.getElementById("createdAt")

    // Usar los datos del certificado obtenidos de la API
    if (certificateData) {
      name.innerHTML = certificateData.studentName.toUpperCase()
      cedula.innerHTML = certificateData.studentDocument
      courseName.innerHTML = certificateData.courseName
      createdAt.innerHTML = new Date(certificateData.issuedDate).toLocaleDateString()
    }
    
    setImageLoad(true)
  }

  useEffect(() => {
    const validateCertificate = async () => {
      try {
        // Obtener datos del certificado desde localStorage (viene de viewCertificateStudent)
        const storedCertificate = localStorage.getItem("certificate_student_data")
        if (storedCertificate) {
          const certificateInfo = JSON.parse(storedCertificate)
          setCertificateData(certificateInfo.payload)
          
          // Configurar propiedades usando la estructura certificate dentro de payload
          const cert = certificateInfo.payload.certificate
          
          setNameProperties({
            fontSize: cert.nameFontSize || cert.fontsize,
            fontFamily: cert.nameFontFamily || cert.fontFamily,
            color: cert.nameColor || cert.color,
            isItalic: cert.nameItalic !== undefined ? cert.nameItalic : cert.italic,
            isBold: cert.nameBold !== undefined ? cert.nameBold : false
          })
          
          setIdProperties({
            fontSize: cert.documentFontSize || cert.fontsize,
            fontFamily: cert.documentFontFamily || cert.fontFamily,
            color: cert.documentColor || cert.color,
            isItalic: cert.documentItalic !== undefined ? cert.documentItalic : cert.italic,
            isBold: cert.documentBold !== undefined ? cert.documentBold : false
          })
          
          setcourseNameProperties({
            fontSize: cert.courseNameFontSize || cert.fontsize,
            fontFamily: cert.courseNameFontFamily || cert.fontFamily,
            color: cert.courseNameColor || cert.color,
            isItalic: cert.courseNameItalic !== undefined ? cert.courseNameItalic : cert.italic,
            isBold: cert.courseNameBold !== undefined ? cert.courseNameBold : false
          })
          
          setCreatedAtProperties({
            fontSize: cert.createdAtFontSize || cert.fontsize,
            fontFamily: cert.createdAtFontFamily || cert.fontFamily,
            color: cert.createdAtColor || cert.color,
            isItalic: cert.createdAtItalic !== undefined ? cert.createdAtItalic : cert.italic,
            isBold: cert.createdAtBold !== undefined ? cert.createdAtBold : false
          })
          
          setNamePosition({ top: cert.nameY, left: cert.nameX })
          setIdPosition({ top: cert.documentY, left: cert.documentX })
          setcourseNamePosition({ top: cert.courseNameY, left: cert.courseNameX })
          setCreatedAtPosition({ top: cert.dateY, left: cert.dateX })

          // Obtener la imagen del certificado
          if (cert.fileName && cert.fileName !== "") {
            const resCert = await api.get(`/certificate/${cert.fileName}`)
            setImageCert(resCert.data.image)
          }
        } else {
          // Si no hay datos del certificado en localStorage, mostrar error
          showError({
            message: 'No se encontraron datos del certificado',
            request: true
          }, () => navigate('/home'))
        }
      } catch (error) {
        console.log('Error al validar certificado:', error)
        showError(error, () => validateCertificate())
      }
    }

    validateCertificate()
  }, [])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.8)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fillOpacity="0.02"%3E%3Cpath d="M50 50c0-13.8-11.2-25-25-25s-25 11.2-25 25 11.2 25 25 25 25-11.2 25-25zm25 0c0-13.8-11.2-25-25-25s-25 11.2-25 25 11.2 25 25 25 25-11.2 25-25z"/%3E%3C/g%3E%3C/svg%3E")',
          zIndex: 0,
        },
      }}
    >
      {/* Botón de regresar (esquina superior izquierda) */}
      <Tooltip title="Volver al inicio" arrow placement="right">
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: "fixed",
            top: 32,
            left: 32,
            zIndex: 1000,
            width: 64,
            height: 64,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: "#ffffff",
            border: `2px solid ${alpha("#ffffff", 0.2)}`,
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            "&:hover": {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
              transform: "scale(1.1) translateX(-4px)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            },
            "&:active": {
              transform: "scale(1.05) translateX(-2px)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>

      {/* Botón de cerrar (esquina superior derecha) */}
      <Tooltip title="Cerrar y volver al inicio" arrow placement="left">
        <IconButton
          onClick={handleCloseModal}
          sx={{
            position: "fixed",
            top: 32,
            right: 32,
            zIndex: 1000,
            width: 64,
            height: 64,
            background: alpha("#ffffff", 0.95),
            color: theme.palette.text.primary,
            border: `2px solid ${alpha(theme.palette.grey[300], 0.5)}`,
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            "&:hover": {
              background: alpha("#ffffff", 1),
              borderColor: theme.palette.error.main,
              color: theme.palette.error.main,
              transform: "scale(1.1) rotate(90deg)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
            },
            "&:active": {
              transform: "scale(1.05) rotate(90deg)",
            },
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <CloseIcon sx={{ fontSize: 28 }} />
        </IconButton>
      </Tooltip>

      {/* Botón de descarga flotante */}
      <Tooltip title="Descargar certificado" arrow placement="left">
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            zIndex: 1000,
          }}
        >
          <DownloadButton />
        </Box>
      </Tooltip>

      {/* Información del curso (esquina superior centro) */}
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            position: "fixed",
            top: 32,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            background: alpha("#ffffff", 0.95),
            backdropFilter: "blur(20px)",
            px: 3,
            py: 1.5,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 2,
            maxWidth: "60vw",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {certificateData?.courseName || course?.course?.name || "Cargando curso..."}
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: theme.palette.success.main,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              fontSize: "0.85rem",
            }}
          >
            {certificateData?.studentDocument || user?.cedula || "Cargando ID..."}
          </Typography>
        </Box>
      </Fade>

      {/* Loading overlay */}
      {!imageLoad && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: alpha("#ffffff", 0.9),
            zIndex: 2000,
            backdropFilter: "blur(8px)",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress
              size={80}
              thickness={3}
              sx={{
                color: theme.palette.primary.main,
                mb: 3,
              }}
            />
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 500,
                mb: 1,
              }}
            >
              Cargando tu certificado
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              Por favor espera un momento...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Contenedor principal del certificado - SIN PADDING PARA COORDENADAS EXACTAS */}
      <Fade in={true} timeout={1000}>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Quitamos el padding que desplaza las coordenadas
          }}
        >
          {/* Certificado - SIN BORDES NI BORDER RADIUS PARA EXPORTACIÓN LIMPIA */}
          <Box
            className={style.imageContainer}
            sx={{
              position: "relative",
              width: "900px", // Dimensión fija del CSS original
              height: "auto",
              minHeight: "530px", // Altura mínima del CSS original
              display: "flex", // Display flex como en el CSS original
              justifyContent: "center",
              alignItems: "center",
              // Removido: borderRadius, border y boxShadow para exportación limpia
              background: "#ffffff",
            }}
          >
            {!imageLoad && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(255,255,255,0.95)",
                  zIndex: 3000,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(2px)",
                }}
              >
                <Loader ba={"transparent"} height={"530px"} color={"#156DF9"} load={2} />
              </Box>
            )}

            <img
              src={imageCert || "/placeholder.svg"}
              className={style.modalImage}
              onLoad={() => {
                setImageLoad(true)
                positionDataCertificate() // FUNCIÓN ORIGINAL EXACTA
              }}
              style={{
                minWidth: "900px", // Dimensiones del CSS original
                maxHeight: "530px",
                objectFit: "contain",
              }}
            />

            {/* Nombre - CON CENTRADO CSS COMO EN OTROS COMPONENTES */}
            <span
              id="name"
              style={{
                position: "absolute",
                top: `${namePosition.top}px`,
                left: `${namePosition.left}px`,
                fontSize: `${nameProperties.fontSize}px`,
                fontFamily: nameProperties.fontFamily,
                color: nameProperties.color,
                fontStyle: nameProperties.isItalic ? "italic" : "normal",
                fontWeight: nameProperties.isBold ? "bold" : 600,
                background: "transparent",
                padding: "5px", // PADDING ORIGINAL EXACTO
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                letterSpacing: "0.5px",
                transform: "translate(-50%, 0)", // CENTRADO CSS IGUAL QUE OTROS COMPONENTES
              }}
            >
              {certificateData?.studentName?.toUpperCase() || "NOMBRE DEL ESTUDIANTE"}
            </span>

            {/* Cédula - CON CENTRADO CSS COMO EN OTROS COMPONENTES */}
            <span
              id="cedula"
              style={{
                position: "absolute",
                top: `${idPosition.top}px`,
                left: `${idPosition.left}px`,
                fontSize: `${idProperties.fontSize}px`,
                fontFamily: idProperties.fontFamily,
                color: idProperties.color,
                fontStyle: idProperties.isItalic ? "italic" : "normal",
                fontWeight: idProperties.isBold ? "bold" : 600,
                background: "transparent",
                padding: "5px", // PADDING ORIGINAL EXACTO
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                letterSpacing: "0.5px",
                transform: "translate(-50%, 0)", // CENTRADO CSS IGUAL QUE OTROS COMPONENTES
              }}
            >
              {certificateData?.studentDocument || "ID DEL ESTUDIANTE"}
            </span>

            {/* Nombre del Curso - CON CENTRADO CSS COMO EN OTROS COMPONENTES */}
            <span
              id="courseName"
              style={{
                position: "absolute",
                top: `${courseNamePosition.top}px`,
                left: `${courseNamePosition.left}px`,
                fontSize: `${courseNameProperties.fontSize}px`,
                fontFamily: courseNameProperties.fontFamily,
                color: courseNameProperties.color,
                fontStyle: courseNameProperties.isItalic ? "italic" : "normal",
                fontWeight: courseNameProperties.isBold ? "bold" : 600,
                background: "transparent",
                padding: "5px", // PADDING ORIGINAL EXACTO
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                letterSpacing: "0.5px",
                transform: "translate(-50%, 0)", // CENTRADO CSS IGUAL QUE OTROS COMPONENTES
              }}
            >
              {certificateData?.courseName || "Nombre del Curso"}
            </span>

            {/* Fecha - CON CENTRADO CSS COMO EN OTROS COMPONENTES */}
            <span
              id="createdAt"
              style={{
                position: "absolute",
                top: `${createdAtPosition.top}px`,
                left: `${createdAtPosition.left}px`,
                fontSize: `${createdAtProperties.fontSize}px`,
                fontFamily: createdAtProperties.fontFamily,
                color: createdAtProperties.color,
                fontStyle: createdAtProperties.isItalic ? "italic" : "normal",
                fontWeight: createdAtProperties.isBold ? "bold" : 600,
                background: "transparent",
                padding: "5px", // PADDING ORIGINAL EXACTO
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                letterSpacing: "0.5px",
                transform: "translate(-50%, 0)", // CENTRADO CSS IGUAL QUE OTROS COMPONENTES
              }}
            >
              {certificateData?.issuedDate ? new Date(certificateData.issuedDate).toLocaleDateString() : new Date().toLocaleDateString()}
            </span>
          </Box>
        </Box>
      </Fade>

      {/* ErrorScreen para errores críticos */}
      {errorState.show && (
        <ErrorScreen
          error={errorState.details}
          title={errorState.message}
          subtitle="Error en el certificado"
          onClose={() => {
            hideError()
            navigate('/home')
          }}
          onRetry={errorState.canRetry ? handleRetry : undefined}
          showRetry={errorState.canRetry}
        />
      )}
    </Box>
  )
}

export default Student