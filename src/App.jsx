import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import BlackBoardLogin from './components/BlackBoardLogin.jsx'
import Callback from './components/Callback.jsx'
import Home from './components/Home.jsx'
import Login from './components/Login';
import Course from './components/Course.jsx';
import Student from './components/Student.jsx';
import Error404 from './components/Error404.jsx';

// Tema personalizado de Material UI
const theme = createTheme({
  palette: {
    primary: {
      main: '#3366cc',
      dark: '#3366cc',
      light: '#4da8f5',
    },
    secondary: {
      main: '#004884',
      dark: '#004884',
      light: '#0077d8ff',
    },
    home: {
      main: '#F7A73F',
      dark: '#f57c00',
      light: '#ffb74d',
      text: '#ffffff',
    },
    profile: {
      main: '#004884',
      dark: '#004884',
      light: '#81c784',
      text: '#ffffff',
    },
    success: {
      main: '#4caf50',
      dark: '#388e3c',
      light: '#81c784',
    },
    warning: {
      main: '#ff9800',
      dark: '#f57c00',
      light: '#ffb74d',
    },
    info: {
      main: '#2196f3',
      dark: '#1976d2',
      light: '#64b5f6',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", "Playfair Display", "Montserrat", "Open Sans", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});



const router =  createBrowserRouter([
  {
    path:'/',
    element: <Login/>,
    errorElement: <Error404/>
  },
  {
    path:'/blackboardLogin',
    element: <BlackBoardLogin/>,
    errorElement: <Error404/>
  },
  {
    path:'/callback',
    element: <Callback/>,
    errorElement: <Error404/>
  },
  {
    path:'/home',
    element: <Home/>,
    errorElement: <Error404/>
  },
  {
    path:'/course',
    element: <Course/>,
    errorElement: <Error404/>
  },
  {
    path:'/student',
    element: <Student/>,
    errorElement: <Error404/>
  },
  {
    path:'*',
    element: <Error404/>
  }
]);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
