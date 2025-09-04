"use client"

import { useEffect, useState, useRef } from "react"
import {
	Box,
	Typography,
	Button,
	IconButton,
	TextField,
	Paper,
	Card,
	CardContent,
	CardActions,
	Chip,
	Avatar,
	useTheme,
	alpha,
	Fade,
	Zoom,
	Modal,
	Tooltip,
	LinearProgress,
} from "@mui/material"
import {
	Edit as EditIcon,
	Save as SaveIcon,
	CloudUpload as CloudUploadIcon,
	Close as CloseIcon,
	Download as DownloadIcon, // Agregar esta línea
	School as SchoolIcon,
	Assignment as AssignmentIcon,
	Visibility as VisibilityIcon,
	CheckCircle as CheckCircleIcon,
	Cancel as CancelIcon,
} from "@mui/icons-material"
import { useStateValue } from "../context/GlobalContext"
import api from "../../axiosConfig"
import Loader from "./Loader"
import style from "../modulesCss/InfoCourse.module.css"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import Toolbar from "./Toolbar"
import { useNotifications } from "../hooks/useNotifications";
import CourseDataHelper from "../utils/CourseDataHelper";

const InfoCourse = ({
	// Elemento seleccionado y sus propiedades
	selectedElement = "name",
	setSelectedElement,
	currentProperties = {},
	updateCurrentProperty,

	// Propiedades individuales
	nameProperties = {},
	idProperties = {},
	courseNameProperties = {},
	dateProperties = {},
	updateNameProperty,
	updateIdProperty,
	updatecourseNameProperty,
	updateDateProperty,

	// Posiciones
	namePosition = { top: 200, left: 100 },
	setNamePosition,
	idPosition = { top: 250, left: 100 },
	setIdPosition,
	courseNamePosition = { top: 300, left: 100 },
	setcourseNamePosition,
	datePosition = { top: 350, left: 100 },
	setDatePosition,

	// Otros estados
	imageCert,
	setImageCert,
	reqScore,
	setReqScore,
	setLodingGrade,
}) => {
	const containerRef = useRef(null)
	const [image, setImage] = useState(null)
	const [lodingImage, setLodiangImage] = useState(true)
	const [file, setFile] = useState(null)
	const [isSaved, setIsSaved] = useState(false)
	const [validateCert, setValidateCert] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isLodingInfo, setIslodingInfo] = useState(false)
	const [toolView, setToolView] = useState(true)
	const [loaderImgPre, setLoaderImgPre] = useState(false)
	const [backgroundSp, setBackgroundSp] = useState(false)
	const [uploadProgress, setUploadProgress] = useState(0)
	const [courseLoaded, setCourseLoaded] = useState(false)

	const { course } = useStateValue()
	const theme = useTheme()

	const { showSuccess, showError, showWarning, showInfo } = useNotifications();

	const [draggingElement, setDraggingElement] = useState(null)
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

	const handleMouseDown = (e, type) => {
		const rect = e.target.getBoundingClientRect()
		setDraggingElement(type)
		setDragOffset({
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		})
		e.preventDefault()
	}

	const handleMouseMove = (e) => {
		if (draggingElement && containerRef.current) {
			const containerRect = containerRef.current.getBoundingClientRect()
			const deltaX = e.clientX - containerRect.left - dragOffset.x
			const deltaY = e.clientY - containerRect.top - dragOffset.y

			if (draggingElement === "name") {
				setNamePosition({ top: deltaY, left: deltaX })
			} else if (draggingElement === "id") {
				setIdPosition({ top: deltaY, left: deltaX })
			} else if (draggingElement === "courseName") {
				setcourseNamePosition({ top: deltaY, left: deltaX })
			} else if (draggingElement === "date") {
				setDatePosition({ top: deltaY, left: deltaX })
			}
		}
	}

	const handleMouseUp = () => {
		setDraggingElement(null)
	}

	const handleTouchStart = (e, type) => {
		const touch = e.touches[0]
		const rect = e.target.getBoundingClientRect()
		setDraggingElement(type)
		setDragOffset({
			x: touch.clientX - rect.left,
			y: touch.clientY - rect.top,
		})
	}

	const handleTouchMove = (e) => {
		if (draggingElement && containerRef.current) {
			const touch = e.touches[0]
			const containerRect = containerRef.current.getBoundingClientRect()
			const deltaX = touch.clientX - containerRect.left - dragOffset.x
			const deltaY = touch.clientY - containerRect.top - dragOffset.y

			if (draggingElement === "name") {
				setNamePosition({ top: deltaY, left: deltaX })
			} else if (draggingElement === "id") {
				setIdPosition({ top: deltaY, left: deltaX })
			} else if (draggingElement === "courseName") {
				setcourseNamePosition({ top: deltaY, left: deltaX })
			} else if (draggingElement === "date") {
				setDatePosition({ top: deltaY, left: deltaX })
			}
		}
	}

	const handleTouchEnd = () => {
		setDraggingElement(null)
	}

	const handleImageChange = (event) => {
		const file = event.target.files[0]
		if (file) {
			setFile(file)
			setImage(URL.createObjectURL(file))
		}
	}

	const handleCancel = () => {
		setImage(null)
		setFile(null)
		document.getElementById("file-input").value = ""
	}

	const handleUpload = async (e) => {
		e.preventDefault()
		setLoaderImgPre(true)
		setUploadProgress(0)

		if (!file) {
			alert("Selecciona una imagen primero")
			return
		}

		if (!course?.course?.courseId) {
			alert("Error: Información del curso no disponible")
			return
		}

		const formData = new FormData()
		formData.append("certificado", file)
		formData.append("courseId", course.course.courseId)

		try {
			// Simular progreso de carga
			const progressInterval = setInterval(() => {
				setUploadProgress((prev) => Math.min(prev + 10, 90))
			}, 200)

			const response = await api.post("/certificate", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})

			showSuccess(response.data.message || 'Imagen cargada correctamente');

			clearInterval(progressInterval)
			setUploadProgress(100)

			if (!response.status == 200) throw new Error("Error al subir la imagen")

			const data = await response.data

			if (data) {
				const res = await api.get(`/certificateCourse/${course?.course?.courseId}`)

				// Configurar propiedades para ambos elementos basándose en los datos de la API
				updateNameProperty('color', res.data.payload.color)
				updateNameProperty('fontFamily', res.data.payload.fontFamily)
				updateNameProperty('fontSize', res.data.payload.fontsize)
				updateNameProperty('isItalic', res.data.payload.italic)
				updateNameProperty('isBold', res.data.payload.bold || false)

				updateIdProperty('color', res.data.payload.color)
				updateIdProperty('fontFamily', res.data.payload.fontFamily)
				updateIdProperty('fontSize', res.data.payload.fontsize)
				updateIdProperty('isItalic', res.data.payload.italic)
				updateIdProperty('isBold', res.data.payload.bold || false)

				if (!res.data.payload.fileName == "") {
					const resCert = await api.get(`/certificate/${res.data.payload.fileName}`)
					setImageCert(resCert.data.image)
					setValidateCert(true)
					handleCancel()
					setValidateCert(true)
					setLodiangImage(true)
				}
			}
		} catch (error) {
			console.error("Error al subir la imagen:", error)
			showError( error?.response?.data?.error ||'Error al subir la imagen');
			setImage(null)
			setFile(null)
			document.getElementById("file-input").value = ""
		} finally {
			setLoaderImgPre(false)
			setUploadProgress(0)
		}
	}

	const saveReqCal = async (value) => {
		if (!course?.course?.courseId) {
			// alert("Error: Información del curso no disponible")
			showError('Error: Información del curso no disponible');
			return
		}

		const reqResult = value / 100
		setIsSaved(true)

		try {
			const res = await api.post(
				`/reqScore/`,
				{
					courseId: course.course.courseId,
					reqScore: reqResult,
				},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
				},
			)

			if (res) {
				showSuccess('Nota actualizada correctamente');
			} else {
				showError('Error al actualizar la nota');
			}
		} catch (error) {
			console.log(error)
		}
	}

	// ✅ Debug - Validar integridad de datos del curso
	useEffect(() => {
		const validation = CourseDataHelper.validateCourseData();
		console.log('🔍 InfoCourse - Validación de datos:', validation);
		
		// Si no hay datos del curso original, mostrar advertencia
		if (!validation.hasCourseData && validation.hasCertificateData) {
			console.warn('⚠️ Datos de curso perdidos pero certificado presente');
			showWarning('Los datos del curso se han perdido. Recargue la página.');
		}
	}, []);

	useEffect(() => {
		const validateCertificate = async () => {
			if (!course?.course?.courseId) {
				// console.log("Course information not available yet")
				return
			}

			setCourseLoaded(true)

			try {
				const dataCertificate = JSON.parse(localStorage.getItem("cetificate_data"))

				if (dataCertificate) {
					if (dataCertificate.payload.courseId === course.course.courseId) {
						// Configurar propiedades individuales basándose en los datos guardados
						// Si existen propiedades individuales, usarlas; si no, usar las globales como fallback
						updateNameProperty('color', dataCertificate.payload.nameColor || dataCertificate.payload.color)
						updateNameProperty('fontFamily', dataCertificate.payload.nameFontFamily || dataCertificate.payload.fontFamily)
						updateNameProperty('fontSize', dataCertificate.payload.nameFontSize || dataCertificate.payload.fontsize)
						updateNameProperty('isItalic', dataCertificate.payload.nameItalic !== undefined ? dataCertificate.payload.nameItalic : dataCertificate.payload.italic)
						updateNameProperty('isBold', dataCertificate.payload.nameBold !== undefined ? dataCertificate.payload.nameBold : (dataCertificate.payload.bold || false))

						updateIdProperty('color', dataCertificate.payload.documentColor || dataCertificate.payload.color)
						updateIdProperty('fontFamily', dataCertificate.payload.documentFontFamily || dataCertificate.payload.fontFamily)
						updateIdProperty('fontSize', dataCertificate.payload.documentFontSize || dataCertificate.payload.fontsize)
						updateIdProperty('isItalic', dataCertificate.payload.documentItalic !== undefined ? dataCertificate.payload.documentItalic : dataCertificate.payload.italic)
						updateIdProperty('isBold', dataCertificate.payload.documentBold !== undefined ? dataCertificate.payload.documentBold : (dataCertificate.payload.bold || false))

						updatecourseNameProperty('color', dataCertificate.payload.courseNameColor || dataCertificate.payload.color)
						updatecourseNameProperty('fontFamily', dataCertificate.payload.courseNameFontFamily || dataCertificate.payload.fontFamily)
						updatecourseNameProperty('fontSize', dataCertificate.payload.courseNameFontSize || dataCertificate.payload.fontsize)
						updatecourseNameProperty('isItalic', dataCertificate.payload.courseNameItalic !== undefined ? dataCertificate.payload.courseNameItalic : dataCertificate.payload.italic)
						updatecourseNameProperty('isBold', dataCertificate.payload.courseNameBold !== undefined ? dataCertificate.payload.courseNameBold : (dataCertificate.payload.bold || false))

						updateDateProperty('color', dataCertificate.payload.dateColor || dataCertificate.payload.color)
						updateDateProperty('fontFamily', dataCertificate.payload.dateFontFamily || dataCertificate.payload.fontFamily)
						updateDateProperty('fontSize', dataCertificate.payload.dateFontSize || dataCertificate.payload.fontsize)
						updateDateProperty('isItalic', dataCertificate.payload.dateItalic !== undefined ? dataCertificate.payload.dateItalic : dataCertificate.payload.italic)
						updateDateProperty('isBold', dataCertificate.payload.dateBold !== undefined ? dataCertificate.payload.dateBold : (dataCertificate.payload.bold || false))

						setNamePosition({ top: dataCertificate.payload.nameY, left: dataCertificate.payload.nameX })
						setIdPosition({ top: dataCertificate.payload.documentY, left: dataCertificate.payload.documentX })
						setcourseNamePosition({ top: dataCertificate.payload.courseNameY || 300, left: dataCertificate.payload.courseNameX || 450 })
						setDatePosition({ top: dataCertificate.payload.dateY || 350, left: dataCertificate.payload.dateX || 450 })

						if (dataCertificate.payload.reqScore != 0) {
							setIsSaved(true)
							setReqScore(dataCertificate.payload.reqScore * 100)
						}

						const dataCertificateImage = JSON.parse(localStorage.getItem("cetificate_data_image"))
						setImageCert(dataCertificateImage)
						setBackgroundSp(true)
						setValidateCert(true)
					}
				} else {
					const res = await api.get(`/certificateCourse/${course.course.courseId}`)
					localStorage.setItem("cetificate_data", JSON.stringify(res.data))

					if (res.data.payload == null) {
						setIslodingInfo(true)
					}

					// Configurar propiedades individuales basándose en los datos de la API
					// Si existen propiedades individuales, usarlas; si no, usar las globales como fallback
					updateNameProperty('color', res.data.payload.nameColor || res.data.payload.color)
					updateNameProperty('fontFamily', res.data.payload.nameFontFamily || res.data.payload.fontFamily)
					updateNameProperty('fontSize', res.data.payload.nameFontSize || res.data.payload.fontsize)
					updateNameProperty('isItalic', res.data.payload.nameItalic !== undefined ? res.data.payload.nameItalic : res.data.payload.italic)
					updateNameProperty('isBold', res.data.payload.nameBold !== undefined ? res.data.payload.nameBold : (res.data.payload.bold || false))

					updateIdProperty('color', res.data.payload.documentColor || res.data.payload.color)
					updateIdProperty('fontFamily', res.data.payload.documentFontFamily || res.data.payload.fontFamily)
					updateIdProperty('fontSize', res.data.payload.documentFontSize || res.data.payload.fontsize)
					updateIdProperty('isItalic', res.data.payload.documentItalic !== undefined ? res.data.payload.documentItalic : res.data.payload.italic)
					updateIdProperty('isBold', res.data.payload.documentBold !== undefined ? res.data.payload.documentBold : (res.data.payload.bold || false))

					updatecourseNameProperty('color', res.data.payload.courseNameColor || res.data.payload.color)
					updatecourseNameProperty('fontFamily', res.data.payload.courseNameFontFamily || res.data.payload.fontFamily)
					updatecourseNameProperty('fontSize', res.data.payload.courseNameFontSize || res.data.payload.fontsize)
					updatecourseNameProperty('isItalic', res.data.payload.courseNameItalic !== undefined ? res.data.payload.courseNameItalic : res.data.payload.italic)
					updatecourseNameProperty('isBold', res.data.payload.courseNameBold !== undefined ? res.data.payload.courseNameBold : (res.data.payload.bold || false))

					updateDateProperty('color', res.data.payload.dateColor || res.data.payload.color)
					updateDateProperty('fontFamily', res.data.payload.dateFontFamily || res.data.payload.fontFamily)
					updateDateProperty('fontSize', res.data.payload.dateFontSize || res.data.payload.fontsize)
					updateDateProperty('isItalic', res.data.payload.dateItalic !== undefined ? res.data.payload.dateItalic : res.data.payload.italic)
					updateDateProperty('isBold', res.data.payload.dateBold !== undefined ? res.data.payload.dateBold : (res.data.payload.bold || false))

					setNamePosition({ top: res.data.payload.nameY, left: res.data.payload.nameX })
					setIdPosition({ top: res.data.payload.documentY, left: res.data.payload.documentX })
					setcourseNamePosition({ top: res.data.payload.courseNameY || 300, left: res.data.payload.courseNameX || 450 })
					setDatePosition({ top: res.data.payload.dateY || 350, left: res.data.payload.dateX || 450 })

					if (res.data.payload.reqScore != 0) {
						setIsSaved(true)
						setReqScore(res.data.payload.reqScore * 100)
					}

					if (!res.data.payload.fileName == "") {
						const resCert = await api.get(`/certificate/${res.data.payload.fileName}`)
						localStorage.setItem("cetificate_data_image", JSON.stringify(resCert.data.image))
						setImageCert(resCert.data.image)
						setValidateCert(true)
					}
				}

				setIslodingInfo(true)
				setToolView(true)
				setBackgroundSp(false)
				setLodingGrade(true)
			} catch (error) {
				console.log(error)
				setLodingGrade(true)
			}
		}
		validateCertificate()
	}, [course?.course?.courseId]) // Solo depender del courseId, no del objeto completo

	return (
		<>
			{/* Verificación de seguridad para course */}
			{!courseLoaded ? (
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
					<Loader background={"transparent"} height={"200px"} color={"#1091F4"} load={1} />
				</Box>
			) : isLodingInfo ? (
				<Box sx={{ mb: 2 }}>
					{/* Header de información del curso */}
					<Fade in={true} timeout={800}>
						<Paper
							elevation={0}
							sx={{
								background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
								color: "#ffffff",
								p: { xs: 3, sm: 4 },
								borderRadius: 0,
								borderEndStartRadius: 12,
								borderEndEndRadius: 12,
								mb: 3,
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
										'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fillOpacity="0.05"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")',
									zIndex: 0,
								},
							}}
						>
							<Box sx={{ position: "relative", zIndex: 1 }}>
								<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
									<Avatar
										sx={{
											background: alpha("#ffffff", 0.2),
											color: "#ffffff",
											width: 56,
											height: 56,
										}}
									>
										<SchoolIcon sx={{ fontSize: 28 }} />
									</Avatar>
									<Box>
										<Typography
											variant="h4"
											sx={{
												fontWeight: 700,
												fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
												mb: 0.5,
												textShadow: "0 2px 4px rgba(0,0,0,0.2)",
												display: "flex",
												alignItems: "center",
												gap: 1,
											}}
										>
											{course?.course?.name || (
												<>
													Cargando curso...
													<Box
														sx={{
															width: 20,
															height: 20,
															border: '2px solid rgba(255,255,255,0.3)',
															borderTop: '2px solid #ffffff',
															borderRadius: '50%',
															animation: 'spin 1s linear infinite',
															'@keyframes spin': {
																'0%': { transform: 'rotate(0deg)' },
																'100%': { transform: 'rotate(360deg)' },
															},
														}}
													/>
												</>
											)}
										</Typography>
										<Typography
											variant="h6"
											sx={{
												display: "flex",
												opacity: 0.9,
												fontSize: "1.1rem",
												fontWeight: 500,
											}}
										>
											ID: {course?.course?.courseId || "Cargando..."}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
									<Chip
										icon={<AssignmentIcon />}
										label={`${course.students ? course.students.length : 0} estudiantes`}
										sx={{
											background: alpha("#ffffff", 0.2),
											color: "#ffffff",
											fontWeight: 600,
											backdropFilter: "blur(10px)",
											"& .MuiChip-icon": { color: "#ffffff" },
										}}
									/>

									{validateCert && (
										<Chip
											icon={<CheckCircleIcon />}
											label="Certificado configurado"
											sx={{
												background: alpha(theme.palette.success.main, 0.2),
												color: "#ffffff",
												fontWeight: 600,
												backdropFilter: "blur(10px)",
												"& .MuiChip-icon": { color: theme.palette.success.light },
											}}
										/>
									)}
								</Box>

								{/* Configuración de requisito de calificación */}
								{validateCert && (
									<Box
										sx={{
											mt: 3,
											p: 2,
											background: alpha("#ffffff", 0.1),
											backdropFilter: "blur(10px)",
											display: "flex",
											alignItems: "center",
											gap: 2,
											flexWrap: "wrap",
											borderRadius: 2,
										}}
									>
										<Typography variant="body1" sx={{ fontWeight: 500 }}>
											Requisito de calificación:
										</Typography>

										{isSaved ? (
											<Chip
												label={`${reqScore}%`}
												sx={{
													background: alpha("#ffffff", 0.2),
													color: "#ffffff",
													fontWeight: 600,
													fontSize: "0.9rem",
												}}
											/>
										) : (
											<TextField
												type="number"
												value={reqScore}
												onChange={(e) => setReqScore(e.target.value)}
												size="small"
												inputProps={{ min: 0, max: 100, step: 5 }}
												sx={{
													width: 80,
													"& .MuiOutlinedInput-root": {
														background: "#ffffff",
														"& fieldset": { borderColor: "transparent" },
													},
												}}
											/>
										)}

										{!isSaved && (
											<Tooltip title="Guardar requisito">
												<IconButton
													onClick={() => saveReqCal(reqScore)}
													sx={{
														color: "#ffffff",
														background: alpha("#ffffff", 0.1),
														"&:hover": { background: alpha("#ffffff", 0.2) },
													}}
												>
													<SaveIcon />
												</IconButton>
											</Tooltip>
										)}

										<Tooltip title="Editar requisito">
											<IconButton
												onClick={() => setIsSaved(false)}
												sx={{
													color: "#ffffff",
													background: alpha("#ffffff", 0.1),
													"&:hover": { background: alpha("#ffffff", 0.2) },
												}}
											>
												<EditIcon />
											</IconButton>
										</Tooltip>
									</Box>
								)}
							</Box>
						</Paper>
					</Fade>

					{/* Sección de configuración de certificado */}
					<Zoom in={true} timeout={1000}>
						<Paper
							elevation={2}
							sx={{
								background: "#ffffff",
								boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
							}}
						>
							<Box sx={{ textAlign: "center" }}>
								<Typography
									variant="h5"
									sx={{
										fontWeight: 600,
										mb: 2,
										color: theme.palette.text.primary,
									}}
								>
									Configuración de Certificado
								</Typography>

								{validateCert ? (
									<Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
										<Box
											sx={{
												width: "fit-content",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												gap: 2,
												p: 3,
												mb: 3,
												background: "#ffffff",
												border: `2px solid ${theme.palette.success.main}`,
												borderRadius: 2,
												boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
											}}
										>
											<CheckCircleIcon
												sx={{
													fontSize: 40,
													color: theme.palette.success.main,
												}}
											/>
											<Box sx={{ textAlign: "left" }}>
												<Typography
													variant="h6"
													sx={{
														fontWeight: 600,
														color: theme.palette.success.dark,
														mb: 0.5,
													}}
												>
													Certificado Configurado
												</Typography>
												<Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
													El curso tiene un certificado listo para generar
												</Typography>
											</Box>
										</Box>

										<Button
											onClick={() => {
												if (!course?.course?.courseId) {
													showError('Error: Información del curso no disponible. Espere a que se cargue completamente.');
													return;
												}
												setIsModalOpen(true);
											}}
											variant="contained"
											size="large"
											startIcon={<VisibilityIcon />}
											disabled={!course?.course?.courseId}
											sx={{
												background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
												color: "#ffffff",
												fontWeight: 600,
												px: 4,
												py: 1.5,
												fontSize: "1rem",
												boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
												"&:hover": {
													transform: "translateY(-2px)",
													boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
												},
												transition: "all 0.2s ease-in-out",
											}}
										>
											Plantilla del Certificado
										</Button>
									</Box>
								) : (
									<Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												gap: 2,
												p: 3,
												mb: 3,
												background: "#ffffff",
												border: `2px solid ${theme.palette.warning.main}`,
												borderRadius: 2,
												boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
											}}
										>
											<CancelIcon
												sx={{
													fontSize: 40,
													color: theme.palette.warning.main,
												}}
											/>
											<Box sx={{ textAlign: "left" }}>
												<Typography
													variant="h6"
													sx={{
														fontWeight: 600,
														color: theme.palette.warning.dark,
														mb: 0.5,
													}}
												>
													Sin Certificado
												</Typography>
												<Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
													Sube una imagen para crear el certificado
												</Typography>
											</Box>
										</Box>

										<input
											id="file-input"
											type="file"
											accept="image/*"
											onChange={handleImageChange}
											style={{ display: "none" }}
										/>
										<Button
											component="label"
											htmlFor="file-input"
											variant="contained"
											size="large"
											startIcon={<CloudUploadIcon />}
											sx={{
												background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
												color: "#ffffff",
												fontWeight: 600,
												px: 4,
												py: 1.5,
												fontSize: "1rem",
												boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
												"&:hover": {
													transform: "translateY(-2px)",
													boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
												},
												transition: "all 0.2s ease-in-out",
											}}
										>
											Seleccionar Certificado
										</Button>
									</Box>
								)}

								{/* Previsualización de imagen */}
								{image && (
									<Fade in={true} timeout={500}>
										<Card
											sx={{
												mt: 3,
												maxWidth: 400,
												mx: "auto",
												boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
											}}
										>
											<CardContent sx={{ position: "relative", p: 0 }}>
												<Box
													component="img"
													src={image}
													alt="Preview"
													sx={{
														width: "100%",
														height: 200,
														objectFit: "cover",
													}}
												/>
												<IconButton
													onClick={handleCancel}
													sx={{
														position: "absolute",
														top: 8,
														right: 8,
														background: alpha("#ffffff", 0.9),
														color: theme.palette.error.main,
														"&:hover": {
															background: "#ffffff",
															transform: "scale(1.1)",
														},
													}}
												>
												</IconButton>

												{loaderImgPre && (
													<Box
														sx={{
															position: "absolute",
															top: 0,
															left: 0,
															right: 0,
															bottom: 0,
															background: alpha("#ffffff", 0.9),
															display: "flex",
															flexDirection: "column",
															alignItems: "center",
															justifyContent: "center",
															gap: 2,
														}}
													>
														<Typography variant="body2" sx={{ fontWeight: 500 }}>
															Subiendo imagen...
														</Typography>
														<LinearProgress variant="determinate" value={uploadProgress} sx={{ width: "80%" }} />
													</Box>
												)}
											</CardContent>

											<CardActions sx={{ justifyContent: "center", p: 2 }}>
												<Button
													onClick={handleUpload}
													variant="contained"
													startIcon={<CloudUploadIcon />}
													disabled={loaderImgPre}
													sx={{
														background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
														color: "#ffffff",
														fontWeight: 600,
													}}
												>
													Subir Imagen
												</Button>
											</CardActions>
										</Card>
									</Fade>
								)}
							</Box>
						</Paper>
					</Zoom>

					{/* Modal súper limpio - solo el certificado */}
					<Modal
						open={isModalOpen}
						onClose={() => setIsModalOpen(false)}
						closeAfterTransition
						sx={{
							zIndex: theme.zIndex.modal + 1,
							backdropFilter: "blur(4px)",
							backgroundColor: "rgba(0, 0, 0, 0.4)",
						}}
						BackdropProps={{
							sx: {
								backdropFilter: "blur(4px)",
								backgroundColor: "rgba(0, 0, 0, 0.4)",
							},
						}}
					>
						<Fade in={isModalOpen}>
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
									p: 3,
									outline: "none",
								}}
								onClick={() => setIsModalOpen(false)}
							>
								{/* Botón de cerrar en la esquina superior derecha de toda la ventana */}
								<IconButton
									onClick={() => setIsModalOpen(false)}
									sx={{
										position: "fixed",
										top: 20,
										right: 20,
										zIndex: theme.zIndex.modal + 2,
										background: alpha("#000000", 0.8),
										color: "#ffffff",
										width: 48,
										height: 48,
										backdropFilter: "blur(10px)",
										"&:hover": {
											background: alpha("#000000", 0.9),
											transform: "scale(1.1)",
										},
										transition: "all 0.2s ease",
										boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
									}}
								>
									<CloseIcon sx={{ fontSize: 24 }} />
								</IconButton>

								<Box
									onClick={(e) => e.stopPropagation()}
									sx={{
										width: "auto", // Cambiar de "100%" a "auto"
										height: "100%",
										maxWidth: "95vw", // Aumentar para acomodar imagen de 900px
										maxHeight: "95vh",
										background: "#ffffff",
										boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
										borderRadius: 3,
										overflow: "hidden",
										display: "flex",
										flexDirection: "column",
									}}
								>
									{/* Toolbar minimalista */}
									<Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, p: 1 }}>
										<Toolbar
											// Elemento seleccionado y sus propiedades
											selectedElement={selectedElement}
											setSelectedElement={setSelectedElement}
											currentProperties={currentProperties}
											updateCurrentProperty={updateCurrentProperty}

											// Propiedades individuales
											nameProperties={nameProperties}
											idProperties={idProperties}
											courseNameProperties={courseNameProperties}
											dateProperties={dateProperties}

											// Posiciones
											namePosition={namePosition}
											idPosition={idPosition}
											courseNamePosition={courseNamePosition}
											datePosition={datePosition}

											// Props existentes que no cambian
											setLodiangImage={setLodiangImage}
											courseId={course?.course?.courseId}
											setValidateCert={setValidateCert}
											setImageCert={setImageCert}
											setIsModalOpen={setIsModalOpen}
											toolView={toolView}
											setToolView={setToolView}
											setBackgroundsp={setBackgroundSp}
										/>
									</Box>

									{/* Área del certificado */}
									<Box
										sx={{
											flex: 1,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											p: 1,
											background: alpha(theme.palette.grey[100], 0.3),
											overflow: "auto",
										}}
									>
										<Box
											className={style.imageContainer}
											ref={containerRef}
											onMouseMove={handleMouseMove}
											onMouseUp={handleMouseUp}
											onTouchMove={handleTouchMove}
											onTouchEnd={handleTouchEnd}
											sx={{
												position: "relative",
												width: "900px", // Dimensión fija crucial para posicionamiento consistente
												height: "100%",
												minHeight: "530px", // Altura mínima como en el CSS original
												display: "block", // Cambiar de flex a block para posicionamiento correcto
												boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
												borderRadius: 2,
												overflow: "hidden",
												background: "#ffffff",
											}}
										>
											{lodingImage ? (
												<>
													<img
														src={imageCert || "/placeholder.svg"}
														alt="Certificado"
														className={style.modalImage}
														style={{
															minWidth: "900px", // Ancho mínimo fijo como en el CSS original
															maxHeight: "530px", // Altura máxima fija
															width: "900px", // Ancho fijo para consistencia
															height: "auto",
															objectFit: "contain",
															display: "block",
														}}
													/>
													<span
														className={`draggableLabel ${draggingElement === "name" ? "dragging" : ""}`}
														onMouseDown={(e) => handleMouseDown(e, "name")}
														onTouchStart={(e) => handleTouchStart(e, "name")}
														onClick={() => setSelectedElement("name")}
														style={{
															position: "absolute",
															top: `${namePosition.top}px`,
															left: `${namePosition.left}px`,
															fontSize: `${nameProperties.fontSize}px`,
															fontFamily: nameProperties.fontFamily,
															color: nameProperties.color,
															fontStyle: nameProperties.isItalic ? "italic" : "normal",
															fontWeight: nameProperties.isBold ? "bold" : "normal",
															background: backgroundSp ? "transparent" : selectedElement === "name" ? "#d1ecf1" : "#e9e5e5b9",
															border: draggingElement === "name" ? "2px solid rgb(17, 182, 211)" : selectedElement === "name" ? "2px solid #007bff" : "none",
															padding: "5px",
															cursor: "move",
															userSelect: "none",
															minWidth: "400px", // Ancho mínimo amplio para nombres largos
															maxWidth: "800px", // Ancho máximo muy amplio
															whiteSpace: "nowrap", // Evitar salto de línea
															textAlign: "center", // Centrar el texto dentro del contenedor
															// Removido: transform: "translate(-50%, 0)" para evitar cortes
														}}
													>
														{"<<Nombre>>"}
													</span>
													<span
														className={`draggableLabel ${draggingElement === "id" ? "dragging" : ""}`}
														onMouseDown={(e) => handleMouseDown(e, "id")}
														onTouchStart={(e) => handleTouchStart(e, "id")}
														onClick={() => setSelectedElement("id")}
														style={{
															position: "absolute",
															top: `${idPosition.top}px`,
															left: `${idPosition.left}px`,
															fontSize: `${idProperties.fontSize}px`,
															fontFamily: idProperties.fontFamily,
															color: idProperties.color,
															fontStyle: idProperties.isItalic ? "italic" : "normal",
															fontWeight: idProperties.isBold ? "bold" : "normal",
															border: draggingElement === "id" ? "2px solid #ff6600" : selectedElement === "id" ? "2px solid #007bff" : "none",
															padding: "5px",
															cursor: "move",
															background: backgroundSp ? "transparent" : selectedElement === "id" ? "#d1ecf1" : "#e9e5e5b9",
															userSelect: "none",
															transform: "translate(-50%, 0)", // Centrar horizontalmente
														}}
													>
														{"1000000000"}
													</span>
													<span
														className={`draggableLabel ${draggingElement === "courseName" ? "dragging" : ""}`}
														onMouseDown={(e) => handleMouseDown(e, "courseName")}
														onTouchStart={(e) => handleTouchStart(e, "courseName")}
														onClick={() => setSelectedElement("courseName")}
														style={{
															position: "absolute",
															top: `${courseNamePosition.top}px`,
															left: `${courseNamePosition.left}px`,
															fontSize: `${courseNameProperties.fontSize}px`,
															fontFamily: courseNameProperties.fontFamily,
															color: courseNameProperties.color,
															fontStyle: courseNameProperties.isItalic ? "italic" : "normal",
															fontWeight: courseNameProperties.isBold ? "bold" : "normal",
															border: draggingElement === "courseName" ? "2px solid #ff6600" : selectedElement === "courseName" ? "2px solid #007bff" : "none",
															padding: "5px",
															cursor: "move",
															background: backgroundSp ? "transparent" : selectedElement === "courseName" ? "#d1ecf1" : "#e9e5e5b9",
															userSelect: "none",
															transform: "translate(-50%, 0)", // Centrar horizontalmente
														}}
													>
														{"<<Nombre del curso>>"}
													</span>
													<span
														className={`draggableLabel ${draggingElement === "date" ? "dragging" : ""}`}
														onMouseDown={(e) => handleMouseDown(e, "date")}
														onTouchStart={(e) => handleTouchStart(e, "date")}
														onClick={() => setSelectedElement("date")}
														style={{
															position: "absolute",
															top: `${datePosition.top}px`,
															left: `${datePosition.left}px`,
															fontSize: `${dateProperties.fontSize}px`,
															fontFamily: dateProperties.fontFamily,
															color: dateProperties.color,
															fontStyle: dateProperties.isItalic ? "italic" : "normal",
															fontWeight: dateProperties.isBold ? "bold" : "normal",
															border: draggingElement === "date" ? "2px solid #ff6600" : selectedElement === "date" ? "2px solid #007bff" : "none",
															padding: "5px",
															cursor: "move",
															background: backgroundSp ? "transparent" : selectedElement === "date" ? "#d1ecf1" : "#e9e5e5b9",
															userSelect: "none",
															transform: "translate(-50%, 0)", // Centrar horizontalmente
														}}
													>
														{"<<Fecha>>"}
													</span>
												</>
											) : (
												<Box
													sx={{
														width: 600,
														height: 400,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														background: "#ffffff",
														borderRadius: 2,
													}}
												>
													<Loader ba={"transparent"} height={"400px"} color={"#156DF9"} load={2} />
												</Box>
											)}
										</Box>
									</Box>

									{/* Footer con botón de descarga */}
									<Box
										sx={{
											p: 2,
											borderTop: `1px solid ${theme.palette.divider}`,
											background: alpha(theme.palette.grey[50], 0.8),
											display: "flex",
											justifyContent: "center",
										}}
									>
										<Button
											onClick={async () => {
												const imageContainer = document.querySelector(`.${style.imageContainer}`)
												const canvas = await html2canvas(imageContainer, { scale: 4 })
												const imgData = canvas.toDataURL("image/png")

												const pdf = new jsPDF("l", "mm", "a4")
												const pageWidth = pdf.internal.pageSize.getWidth()
												const pageHeight = pdf.internal.pageSize.getHeight()
												const margin = 10
												const imgWidth = pageWidth - 2 * margin
												const imgHeight = pageHeight - 2 * margin

												pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight)
												pdf.rect(margin, margin, imgWidth, imgHeight)
												pdf.save("certificado.pdf")
											}}
											variant="contained"
											startIcon={<DownloadIcon />}
											sx={{
												background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
												color: "#ffffff",
												fontWeight: 600,
												px: 3,
												py: 1.5,
												boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
												"&:hover": {
													transform: "translateY(-2px)",
													boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
												},
												transition: "all 0.2s ease-in-out",
											}}
										>
											Descargar PDF
										</Button>
									</Box>
								</Box>
							</Box>
						</Fade>
					</Modal>
				</Box>
			) : (
				<Loader background={"white"} height={"100vh"} color={"#1091F4"} load={1} />
			)}
		</>
	)
}

export default InfoCourse