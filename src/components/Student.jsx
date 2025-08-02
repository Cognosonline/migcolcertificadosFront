import React, { useEffect, useState } from 'react';
import {
	Box,
	Typography,
	Button,
	IconButton,
	Paper,
	useTheme,
	alpha,
	Fade,
	Zoom,
	Backdrop,
	Container,
	Tooltip,
	Avatar
} from '@mui/material';
import {
	Close as CloseIcon,
	Download as DownloadIcon,
	School as SchoolIcon,
	Assignment as AssignmentIcon,
	ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { useStateValue } from '../context/GlobalContext';
import style from '../modulesCss/Student.module.css';
import { useNavigate } from 'react-router-dom';
import api from '../../axiosConfig.js';
import Loader from './Loader.jsx';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


const Student = () => {
	const { course, user } = useStateValue();
	const [fontSize, setFontSize] = useState(16);
	const [fontFamily, setFontFamily] = useState("Arial");
	const [color, setColor] = useState("#000000");
	const [isItalic, setIsItalic] = useState(false);
	const [namePosition, setNamePosition] = useState({ top: 100, left: 100 });
	const [idPosition, setIdPosition] = useState({ top: 200, left: 100 });
	const [imageCert, setImageCert] = useState(null);
	const navigate = useNavigate();
	const [imageLoad, setImageLoad] = useState(false);
	const theme = useTheme();

	const handleCloseModal = (e) => {
		e.preventDefault();
		localStorage.removeItem('cetificate_data');
		localStorage.removeItem('cetificate_data_image');
		localStorage.removeItem('course_data');
		navigate('/home');
	};

	const DownloadButton = () => {
		const downloadPDF = async () => {
			const imageContainer = document.querySelector(`.${style.imageContainer}`);
			// Capturar el contenedor como imagen
			const canvas = await html2canvas(imageContainer, {
				scale: 4  // Aumenta la resolución
			});
			const imgData = canvas.toDataURL("image/png");

			// Crear el PDF en horizontal (A4 landscape)
			const pdf = new jsPDF("l", "mm", "a4");
			const pageWidth = pdf.internal.pageSize.getWidth();
			const pageHeight = pdf.internal.pageSize.getHeight();

			const margin = 10;
			const imgWidth = pageWidth - 2 * margin;
			const imgHeight = pageHeight - 2 * margin;

			pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
			pdf.rect(margin, margin, imgWidth, imgHeight);
			pdf.save(`Certificado_${course.course.name}_${user.cedula}.pdf`);
		};

		return (
			<Button
				onClick={downloadPDF}
				variant="contained"
				size="large"
				startIcon={<DownloadIcon />}
				sx={{
					background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
					color: '#ffffff',
					fontWeight: 600,
					px: 4,
					py: 1.5,
					fontSize: '1rem',
					boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
					'&:hover': {
						transform: 'translateY(-3px)',
						boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
					},
					transition: 'all 0.3s ease-in-out',
					borderRadius: 2,
				}}
			>
				Descargar PDF
			</Button>
		);
	};

	const positionDataCertificate = () => {
		const name = document.getElementById('name');
		const cedula = document.getElementById('cedula');

		// Establecer placeholder
		name.innerHTML = '&lt;&lt;Nombre&gt;&gt;';

		// Obtener posición relativa al contenedor
		const placeholderWidth = name.getBoundingClientRect().width;
		const halfPlaceholder = placeholderWidth / 2;

		// Obtener el left inicial desde props
		const originalLeft = namePosition.left;

		// Calcular el centro del placeholder
		const centroPlaceholder = originalLeft + halfPlaceholder;

		// Asignar el nombre real
		name.innerHTML = (user.nombre.given.toUpperCase() + " " + user.nombre.family.toUpperCase());
		cedula.innerHTML = user.cedula;

		// Obtener el nuevo ancho del span con el nombre real
		const userNameWidth = name.getBoundingClientRect().width;
		const halfUserName = userNameWidth / 2;

		// Calcular nueva posición
		let nuevoLeft = originalLeft + placeholderWidth;
		nuevoLeft -= halfPlaceholder;
		nuevoLeft -= halfUserName;

		// Aplicar el nuevo valor de left
		name.style.left = `${nuevoLeft}px`;
		cedula.style.top = `${idPosition.top + 3}px`;
		setImageLoad(true);
	};

	useEffect(() => {
		const validateCertificate = async () => {
			try {
				const res = await api.get(`/certificateCourse/${course.course.courseId}`);
				localStorage.setItem('cetificate_data', JSON.stringify(res.data));

				setColor(res.data.payload.color);
				setFontFamily(res.data.payload.fontFamily);
				setFontSize(res.data.payload.fontsize);
				setIsItalic(res.data.payload.italic);
				setNamePosition({ top: res.data.payload.nameY, left: res.data.payload.nameX });
				setIdPosition({ top: res.data.payload.documentY, left: res.data.payload.documentX });

				if (!res.data.payload.fileName == '') {
					const resCert = await api.get(`/certificate/${res.data.payload.fileName}`);
					localStorage.setItem('cetificate_data_image', JSON.stringify(resCert.data.image));
					setImageCert(resCert.data.image);
				}
			} catch (error) {
				console.log(error);
			}
		};

		validateCertificate();
	}, []);




	return (
		<Box
			sx={{
				position: 'fixed',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: theme.zIndex.modal,
			}}
		>
			{/* Backdrop personalizado con blur */}
			<Backdrop
				open={true}
				sx={{
					backdropFilter: 'blur(8px)',
					backgroundColor: alpha('#000000', 0.85),
					zIndex: theme.zIndex.modal,
				}}
			/>

			{/* Botón de cerrar en la esquina superior derecha */}
			<Fade in={true} timeout={800}>
				<IconButton
					onClick={handleCloseModal}
					sx={{
						position: 'fixed',
						top: 20,
						right: 20,
						zIndex: theme.zIndex.modal + 2,
						background: alpha('#000000', 0.8),
						color: '#ffffff',
						width: 56,
						height: 56,
						backdropFilter: 'blur(10px)',
						border: `2px solid ${alpha('#ffffff', 0.2)}`,
						'&:hover': {
							background: alpha('#000000', 0.9),
							transform: 'scale(1.1) rotate(90deg)',
							borderColor: alpha('#ffffff', 0.4),
						},
						transition: 'all 0.3s ease-in-out',
						boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
					}}
				>
					<CloseIcon sx={{ fontSize: 28 }} />
				</IconButton>
			</Fade>

			{/* Botón de regresar alternativo */}
			<Fade in={true} timeout={1000}>
				<Tooltip title="Volver al inicio" placement="bottom">
					<IconButton
						onClick={handleCloseModal}
						sx={{
							position: 'fixed',
							top: 20,
							left: 20,
							zIndex: theme.zIndex.modal + 2,
							background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
							color: '#ffffff',
							width: 48,
							height: 48,
							backdropFilter: 'blur(10px)',
							'&:hover': {
								transform: 'scale(1.1) translateX(-2px)',
								boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
							},
							transition: 'all 0.3s ease-in-out',
							boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
						}}
					>
						<ArrowBackIcon sx={{ fontSize: 24 }} />
					</IconButton>
				</Tooltip>
			</Fade>

			{/* Contenido principal */}
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					p: 3,
					zIndex: theme.zIndex.modal + 1,
				}}
			>
				<Zoom in={true} timeout={1200}>
					<Paper
						elevation={24}
						sx={{
							width: 'auto',
							maxWidth: '95vw',
							maxHeight: '95vh',
							background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha('#f8f9fa', 0.95)} 100%)`,
							backdropFilter: 'blur(20px)',
							borderRadius: 4,
							overflow: 'hidden',
							border: `1px solid ${alpha('#ffffff', 0.2)}`,
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						{/* Header del modal */}
						<Box
							sx={{
								background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
								color: '#ffffff',
								p: 3,
								display: 'flex',
								alignItems: 'center',
								gap: 2,
								position: 'relative',
								'&::before': {
									content: '""',
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fillOpacity="0.05"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E")',
									zIndex: 0,
								},
							}}
						>
							<Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
								<Avatar
									sx={{
										background: alpha('#ffffff', 0.2),
										color: '#ffffff',
										width: 56,
										height: 56,
									}}
								>
									<SchoolIcon sx={{ fontSize: 28 }} />
								</Avatar>
								<Box sx={{ flex: 1 }}>
									<Typography
										variant="h5"
										sx={{
											fontWeight: 700,
											fontSize: { xs: '1.3rem', sm: '1.5rem' },
											mb: 0.5,
											textShadow: '0 2px 4px rgba(0,0,0,0.2)',
										}}
									>
										Tu Certificado
									</Typography>
									<Typography
										variant="subtitle1"
										sx={{
											opacity: 0.9,
											fontSize: '1rem',
											fontWeight: 500,
										}}
									>
										{course.course.name}
									</Typography>
								</Box>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<AssignmentIcon sx={{ fontSize: 20, opacity: 0.8 }} />
									<Typography
										variant="body2"
										sx={{
											opacity: 0.9,
											fontWeight: 500,
											fontSize: '0.9rem',
										}}
									>
										{user.cedula}
									</Typography>
								</Box>
							</Box>
						</Box>

						{/* Área del certificado */}
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								p: 3,
								background: alpha(theme.palette.grey[50], 0.5),
								position: 'relative',
							}}
						>
							<Box
								className={style.imageContainer}
								sx={{
									position: 'relative',
									width: 'fit-content',
									maxWidth: '100%',
									maxHeight: '100%',
									boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
									borderRadius: 3,
									overflow: 'hidden',
									background: '#ffffff',
									border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
								}}
							>
								{!imageLoad && (
									<Box
										sx={{
											position: 'absolute',
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											background: 'rgba(255,255,255,0.95)',
											zIndex: 3000,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											backdropFilter: 'blur(2px)',
										}}
									>
										<Loader ba={'transparent'} height={'530px'} color={'#156DF9'} load={2} />
									</Box>
								)}

								<img
									src={imageCert}
									className={style.modalImage}
									onLoad={() => {
										setImageLoad(true);
										positionDataCertificate();
									}}
									style={{
										width: '100%',
										height: 'auto',
										display: 'block',
									}}
								/>

								{/* Nombre arrastrable */}
								<span
									id="name"
									style={{
										position: "absolute",
										top: `${namePosition.top}px`,
										left: `${namePosition.left}px`,
										fontSize: `${fontSize}px`,
										fontFamily: fontFamily,
										color: color,
										fontStyle: isItalic ? "italic" : "normal",
										background: "transparent",
										padding: "5px",
									}}
								/>

								{/* Cédula arrastrable */}
								<span
									id="cedula"
									style={{
										position: "absolute",
										top: `${idPosition.top}px`,
										left: `${idPosition.left}px`,
										fontSize: `${fontSize}px`,
										fontFamily: fontFamily,
										color: color,
										fontStyle: isItalic ? "italic" : "normal",
										background: "transparent",
										padding: "5px",
									}}
								/>
							</Box>
						</Box>

						{/* Footer con botón de descarga */}
						<Box
							sx={{
								p: 3,
								background: alpha(theme.palette.grey[50], 0.8),
								borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.3)}`,
								display: 'flex',
								justifyContent: 'center',
								backdropFilter: 'blur(10px)',
							}}
						>
							<DownloadButton />
						</Box>
					</Paper>
				</Zoom>
			</Box>
		</Box>
	);
}

export default Student;