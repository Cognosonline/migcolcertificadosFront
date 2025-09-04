"use client"

import { useEffect, useState, useRef } from "react"
import {
	Box,
	Typography,
	TextField,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Card,
	CardContent,
	CardActions,
	InputAdornment,
	Chip,
	Avatar,
	useTheme,
	alpha,
	Fade,
	Zoom,
	IconButton,
	Tooltip,
	Modal,
} from "@mui/material"
import {
	Search as SearchIcon,
	School as SchoolIcon,
	Person as PersonIcon,
	Grade as GradeIcon,
	Close as CloseIcon,
	GetApp as GetAppIcon,
	Assignment as AssignmentIcon,
	CheckCircle as CheckCircleIcon,
	Cancel as CancelIcon,
} from "@mui/icons-material"
import { styled } from "@mui/material/styles"
import { useStateValue } from "../context/GlobalContext.jsx"
import style from "../modulesCss/Gradebook.module.css"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import Loader from "./Loader.jsx"
import { useNotifications } from "../hooks/useNotifications"
import CourseDataHelper from "../utils/CourseDataHelper"

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.MuiTableCell-head`]: {
		background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
		color: "#ffffff",
		fontWeight: 700,
		fontSize: "0.95rem",
		textTransform: "uppercase",
		letterSpacing: "0.5px",
		borderBottom: "none",
		boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
	},
	[`&.MuiTableCell-body`]: {
		fontSize: "0.9rem",
		borderBottom: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`,
		padding: "16px",
	},
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(even)": {
		backgroundColor: alpha(theme.palette.primary.main, 0.02),
	},
	"&:hover": {
		backgroundColor: alpha(theme.palette.primary.main, 0.05),
		transform: "translateY(-1px)",
		boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
	},
	transition: "all 0.2s ease-in-out",
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}))

const GradeChip = styled(Chip)(({ theme, passed }) => ({
	fontWeight: 600,
	fontSize: "0.85rem",
	background: passed
		? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
		: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
	color: "#ffffff",
	boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
	"& .MuiChip-icon": {
		color: "#ffffff",
	},
}))

