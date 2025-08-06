import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Card,
	CardActions,
	CardContent,
	Typography,
	Chip,
	Box,
	useTheme,
	alpha,
	LinearProgress,
	Tooltip,
	IconButton,
	Fade
} from '@mui/material';
import {
	School as SchoolIcon,
	Person as PersonIcon,
	Login as LoginIcon,
	Star as StarIcon,
	CheckCircle as CheckCircleIcon,
	Warning as WarningIcon
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

import { useStateValue } from '../context/GlobalContext';
import api from '../../axiosConfig';

const CardCourse = (props) => {
	const { course } = props;
	const navigate = useNavigate();
	const theme = useTheme();
	const [isLoading, setIsLoading] = useState(false);
	const { getCourse, getUserCertificate, user } = useStateValue();
	const [validateScore, setValidateScore] = useState(true);
	const [scoreData, setScoreData] = useState({
		userScore: 0,
		possible: 0,
		normalizedScore: 0,
		reqScore: 0
	});

	const isStudent = course.role === 'Student';
	const isProfessor = course.role === 'Instructor' || course.role === 'A';

	const courseSelect = async (e) => {
		setIsLoading(true);
		try {
			e.preventDefault();
			await getCourse(course.courseInfo.id);
			navigate('/course');
		} catch (error) {
			console.log('Error al obtener el curso:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const viewStudent = async (e) => {
		setIsLoading(true);
		try {
			e.preventDefault();
			await getCourse(course.courseInfo.id);
			navigate('/student');
		} catch (error) {
			console.log('Error al obtener el curso:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const viewCertificateStudent = async (e) => {
		setIsLoading(true);
		try {
			e.preventDefault();
			await getUserCertificate(user?.externalId || user?.id, course.courseInfo.courseId);
			navigate('/student');
		} catch (error) {
			console.log('Error al obtener el certificado:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const validateScoreU = async () => {
			try {
				const res = await api.get(`/certificateCourse/${course.courseInfo.courseId}`);
				const reqScore = res.data.payload.reqScore;

				const userScore = course.courseInfo.score?.score;
				const possible = course.courseInfo.score?.possible;

				let normalizedUserScore = 0;

				if (typeof userScore === "number" && typeof possible === "number" && possible > 0) {
					const isProbablyPercentage = possible >= 100 && userScore <= 100;

					if (isProbablyPercentage) {
						normalizedUserScore = userScore / 100;
					} else {
						normalizedUserScore = userScore / possible;
					}
				}

				const hasEnoughScore = (
					typeof userScore === "number" &&
					typeof possible === "number" &&
					normalizedUserScore >= reqScore
				);

				setScoreData({
					userScore: userScore || 0,
					possible: possible || 0,
					normalizedScore: normalizedUserScore,
					reqScore: reqScore
				});

				setValidateScore(!hasEnoughScore);
			} catch (error) {
				console.log(error);
				setValidateScore(true);
			}
		};

		if (!isStudent) {
			setValidateScore(false);
		}

		if (isStudent) {
			validateScoreU();
		}
	}, [course, isStudent]);

	if (validateScore && isStudent) {
		return null;
	}

	const getScoreColor = () => {
		if (scoreData.normalizedScore >= 0.8) return theme.palette.success.main;
		if (scoreData.normalizedScore >= 0.6) return theme.palette.warning.main;
		return theme.palette.error.main;
	};

	const getRoleConfig = () => {
		if (isStudent) {
			return {
				icon: <SchoolIcon />,
				label: 'Estudiante',
				color: theme.palette.primary.main,
				action: 'CERTIFICADO',
				actionColor: 'success'
			};
		}
		return {
			icon: <PersonIcon />,
			label: 'Profesor',
			color: theme.palette.secondary.main,
			action: 'INGRESAR',
			actionIcon: <LoginIcon />,
			actionColor: 'primary'
		};
	};

	const roleConfig = getRoleConfig();

	return (
		<Fade in={true} timeout={600}>
			<Card
				sx={{
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					borderRadius: 3,
					overflow: 'hidden',
					background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
					border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
					transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
					'&:hover': {
						transform: 'translateY(-4px)',
						boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
						border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
					},
				}}
			>
				{/* Header con gradiente */}
				<Box
					sx={{
						height: 8,
						background: `linear-gradient(90deg, ${roleConfig.color}, ${alpha(roleConfig.color, 0.7)})`,
					}}
				/>

				<CardContent sx={{ flexGrow: 1, p: 3 }}>
					{/* Información del curso */}
					<Box sx={{ mb: 2 }}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
								mb: 1,
							}}
						>
							<Chip
								label={course.courseInfo.courseId}
								size="small"
								sx={{
									background: alpha(theme.palette.primary.main, 0.1),
									color: theme.palette.primary.main,
									fontWeight: 600,
									fontSize: '0.75rem',
								}}
							/>
							<Box sx={{ flex: 1 }} />
							<Tooltip title={`Rol: ${roleConfig.label}`}>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 0.5,
										px: 1,
										py: 0.5,
										borderRadius: 1,
										background: alpha(roleConfig.color, 0.1),
										color: roleConfig.color,
									}}
								>
									{roleConfig.icon}
								</Box>
							</Tooltip>
						</Box>

						<Typography
							variant="h6"
							sx={{
								fontWeight: 600,
								fontSize: '1.1rem',
								lineHeight: 1.3,
								mb: 1,
								color: theme.palette.text.primary,
								display: '-webkit-box',
								WebkitLineClamp: 2,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
								minHeight: '2.6rem',
							}}
						>
							{course.courseInfo.name}
						</Typography>

						<Chip
							icon={roleConfig.icon}
							label={roleConfig.label}
							size="small"
							sx={{
								background: alpha(roleConfig.color, 0.1),
								color: roleConfig.color,
								fontWeight: 500,
								border: `1px solid ${alpha(roleConfig.color, 0.2)}`,
							}}
						/>
					</Box>

					{/* Progreso para estudiantes */}
					{isStudent && scoreData.possible > 0 && (
						<Box sx={{ mb: 2 }}>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'space-between',
									mb: 1,
								}}
							>
								<Typography variant="body2" sx={{ fontWeight: 500 }}>
									Progreso
								</Typography>
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									{scoreData.normalizedScore >= scoreData.reqScore ? (
										<CheckCircleIcon sx={{ fontSize: 16, color: theme.palette.success.main }} />
									) : (
										<WarningIcon sx={{ fontSize: 16, color: theme.palette.warning.main }} />
									)}
									<Typography
										variant="body2"
										sx={{
											fontWeight: 600,
											color: getScoreColor(),
										}}
									>
										{Math.round(scoreData.normalizedScore * 100)}%
									</Typography>
								</Box>
							</Box>
							<LinearProgress
								variant="determinate"
								value={scoreData.normalizedScore * 100}
								sx={{
									height: 6,
									borderRadius: 3,
									background: alpha(theme.palette.grey[300], 0.3),
									'& .MuiLinearProgress-bar': {
										borderRadius: 3,
										background: `linear-gradient(90deg, ${getScoreColor()}, ${alpha(getScoreColor(), 0.8)})`,
									},
								}}
							/>
							<Typography
								variant="caption"
								sx={{
									display: 'block',
									mt: 0.5,
									color: theme.palette.text.secondary,
								}}
							>
								{scoreData.userScore}/{scoreData.possible} puntos
							</Typography>
						</Box>
					)}
				</CardContent>

				<CardActions sx={{ p: 2, pt: 0 }}>
					<LoadingButton
						fullWidth
						size="large"
						variant="contained"
						color={roleConfig.actionColor}
						startIcon={roleConfig.actionIcon}
						onClick={isStudent ? viewCertificateStudent : courseSelect}
						loading={isLoading}
						sx={{
							color: theme.palette.home.text,
							py: 1.2,
							borderRadius: 2,
							textTransform: 'none',
							fontWeight: 600,
							fontSize: '0.9rem',
							boxShadow: `0 4px 12px ${alpha(theme.palette[roleConfig.actionColor].main, 0.3)}`,
							'&:hover': {
								transform: 'translateY(-1px)',
								boxShadow: `0 6px 16px ${alpha(theme.palette[roleConfig.actionColor].main, 0.4)}`,
							},
							transition: 'all 0.2s ease',
						}}
					>
						{roleConfig.action}
					</LoadingButton>
				</CardActions>
			</Card>
		</Fade>
	);
};

export default CardCourse;