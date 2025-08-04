"use client"

import { useState } from "react"
import {
	Box,
	Typography,
	Paper,
	useTheme,
	alpha,
	Fade,
	Zoom,
	IconButton,
	Tooltip,
	Breadcrumbs,
	Link,
	Chip,
} from "@mui/material"
import {
	School as SchoolIcon,
	Settings as SettingsIcon,
	Assessment as AssessmentIcon,
	Home as HomeIcon,
	NavigateNext as NavigateNextIcon,
	AutoAwesome as AutoAwesomeIcon,
} from "@mui/icons-material"

import NavBar from "./Navbar"
import InfoCourse from "./InfoCourse"
import Gradebook from "./Gradebook"

const Course = () => {
	// Estados individuales para cada elemento
	const [selectedElement, setSelectedElement] = useState("name") // "name" o "id"
	
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
	
	// Posiciones (se mantienen separadas)
	const [namePosition, setNamePosition] = useState({ top: 200, left: 100 })
	const [idPosition, setIdPosition] = useState({ top: 250, left: 100 })
	const [imageCert, setImageCert] = useState(null)
	const [reqScore, setReqScore] = useState(null)
	const [lodignGrade, setLodingGrade] = useState(false)

	// Funciones para actualizar propiedades individuales
	const updateNameProperty = (property, value) => {
		setNameProperties(prev => ({
			...prev,
			[property]: value
		}))
	}

	const updateIdProperty = (property, value) => {
		setIdProperties(prev => ({
			...prev,
			[property]: value
		}))
	}

	// Función para obtener las propiedades del elemento seleccionado
	const getCurrentProperties = () => {
		return selectedElement === "name" ? nameProperties : idProperties
	}

	// Función para actualizar propiedades del elemento seleccionado
	const updateCurrentProperty = (property, value) => {
		if (selectedElement === "name") {
			updateNameProperty(property, value)
		} else {
			updateIdProperty(property, value)
		}
	}

	const theme = useTheme()

	return (
		<Box sx={{ minHeight: "100vh", background: theme.palette.background.default }}>
			<NavBar />

			{/* Contenido principal con espacio para el sidebar */}
			<Box
				sx={{
					marginLeft: { xs: 0, sm: "280px" },
					marginTop: { xs: "64px", sm: 0 },
					minHeight: "100vh",
				}}
			>
				{/* Breadcrumbs mejorados */}
				{/* <Fade in={true} timeout={600}>
					<Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
						<Breadcrumbs
							separator={<NavigateNextIcon fontSize="small" />}
							sx={{
								"& .MuiBreadcrumbs-separator": {
									color: theme.palette.text.secondary,
								},
							}}
						>
							<Link
								underline="hover"
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
									color: theme.palette.text.secondary,
									"&:hover": {
										color: theme.palette.primary.main,
									},
								}}
							>
								<HomeIcon fontSize="inherit" />
								Inicio
							</Link>
							<Typography
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 0.5,
									color: theme.palette.text.primary,
									fontWeight: 500,
								}}
							>
								<SchoolIcon fontSize="inherit" />
								Gestión de Curso
							</Typography>
						</Breadcrumbs>
					</Box>
				</Fade> */}

				{/* Contenido principal */}
				<Box>
					<Zoom in={true} timeout={1000}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							{/* Componente InfoCourse */}
							<Paper
								elevation={3}
								sx={{
									borderRadius: 0,
									overflow: "hidden",
									background: "#ffffff",
									boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
									transition: "all 0.3s ease",
									"&:hover": {
										boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
										transform: "translateY(-2px)",
									},
								}}
							>
								<InfoCourse
									// Elemento seleccionado y sus propiedades
									selectedElement={selectedElement}
									setSelectedElement={setSelectedElement}
									currentProperties={getCurrentProperties()}
									updateCurrentProperty={updateCurrentProperty}
									
									// Propiedades individuales
									nameProperties={nameProperties}
									idProperties={idProperties}
									updateNameProperty={updateNameProperty}
									updateIdProperty={updateIdProperty}
									
									// Posiciones
									namePosition={namePosition}
									setNamePosition={setNamePosition}
									idPosition={idPosition}
									setIdPosition={setIdPosition}
									
									// Otros estados
									imageCert={imageCert}
									setImageCert={setImageCert}
									reqScore={reqScore}
									setReqScore={setReqScore}
									setLodingGrade={setLodingGrade}
								/>
							</Paper>

							{/* Componente Gradebook (condicional) */}
							{lodignGrade && (
								<Fade in={lodignGrade} timeout={800}>
									<Paper
										elevation={3}
										sx={{
											overflow: "hidden",
											background: "#ffffff",
											boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
											transition: "all 0.3s ease",
											"&:hover": {
												boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
												transform: "translateY(-2px)",
											},
										}}
									>
										<Gradebook
											nameProperties={nameProperties}
											idProperties={idProperties}
											namePosition={namePosition}
											idPosition={idPosition}
											imageCert={imageCert}
											reqScore={reqScore}
										/>
									</Paper>
								</Fade>
							)}
						</Box>
					</Zoom>
				</Box>
			</Box>
		</Box>
	)
}

export default Course