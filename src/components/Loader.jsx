import React from 'react';
import {
	Box,
	CircularProgress,
	Typography,
	useTheme,
	alpha,
	Fade
} from '@mui/material';
import { spiral, lineWobble } from 'ldrs';

spiral.register();
lineWobble.register();

export default function Loader({
	color,
	height = '100vh',
	background = 'transparent',
	load = 1,
	message = 'Cargando...',
	showMessage = true
}) {
	const theme = useTheme();

	const defaultColor = color || theme.palette.primary.main;
	const defaultBackground = background === 'white' ? 'white' :
		background === 'transparent' ? 'transparent' :
			`linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`;

	const renderLoader = () => {
		switch (load) {
			case 1:
				return (
					<l-spiral
						size="50"
						speed="0.9"
						color={defaultColor}
					/>
				);
			case 2:
				return (
					<l-line-wobble
						size="100"
						stroke="5"
						bg-opacity="0.09"
						speed="2.8"
						color={defaultColor}
					/>
				);
			case 3:
				return (
					<CircularProgress
						size={60}
						thickness={4}
						sx={{
							color: defaultColor,
							'& .MuiCircularProgress-circle': {
								strokeLinecap: 'round',
							},
						}}
					/>
				);
			default:
				return (
					<CircularProgress
						size={40}
						sx={{ color: defaultColor }}
					/>
				);
		}
	};

	return (
		<Box
			sx={{
				width: '100%',
				height: height,
				background: defaultBackground,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative',
				backdropFilter: background === 'transparent' ? 'none' : 'blur(10px)',
			}}
		>
			{/* Loader principal */}
			<Fade in={true} timeout={600}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						gap: 2,
					}}
				>
					{renderLoader()}

					{showMessage && (
						<Typography
							variant="body1"
							sx={{
								color: theme.palette.text.secondary,
								fontWeight: 500,
								fontSize: '1rem',
								textAlign: 'center',
								animation: 'pulse 2s ease-in-out infinite',
								'@keyframes pulse': {
									'0%, 100%': {
										opacity: 0.7,
									},
									'50%': {
										opacity: 1,
									},
								},
							}}
						>
							{message}
						</Typography>
					)}
				</Box>
			</Fade>

			{/* Elementos decorativos opcionales */}
			{load === 1 && (
				<>
					<Box
						sx={{
							position: 'absolute',
							top: '20%',
							left: '20%',
							width: 20,
							height: 20,
							borderRadius: '50%',
							background: alpha(defaultColor, 0.2),
							animation: 'float 4s ease-in-out infinite',
							'@keyframes float': {
								'0%, 100%': {
									transform: 'translateY(0px)',
								},
								'50%': {
									transform: 'translateY(-10px)',
								},
							},
						}}
					/>
					<Box
						sx={{
							position: 'absolute',
							bottom: '20%',
							right: '25%',
							width: 15,
							height: 15,
							borderRadius: '50%',
							background: alpha(defaultColor, 0.15),
							animation: 'float 6s ease-in-out infinite reverse',
						}}
					/>
				</>
			)}
		</Box>
	);
}