export default function GradeBook({
	nameProperties,
	idProperties,
	courseNameProperties,
	dateProperties,
	namePosition,
	idPosition,
	courseNamePosition,
	datePosition,
	imageCert,
	reqScore,
}) {
	const { course, user, getUserCertificate, getCertificateCourseData } = useStateValue()
	const { showSuccess, showError, showWarning, showInfo } = useNotifications()
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)
	// Estado local para preservar estudiantes y evitar que se reseteen
	const [localStudents, setLocalStudents] = useState(course?.students || [])
	const [filteredStudents, setFilteredStudents] = useState(course?.students || [])
	// Estado local para preservar courseId
	const [localCourseId, setLocalCourseId] = useState(course?.course?.courseId)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedStudent, setSelectedStudent] = useState(null)
	const [lodingImage, setLodiangImage] = useState(true)
	const [userDow, setUserDow] = useState(null)
	const [searchInput, setSearchInput] = useState("")
	const [certificateData, setCertificateData] = useState(null)
	const theme = useTheme()

	// Añadir los mismos handlers de arrastre que InfoCourse
	const containerRef = useRef(null)
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
				// No modificar las posiciones, solo mostrar visualmente
			} else if (draggingElement === "id") {
				// No modificar las posiciones, solo mostrar visualmente  
			}
		}
	}

	const handleMouseUp = () => {
		setDraggingElement(null)
	}

	const handleCertificateClick = async (student) => {
		try {
			// Limpiar estado previo ANTES de abrir el modal
			setCertificateData(null)
			setLodiangImage(false)
			
			// Abrir modal inmediatamente con loader
			setIsModalOpen(true)
			setSelectedStudent(student)
			setUserDow(student.user.externalId)
			
			// Usar courseId local o del contexto como fallback
			const courseId = localCourseId || course?.course?.courseId
			const userId = student.user.id
			
			if (!courseId) {
				setLodiangImage(true)
				return
			}
			
			const certificateResponse = await getUserCertificate(userId, courseId)
			
			// Validación más específica
			if (certificateResponse !== null && certificateResponse !== undefined) {
				setCertificateData(certificateResponse)
				showSuccess(`Certificado cargado para ${student.user.name}`);
				// Mantener loading por un momento para que se procesen los datos
				setTimeout(() => {
					setLodiangImage(true)
				}, 500)
			} else {
				setLodiangImage(true)
				showError('No se pudo cargar el certificado');
			}
		} catch (error) {
			setLodiangImage(true)
			showError(`Error al cargar certificado: ${error.message}`);
		}
	}

	// Función para cerrar el modal y limpiar estado
	const closeModal = () => {
		setIsModalOpen(false)
		setCertificateData(null)
		setSelectedStudent(null)
		setUserDow(null)
		setLodiangImage(true) // Resetear a true para el próximo uso
		
		// ✅ Limpiar datos de certificado sin afectar course_data
		CourseDataHelper.clearCertificateData();
		// console.log('🧹 Datos de certificado limpiados');
	}

	const positionDataCertificate = () => {
		if (!certificateData) {
			return
		}
		
		const name = document.getElementById("name")
		const cedula = document.getElementById("cedula")
		const courseName = document.getElementById("courseName")
		const date = document.getElementById("date")
		
		// Los datos están en certificateData.payload según los logs
		const payload = certificateData.payload || certificateData
		
		// Usar los datos del servicio getUserCertificate con el formato correcto
		if (name) name.innerHTML = payload.studentName?.toUpperCase() || ""
		if (cedula) cedula.innerHTML = payload.studentDocument || ""
		if (courseName) courseName.innerHTML = payload.courseName || ""
		if (date) {
			const formattedDate = payload.issuedDate 
				? new Date(payload.issuedDate).toLocaleDateString() 
				: new Date().toLocaleDateString()
			date.innerHTML = formattedDate
		}
	}

	const DownloadButton = () => {
		const downloadPDF = async () => {
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
			
			// Usar los datos del certificado para el nombre del archivo
			const payload = certificateData?.payload || certificateData
			const fileName = payload?.studentName 
				? `Certificado_${payload.studentName.replace(/\s+/g, '_')}_${payload.studentDocument || userDow}.pdf`
				: `Certificado_${course?.course?.name || 'Curso'}_${userDow}.pdf`
			
			pdf.save(fileName)
		}

		return (
			<Button
				onClick={downloadPDF}
				variant="contained"
				startIcon={<GetAppIcon />}
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
		)
	}

	const renderScore = (score) => {
		if (!score || score.score === 0) return "--"
		if (score.scaleType === "Percent") return `${score.score}%`
		if (score.scaleType === "Tabular") return score.text
		return score.score
	}

	const isStudentPassed = (student) => {
		if (!student.score || student.score === 0) return false
		return student.score.possible * (reqScore / 100) <= student.score.score
	}

	useEffect(() => {
		// ✅ Debug - Validar integridad de datos
		// const validation = CourseDataHelper.validateCourseData();
		// console.log('🔍 Gradebook - Validación de datos:', validation);
		
		// Sincronizar estudiantes locales cuando cambie course.students
		if (course?.students && course.students.length > 0) {
			setLocalStudents(course.students)
		}
		
		// Preservar courseId cuando esté disponible
		if (course?.course?.courseId && !localCourseId) {
			setLocalCourseId(course.course.courseId)
		}
	}, [course?.students, course?.course?.courseId])

	useEffect(() => {
		const filtered = localStudents?.filter((student) => {
			const externalId = student?.user?.externalId || ""
			const name = student?.user?.name || ""
			return (
				externalId.toLowerCase().includes(searchInput.toLowerCase()) ||
				name.toLowerCase().includes(searchInput.toLowerCase())
			)
		})
		setFilteredStudents(filtered)
	}, [searchInput, localStudents])

	useEffect(() => {
		const handleResize = () => setWindowWidth(window.innerWidth)
		window.addEventListener("resize", handleResize)
		return () => window.removeEventListener("resize", handleResize)
	}, [])

	useEffect(() => {
		if (isModalOpen && certificateData && lodingImage) {
			setTimeout(() => {
				positionDataCertificate()
			}, 100) // Reducir tiempo para mejor UX
		}
	}, [isModalOpen, certificateData, lodingImage])

	return (
		<Box>
			{/* Header mejorado */}
			<Fade in={true} timeout={800}>
				<Box
					sx={{
						background: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
						color: "#ffffff",
						p: { xs: 3, sm: 4 },
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
						<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
							<Box
								sx={{
									p: 1.5,
									backdropFilter: "blur(10px)",
								}}
							>
								<AssignmentIcon sx={{ fontSize: 28, color: "#ffffff" }} />
							</Box>
							<Typography
								variant="h4"
								sx={{
									fontWeight: 700,
									fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
									textShadow: "0 2px 4px rgba(0,0,0,0.2)",
								}}
							>
								Libro de Calificaciones
							</Typography>
						</Box>

						{/* Barra de búsqueda mejorada */}
						<Box sx={{ maxWidth: 500 }}>
							<TextField
								placeholder="Buscar estudiante por nombre o ID..."
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
								fullWidth
								size="medium"
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SearchIcon sx={{ color: theme.palette.text.secondary }} />
										</InputAdornment>
									),
								}}
								sx={{
									"& .MuiOutlinedInput-root": {
										background: "#ffffff",
										fontSize: "0.95rem",
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
										"& fieldset": {
											borderColor: "transparent",
										},
										"&:hover fieldset": {
											borderColor: alpha(theme.palette.info.main, 0.3),
										},
										"&.Mui-focused fieldset": {
											borderColor: theme.palette.info.main,
											borderWidth: 2,
										},
									},
								}}
							/>
						</Box>

						{/* Estadísticas */}
						<Box sx={{ display: "flex", gap: 2, mt: 3, flexWrap: "wrap" }}>
							<Chip
								icon={<PersonIcon />}
								label={`${filteredStudents?.length || 0} estudiantes`}
								sx={{
									background: alpha("#ffffff", 0.2),
									color: "#ffffff",
									fontWeight: 600,
									backdropFilter: "blur(10px)",
									"& .MuiChip-icon": { color: "#ffffff" },
								}}
							/>
							<Chip
								icon={<GradeIcon />}
								label={`Requisito: ${reqScore || 0}%`}
								sx={{
									background: alpha("#ffffff", 0.2),
									color: "#ffffff",
									fontWeight: 600,
									backdropFilter: "blur(10px)",
									"& .MuiChip-icon": { color: "#ffffff" },
								}}
							/>
						</Box>
					</Box>
				</Box>
			</Fade>

			{/* Contenido responsive */}
			{windowWidth < 900 ? (
				// Vista móvil con cards mejoradas
				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					{localStudents && localStudents.length > 0 ? (
						filteredStudents.map((row, index) => (
							<Fade key={row.user.externalId} in={true} timeout={300 + index * 100}>
								<Card
									sx={{
										background: "#ffffff",
										boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
										transition: "all 0.3s ease",
										"&:hover": {
											transform: "translateY(-4px)",
											boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
										},
									}}
								>
									<CardContent sx={{ pb: 1 }}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
											<Avatar
												sx={{
													background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
													color: "#ffffff",
													fontWeight: 600,
												}}
											>
												{row.user.name.charAt(0)}
											</Avatar>
											<Box sx={{ flex: 1 }}>
												<Typography
													variant="h6"
													sx={{
														fontWeight: 600,
														fontSize: "1.1rem",
														color: theme.palette.text.primary,
														mb: 0.5,
													}}
												>
													{row.user.name}
												</Typography>
												<Typography
													variant="body2"
													sx={{
														color: theme.palette.text.secondary,
														fontSize: "0.9rem",
													}}
												>
													ID: {row.user.externalId}
												</Typography>
											</Box>
										</Box>

										<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
											<Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
												Calificación:
											</Typography>
											<GradeChip
												label={renderScore(row.score)}
												passed={isStudentPassed(row)}
												icon={isStudentPassed(row) ? <CheckCircleIcon /> : <CancelIcon />}
											/>
										</Box>
									</CardContent>

									<CardActions sx={{ px: 2, pb: 2 }}>
										<Button
											variant="contained"
											size="small"
											disabled={!isStudentPassed(row)}
											startIcon={<SchoolIcon />}
											onClick={(e) => {
												e.preventDefault()
												handleCertificateClick(row)
											}}
											sx={{
												background: isStudentPassed(row)
													? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
													: theme.palette.grey[300],
												color: "#ffffff",
												fontWeight: 600,
												"&:hover": {
													transform: isStudentPassed(row) ? "translateY(-1px)" : "none",
													boxShadow: isStudentPassed(row) ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
												},
												"&:disabled": {
													color: theme.palette.text.disabled,
												},
											}}
										>
											Certificado
										</Button>
									</CardActions>
								</Card>
							</Fade>
						))
					) : (
						<Box sx={{ textAlign: "center", py: 4 }}>
							<Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
								No hay estudiantes disponibles
							</Typography>
						</Box>
					)}
				</Box>
			) : (
				// Vista desktop con tabla mejorada
				<Zoom in={true} timeout={1000}>
					<TableContainer
						component={Paper}
						sx={{
							boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
							overflow: "hidden",
							maxHeight: "60vh",
						}}
					>
						<Table stickyHeader>
							<TableHead>
								<TableRow>
									<StyledTableCell>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
											<PersonIcon sx={{ fontSize: 20 }} />
											Nombres y Apellidos
										</Box>
									</StyledTableCell>
									<StyledTableCell align="center">
										<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
											<AssignmentIcon sx={{ fontSize: 20 }} />
											Documento
										</Box>
									</StyledTableCell>
									<StyledTableCell align="center">
										<Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "center" }}>
											<GradeIcon sx={{ fontSize: 20 }} />
											Calificación
										</Box>
									</StyledTableCell>
									<StyledTableCell align="center">Estado</StyledTableCell>
									<StyledTableCell align="center">Acción</StyledTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{localStudents && localStudents.length > 0 ? (
									filteredStudents.map((row, index) => (
										<Fade key={row.user.name} in={true} timeout={200 + index * 50}>
											<StyledTableRow>
												<StyledTableCell>
													<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
														<Avatar
															sx={{
																background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
																color: "#ffffff",
																width: 40,
																height: 40,
																fontSize: "0.9rem",
																fontWeight: 600,
															}}
														>
															{row.user.name.charAt(0)}
														</Avatar>
														<Typography
															variant="body1"
															sx={{
																fontWeight: 500,
																color: theme.palette.text.primary,
															}}
														>
															{row.user.name}
														</Typography>
													</Box>
												</StyledTableCell>
												<StyledTableCell align="center">
													<Typography
														variant="body2"
														sx={{
															fontFamily: "monospace",
															background: alpha(theme.palette.grey[100], 0.8),
															px: 1,
															py: 0.5,
															fontWeight: 600,
														}}
													>
														{row.user.externalId}
													</Typography>
												</StyledTableCell>
												<StyledTableCell align="center">
													<GradeChip
														label={renderScore(row.score)}
														passed={isStudentPassed(row)}
														icon={isStudentPassed(row) ? <CheckCircleIcon /> : <CancelIcon />}
													/>
												</StyledTableCell>
												<StyledTableCell align="center">
													<Chip
														label={isStudentPassed(row) ? "Aprobado" : "No aprobado"}
														color={isStudentPassed(row) ? "success" : "warning"}
														variant="outlined"
														size="small"
													/>
												</StyledTableCell>
												<StyledTableCell align="center">
													<Tooltip title={isStudentPassed(row) ? "Generar certificado" : "Estudiante no aprobado"}>
														<span>
															<Button
																variant="contained"
																size="small"
																disabled={!isStudentPassed(row)}
																startIcon={<SchoolIcon />}
																onClick={(e) => {
																	e.preventDefault()
																	handleCertificateClick(row)
																}}
																sx={{
																	background: isStudentPassed(row)
																		? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
																		: theme.palette.grey[300],
																	color: "#ffffff",
																	fontWeight: 600,
																	minWidth: 120,
																	"&:hover": {
																		transform: isStudentPassed(row) ? "translateY(-1px)" : "none",
																		boxShadow: isStudentPassed(row) ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
																	},
																	"&:disabled": {
																		color: theme.palette.text.disabled,
																	},
																}}
															>
																Certificado
															</Button>
														</span>
													</Tooltip>
												</StyledTableCell>
											</StyledTableRow>
										</Fade>
									))
								) : (
									<StyledTableRow>
										<StyledTableCell colSpan={5} align="center">
											<Typography variant="body2" sx={{ py: 3, color: theme.palette.text.secondary }}>
												No hay estudiantes disponibles
											</Typography>
										</StyledTableCell>
									</StyledTableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Zoom>
			)}

			{/* Modal compacto mejorado */}
			<Modal
				open={isModalOpen}
				onClose={closeModal}
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
						onClick={closeModal}
					>
						{/* Botón de cerrar en la esquina superior derecha de toda la ventana */}
						<IconButton
							onClick={closeModal}
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
								width: "auto", // Cambiar de "auto" a coincidir con InfoCourse
								height: "100%", // Cambiar de "auto" a "100%" como InfoCourse
								maxWidth: "95vw", // Aumentar para acomodar imagen de 900px
								maxHeight: "95vh", // Cambiar de "90vh" a "95vh" como InfoCourse
								background: "#ffffff",
								boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
								borderRadius: 3,
								overflow: "hidden",
								display: "flex",
								flexDirection: "column",
							}}
						>
							{/* Header minimalista */}
							<Box
								sx={{
									background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
									color: "#ffffff",
									p: 2,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									minHeight: 60,
								}}
							>
								<Typography variant="h6" sx={{ fontWeight: 600 }}>
									Certificado - {selectedStudent?.user.name}
								</Typography>
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
								{!lodingImage ? (
									// Loader mientras se cargan los datos
									<Box
										sx={{
											width: "900px",
											height: "530px",
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "center",
											background: "#ffffff",
											borderRadius: 2,
											boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
										}}
									>
										<Loader ba={"transparent"} height={"150px"} color={"#156DF9"} load={2} />
										<Typography 
											variant="body2" 
											sx={{ 
												mt: 2, 
												color: theme.palette.text.secondary,
												fontWeight: 500 
											}}
										>
											Cargando datos del certificado...
										</Typography>
									</Box>
								) : (
									// Certificado con datos
									<Box
										className={style.imageContainer}
										ref={containerRef}
										onMouseMove={handleMouseMove}
										onMouseUp={handleMouseUp}
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
										<img
											src={imageCert || "/placeholder.svg"}
											alt="Certificado"
											className={style.modalImage}
											style={{
												minWidth: "900px",
												maxHeight: "530px", 
												width: "900px",
												height: "auto",
												objectFit: "contain",
												display: "block",
											}}
										/>
										<span
											className={`draggableLabel ${draggingElement === "name" ? "dragging" : ""}`}
											id="name"
											onMouseDown={(e) => handleMouseDown(e, "name")}
											style={{
												position: "absolute",
												top: `${namePosition.top}px`,
												left: `${namePosition.left}px`,
												fontSize: `${nameProperties.fontSize}px`,
												fontFamily: nameProperties.fontFamily,
												color: nameProperties.color,
												fontStyle: nameProperties.isItalic ? "italic" : "normal",
												fontWeight: nameProperties.isBold ? "bold" : "normal",
												background: "transparent",
												padding: "5px",
												cursor: "move",
												userSelect: "none",
												minWidth: "400px", // Ancho mínimo amplio para nombres largos
												maxWidth: "800px", // Ancho máximo muy amplio
												whiteSpace: "nowrap", // Evitar salto de línea
												textAlign: "center", // Centrar el texto dentro del contenedor
												// Removido: transform: "translate(-50%, 0)" para evitar cortes
											}}
										/>
										<span
											className={`draggableLabel ${draggingElement === "id" ? "dragging" : ""}`}
											id="cedula"
											onMouseDown={(e) => handleMouseDown(e, "id")}
											style={{
												position: "absolute",
												top: `${idPosition.top}px`,
												left: `${idPosition.left}px`,
												fontSize: `${idProperties.fontSize}px`,
												fontFamily: idProperties.fontFamily,
												color: idProperties.color,
												background: "transparent",
												fontStyle: idProperties.isItalic ? "italic" : "normal",
												fontWeight: idProperties.isBold ? "bold" : "normal",
												padding: "5px",
												cursor: "move",
												userSelect: "none",
												transform: "translate(-50%, 0)", // Centrar horizontalmente
											}}
										/>
										<span
											className={`draggableLabel ${draggingElement === "courseName" ? "dragging" : ""}`}
											id="courseName"
											onMouseDown={(e) => handleMouseDown(e, "courseName")}
											style={{
												position: "absolute",
												top: `${courseNamePosition.top}px`,
												left: `${courseNamePosition.left}px`,
												fontSize: `${courseNameProperties.fontSize}px`,
												fontFamily: courseNameProperties.fontFamily,
												color: courseNameProperties.color,
												background: "transparent",
												fontStyle: courseNameProperties.isItalic ? "italic" : "normal",
												fontWeight: courseNameProperties.isBold ? "bold" : "normal",
												padding: "5px",
												cursor: "move",
												userSelect: "none",
												transform: "translate(-50%, 0)", // Centrar horizontalmente
											}}
										>
											{"Nombre del curso"}
										</span>
										<span
											className={`draggableLabel ${draggingElement === "date" ? "dragging" : ""}`}
											id="date"
											onMouseDown={(e) => handleMouseDown(e, "date")}
											style={{
												position: "absolute",
												top: `${datePosition.top}px`,
												left: `${datePosition.left}px`,
												fontSize: `${dateProperties.fontSize}px`,
												fontFamily: dateProperties.fontFamily,
												color: dateProperties.color,
												background: "transparent",
												fontStyle: dateProperties.isItalic ? "italic" : "normal",
												fontWeight: dateProperties.isBold ? "bold" : "normal",
												padding: "5px",
												cursor: "move",
												userSelect: "none",
												transform: "translate(-50%, 0)", // Centrar horizontalmente
											}}
										>
											{new Date().toLocaleDateString()}
										</span>
									</Box>
								)}
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
								{lodingImage && certificateData ? <DownloadButton /> : null}
							</Box>
						</Box>
					</Box>
				</Fade>
			</Modal>
		</Box>
	)
}