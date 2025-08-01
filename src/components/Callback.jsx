import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Loader from "./Loader";
import api from '../../axiosConfig';
import { useStateValue } from '../context/GlobalContext';

export default function Callback() {
	const location = useLocation();
	const navigate = useNavigate();
	const { singInUser } = useStateValue();

	async function fetchToken() {
		const params = new URLSearchParams(location.search);
		const code = params.get('code');

		try {
			const result = await api.post('/oauth/token', {
				code: code
			});

			if (result.status === 200) {
				const { token, userId } = result.data.payload;

				sessionStorage.setItem('token', token);

				await singInUser(userId);

				navigate('/home');
			}
		} catch (error) {
			console.log('Error durante la autenticación:', error);
			navigate('/', { replace: true });
		}
	}

	useEffect(() => {
		fetchToken();
	}, []);

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
			}}
		>
			<Loader
				background="transparent"
				height="auto"
				color="#1091F4"
				load={1}
				message="Autenticando usuario..."
				showMessage={true}
			/>

			<Typography
				variant="body2"
				sx={{
					mt: 4,
					color: 'text.secondary',
					textAlign: 'center',
					maxWidth: 400,
					px: 2,
				}}
			>
				Estamos procesando tu información de acceso.
				Serás redirigido automáticamente en unos momentos.
			</Typography>
		</Box>
	);
}